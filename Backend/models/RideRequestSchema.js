const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  pickup: {
    address: String,
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'  // Allows for geospatial queries
    }
  },
  dropoff: {
    address: String,
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    }
  },
  vehicleType: String,
  numPassengers: Number,
  userId: mongoose.Schema.Types.ObjectId,  // Reference to the user who made the request
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
