// src/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const driverRoutes = require('./routes/driver');
const adminRoutes = require('./routes/admin'); // Import admin routes

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded bodies

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Register user routes
app.use('/api/auth', authRoutes);

// Register driver routes
app.use('/api/driver', driverRoutes);

// Register admin routes
app.use('/api/admin', adminRoutes); // Add this line to include admin routes

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
