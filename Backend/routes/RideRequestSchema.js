const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequestSchema');  // Adjust the path as needed
const authMiddleware = require('../middleware/authMiddleware'); 

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType, numPassengers } = req.body;

    // Check for authenticated user
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const newRideRequest = new RideRequest({
      pickup: {
        address: pickup,
        coordinates: req.body.pickupCoords,
      },
      dropoff: {
        address: dropoff,
        coordinates: req.body.dropoffCoords,
      },
      vehicleType,
      numPassengers,
      userId: req.user._id,  // Assuming you have user authentication in place
    });

    await newRideRequest.save();
    res.status(201).json({ message: 'Ride request created successfully', rideRequest: newRideRequest });
  } catch (error) {
    console.error('Error creating ride request:', error);
    res.status(500).json({ message: 'Error creating ride request' });
  }
});

module.exports = router;
