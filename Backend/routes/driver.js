const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const ScheduledRide = require('../models/ScheduledRide');
const User = require('../models/User')
const Payment = require('../models/Payment')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Load your Stripe secret key

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
        const { username, email, password, phoneNumber, vehicleType, vehicleNumber } = req.body;

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
                phoneNumber,
                vehicleType,
                vehicleNumber,
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
      const driver = await Driver.findOne({ email });
      if (!driver) {
          return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, driver.password);
      if (!isMatch) {
          return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
      }

      // Check if the driver is approved by the admin
      if (!driver.isApproved) {
          return res.status(403).json({ 
              success: false, 
              msg: 'Your account is not approved yet. Please contact support.' 
          });
      }

      const payload = {
          driver: {
              id: driver.id,
              role: 'driver',
              isApproved: driver.isApproved,
              hasPaid: driver.hasPaid
          }
      };

      jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '1h' },
          (err, token) => {
              if (err) throw err;
              res.json({ 
                  success: true,
                  token,
                  role: 'driver',
                  hasPaid: driver.hasPaid
              });
          }
      );
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, msg: 'Server error' });
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
        phoneNumber: driver.phoneNumber,
        vehicleType: driver.vehicleType,
        vehicleRegistration: driver.vehicleRegistration,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
  


// get matching rides
router.get('/scheduledrides', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decodedToken.driver.id;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ msg: 'Driver not found' });
    }

    const driverVehicleType = driver.vehicleType;

    // Get the current date and time
    const currentTime = new Date();

    const matchingRides = await ScheduledRide.find({
      vehicleType: driverVehicleType,
      status: 'pending',
      scheduledDateTime: { $gt: currentTime } // Filter for future rides
    })
      .populate({
        path: 'userId',
        select: 'name username' // Include both name and username
      })
      .select('-__v');

    if (matchingRides.length === 0) {
      return res.status(404).json({ msg: 'No matching rides found' });
    }

    res.json(matchingRides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Route to accept a ride
router.patch('/accept-ride/:rideId', async (req, res) => {
  try {
      const rideId = req.params.rideId;
      const token = req.header('Authorization').replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const driverId = decodedToken.driver.id;  // Get the driver ID from the token

      // Find the ride by rideId
      const ride = await ScheduledRide.findById(rideId);
      
      // Check if the ride exists
      if (!ride) {
          return res.status(404).json({ msg: 'Ride not found' });
      }

      // Check if the ride status is pending (only pending rides can be accepted)
      if (ride.status !== 'pending') {
          return res.status(400).json({ msg: 'Ride has already been accepted or is not available' });
      }

      // Update the ride's status to 'accepted' and set the driver's ID
      ride.status = 'accepted';
      ride.driverId = driverId;
      ride.acceptedAt = new Date();  // Set the time when the ride was accepted

      // Save the updated ride
      await ride.save();

      res.json({ msg: 'Ride accepted successfully', ride });
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
  }
});


// Fetch rides accepted by the logged-in driver
router.get('/acceptedrides', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decodedToken.driver.id; // Assuming the driver ID is stored in decoded token

    const driver = await Driver.findById(driverId);
    if (!driver) {
        return res.status(404).json({ msg: 'Driver not found' });
    }

    // Fetch the rides where the driver has been assigned and status is accepted
    const acceptedRides = await ScheduledRide.find({
        driverId: driverId,      // Driver ID should match
        status: 'accepted'       // The ride's status must be 'accepted'
    })
    .populate({
        path: 'userId',
        select: 'name username' // Include both name and username from the user model
    })
    .select('-__v'); // Exclude version key from the result

    // Check if there are no accepted rides
    if (acceptedRides.length === 0) {
        return res.status(404).json({ msg: 'No accepted rides found for this driver' });
    }

    res.json(acceptedRides);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

 module.exports = router;