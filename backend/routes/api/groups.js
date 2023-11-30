const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const
    {
        Group,
        Membership,
        User,
        Venue,
        GroupImage,
        Event

    } = require('../../db/models');

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const venue = require('../../db/models/venue');

const router = express.Router();

//Get All Groups
router.get("/", async (req, res) => {
    const allGroups = await Group.findAll();

    for (let group of allGroups) {
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        group.setDataValue("numMembers", memberCount)
    }

    res.status(200)
    res.json(allGroups)
});


//Get All Group Info From Current User

router.get('/current', requireAuth, async (req, res) => {
    console.log("LOOK HERE!:", req.user.id);
    const currentUser = await User.findByPk(req.user.id);
    const userGroupsOrganized = await currentUser.getGroupsOrganized();
    const userGroupsJoined = await currentUser.getGroupsJoined();
    res.json({
        Groups: userGroupsOrganized.concat(userGroupsJoined)
    })
})

//Get Group Details based on Id

router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    const targetGroup = await Group.findByPk(groupId, {
        include: [
            {
                model: GroupImage,
                where: { groupId: groupId }
            },
            {
                model: User,
                as: "Organizer",
                attributes: ["id", "firstname", "lastname"],
            },
            {
                model: Venue,
                where: { groupId: groupId }
            },
        ]
    })

    res.json(targetGroup);
})

//Create a new Group

router.post("/", requireAuth, async (req, res) => {
    let { name, about, type, private, city, state } = req.body;
    const user = req.user;

    let newGroup = await Group.create({
        organizerId: user.id,
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    })

    res.json(newGroup)
})

//Add an Image to a Group based on the Group's Id

router.post("/:groupId/images", requireAuth, async (req, res) => {
    const { groupId } = req.params
    const { url, preview } = req.body;
    const newGroupImage = await GroupImage.create({
        groupId: groupId,
        url: url,
        preview: preview
    })

    res.json(newGroupImage);
})

//Edit a Group

router.put("/:groupId", requireAuth, async (req, res) => {
    const { groupId } = req.params
    const targetGroup = await Group.findByPk(groupId);
    let { name, about, type, private, city, state } = req.body

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    targetGroup.name = name || targetGroup.name,
        targetGroup.about = about || targetGroup.about,
        targetGroup.type = type || targetGroup.type,
        targetGroup.private = private || targetGroup.private,
        targetGroup.city = city || targetGroup.city,
        targetGroup.state = state || targetGroup.state

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

    targetGroup.destroy();

    res.json({
        message: "Successfully Deleted"
    })
})

//Get All Venues based on Group Id

router.get("/:groupId/venues", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const allGroupVenues = await targetGroup.getVenues()

    res.json({
        Venues: allGroupVenues
    });
})

//Create a new Venus based on Group Id

router.post("/:groupId/venues", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    const { address, city, state, lat, lng } = req.body;

    const newVenue = await Venue.create({
        groupId: groupId,
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    })

    res.json(newVenue);
})

//Get All Events of a Group based on Id
router.get("/:groupId/events", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const groupEvents = await targetGroup.getEvents({
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

    return res.status(200).json({
        Events: groupEvents
    })
})

//Create an Event for a Group based on Id
router.post("/:groupId/events", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    const newEvent = await Event.create({
        groupId: groupId,
        venueId: venueId,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: startDate,
        endDate: endDate
    })

    return res.status(200).json(newEvent);
})




module.exports = router;
