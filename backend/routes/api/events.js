const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const {
    Event,
    Venue,
    Group,
    EventImage,

} = require('../../db/models');

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const venue = require('../../db/models/venue');

const router = express.Router();

//Get All the Events
router.get('/', async (req, res) => {
    const allEvents = await Event.findAll();

    return res.status(200).json({
        Events: allEvents
    });

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
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { url, preview } = req.body

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    const newEventImage = await EventImage.create({
        eventId: eventId,
        url: url,
        preview: preview
    })

    return res.status(200).json(newEventImage);
})

//Edit and Event based on Event's Id
router.put("/:eventId", requireAuth, async (req, res) => {
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const targetVenue = await Venue.findByPk(venueId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    if (!targetVenue) return res.status(404).json({
        message: "Venue couldn't be found"
    })

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
    const { eventId } = req.params;
    const targetEvent = await Event.findByPk(eventId);

    if (!targetEvent) return res.status(404).json({
        message: "Event couldn't be found"
    })

    await targetEvent.destroy();

    res.status(200).json({
        message: "Successfully Deleted"
    })
})


module.exports = router;
