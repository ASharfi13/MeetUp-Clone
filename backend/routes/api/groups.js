const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const
    {
        Group,
        Membership,
        User,
        Venue,
        GroupImage,
        Event,
        Attendance,
        EventImage,
        sequelize

    } = require('../../db/models');

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
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
        .isString()
        .isIn(["Online", "In Person"])
        .withMessage("Type must be Online or In Person"),
    check("startDate")
        .optional()
        .isString()
        .toDate()
        .withMessage("Start date must be a valid datetime")
]

//Get All Groups
router.get("/", validateGetAllQueryParams, handleValidationErrors, async (req, res) => {
    //Query Param Stuff
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

    const allGroups = await Group.findAll({
        where,
        offset,
        limit: pageSize
    });



    for (let group of allGroups) {
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        group.setDataValue("numMembers", memberCount)
    }

    for (let group of allGroups) {
        const eventCount = await Event.count({
            where: {
                groupId: group.id
            }
        })
        group.setDataValue("numEvents", eventCount)
    }

    for (let group of allGroups) {
        const previewImg = await GroupImage.findOne({
            where: {
                groupId: group.id
            }
        });
        if (previewImg) {
            group.setDataValue("previewImage", previewImg.url)
        } else {
            group.setDataValue("previewImage", null);
        }
    }

    res.status(200)
    res.json({
        Groups: allGroups
    })
});


//Get All Group Info From Current User

router.get('/current', requireAuth, async (req, res) => {
    const user = req.user
    const currentUser = await User.findByPk(user.id);
    const userGroupsOrganized = await currentUser.getGroupsOrganized();
    const userGroupsJoined = await currentUser.getGroupsJoined();

    const allUserGroups = userGroupsOrganized.concat(userGroupsJoined);

    for (let group of allUserGroups) {
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        group.setDataValue("numMembers", memberCount)
    }

    for (let group of allUserGroups) {
        const previewImg = await GroupImage.findOne({
            where: {
                groupId: group.id
            }
        });
        if (previewImg) {
            group.setDataValue("previewImage", previewImg.url)
        } else {
            group.setDataValue("previewImage", null);
        }
    }


    res.status(200).json({
        Groups: allUserGroups
    })
})

//Get Group Details based on Id

router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    const targetGroup = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                attributes: ["id", "url", "preview"]
            },
            {
                model: User,
                as: "Organizer",
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: Venue
            },
        ]
    })

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const memberCount = await Membership.count({
        where: {
            groupId: targetGroup.id
        }
    });
    targetGroup.setDataValue("numMembers", memberCount)

    const numEvents = await Event.count({
        where: {
            groupId: targetGroup.id
        }
    });
    targetGroup.setDataValue("numEvents", numEvents);

    res.json(targetGroup);
})

//Create a new Group

router.post("/", requireAuth, async (req, res) => {
    let { name, about, type, isPrivate, city, state, previewImg, backgroundImg } = req.body;
    const user = req.user;

    //Body Validations
    const errObj = {
        message: "Bad Request",
        errors: {

        }
    }

    let errCount = 0;

    if (!name || name.length > 60) {
        errObj.errors.name = "Name must be 60 characters or less";
        errCount++;
    }

    if (!about || about.length < 50) {
        errObj.errors.about = "About must be 50 characters or more";
        errCount++;
    }

    if (!type || !["Online", "In person"].includes(type)) {
        errObj.errors.type = "Type must be 'Online' or 'In person'";
        errCount++;
    }

    if (!isPrivate || typeof isPrivate !== "boolean") {
        errObj.errors.isPrivate = "Private must be a boolean";
    }

    if (!city || city.length === 0) {
        errObj.errors.city = "City is required";
        errCount++;
    }

    if (!state || state.length === 0) {
        errObj.errors.state = "State is required";
        errCount++;
    }

    if (!backgroundImg) {
        errObj.errors.backgroundImgNone = "Background Img Url is required"
    }

    if (!["jpeg", "png", "jpg"].includes(backgroundImg[backgroundImg.length - 1])) {
        errObj.errors.backgroundImgInvalid = "Background Img Url is Invalid"
    }

    if (errCount > 0) return res.status(400).json(errObj)

    let newGroup = await Group.create({
        organizerId: user.id,
        name: name,
        about: about,
        type: type,
        isPrivate: isPrivate,
        city: city,
        state: state,
        backgroundImg
    })

    if (previewImg) {
        await GroupImage.create({
            groupId: newGroup.id,
            url: previewImg,
            preview: true
        })
    }

    res.status(201).json(newGroup)
})

//Add an Image to a Group based on the Group's Id

router.post("/:groupId/images", requireAuth, async (req, res) => {
    const user = req.user
    const { groupId } = req.params;
    const { url, preview } = req.body;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    if (user.id !== targetGroup.organizerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const newGroupImage = await GroupImage.create({
        groupId: groupId,
        url: url,
        preview: preview
    })

    const response = await GroupImage.findOne({
        where: {
            url: url
        },
        attributes: {
            exclude: ["createdAt", "updatedAt", "groupId"]
        }
    })

    res.json(response);
})

//Edit a Group

router.put("/:groupId", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params
    const targetGroup = await Group.findByPk(groupId);
    let { name, about, type, isPrivate, city, state, backgroundImg } = req.body

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    if (user.id !== targetGroup.organizerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    //Body Validation
    const errObj = {
        message: "Bad Request",
        errors: {

        }
    }

    let errCount = 0;

    if (name.length > 60) {
        errObj.errors.name = "Name must be 60 characters or less";
        errCount++;
    }

    if (about.length < 50) {
        errObj.errors.about = "About must be 50 characters or more";
        errCount++;
    }

    if (!["Online", "In person"].includes(type)) {
        errObj.errors.type = "Type must be 'Online' or 'In person'";
        errCount++;
    }

    if (typeof isPrivate !== "boolean") {
        errObj.errors.isPrivate = "Private must be a boolean";
        errCount++;
    }

    if (city.length === 0) {
        errObj.errors.city = "City is required";
        errCount++;
    }

    if (state.length === 0) {
        errObj.errors.state = "State is required";
        errCount++;
    }

    if (!["jpeg", "png", "jpg"].includes(backgroundImg[backgroundImg.length - 1])) {
        errObj.errors.backgroundImgInvalid = "Background Img Url is Invalid"
    }

    if (errCount > 0) return res.status(400).json(errObj)

    targetGroup.name = name || targetGroup.name,
        targetGroup.about = about || targetGroup.about,
        targetGroup.type = type || targetGroup.type,
        targetGroup.isPrivate = isPrivate || targetGroup.isPrivate,
        targetGroup.city = city || targetGroup.city,
        targetGroup.state = state || targetGroup.state
    targetGroup.backgroundImg = backgroundImg || targetGroup.backgroundImg

    await targetGroup.save()

    res.json(targetGroup);
})

//Delete An Existing Group

router.delete('/:groupId', requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    if (req.user.id !== targetGroup.organizerId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await targetGroup.destroy();

    res.status(200).json({
        message: "Successfully Deleted"
    })
})

//Get All Venues based on Group Id

router.get("/:groupId/venues", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    const allGroupVenues = await targetGroup.getVenues()

    res.status(200).json({
        Venues: allGroupVenues
    });
})

//Create a new Venus based on Group Id

router.post("/:groupId/venues", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const user = req.user;
    const { address, city, state, lat, lng } = req.body;

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: "co-host"
        }
    });

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    //Body Validation Checks:

    const errObj = {
        message: "Bad Request",
        errors: {}
    }

    let errCount = 0

    if (!address || address.length === 0) {
        errObj.errors.address = "Street address is required"
        errCount++
    }

    if (!city || city.length === 0) {
        errObj.errors.city = "City is required"
        errCount++
    }

    if (!state || state.length === 0) {
        errObj.errors.state = "State is required"
        errCount++
    }

    if (!lat || lat > 90 || lat < -90) {
        errObj.errors.lat = "Latitude must be within -90 and 90"
        errCount++
    }

    if (!lng || lng > 180 || lng < -180) {
        errObj.errors.lng = "Longitude must be within -180 and 180"
        errCount++
    }

    if (errCount > 0) return res.status(400).json(errObj)



    const newVenue = await Venue.create({
        groupId: groupId,
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    })

    const response = await Venue.findOne({
        where: {
            id: newVenue.id
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    res.json(response);
})

//Get All Events of a Group based on Id
router.get("/:groupId/events", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const groupEvents = await targetGroup.getEvents({
        attributes: {
            exclude: ['capacity', 'price']
        },
        include: [
            {
                model: Group,
                attributes: ["id", "name", "city", "state"]
            },
            {
                model: Venue,
                attributes: ["id", "city", "state"]
            }
        ]
    });

    if (groupEvents.length === 0) return res.status(404).json({
        message: "Event couldn't be found"
    })

    for (let event of groupEvents) {
        const attendCount = await Attendance.count({
            where: {
                eventId: event.id
            }
        });
        event.setDataValue("numAttending", attendCount)
    }

    for (let event of groupEvents) {
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
        Events: groupEvents
    })
})

//Create an Event for a Group based on Id
router.post("/:groupId/events", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    let { venueId, name, type, capacity, price, description, startDate, endDate, previewImg, address, city, state } = req.body;

    let eventVenue;

    if (venueId === null) {
        eventVenue = await Venue.create({
            groupId: groupId,
            address: address,
            city: city,
            state: state,
            lat: 85,
            lng: 120
        })
    }

    const targetVenue = await Venue.findByPk(venueId || eventVenue.id);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    if (!targetVenue) return res.status(404).json({
        message: "Venue couldn't be found"
    })


    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
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

    if (isNaN(currStartDate) || isNaN(currEndDate)) {
        errObj.errors.invalidDates = "Start and/or End Date are invalid";
        errCount++;
    }

    if (!currStartDate || currStartDate <= currentDate) {
        errObj.errors.startDate = "Start date must be in the future";
        errCount++;
    }

    if (!currEndDate || currEndDate <= currStartDate) {
        errObj.errors.endDate = "End date is less than start date"
        errCount++;
    }

    if (errCount > 0) return res.status(400).json(errObj);

    const convertDate = (date) => {
        const newDate = new Date(date);

        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, "0");
        const day = String(newDate.getDate()).padStart(2, "0");
        const hours = String(newDate.getHours()).padStart(2, "0");
        const minutes = String(newDate.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    let newEvent = await Event.create({
        groupId: groupId,
        venueId: venueId || eventVenue.id,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: convertDate(currStartDate),
        endDate: convertDate(currEndDate)
    })

    if (previewImg) {
        await EventImage.create({
            eventId: newEvent.id,
            url: previewImg,
            preview: true

        })
    }

    const response = await Event.findOne({
        where: {
            id: newEvent.id
        },
        attributes: {
            exclude: ["createdAt", "updatedAt"]
        }
    })

    return res.status(200).json(response);
})

//Get All Members of a Group based on Group Id
router.get("/:groupId/members", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const cohost = await Membership.findOne({
        where: {
            userId: req.user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    const arrOfMembers = await targetGroup.getMembers({
        attributes: {
            exclude: ['username']
        },
        joinTableAttributes: ["status"]
    });


    for (let i = 0; i < arrOfMembers.length; i++) {
        if (arrOfMembers[i].Membership.status === "pending") {
            arrOfMembers.splice(i, 1);
        }
    }


    if (targetGroup.organizerId !== req.user.id && !cohost) {
        return res.status(200).json({
            Members: arrOfMembers
        });
    }

    const groupMembers = await targetGroup.getMembers({
        attributes: {
            exclude: ['username']
        },
        joinTableAttributes: ["status"]
    });

    return res.status(200).json({
        Members: groupMembers
    })

})


//Request a Membership for a Group based on Group's Id
router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    const groupMembers = await targetGroup.getMembers();

    for (const member of groupMembers) {

        if (member.username === req.user.username) {
            if (member.Membership && (member.Membership.status === "member" || member.Membership.status === "co-host")) {
                return res.status(400).json({
                    message: "User is already a member of the group"
                });
            } else if (member.Membership && member.Membership.status !== "member") {
                return res.status(400).json({
                    message: "Membership has already been requested"
                })
            }
        }
    }

    const newMember = await Membership.create({
        userId: req.user.id,
        groupId: groupId,
        status: "pending"
    })

    const response = await Membership.findOne({
        where: {
            createdAt: newMember.createdAt,
            updatedAt: newMember.updatedAt
        },
        attributes: [['userId', 'memberId'], 'status']
    })

    return res.status(200).json(response);
})

//Edit/Change the Status of a Member
router.put("/:groupId/membership", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;
    const { memberId, status } = req.body;

    const targetGroup = await Group.findByPk(groupId);

    const memberUser = await User.findByPk(memberId);

    const targetMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    });

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    if (!memberUser) return res.status(404).json({
        message: "User couldn't be found"
    })

    if (!targetMember) return res.status(404).json({
        message: "Membership between the user and the group does not exist"
    });

    if (status === "pending") return res.status(400).json({
        message: "Bad Request",
        errors: {
            status: "Cannot change a membership status to pending"
        }
    });

    //Co-Host or Organizer Checks

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    //Check if Organizer when changing to Cohost !

    if (status === "co-host") {
        if (targetGroup.organizerId === user.id) {
            targetMember.status = status
            await targetMember.save();

            const response = await Membership.findOne({
                where: {
                    userId: memberId,
                    groupId: groupId
                },
                attributes: ['id', 'groupId', ['userId', 'memberId'], 'status']
            })

            return res.status(200).json(response);
        } else {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
    }


    //Changing to Member
    targetMember.status = status;
    await targetMember.save();

    const response = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        },
        attributes: ['id', 'groupId', ['userId', 'memberId'], 'status']
    })

    return res.status(200).json(response)
})

//Delete a membership to a group specificed by id
router.delete("/:groupId/membership/:memberId", requireAuth, async (req, res) => {
    const { groupId, memberId } = req.params

    const targetGroup = await Group.findByPk(groupId);

    const memberUser = await User.findByPk(memberId);

    const targetMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    if (!memberUser) return res.status(404).json({
        message: "User couldn't be found"
    })

    if (!targetMember) return res.status(404).json({
        message: "Membership does not exist for this User"
    })


    //When deleting YOUR OWN membership
    if (parseInt(req.user.id) === parseInt(memberId)) {
        await targetMember.destroy();
        return res.status(200).json({
            message: "Successfully deleted membership from group"
        })
    }

    //From this point forward, you are trying to delete someone else who is
    //not you and we check if you're valid//


    if (targetGroup.organizerId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }

    await targetMember.destroy();

    return res.status(200).json({
        message: "Successfully deleted membership from group"
    })
});

module.exports = router;
