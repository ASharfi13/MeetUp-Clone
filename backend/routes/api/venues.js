const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const {
    Venue,
    Group,
    Membership
} = require('../../db/models');

const { body, check, validationResult } = require("express-validator");
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
            message: "Forbidden"
        })
    }

    //Body Validation Check
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

    targetVenue.groupId = groupId || targetVenue.groupId;
    targetVenue.address = address || targetVenue.address;
    targetVenue.city = city || targetVenue.city;
    targetVenue.state = state || targetVenue.state;
    targetVenue.lat = lat || targetVenue.lat;
    targetVenue.lng = lng || targetVenue.lng;

    await targetVenue.save();

    const response = await Venue.findOne({
        where: {
            id: venueId
        },
        attributes: {
            exclude: ["updatedAt", "createdAt"]
        }
    })

    res.json(response);
})



module.exports = router;
