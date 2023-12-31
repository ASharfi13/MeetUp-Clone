// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const membershipsRouter = require('./memberships.js');
const attendancesRouter = require('./attendances.js');
const imagesRouter = require('./images.js');

// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

router.use('/memberships', membershipsRouter);

router.use('/attendances', attendancesRouter);

router.use('/', imagesRouter);

router.post('/test', (req, res) => {
    res.json({ requestBody: req.body });
});



module.exports = router;
