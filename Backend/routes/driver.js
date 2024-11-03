const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const RideRequest = require('../models/RideRequestSchema');
const User = require('../models/User')



router.post('/ride-requests/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Verify the token and get driver ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const driverId = decoded.driver.id;
        console.log(driverId);

    
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        const { vehicleType, location: liveLocation } = driver;

        // Check the driver's location
        console.log('Driver Location:', liveLocation.coordinates);

        // Fetch all ride requests that match the driver's vehicle type
        const rideRequests = await RideRequest.find({
            vehicleType: vehicleType.toLowerCase(), 
            status: 'pending' 
        });

        res.json({ nearbyRequest: rideRequests[rideRequests.length-1] });
        
    } catch (error) {
        console.error('Error fetching ride requests:', error);
        res.status(500).json({ message: 'Failed to fetch ride requests' });
    }
});



//Find user
router.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId); // Adjust according to your database structure
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user details:', error);
      res.status(500).json({ message: 'Server error' });
    }
});




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




// Get a driver's profile
router.get('/profile', async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.driverId);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
      res.json({
        _id: driver._id,
        username: driver.username,
        licenseNumber: driver.licenseNumber,
        vehicleType: driver.vehicleType,
        vehicleRegistration: driver.vehicleRegistration,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });



  // Route to update ride request status to "accepted"
router.put('/accept/:rideRequestId', async (req, res) => {
    const { rideRequestId } = req.params;

    try {
        // Find the ride request and update the status to "accepted"
        const updatedRequest = await RideRequest.findByIdAndUpdate(
            rideRequestId,
            { status: 'accepted', acceptedAt: new Date() }, // Update status and set acceptedAt
            { new: true } // Returns the updated document
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Ride request not found' });
        }

        res.json({
            message: 'Ride request status updated to accepted',
            rideRequest: updatedRequest
        });
    } catch (error) {
        console.error('Error updating ride request status:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});



//see accepted or not

router.get('/ride-requests', async (req, res) => {
    try {
        // Retrieve all ride requests
        const rideRequests = await RideRequest.find() 

        if (rideRequests.length > 0) {
            const firstRequest = rideRequests[rideRequests.length-1]; 
            const isAccepted = firstRequest.status === 'accepted';  
            if(isAccepted){
                return res.json({ accepted: true}); 
            }
            return res.json({ accepted: false });
           
        } else {
            return res.json({ accepted: false });
        }
    } catch (error) {
        console.error('Error fetching ride requests:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});
  
 

 module.exports = router;