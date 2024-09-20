const Driver = require('../models/driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Driver Registration
exports.registerDriver = async (req, res) => {
    const { username, email, password, vehicleType, licenseNumber } = req.body;
    const { licenseImage, vehicleRegistration, insuranceDocument } = req.files; // Assuming you're using multer for file uploads

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
            licenseNumber,
            licenseImage: licenseImage[0]?.path, // Using optional chaining
            vehicleRegistration: vehicleRegistration[0]?.path,
            insuranceDocument: insuranceDocument[0]?.path
        });

        // Hash password before saving
        driver.password = await bcrypt.hash(password, 10);
        await driver.save();

        const payload = {
            driver: {
                id: driver.id,
                isApproved: driver.isApproved // Include approval status in payload
            }
        };

    
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error during registration' });
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

        if (!driver.isApproved) {
            return res.status(403).json({ msg: 'Your account is pending approval by the admin' });
        }

        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            driver: {
                id: driver.id,
                isApproved: driver.isApproved
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Token generation error' });
                }
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

// Get Driver Profile
exports.getDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.driver.id).select('-password');
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error fetching driver profile' });
    }
};

// Update Driver Profile
exports.updateDriver = async (req, res) => {
    const { username, email, password, vehicleType, licenseNumber } = req.body;
    const { licenseImage, vehicleRegistration, insuranceDocument } = req.files;

    try {
        const driver = await Driver.findById(req.driver.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }

        if (username) driver.username = username;
        if (email) driver.email = email;
        if (password) driver.password = await bcrypt.hash(password, 10);
        if (vehicleType) driver.vehicleType = vehicleType;
        if (licenseNumber) driver.licenseNumber = licenseNumber;
        if (licenseImage) driver.licenseImage = licenseImage[0]?.path;
        if (vehicleRegistration) driver.vehicleRegistration = vehicleRegistration[0]?.path;
        if (insuranceDocument) driver.insuranceDocument = insuranceDocument[0]?.path;

        await driver.save();
        res.json(driver);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error updating driver profile' });
    }
};

// Delete Driver Profile
exports.deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndRemove(req.driver.id);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }
        res.json({ msg: 'Driver deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error deleting driver profile' });
    }
};

// Admin approval of driver
exports.approveDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.driverId);
        if (!driver) {
            return res.status(404).json({ msg: 'Driver not found' });
        }

        driver.isApproved = true;
        await driver.save();
        res.json({ msg: 'Driver approved' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error approving driver' });
    }
};
