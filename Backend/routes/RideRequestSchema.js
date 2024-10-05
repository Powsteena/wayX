// const express = require('express');
// const router = express.Router();
// const RideRequest = require('../models/RideRequestSchema');  // Adjust the path as needed
// const authMiddleware = require('../middleware/authMiddleware'); 

// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const { pickup, dropoff, vehicleType, numPassengers } = req.body;

//     // Check for authenticated user
//     if (!req.user || !req.user._id) {
//         return res.status(401).json({ message: 'User not authenticated' });
//     }

//     const newRideRequest = new RideRequest({
//       pickup: {
//         address: pickup,
//         coordinates: req.body.pickupCoords,
//       },
//       dropoff: {
//         address: dropoff,
//         coordinates: req.body.dropoffCoords,
//       },
//       vehicleType,
//       numPassengers,
//       userId: req.user._id,  // Assuming you have user authentication in place
//     });

//     await newRideRequest.save();
//     res.status(201).json({ message: 'Ride request created successfully', rideRequest: newRideRequest });
//   } catch (error) {
//     console.error('Error creating ride request:', error);
//     res.status(500).json({ message: 'Error creating ride request' });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const RideRequest = require('../models/RideRequestSchema');  // Adjust the path as needed
const Driver = require('../models/driver');  // Import the Driver model for finding nearest drivers
const authMiddleware = require('../middleware/authMiddleware'); 
const { io } = require('../server');  // Import Socket.io instance

// Create Ride Request and notify drivers in real-time
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { pickup, dropoff, vehicleType } = req.body;

    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
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

    // Validate pickup coordinates
if (!pickup.coordinates || pickup.coordinates.length !== 2) {
  return res.status(400).json({ message: 'Invalid pickup coordinates' });
}

// Find nearest drivers based on vehicle type, location, and availability
const nearbyDrivers = await Driver.find({
  vehicleType: vehicleType, // Match vehicle type
  isAvailable: true,  // Only available drivers
  'liveLocation.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: pickup.coordinates,  // Pickup location for proximity
      },
      $maxDistance: 10000  // 10km radius
    }
  }
});


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

      // Respond with success message
      res.status(201).json({ message: 'Ride request created and drivers notified', rideRequest: newRideRequest });
    } else {
      // If no nearby drivers found, respond accordingly
      res.status(201).json({ message: 'Ride request created but no available drivers nearby', rideRequest: newRideRequest });
    }

  } catch (error) {
    console.error('Error creating ride request:', error);
    res.status(500).json({ message: 'Error creating ride request' });
  }
});

module.exports = router;
