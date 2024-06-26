const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ message: 'Email already exists.'});
        }

        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ', error: error.message });
    }
};