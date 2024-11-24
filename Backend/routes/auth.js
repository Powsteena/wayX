const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const Driver = require('../models/driver'); 
const ScheduledRide = require('../models/ScheduledRide')
const Contact = require('../models/contact')

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
        // Check for the authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No authorization header found' });
        }

        // Verify token
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authorization token is required' });
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decodedToken);  // Inspect the decoded token
        } catch (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // Use appropriate field from the decoded token
        const userId = decodedToken.user?.id || decodedToken.id;  // Adjust this based on your JWT payload

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID not found in token' });
        }

        // Fetch rides with populated driver details
        const rides = await ScheduledRide.find({ userId, status: 'accepted' })
            .populate('userId', 'name email')  // Populate user info
            .populate('driverId', 'username vehicleType vehicleNumber phoneNumber')  // Populate driver details
            .select('-__v')  // Exclude unwanted fields
            .lean();  // Use lean for plain JS objects

        if (!rides || rides.length === 0) {
            return res.status(404).json({ success: false, message: 'No accepted rides found' });
        }

        // Process rides data
        const processedRides = rides.map(ride => ({
            ...ride,
            pickup: ride.pickup || { address: 'Not provided' },
            dropoff: ride.dropoff || { address: 'Not provided' },
            driverId: ride.driverId || {
                name: 'Not assigned',
                vehicleType: 'Not provided',
                vehicleNumber: 'Not provided',
                phoneNumber: 'Not provided',
            },
            scheduledDateTime: ride.scheduledDateTime || new Date(),
        }));

        return res.status(200).json(processedRides);
    } catch (err) {
        console.error('Server error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
});

router.post('/contact', async (req, res) => {
    try {
        console.log('Received data:', req.body);

        const { fullName, email, subject, message } = req.body;

        // Validate input
        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create and save contact
        const contact = new Contact({
            fullName,
            email,
            subject,
            message
        });

        await contact.save(); // Save the document to the database

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: contact
        });

    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating contact',
            error: error.message
        });
    }
});



module.exports = router;