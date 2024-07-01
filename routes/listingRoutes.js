const express = require('express');
const isLoggedIn = require('../middlewares/authMiddleware');
const { fetchListings } = require('../controllers/listingsController');
const router = express.Router();

router.get('/', isLoggedIn, fetchListings);

module.exports = router;