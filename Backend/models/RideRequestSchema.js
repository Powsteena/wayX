
// const mongoose = require('mongoose');

// const rideRequestSchema = new mongoose.Schema({
//   pickup: {
//     address: {type:String,
//     required: [true, 'Pickup address is required']},
//     coordinates: {
//       type: [Number],  // [longitude, latitude]
//       index: '2dsphere'  // Allows for geospatial queries
//     }
//   },
//   dropoff: {
//     address: {type:String,
//       required: [true, 'Dropoff address is required']}, // Validation
//     coordinates: {
//       type: [Number],  // [longitude, latitude]
//       index: '2dsphere'
//     }
//   },
//   vehicleType: {
//     type: String,
//     set: (v) => v.toLowerCase()
//   },
//   numPassengers: Number,
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reference to the user who made the request
//   driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },  // Reference to the driver who accepts the request
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'rejected', 'completed'],  // Possible statuses for the ride request
//     default: 'pending'
//   },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });

// // Pre-save hook to update 'updatedAt' field
// rideRequestSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

// module.exports = mongoose.model('RideRequest', rideRequestSchema);




const mongoose = require('mongoose');

const RideRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    pickup: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },
    dropoff: {
        address: {
            type: String,
            required: true
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'van', 'motorbike', 'auto'],
        lowercase: true
    },
    numPassengers: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    fare: {
        type: Number,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    acceptedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    }
});

// Create geospatial indexes
RideRequestSchema.index({ 'pickup.coordinates': '2dsphere' });
RideRequestSchema.index({ 'dropoff.coordinates': '2dsphere' });

module.exports = mongoose.model('RideRequest', RideRequestSchema);