// src/controllers/driverController.js

const Driver = require('../models/driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Driver Registration
exports.registerDriver = async (req, res) => {
    const { username, email, password, vehicleType, licenseNumber } = req.body;

    try {
        let driver = await Driver.findOne({ email });
        if (driver) {
            return res.status(400).json({ msg: 'Driver already exists' });
        }

        driver = new Driver({
            username,
            email,
            password,
            vehicleType,
            licenseNumber
        });

        await driver.save();

        const payload = {
            driver: {
                id: driver.id
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Driver Login
exports.loginDriver = async (req, res) => {
    const { email, password } = req.body;

    try {
        let driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            driver: {
                id: driver.id
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
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Driver Profile
exports.getDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.driver.id).select('-password');
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update Driver Profile
exports.updateDriver = async (req, res) => {
    const { username, email, password, vehicleType, licenseNumber } = req.body;

    try {
        const driver = await Driver.findById(req.driver.id);

        if (username) driver.username = username;
        if (email) driver.email = email;
        if (password) driver.password = await bcrypt.hash(password, 10);
        if (vehicleType) driver.vehicleType = vehicleType;
        if (licenseNumber) driver.licenseNumber = licenseNumber;

        await driver.save();
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete Driver Profile
exports.deleteDriver = async (req, res) => {
    try {
        await Driver.findByIdAndRemove(req.driver.id);
        res.json({ msg: 'Driver deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
