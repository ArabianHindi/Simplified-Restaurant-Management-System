const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Sequelize, Op } = require('sequelize')
const dotenv = require('dotenv');

const crypto = require('crypto');
const User = require('../models/User');

dotenv.config();
// User Signup
router.post('/auth/signup', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate role
        if (!['admin', 'staff'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ username, password: hashedPassword, role });
        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Username already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// User Login
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // res.cookie("token",token, {
        //     httpOnly:true,
        //     maxAge:60*60*1000
        // });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Password Reset: Request reset link
router.post('/auth/reset-password-request', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 7500000;
        await user.update({ resetToken, resetTokenExpiry });

        // Send email logic here (mocked for now)
        console.log(`Reset password link: http://localhost:3000/auth/reset-password/${resetToken}`);

        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Password Reset: Reset the password
router.post('/auth/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ where: { resetToken: token, resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() } } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpiry: null });
        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;