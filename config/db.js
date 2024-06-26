const mongoose = require('mongoose');
require('dotenv').config();

const DB_URL = process.env.DATABASE_URL;

async function DBconnect() {
    try {
        await mongoose.connect(DB_URL);
        console.log('DB Connection - SUCCESS')
    } catch (error) {
        console.log('DB Connection - FAILED')
        console.log(error)
    }
}

module.exports = DBconnect;