// imports router
const router = require('express').Router();
// imports api routes
const apiRoutes = require('./api');

// adds api prefix to api routes
router.use('/api', apiRoutes);
router.use((req, res) => res.send('Wrong route'));

// exports router
module.exports = router;
