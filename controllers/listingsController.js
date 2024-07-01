const User = require('../models/userModel');
const Listing = require('../models/listingModel');

exports.fetchListings = async (req, res) => {
    try {
        const userId = req.user._id;

        const listings = await Listing.find({ user: userId });
        if (!listings || listings.length === 0) {
            return res.status(404).json({ error: 'No listings found for this user.' });
        }
        res.json(listings);
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
