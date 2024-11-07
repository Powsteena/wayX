const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware'); 
const ScheduledRide = require('../models/ScheduledRide')

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role: role || 'user'  // Default role is 'user'
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role  // Include role in payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error('Registration Error:', error); // Log the error
        res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
});

// POST /api/auth/login - Log in a user
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role  // Include role in payload
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, role: user.role });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET /api/auth/user - Get user details (requires authentication)
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH /api/auth/user - Update user details (requires authentication)
router.patch('/user', authMiddleware, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE /api/auth/user - Delete a user (requires authentication)
router.delete('/user', authMiddleware, async (req, res) => {
    try {
        await User.findByIdAndRemove(req.user.id);
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/count', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.json({ count: userCount });
    } catch (error) {
        console.error('Error fetching user count:', error);
        res.status(500).json({ error: 'Failed to fetch user count' });
    }
});


// Get rides created by the currently authenticated user

router.get('/my-rides', async (req, res) => {
    try {
        // Get the token from the request headers
        const token = req.header('Authorization').replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        // Decode the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the userId from the decoded token
        const userId = decodedToken.user.id;

        // Fetch rides filtered by the authenticated user's userId
        const rides = await ScheduledRide.find({ userId })
            .populate('userId', 'name email')  // Populate user details
            .populate('driverId', 'name vehicle')  // Populate driver details
            .select('-__v');  // Optionally exclude the __v field

        // Check if rides are found
        if (rides.length === 0) {
            return res.status(404).json({ msg: 'No rides found for this user' });
        }

        // Ensure pickup and dropoff are always present, even if empty
        const ridesWithDefaultValues = rides.map((ride) => ({
            ...ride._doc,
            pickup: ride.pickup || { address: 'Not provided' },
            dropoff: ride.dropoff || { address: 'Not provided' }
        }));

        // Return the rides to the client
        res.json(ridesWithDefaultValues);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.get('/my-acceptedrides', async (req, res) => {
    try {
        // Check if Authorization header exists
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authorization header found' 
            });
        }

        // Get and verify token
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authorization token is required' 
            });
        }

        // Verify token and get user data
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }

        const userId = decodedToken.user.id;

        // Fetch rides with proper error handling
        const rides = await ScheduledRide.find({ 
            userId,
            status: 'accepted'
        })
        .populate('userId', 'name email')
        .populate('driverId', 'name vehicle')
        .select('-__v')
        .lean(); // Use lean() for better performance

        // Process and return the rides
        const processedRides = rides.map(ride => ({
            ...ride,
            pickup: ride.pickup || { address: 'Not provided' },
            dropoff: ride.dropoff || { address: 'Not provided' },
            driverId: ride.driverId || { name: 'Not assigned', vehicle: 'Not assigned' }
        }));

        return res.status(200).json(processedRides);

    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});


module.exports = router;