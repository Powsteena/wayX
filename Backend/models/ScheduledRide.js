const mongoose = require('mongoose');

const ScheduledRideSchema = new mongoose.Schema({
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
        }
    },
    dropoff: {
        address: {
            type: String,
            required: true
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
    scheduledDateTime: {
        type: Date,
        required: true
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

module.exports = mongoose.model('ScheduledRide', ScheduledRideSchema);
