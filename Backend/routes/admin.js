const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Driver = require('../models/driver');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Apply authMiddleware to all routes
router.use(authMiddleware);

// GET /api/admin/users - Fetch all users (requires admin role)
router.get('/users', async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }

    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/admin/drivers - Fetch all drivers (requires admin role)
router.get('/drivers', async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }

    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/admin/user/:id - Update user details (requires admin role)
router.patch('/user/:id', async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }

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

// DELETE /api/admin/user/:id - Delete a user (requires admin role)
router.delete('/user/:id', async (req, res) => {
    if (req.role !== 'admin') {
        return res.status(403).json({ msg: 'Admin access required' });
    }

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

module.exports = router;
