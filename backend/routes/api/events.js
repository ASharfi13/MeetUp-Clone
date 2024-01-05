const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {
    Event,
    Venue,
    Group,
    EventImage,
    Attendance,
    Membership,
    User

} = require('../../db/models');

const { body, check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op, or } = require("sequelize");
const venue = require('../../db/models/venue');

const router = express.Router();

const validateGetAllQueryParams = [
    check("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a NUMBER greater than or equal to 1"),
    check("size")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be NUMBER greater than or equal to 1"),
    check("name")
        .optional()
        .custom((val) => {
            if (val !== undefined && !isNaN(parseInt(val))) {
                throw new Error("Name must be a string")
            }
            return val;
        }),
    check("type")
        .optional()
        .isIn(["Online", "In person"])
        .withMessage("Type must be Online or In Person"),
    check("startDate")
        .optional()
        .custom((val) => {
            if (val !== undefined && isNaN(Date.parse(val))) {
                throw new Error("Start date must be a valid datetime")
            }

            return val;
        }),
    handleValidationErrors
]

//Get All the Events
router.get('/', validateGetAllQueryParams, async (req, res) => {
    let { page, size, name, type, startDate } = req.query;

    if (!page) page = 1;

    if (!size) size = 20;

    const pageNum = Math.min(parseInt(page) || 1, 10);

    const pageSize = Math.min(parseInt(size) || 20, 20);

    const offset = (pageNum - 1) * pageSize;

    let where = {};

    if (name) {
        where.name = name
    }

    if (type) {
        where.type = type
    }

    if (startDate) {
        where.startDate = startDate
    }

    const allEvents = await Event.findAll({
        where,
        attributes: {
            exclude: ['description', 'capacity', 'price']
        },
        include: [{
            model: Group,
            attributes: ["id", "name", "city", "state"]
        }, {
            model: Venue,
            attributes: ["id", "city", "state"],
        }],
        offset,
        limit: pageSize
    });

    for (let event of allEvents) {
        const attendCount = await Attendance.count({
            where: {
                eventId: event.id
            }
        });
        event.setDataValue("numAttending", attendCount)
    }

    for (let event of allEvents) {
        const previewImg = await EventImage.findOne({
            where: {
                eventId: event.id
            }
        });
        if (previewImg) {
            event.setDataValue("previewImage", previewImg.url)
        } else {
            event.setDataValue("previewImage", null);
        }
    }

    return res.status(200).json({
        Events: allEvents
    })
});


//Get All Details of the Event based on Id
router.get("/:eventId", async (req, res) => {
    const { eventId } = req.params;

    const targetEvent = await Event.findByPk(eventId, {
        include: [
            {
                model: Group,
                attributes: ["id", "name", "private", "city", "state"]
            },
            {
                model: Venue
            },
            {
                model: EventImage,
                attributes: ["id", "url", "preview"]
            }
        ]
    });


    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    //Adding the Extras

    const attendCount = await Attendance.count({
        where: {
            eventId: targetEvent.id
        }
    });

    targetEvent.setDataValue("numMembers", attendCount)

    return res.status(200).json(targetEvent);
})

//Create and Add an Image to an Event based on Event's Id
router.post("/:eventId/images", requireAuth, async (req, res) => {
    const user = req.user;
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { url, preview } = req.body

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const targetGroup = await Group.findByPk(targetEvent.groupId);

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    const attending = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId: eventId,
            status: "attending"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost && !attending) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const newEventImage = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })

    const response = await EventImage.findOne({
        where: {
            id: newEventImage.id
        },
        attributes: {
            exclude: ["eventId", "updatedAt", "createdAt"]
        }
    })

    return res.status(200).json(response);
})

//Edit and Event based on Event's Id
router.put("/:eventId", requireAuth,
    async (req, res) => {
        const user = req.user;
        const { eventId } = req.params;
        const targetEvent = await Event.findByPk(eventId);
        const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
        const targetVenue = await Venue.findByPk(venueId);

        if (!targetEvent) return res.status(404).json({
            message: "Event couldn't be found"
        })

        if (venueId) {
            if (!targetVenue) return res.status(404).json({
                message: "Venue couldn't be found"
            })
        }

        const targetGroup = await Group.findByPk(targetEvent.groupId);

        const cohost = await Membership.findOne({
            where: {
                userId: user.id,
                groupId: targetEvent.groupId,
                status: "co-host"
            }
        })

        if (targetGroup.organizerId !== user.id && !cohost) {
            return res.status(403).json({
                message: "Forbidden"
            })
        }

        //Body Validation Checks
        const currentDate = new Date();
        const currStartDate = new Date(startDate);
        const currEndDate = new Date(endDate);

        const errObj = {
            message: "Bad Request",
            errors: {}
        };

        let errCount = 0;

        if (!name || name.length < 5) {
            errObj.errors.name = "Name must be at least 5 characters";
            errCount++;
        }

        if (!type || type.length === 0 || !["Online", "In person"].includes(type)) {
            errObj.errors.type = "Type must be Online or In person";
            errCount++;
        }

        if (!capacity || typeof capacity !== "number") {
            errObj.errors.capacity = "Capacity must be an integer";
            errCount++;
        }

        if (!price || isNaN(price) || price < 0) {
            errObj.errors.price = "Price is invalid";
            errCount++;
        }

        if (!description || description.length === 0) {
            errObj.errors.description = "Description is required";
            errCount++;
        }

        if (!startDate || currStartDate <= currentDate) {
            errObj.errors.startDate = "Start date must be in the future";
            errCount++;
        }

        if (!endDate || currEndDate <= currStartDate) {
            errObj.errors.endDate = "End date is less than start date"
            errCount++;
        }

        if (errCount > 0) return res.status(400).json(errObj);

        targetEvent.venueId = venueId || targetEvent.venueId;
        targetEvent.name = name || targetEvent.name;
        targetEvent.type = type || targetEvent.type;
        targetEvent.capacity = capacity || targetEvent.capacity;
        targetEvent.price = price || targetEvent.price;
        targetEvent.description = description || targetEvent.description;
        targetEvent.startDate = startDate || targetEvent.startDate;
        targetEvent.endDate = endDate || targetEvent.endDate;

        await targetEvent.save();

        const response = await Event.findOne({
            where: {
                id: eventId
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        })

        return res.status(200).json(response);
    })

//Delete an Event Specified by Id
router.delete("/:eventId", requireAuth, async (req, res) => {
    const user = req.user;
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const targetGroup = await Group.findByPk(targetEvent.groupId);

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await targetEvent.destroy();

    res.status(200).json({
        message: "Successfully Deleted"
    })
})

//Get all Attendees of an Event specified by an Id
router.get("/:eventId/attendees", async (req, res) => {
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const targetGroup = await Group.findByPk(targetEvent.groupId);

    const cohost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    //Specific Attendees

    const arrOfAttendees = await targetEvent.getAttendees({
        attributes: {
            exclude: ['username']
        },
        joinTableAttributes: ["status"]
    });

    for (let i = 0; i < arrOfAttendees.length; i++) {
        if (arrOfAttendees[i].Attendance.status === "pending") {
            arrOfAttendees.splice(i, 1);
        }
    }

    if (targetGroup.organizerId !== req.user.id && !cohost) {
        return res.status(200).json({
            Attendees: arrOfAttendees
        });
    }

    const allEventAttendees = await targetEvent.getAttendees({
        attributes: {
            exclude: ['username']
        },
        joinTableAttributes: ["status"]
    });

    return res.status(200).json({
        Attendees: allEventAttendees
    })
})

//Create or Request to Attend an Event based on the Event's Id
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = await req.params;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const userCurrentMember = await Membership.findOne({
        where: {
            groupId: targetEvent.groupId,
            userId: req.user.id,
            status: {
                [Op.in]: ["member", "co-host"]
            }
        }
    })

    if (!userCurrentMember) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const eventAttendees = await targetEvent.getAttendees();

    for (const attendee of eventAttendees) {
        if (attendee.id === req.user.id) {
            if (attendee.Attendance && attendee.Attendance.status === "attending") {
                return res.status(400).json({
                    message: "User is already an attendee of the event"
                })
            } else {
                return res.status(400).json({
                    message: "Attendance has already been requested"
                })
            }
        }
    }


    const newAttendee = await Attendance.create({
        eventId: eventId,
        userId: req.user.id,
        status: "pending"
    })

    const response = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: req.user.id,
            status: "pending"
        },
        attributes: {
            exclude: ["eventId", "updatedAt", "createdAt"]
        }
    })

    return res.status(200).json(response);
})

//Change or PUT the attendance of an attendee for a event by Id
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { userId, status } = req.body;

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    });

    const targetGroup = await Group.findByPk(targetEvent.groupId);

    const targetAttendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    });

    const memberUser = await User.findByPk(userId);

    if (!memberUser) return res.status(404).json({
        message: "User couldn't be found"
    })

    if (!targetAttendee) return res.status(404).json({
        message: "Attendance between the user and the event does not exist"
    })

    if (status === "pending") return res.status(400).json({
        message: "Cannot change an attendance status to pending"
    })

    //Can you even edit it lil bruh?

    const cohost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== req.user.id && !cohost) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    targetAttendee.status = status;

    await targetAttendee.save();

    const response = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        },
        attributes: ["id", "eventId", "userId", "status"]
    })

    return res.status(200).json(response);
});

//Delete an Attendance to an Event specified by Id
router.delete("/:eventId/attendance/:userId", requireAuth, async (req, res) => {
    const { eventId, userId } = req.params;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    });

    const targetGroup = await Group.findByPk(targetEvent.groupId);

    const memberUser = await User.findByPk(userId);

    const targetAttendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId,
        }
    })

    if (!memberUser) return res.status(404).json({
        message: "User couldn't be found"
    })

    if (!targetAttendee) return res.status(404).json({
        message: "Attendance does not exist for this User"
    })

    if (parseInt(userId) === parseInt(req.user.id)) {
        const userAttending = await Attendance.findOne({
            where: {
                userId: req.user.id,
                eventId: eventId,
                status: "attending"
            }
        })

        if (userAttending) {
            await userAttending.destroy();
            return res.status(200).json({
                message: "Successfully deleted your attendance from event"
            })
        }
    }

    //Permission Check

    if (targetGroup.organizerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await targetAttendee.destroy();

    return res.status(200).json({
        message: "Successfully deleted User Attendance from the event"
    });
});




module.exports = router;
