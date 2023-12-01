const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { Membership } = require('../../db/models');


const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");
const venue = require('../../db/models/venue');
const membership = require('../../db/models/membership');

const router = express.Router();

//Get All Members In General Route:

router.get("/", async (req, res) => {
    const allMembers = await Membership.findAll();
    res.json(allMembers)
})

module.exports = router;
