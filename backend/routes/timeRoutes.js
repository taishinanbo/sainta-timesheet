const express = require('express');
const router = express.Router();
const User = require('../models/User');

function getTodayKey() {
  return new Date().toISOString().split('T')[0]; // e.g. 2025-07-16
}

// 🟢 Clock In
router.post('/:userId/clock-in', async (req, res) => {
  const { userId } = req.params;
  const today = getTodayKey();
  const now = new Date();

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const log = user.userWorkLogs.get(today) || {};

    if (log.clockIn) return res.status(400).json({ message: 'Already clocked in today' });

    log.clockIn = now;
    log.breaks = [];
    user.userWorkLogs.set(today, log);
    await user.save();

    res.json({ message: 'Clocked in', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 Break Start
router.post('/:userId/break-start', async (req, res) => {
  const { userId } = req.params;
  const today = getTodayKey();
  const now = new Date();

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const log = user.userWorkLogs.get(today);
    if (!log || !log.clockIn) return res.status(400).json({ message: 'Not clocked in yet' });

    if (log.clockOut) return res.status(400).json({ message: 'Already clocked out' });

    const breaks = log.breaks || [];
    if (breaks.length > 0 && !breaks[breaks.length - 1].end) {
      return res.status(400).json({ message: 'Already on break' });
    }

    breaks.push({ start: now });
    log.breaks = breaks;
    user.userWorkLogs.set(today, log);
    await user.save();

    res.json({ message: 'Break started', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔵 Break End
router.post('/:userId/break-end', async (req, res) => {
  const { userId } = req.params;
  const today = getTodayKey();
  const now = new Date();

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const log = user.userWorkLogs.get(today);
    if (!log || !log.clockIn) return res.status(400).json({ message: 'Not clocked in yet' });

    const breaks = log.breaks || [];
    if (breaks.length === 0 || breaks[breaks.length - 1].end) {
      return res.status(400).json({ message: 'Not currently on a break' });
    }

    breaks[breaks.length - 1].end = now;
    user.userWorkLogs.set(today, log);
    await user.save();

    res.json({ message: 'Break ended', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔴 Clock Out
router.post('/:userId/clock-out', async (req, res) => {
  const { userId } = req.params;
  const today = getTodayKey();
  const now = new Date();

  try {
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const log = user.userWorkLogs.get(today);
    if (!log || !log.clockIn) return res.status(400).json({ message: 'Not clocked in yet' });

    if (log.clockOut) return res.status(400).json({ message: 'Already clocked out' });

    log.clockOut = now;
    user.userWorkLogs.set(today, log);
    await user.save();

    res.json({ message: 'Clocked out', log });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
