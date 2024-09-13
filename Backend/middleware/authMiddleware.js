const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Driver = require('../models/driver'); // Ensure the correct model name
require('dotenv').config();

module.exports = async function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Extract the token value after the Bearer keyword
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);

        // Check for role, assuming role is defined in the token payload
        const { role, id } = decoded;

        if (role === 'user') {
            req.user = await User.findById(id).select('-password'); // Exclude password from user object
            if (!req.user) {
                return res.status(404).json({ msg: 'User not found' });
            }
        } else if (role === 'driver') {
            req.driver = await Driver.findById(id);
            if (!req.driver) {
                return res.status(404).json({ msg: 'Driver not found' });
            }
        } else if (role === 'admin') {
            req.admin = await User.findById(id); // Assuming admin is also a User
            if (!req.admin || req.admin.role !== 'admin') {
                return res.status(404).json({ msg: 'Admin not found or not authorized' });
            }
        } else {
            return res.status(401).json({ msg: 'Invalid role' });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
