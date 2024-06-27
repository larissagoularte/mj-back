const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.staus(400).json({ message: "Email and password are required."})
        }

        const lowerCaseEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowerCaseEmail });
        if(!user) {
            return res.status(400).json({ message: "Invalid email or password."});
        }

        const passCompare = await bcrypt.compare(password, user.password);
        if (passCompare) {
            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                },
                JWT_SECRET,
                {
                    expiresIn: '1h'
                }
            );

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            
            return res.status(200).json({ id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName });
        } else {
            return res.status(400).json({ message: "Invalid email or password." });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}