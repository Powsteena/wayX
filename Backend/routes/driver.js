const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const RideRequestSchema = require('../models/RideRequestSchema');

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

// Create the upload directory if it does not exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Specify the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Customize the file name
    }
});

const upload = multer({ storage });

// POST /api/driver/register - Register Driver with document uploads
router.post('/register', 
    upload.fields([
        { name: 'licenseImage', maxCount: 1 },
        { name: 'vehicleRegistration', maxCount: 1 },
        { name: 'insuranceDocument', maxCount: 1 }
    ]),
    async (req, res) => {
        const { username, email, password, licenseNumber, vehicleType } = req.body;

        try {
            let driver = await Driver.findOne({ email });
            if (driver) {
                return res.status(400).json({ msg: 'Driver already exists' });
            }

            if (!req.files['licenseImage'] || !req.files['vehicleRegistration'] || !req.files['insuranceDocument']) {
                return res.status(400).json({ msg: 'All required documents must be uploaded' });
            }

            driver = new Driver({
                username,
                email,
                password,
                licenseNumber,
                vehicleType,
                licenseImage: req.files['licenseImage'][0].path,
                vehicleRegistration: req.files['vehicleRegistration'][0].path,
                insuranceDocument: req.files['insuranceDocument'][0].path,
                isApproved: false
            });

            await driver.save();

            const payload = {
                driver: {
                    id: driver.id,
                    role: 'driver'
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, role: 'driver' });
                }
            );
        } catch (error) {
            console.error('Registration Error:', error);
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ errors });
            }
            res.status(500).json({ message: 'Registration failed. Please try again.' });
        }
    }
);

// POST /api/driver/login - Login Driver
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check if the driver is approved by the admin
        if (!driver.isApproved) {
            return res.status(403).json({ msg: 'Your account is not approved yet. Please contact support.' });
        }

        const payload = {
            driver: {
                id: driver.id,
                role: 'driver'
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: 'driver' });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Update driver availability and live location
router.post('/update-availability', async (req, res) => {
    const { driverId, isAvailable, liveLocation } = req.body;

    try {
        const updateData = { isAvailable };

        // If the driver is available, update the liveLocation
        if (isAvailable && liveLocation) {
            updateData.liveLocation = {
                address: liveLocation.address,
                coordinates: liveLocation.coordinates
            };
        } else {
            updateData.liveLocation = null; // Set to null if not available
        }

        const updatedDriver = await Driver.findByIdAndUpdate(
            driverId,
            updateData,
            { new: true }
        );

        if (!updatedDriver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        res.json(updatedDriver);
    } catch (error) {
        console.error('Error updating driver availability:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


//Route to get the total number of drivers
router.get('/count', async (req, res) => {
    try {
      const driverCount = await Driver.countDocuments();
      res.json({ count: driverCount });
    } catch (error) {
      console.error('Error fetching driver count:', error);
      res.status(500).json({ error: 'Failed to fetch driver count' });
    }
  });

//   // GET /api/driver/riderequests - Fetch all ride requests for a specific driver with matching vehicle type
// router.get('/riderequests', async (req, res) => {
//     try {
//         const driverId = req.driverId;  // Assume driverId is added to the req object in driverCheck middleware

//         // Fetch the driver to get the vehicle type
//         const driver = await DriverSchema.findById(driverId).select('vehicle');  // Assuming 'vehicle' is a field in the Driver schema
//         if (!driver) {
//             return res.status(404).json({ message: 'Driver not found' });
//         }

//         const driverVehicleType = driver.vehicle.type;  // Assuming 'vehicle' field contains an object with 'type' property

//         // Define the time window (e.g., fetch ride requests created in the last 10 minutes)
//         const timeWindow = 10 * 60 * 1000;  // 10 minutes in milliseconds
//         const currentTime = new Date();
//         const minTime = new Date(currentTime.getTime() - timeWindow);

//         // Find ride requests with the same vehicle type and created within the last 10 minutes
//         const rides = await RideRequestSchema.find({
//             vehicleType: driverVehicleType,  // Match the ride request's vehicle type with the driver's vehicle type
//             createdAt: { $gte: minTime }     // Filter by creation time (latest rides within the time window)
//         })
//             .populate('userId', 'name email')  // Populate user details
//             .select('-__v');  // Exclude the __v field

//         // Ensure pickup and dropoff are always present
//         const ridesWithDefaultValues = rides.map((ride) => ({
//             ...ride._doc,  // Spread the existing ride document
//             pickup: ride.pickup || { address: 'Not provided' },  // Default pickup
//             dropoff: ride.dropoff || { address: 'Not provided' }  // Default dropoff
//         }));

//         // Send the rides specific to the driver
//         res.status(200).json(ridesWithDefaultValues);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server error');
//     }
// });

  
// GET /api/driver/riderequests - Fetch all ride requests for a specific driver
router.get('/riderequests', async (req, res) => {
    try {
        const driverId = req.driverId;  // Assume driverId is added to the req object in driverCheck middleware

        // Find all ride requests assigned to the logged-in driver
        const rides = await RideRequestSchema.find({ driverId })
            .populate('userId', 'name email')  // Populate user details
            .select('-__v');  // Exclude the __v field

        // Ensure pickup and dropoff are always present
        const ridesWithDefaultValues = rides.map((ride) => ({
            ...ride._doc,  // Spread the existing ride document
            pickup: ride.pickup || { address: 'Not provided' },  // Default pickup
            dropoff: ride.dropoff || { address: 'Not provided' }  // Default dropoff
        }));

        // Send the rides specific to the driver
        res.status(200).json(ridesWithDefaultValues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

  module.exports = router;
