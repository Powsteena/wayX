// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const DriverSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     vehicleType: {
//         type: String,
//         required: true
//     },
//     licenseNumber: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         enum: ['driver'], // Include other roles if needed
//         default: 'driver'
//     },
//     documents: [{
//         name: {
//             type: String,
//             required: true
//         },
//         type: {
//             type: String,
//             required: true
//         },
//         url: {
//             type: String, // Store the file path or URL for each document
//             required: true
//         },
//         uploadedAt: {
//             type: Date,
//             default: Date.now
//         }
//     }],
//     isApproved: {
//         type: Boolean, // Determines if the driver is approved by admin
//         default: false
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Hash the password before saving
// DriverSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

// module.exports = mongoose.model('Driver', DriverSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const DocumentSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true
//     },
//     type: {
//         type: String,
//         required: true
//     },
//     url: {
//         type: String, // Store the file path or URL for each document
//         required: true
//     },
//     uploadedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// const LiveLocationSchema = new mongoose.Schema({
//     latitude: {
//         type: Number,
//         required: function() { return this.isAvailable; } // Required only when driver is available
//     },
//     longitude: {
//         type: Number,
//         required: function() { return this.isAvailable; } // Required only when driver is available
//     }
// }, { _id: false }); // Prevents mongoose from adding an _id to the subdocument

// const DriverSchema = new mongoose.Schema({
//     username: {
//         type: String,
//         unique: true,
//         required: [true, 'Username is required']
//     },
//     email: {
//         type: String,
//         unique: true,
//         required: [true, 'Email is required'],
//         match: [/.+\@.+\..+/, 'Please provide a valid email address'] // Email validation regex
//     },
//     password: {
//         type: String,
//         required: [true, 'Password is required']
//     },
//     vehicleType: {
//         type: String,
//         required: [true, 'Vehicle type is required']
//     },
//     licenseNumber: {
//         type: String,
//         required: [true, 'License number is required']
//     },
//     role: {
//         type: String,
//         enum: ['driver'], // Can be expanded for other roles if needed
//         default: 'driver'
//     },
//     documents: [DocumentSchema], // Embed documents as a subdocument schema
//     isApproved: {
//         type: Boolean, // Admin approval status
//         default: false
//     },
//     isAvailable: {
//         type: Boolean, // Driver availability status
//         default: false
//     },
//     liveLocation: {
//         type: LiveLocationSchema,
//         default: null // Default to null when not available
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Hash password before saving
// DriverSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) {
//         return next();
//     }
//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err); // Pass the error to the next middleware
//     }
// });

// module.exports = mongoose.model('Driver', DriverSchema);



// models/Driver.js

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
        type: {
            latitude: Number,
            longitude: Number
        },
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

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