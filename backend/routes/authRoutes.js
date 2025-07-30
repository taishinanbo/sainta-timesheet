const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// ユーザー登録
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
    res.status(201).json({
      message: 'User registered',
      user: {
        _id: newUser._id,
        userId,
        userName,
        userEmail,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// パスワード認証（MongoDBの_idベース）
router.post('/verify-password', async (req, res) => {
  const { userMongoId, password } = req.body;

  try {
    const user = await User.findById(userMongoId);
    if (!user) return res.status(404).json({ message: 'ユーザーが見つかりません' });

    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) return res.status(401).json({ message: 'パスワードが違います' });

    res.json({ message: '認証成功' });
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラー' });
  }
});

// ユーザー一覧取得（_id含む）
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { userId: 1, userName: 1 }).lean(); // ← _id は含まれる
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'ユーザー取得エラー', error: err.message });
  }
});

// ログイン（email or userId）
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ userEmail: identifier }, { userId: identifier }]
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.userPassword);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        userName: user.userName,
        userEmail: user.userEmail,
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;