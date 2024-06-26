require('dotenv').config();
const express = require('express');
const cors = require('cors');
const DBconnect = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express(); 
const PORT = process.env.PORT || 9000;

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json())

DBconnect();

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to MJMgmt API!');
});

app.listen(PORT, () => {
    console.log('Server running on PORT ' + PORT)
});