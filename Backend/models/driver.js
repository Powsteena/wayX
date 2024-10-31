

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    licenseNumber: {
        type: String,
        required: [true, 'License number is required']
    },
    vehicleType: {
        type: String,
        required: [true, 'Vehicle type is required']
    },
    licenseImage: {
        type: String,
        required: [true, 'License image is required']
    },
    vehicleRegistration: {
        type: String,
        required: [true, 'Vehicle registration is required']
    },
    insuranceDocument: {
        type: String,
        required: [true, 'Insurance document is required']
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'driver'
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    liveLocation: {
        address: {
            type: String,
            default: null
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            index: '2dsphere',  // Allows for geospatial queries
            default: [null, null]  // Default to [null, null]
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Password hashing middleware
DriverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Driver', DriverSchema);