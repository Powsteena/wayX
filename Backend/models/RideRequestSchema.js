
const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema({
  pickup: {
    address: {type:String,
    required: [true, 'Pickup address is required']},// Validation
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'  // Allows for geospatial queries
    }
  },
  dropoff: {
    address: {type:String,
      required: [true, 'Dropoff address is required']}, // Validation
    coordinates: {
      type: [Number],  // [longitude, latitude]
      index: '2dsphere'
    }
  },
  vehicleType: String,
  numPassengers: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the user who made the request
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },  // Reference to the driver who accepts the request
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],  // Possible statuses for the ride request
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Pre-save hook to update 'updatedAt' field
rideRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('RideRequest', rideRequestSchema);
