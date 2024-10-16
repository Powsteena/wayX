

const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequestSchema');  // Adjust the path as needed
const Driver = require('../models/driver');  // Import the Driver model for finding nearest drivers
const authMiddleware = require('../middleware/authMiddleware'); 
const { io } = require('../server');  // Import Socket.io instance

// Create Ride Request and notify drivers in real-time
router.post('/', authMiddleware, async (req, res) => {
  try {

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    const { pickup, dropoff, vehicleType, numPassengers } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }


    // Validate pickup and dropoff objects
    if (!pickup.address || !pickup.coordinates || !dropoff.address || !dropoff.coordinates) {
      console.log('Invalid pickup or dropoff data');
      return res.status(400).json({ message: 'Invalid pickup or dropoff data' });
    }

   // Validate coordinates
   if (!Array.isArray(pickup.coordinates) || pickup.coordinates.length !== 2 ||
   !Array.isArray(dropoff.coordinates) || dropoff.coordinates.length !== 2) {
 console.log('Invalid coordinates');
 return res.status(400).json({ message: 'Invalid coordinates' });
}
    // Create a new ride request document
    const newRideRequest = new RideRequest({
      pickup: {
        address: req.body.pickup.address,
        coordinates: req.body.pickup.coordinates,
      },
      dropoff: {
        address: req.body.dropoff.address,
        coordinates: req.body.dropoff.coordinates,
      },
      vehicleType: req.body.vehicleType,
      numPassengers: req.body.numPassengers,
      userId: req.user._id,
    });

    await newRideRequest.save();

    

// Find nearest drivers based on vehicle type, location, and availability
const nearbyDrivers = await Driver.find({
  vehicleType: vehicleType, 
  isAvailable: true,  
  'liveLocation.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: req.body.pickup.coordinates,  
      },
      $maxDistance: 10000  // 10km radius
    }
  }
});
console.log('Nearby drivers found:', nearbyDrivers.length);

    if (nearbyDrivers.length > 0) {
      // Notify all relevant drivers via Socket.io
      nearbyDrivers.forEach(driver => {
        io.to(`driver_${driver.userId}`).emit('newRideRequest', {
          rideRequestId: newRideRequest._id,
          pickup: newRideRequest.pickup,
          dropoff: newRideRequest.dropoff,
          vehicleType: newRideRequest.vehicleType,
        });
      });
    console.log('Drivers notified');
    }

    // Respond with success message
    res.status(201).json({ 
      message: nearbyDrivers.length > 0 ? 'Ride request created and drivers notified' : 'Ride request created but no available drivers nearby', 
      rideRequest: newRideRequest 
    });

  } catch (error) {
    console.error('Error creating ride request:', error);
    res.status(500).json({ message: 'Error creating ride request' });
  }
});


// Route to get the total number of rides
router.get('/count', async (req, res) => {
  try {
    const rideCount = await RideRequest.countDocuments();
    res.json({ count: rideCount });
  } catch (error) {
    console.error('Error fetching ride count:', error);
    res.status(500).json({ error: 'Failed to fetch ride count' });
  }
});

module.exports = router;
