const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/driver');
require('dotenv').config();

module.exports = async function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Extract the token value after the Bearer keyword
        const extractedToken = token.split(' ')[1];
        console.log('Extracted token:', extractedToken); // Log token for debugging
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);

        // Extract role and id from the token payload
        const { role, id } = decoded;

        // Role-based logic for 'user', 'driver', and 'admin'
        if (role === 'user') {
            req.user = await User.findById(id).select('-password');
            if (!req.user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        } else if (role === 'driver') {
            req.driver = await Driver.findById(id);
            if (!req.driver) {
                return res.status(404).json({ msg: 'Driver not found' });
            }
        } else if (role === 'admin') {
            req.admin = await User.findById(id).select('-password');
            if (!req.admin || req.admin.role !== 'admin') {
                return res.status(403).json({ msg: 'Admin access denied' });
            }
        } else {
            return res.status(401).json({ msg: 'Invalid role' });
        }

        req.role = role;
        next();
    } catch (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};
