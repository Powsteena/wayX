const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Driver = require('../models/driver')
const ScheduledRide = require('../models/ScheduledRide');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const Contact = require('../models/contact');

// Apply authMiddleware to all routes
router.use(authMiddleware);

// Middleware to check for admin role
const adminCheck = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }
    next();
};

// GET /api/admin/users - Fetch all users (requires admin role)
router.get('/users', adminCheck, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id - Update user details (requires admin role)
router.patch('/user/:id', adminCheck, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id/activate - Activate a user (requires admin role)
router.patch('/user/:id/activate', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isActive = true;
        await user.save();
        res.json({ msg: 'User activated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id/deactivate - Deactivate a user (requires admin role)
router.patch('/user/:id/deactivate', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.isActive = false;
        await user.save();
        res.json({ msg: 'User deactivated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id/promote - Promote a user to admin (requires admin role)
router.patch('/user/:id/promote', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.role = 'admin';
        await user.save();
        res.json({ msg: 'User promoted to admin', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id/demote - Demote an admin to user (requires admin role)
router.patch('/user/:id/demote', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.role = 'user';
        await user.save();
        res.json({ msg: 'Admin demoted to user', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/admin/user/:id - Delete a user (requires admin role)
router.delete('/user/:id', adminCheck, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// get all drivers
router.get('/driver', adminCheck, async (req, res) => {
    try {
        const drivers = await Driver.find().select('-password');
        res.json(drivers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/admin/driver/:id - Fetch a specific driver's details (requires admin role)
router.get('/driver/:id', adminCheck, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).select('-password');
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/driver/:id/approve - Approve a driver (requires admin role)
router.patch('/driver/:id/approve', adminCheck, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        driver.isApproved = true;
        await driver.save();
        res.json({ msg: 'Driver approved', driver });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/driver/:id/reject - Reject a driver (requires admin role)
router.patch('/driver/:id/reject', adminCheck, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        driver.isApproved = false;
        await driver.save();
        res.json({ msg: 'Driver rejected', driver });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/driver/:id - Update driver details (requires admin role)
router.patch('/driver/:id', adminCheck, async (req, res) => {
    const { username, email, vehicleType, phoneNumber } = req.body;

    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }

        if (username) driver.username = username;
        if (email) driver.email = email;
        if (vehicleType) driver.vehicleType = vehicleType;
        if (phoneNumber) driver.phoneNumber = phoneNumber;

        await driver.save();
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/admin/driver/:id - Delete a driver (requires admin role)
router.delete('/driver/:id', adminCheck, async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        await driver.remove();
        res.json({ msg: 'Driver deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all rides
router.get('/rides', adminCheck, async (req, res) => {
    try {
        const rides = await ScheduledRide.find()
            .populate({
                path: 'userId',
                select: 'username name email' // Include all fields you might need
            })
            .populate({
                path: 'driverId',
                select: 'username vehicle name'
            })
            .select('-__v');

        // Add debugging log
        console.log('Populated rides:', JSON.stringify(rides, null, 2));

        const ridesWithDefaultValues = rides.map((ride) => ({
            ...ride._doc,
            pickup: ride.pickup || { address: 'Not provided' },
            dropoff: ride.dropoff || { address: 'Not provided' }
        }));

        res.json(ridesWithDefaultValues);
    } catch (err) {
        console.error('Error in /rides endpoint:', err);
        res.status(500).send('Server error');
    }
});


// fetch all contact msges 
router.get('/get/contact', adminCheck, async (req, res) => {
    try {
        // Fetch all contacts sorted by creation date in descending order
        const contacts = await Contact.find();

        res.json({
            success: true,
            count: contacts.length,
            data: contacts,
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contacts',
            error: error.message,
        });
    }
});


module.exports = router;
