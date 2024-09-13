// src/routes/driverRoutes.js

const express = require('express');
const router = express.Router();
const {
    registerDriver,
    loginDriver,
    getDriver,
    updateDriver,
    deleteDriver
} = require('../controllers/driverController');
const auth = require('../middleware/authMiddleware');

// Register Driver
router.post('/register', registerDriver);

// Login Driver
router.post('/login', loginDriver);

// Get Driver Profile
router.get('/profile', auth, getDriver);

// Update Driver Profile
router.put('/profile', auth, updateDriver);

// Delete Driver Profile
router.delete('/profile', auth, deleteDriver);

module.exports = router;
