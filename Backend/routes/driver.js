const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const RideRequest = require('../models/ScheduledRide');
const User = require('../models/User')
const Payment = require('../models/Payment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load your Stripe secret key




// router.post('/ride-requests/:token', async (req, res) => {
//     const { token } = req.params;

//     try {
//         // Verify the token and get driver ID
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const driverId = decoded.driver.id;
//         console.log(driverId);

    
//         const driver = await Driver.findById(driverId);
//         if (!driver) {
//             return res.status(404).json({ message: 'Driver not found' });
//         }

//         const { vehicleType, location: liveLocation } = driver;

//         // Check the driver's location
//         console.log('Driver Location:', liveLocation.coordinates);

//         // Fetch all ride requests that match the driver's vehicle type
//         const rideRequests = await RideRequest.find({
//             vehicleType: vehicleType.toLowerCase(), 
//             status: 'pending' 
//         });

//         res.json({ nearbyRequest: rideRequests[rideRequests.length-1] });
        
//     } catch (error) {
//         console.error('Error fetching ride requests:', error);
//         res.status(500).json({ message: 'Failed to fetch ride requests' });
//     }
// });


const mongoose = require('mongoose');
const haversine = require('haversine-distance'); // Install this package for distance calculation
// Ride Requests Route: Fetch the latest ride request that matches the vehicle type, status, and proximity
router.get('/ride-requests/:token', async (req, res) => {
    const { token } = req.params;

    try {
        if (!token) {
            console.log('No token provided');
            return res.status(400).json({ message: 'Token is required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const driverId = decoded.driver.id; // Access the driver's ID from the decoded token

        // Find the driver in the database
        const driver = await Driver.findById(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        console.log('Driver data:', driver);
        const { vehicleType, liveLocation } = driver;

        // Fetch all pending ride requests that match the driver's vehicle type
        const rideRequests = await RideRequest.find({
            vehicleType: vehicleType.toLowerCase(),
            status: 'pending'
        }).sort({ createdAt: -1 }); // Sorting by latest request

        // Filter nearby requests using Google Maps Distance Matrix API
        const nearbyRequestsPromises = rideRequests.map(async (request) => {
            if (request.pickupLocation && liveLocation) {
                const driverLocation = `${liveLocation.coordinates[1]},${liveLocation.coordinates[0]}`;
                const pickupLocation = `${request.pickupLocation.coordinates[1]},${request.pickupLocation.coordinates[0]}`;

                // Call Google Distance Matrix API
                const options = {
                    method: 'GET',
                    url: 'https://google-map-places.p.rapidapi.com/maps/api/distancematrix/json',
                    params: {
                        origins: driverLocation,
                        destinations: pickupLocation,
                        mode: 'driving',
                        units: 'metric',
                    },
                    headers: {
                        'x-rapidapi-key': '962111a97cmshe5fa71b93e2a226p128708jsn2f0b2b4e19e8',
                        'x-rapidapi-host': 'google-map-places.p.rapidapi.com'
                    }
                };

                try {
                    const response = await axios.request(options);
                    const distanceData = response.data.rows[0].elements[0];

                    if (distanceData.status === 'OK') {
                        const distanceInMeters = distanceData.distance.value;
                        console.log(`Distance to request: ${distanceInMeters} meters`);
                        return distanceInMeters <= 5000 ? request : null; // Distance threshold of 5 km
                    } else {
                        console.log('Error fetching distance from Google Maps API:', distanceData.status);
                    }
                } catch (error) {
                    console.error('Error fetching distance from Google Maps API:', error.message);
                }
            }
            return null;
        });

        const nearbyRequests = (await Promise.all(nearbyRequestsPromises)).filter(Boolean);

        // Get the latest nearby request, if any
        const latestNearbyRequest = nearbyRequests.length > 0 ? nearbyRequests[0] : null;

        // Check if the latest request is accepted
        const isAccepted = latestNearbyRequest ? latestNearbyRequest.status === 'accepted' : false;

        res.json({
            accepted: isAccepted,
            nearbyRequest: latestNearbyRequest
        });
    } catch (error) {
        console.error('Error fetching ride requests:', error.message);
        res.status(500).json({ message: 'Server error' });
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


// Create Payment Intent Route

router.post('/create-payment-intent', async (req, res) => {
    try {
      const { driverId, amount, currency } = req.body;
  
      if (!driverId || !amount || !currency) {
        return res.status(400).json({ 
          message: 'Missing required fields: driverId, amount, and currency are required' 
        });
      }
  
      // Create payment record first
      const payment = new Payment({
        driverId,
        amount,
        currency,
        status: 'pending'
      });
      await payment.save();
  
      // Create Stripe PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: {
          driverId,
          paymentId: payment._id.toString()
        }
      });
  
      // Update payment record with Stripe ID
      payment.stripePaymentIntentId = paymentIntent.id;
      await payment.save();
  
      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
      });
    } catch (error) {
      console.error('Payment intent creation error:', error);
      res.status(500).json({ 
        message: 'Failed to create payment intent',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
  
 
router.post('/payment-success', async (req, res) => {
    try {
      const { paymentId, transactionId, driverId } = req.body;
      
      if (!paymentId || !transactionId || !driverId) {
        return res.status(400).json({ 
          message: 'Missing required fields: paymentId, transactionId, and driverId are required' 
        });
      }
  
      // Find the payment by ID
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      // Ensure that the driver ID matches the payment's driverId
      if (payment.driverId.toString() !== driverId) {
        return res.status(403).json({ message: 'Unauthorized access to payment' });
      }
  
      // Update the payment status to 'completed'
      payment.status = 'completed';
      payment.transactionId = transactionId;
      await payment.save();
  
      // Now update the driver's hasPaid status to true
      const driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({ message: 'Driver not found' });
      }
  
      driver.hasPaid = true; // Update the driver's hasPaid status
      await driver.save();
  
      res.json({ 
        message: 'Payment updated successfully and driver\'s hasPaid status updated' 
      });
    } catch (error) {
      console.error('Payment success update error:', error);
      res.status(500).json({ 
        message: 'Failed to update payment and driver status'
      });
    }
  });
  
  


//see accepted or not

// router.get('/ride-requests', async (req, res) => {
//     try {
//         // Retrieve all ride requests
//         const rideRequests = await RideRequest.find() 

//         if (rideRequests.length > 0) {
//             const firstRequest = rideRequests[rideRequests.length-1]; 
//             const isAccepted = firstRequest.status === 'accepted';  
//             if(isAccepted){
//                 return res.json({ accepted: true}); 
//             }
//             return res.json({ accepted: false });
           
//         } else {
//             return res.json({ accepted: false });
//         }
//     } catch (error) {
//         console.error('Error fetching ride requests:', error.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// });
  
 

 module.exports = router;