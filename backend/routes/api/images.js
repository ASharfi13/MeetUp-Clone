const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {
    GroupImage,
    EventImage,
    Membership,
    Group,
    Event
} = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op, or } = require("sequelize");
const venue = require('../../db/models/venue');

const router = express.Router();

//Delete an Image for a Group
router.delete("/group-images/:imageId", requireAuth, async (req, res) => {
    const user = req.user;
    const { imageId } = req.params;
    const targetImage = await GroupImage.findByPk(imageId);

    if (!targetImage) return res.status(404).json({
        message: "Group Image couldn't be found"
    })

    const userOrganizer = await Group.findOne({
        where: {
            organizerId: user.id,
            id: targetImage.groupId
        }
    })

    const userCohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: targetImage.groupId,
            status: "co-host"
        }
    })

    if (!userOrganizer || !userCohost) {
        return res.status(403).json({
            message: "Only the Co-Host or Organizer may delete a Group's Image"
        })
    }

    await targetImage.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })
});

//Delete an Image for an Event
router.delete("/event-images/:imageId", requireAuth, async (req, res) => {
    const user = req.user;
    const { imageId } = req.params;
    const targetImage = await EventImage.findByPk(imageId);
    const targetEvent = await Event.findByPk(targetImage.eventId)

    if (!targetImage) return res.status(404).json({
        message: "Event Image couldn't be found"
    })

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

    if (!userOrganizer || !userCohost) {
        return res.status(403).json({
            message: "Only the Co-Host or Organizer may delete an Event's Image"
        })
    }

    await targetImage.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })
});

module.exports = router;
