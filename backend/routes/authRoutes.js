const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'; // use .env in production

// Register user (Admin only)
router.post('/register', async (req, res) => {
  const { userId, userName, userEmail, userPassword } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ userId }, { userEmail }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({
      userId,
      userName,
      userEmail,
      userPassword: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login (by email or userId)
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // identifier = email or userId

  try {
    const user = await User.findOne({
      $or: [{ userEmail: identifier }, { userId: identifier }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, userId: user.userId }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        userName: user.userName,
        userEmail: user.userEmail
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
