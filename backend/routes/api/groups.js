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
router.get("/", requireAuth, async (req, res) => {
    const allGroups = await Group.findAll();

    for (let group of allGroups) {
        const memberCount = await Membership.count({
            where: {
                groupId: group.id
            }
        });
        group.setDataValue("numMembers", memberCount)
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

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
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
    const user = req.params
    const { groupId } = req.params
    const { url, preview } = req.body;
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    if (user.id !== targetGroup.organizerId) {
        return res.status(403).json("Forbidden")
    }

    const newGroupImage = await GroupImage.create({
        groupId: groupId,
        url: url,
        preview: preview
    })

    res.json(newGroupImage);
})

//Edit a Group

router.put("/:groupId", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params
    const targetGroup = await Group.findByPk(groupId);
    let { name, about, type, private, city, state } = req.body

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    if (user.id !== targetGroup.organizerId) {
        return res.status(403).json("Forbidden")
    }

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
        return res.status(403).json("Forbidden")
    }

    const allGroupVenues = await targetGroup.getVenues()

    res.status(200).json({
        Venues: allGroupVenues
    });
})

//Create a new Venus based on Group Id

router.post("/:groupId/venues", async (req, res) => {
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const user = req.user;

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    const cohost = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json("Forbidden")
    }

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
    const user = req.user;
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

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
        return res.status(403).json("Forbidden")
    }

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

//Get All Members of a Group based on Group Id
router.get("/:groupId/members", async (req, res) => {
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

    const specificMembers = await Membership.findAll({
        where: {
            groupId: groupId,
            status: ["co-host", "member"]
        }
    });


    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(200).json(specificMembers);
    }

    const groupMembers = await targetGroup.getMembers({ reload: true });

    return res.status(200).json({
        Members: groupMembers
    })

})


//Request a Membership for a Group based on Group's Id
router.post("/:groupId/membership", requireAuth, async (req, res) => {
    const { groupId } = req.params;
    const user = req.user
    const targetGroup = await Group.findByPk(groupId);

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    const groupMembers = await targetGroup.getMembers();

    for (const member of groupMembers) {

        if (member.username === user.username) {
            if (member.Membership && (member.Membership.status === "member" || member.Membership.status === "co-host")) {
                return res.status(400).json({
                    message: "User is already a member"
                });
            } else if (member.Membership && member.Membership.status !== "member") {
                return res.status(400).json({
                    message: "Membership has already been requested"
                })
            }
        }
    }

    const newMember = await Membership.create({
        userId: user.id,
        groupId: groupId,
        status: "pending"
    })

    return res.status(200).json(newMember);
})

//Edit/Change the Status of a Member
router.put("/:groupId/membership", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params;
    const targetGroup = await Group.findByPk(groupId);
    const { memberId, status } = req.body;

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    });

    if (!targetMember) return res.status(404).json({
        message: "Validations Error",
        "errors": {
            "status": "User couldn't be found"
        }
    });

    if (status === "pending") return res.status(400).json({
        message: "Validations Error",
        errors: {
            memberId: "Cannot change a membership status to pending"
        }
    });

    const targetMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    });

    if (!status) return res.status(404).json({
        message: "Membership between the user and the group does not exist"
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
        return res.status(403).json("Forbidden")
    }

    if (status === "co-host") {
        if (targetGroup.organizerId === user.id) {
            targetMember.state = status
            await targetMember.save();
            return res.status(200).json(targetMember);
        } else {
            return res.status(403).json("Forbidden");
        }
    }
})

//Delete a membership to a group specificed by id
router.delete("/:groupId/membership", requireAuth, async (req, res) => {
    const user = req.user;
    const { groupId } = req.params
    const targetGroup = await Group.findByPk(groupId);
    const { memberId } = req.body

    if (!targetGroup) return res.status(404).json({
        message: "Group couldn't be found"
    })

    if (!memberId) {
        return res.status(400).json({
            message: "Validation Error",
            errors: {
                memberId: "User couldn't be found"
            }
        })
    }

    const targetMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId
        }
    })

    if (!targetMember) return res.status(400).json({
        message: "Validation Error",
        errors: {
            memberId: "User couldn't be found"
        }
    })

    const userCurrentMember = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId
        }
    })

    if (userCurrentMember) {
        await userCurrentMember.destroy();
        return res.status(200).json({
            message: "Successfully deleted membership from group"
        })
    }


    if (targetMember.status !== "member") {
        return res.status(404).json({
            message: "Membership does not exist for this User"
        })
    }


    //From this point forward, you are trying to delete someone else who is
    //not you and we check if you're valid//

    const cohost = await Membership.findOne({
        where: {
            userId: memberId,
            groupId: groupId,
            status: "co-host"
        }
    })

    if (targetGroup.organizerId !== user.id && !cohost) {
        return res.status(403).json("Forbidden")
    }

    await targetMember.destroy();

    return res.json(200).json({
        message: "Successfully deleted membership from group"
    })
});

module.exports = router;
