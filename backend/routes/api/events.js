const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {
    Event,
    Venue,
    Group,
    EventImage,
    Attendance,
    Membership

} = require('../../db/models');

const { check, validationResult } = require("express-validator");
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
        .isString()
        .withMessage("Name must be a string"),
    check("type")
        .optional()
        .isIn(["Online", "In person"])
        .withMessage("Type must be Online or In Person"),
    check("startDate")
        .optional()
        .isString()
        .toDate()
        .withMessage("Start date must be a valid datetime")
]

//Get All the Events
router.get('/', validateGetAllQueryParams, handleValidationErrors, async (req, res) => {
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
        where.startDate = {
            [Op.gte]: new Date(startDate)
        }
    }

    const allEvents = await Event.findAll({
        where,
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
                attributes: ["id", "name", "city", "state"]
            },
            {
                model: Venue,
                attributes: ["id", "city", "state"]
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

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json("Forbidden")
    }

    const newEventImage = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })

    return res.status(200).json(newEventImage);
})

//Edit and Event based on Event's Id
router.put("/:eventId", requireAuth, async (req, res) => {
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
        return res.status(403).json("Forbidden")
    }

    targetEvent.venueId = venueId || targetEvent.venueId;
    targetEvent.name = name || targetEvent.name;
    targetEvent.type = type || targetEvent.type;
    targetEvent.capacity = capacity || targetEvent.capacity;
    targetEvent.price = price || targetEvent.price;
    targetEvent.description = description || targetEvent.description;
    targetEvent.startDate = startDate || targetEvent.startDate;
    targetEvent.endDate = endDate || targetEvent.endDate;

    await targetEvent.save();

    return res.status(200).json(targetEvent);
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
        return res.status(403).json("Forbidden")
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

    const allEventAttendees = await targetEvent.getAttendees();

    return res.status(200).json({
        Attendees: allEventAttendees
    })
})

//Create or Request to Attend an Event based on the Event's Id
router.post("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = await req.params;
    const user = req.user;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const userCurrentMember = await Membership.findOne({
        where: {
            groupId: targetEvent.groupId,
            userId: user.id
        }
    })

    if (!userCurrentMember) {
        return res.status(403).json("Forbidden")
    }

    const eventAttendees = await targetEvent.getAttendees();

    for (const attendee of eventAttendees) {
        if (attendee.id === user.id) {
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
        userId: user.id,
        status: "pending"
    })

    return res.status(200).json(newAttendee);
})

//Change or PUT the attendance of an attendee for a event by Id
router.put("/:eventId/attendance", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { userId, status } = req.body;

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    });

    const targetAttendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId
        }
    });

    if (!targetAttendee) return res.status(404).json({
        message: "Attendance between the user and the event does not exist"
    })

    const organizer = await Group.findOne({
        where: {
            organizerId: userId
        }
    })

    if (status === "pending") return res.status(400).json({
        message: "Cannot change an attendance status to pending"
    })

    //Can you even edit it lil bruh?

    const cohost = await Membership.findOne({
        where: {
            userId: userId,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    if (!organizer && !cohost) {
        return res.status(403).json("Forbidden")
    }

    targetAttendee.status = status;

    await targetAttendee.save();

    return res.status(200).json(targetAttendee);
});

//Delete an Attendance to an Event specified by Id
router.delete("/:eventId/attendance", requireAuth, async (req, res) => {
    const user = req.user
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { userId } = req.body;

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    });

    const targetAttendee = await Attendance.findOne({
        where: {
            eventId: eventId,
            userId: userId,
        }
    })

    if (!targetAttendee) return res.status(404).json({
        message: "Attendance does not exist for this User"
    })


    const userCurrentMember = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId: eventId
        }
    })

    if (userCurrentMember) {
        await userCurrentMember.destroy();
        return res.status(200).json({
            message: "Successfully deleted attendance from event"
        })
    }


    const userOrganizer = await Group.findOne({
        where: {
            organizerId: user.id,
            id: targetEvent.groupId
        }
    })

    const userCohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: targetEvent.groupId,
            status: "co-host"
        }
    })

    if (!userOrganizer && !userCohost) {
        return res.status(403).json("Forbidden")
    }

    await targetAttendee.destroy();

    return res.status(200).json({
        message: "Successfully deleted User Attendance from the event"
    });
});




module.exports = router;
