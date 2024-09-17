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
            licenseImage: licenseImage[0].path, // Saving file path or URL
            vehicleRegistration: vehicleRegistration[0].path,
            insuranceDocument: insuranceDocument[0].path
        });

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

        // Check if the driver is approved by the admin
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
    const { licenseImage, vehicleRegistration, insuranceDocument } = req.files;

    try {
        const driver = await Driver.findById(req.driver.id);

        if (username) driver.username = username;
        if (email) driver.email = email;
        if (password) driver.password = await bcrypt.hash(password, 10);
        if (vehicleType) driver.vehicleType = vehicleType;
        if (licenseNumber) driver.licenseNumber = licenseNumber;
        if (licenseImage) driver.licenseImage = licenseImage[0].path;
        if (vehicleRegistration) driver.vehicleRegistration = vehicleRegistration[0].path;
        if (insuranceDocument) driver.insuranceDocument = insuranceDocument[0].path;

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
        res.status(500).send('Server error');
    }
};
