const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    registerDriver,
    loginDriver,
    getDriver,
    updateDriver,
    deleteDriver,
    approveDriver // Controller for admin approval
} = require('../controllers/driverController');
const auth = require('../middleware/authMiddleware'); // Single middleware for auth and role checking

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Create the upload directory if it does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Specify your upload directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Customize the file name
    }
});

const upload = multer({ storage });

// Register Driver with document uploads
router.post(
    '/register',
    upload.fields([
        { name: 'licenseImage', maxCount: 1 },
        { name: 'vehicleRegistration', maxCount: 1 },
        { name: 'insuranceDocument', maxCount: 1 }
    ]),
    registerDriver
);

// Login Driver
router.post('/login', loginDriver);

// Get Driver Profile
router.get('/profile', auth, getDriver);

// Update Driver Profile (with file uploads)
router.put(
    '/profile',
    auth,
    upload.fields([
        { name: 'licenseImage', maxCount: 1 },
        { name: 'vehicleRegistration', maxCount: 1 },
        { name: 'insuranceDocument', maxCount: 1 }
    ]),
    updateDriver
);

// Delete Driver Profile
router.delete('/profile', auth, deleteDriver);

// Admin approves a driver
router.put('/approve/:driverId', auth, (req, res, next) => {
    // Check if the user has admin privileges
    if (req.admin) {
        return approveDriver(req, res);
    } else {
        return res.status(403).json({ message: 'Access denied. Admins only' }); // Unauthorized access
    }
});

module.exports = router;
