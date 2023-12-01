const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const {
    Venue,
    Group,
    Membership
} = require('../../db/models');

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

//Get All Venues

router.get("/", async (req, res) => {
    const allVenues = await Venue.findAll();
    res.json(allVenues);
})

//Edit a Venue based on Id

router.put("/:venueId", requireAuth, async (req, res) => {
    const user = req.user;
    const { venueId } = req.params;
    const targetVenue = await Venue.findByPk(venueId);
    const { groupId, address, city, state, lat, lng } = req.body;

    if (!targetVenue) return res.status(404).json({
        message: "Venue couldn't be found"
    })

    const targetGroup = await Group.findByPk(targetVenue.groupId);

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: targetVenue.groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json({
            message: "Not Allowed to Edit Venue!"
        })
    }

    targetVenue.groupId = groupId || targetVenue.groupId;
    targetVenue.address = address || targetVenue.address;
    targetVenue.city = city || targetVenue.city;
    targetVenue.state = state || targetVenue.state;
    targetVenue.lat = lat || targetVenue.lat;
    targetVenue.lng = lng || targetVenue.lng;

    await targetVenue.save();

    res.json(targetVenue);
})



module.exports = router;
