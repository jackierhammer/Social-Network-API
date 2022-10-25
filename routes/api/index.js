// imports router 
const router = require('express').Router();
// imports user and thought routes from same folder
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');

// connects user and thought routes to the router
router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

// exports router
module.exports = router;