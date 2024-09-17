const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        required: true
    },
    licenseNumber: {
        type: String,
        required: true
    },
    documents: [{
        type: String, // Array to store file paths or URLs for multiple documents
        required: true
    }],
    isApproved: {
        type: Boolean, // Determines if the driver is approved by admin
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
DriverSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Driver', DriverSchema);
