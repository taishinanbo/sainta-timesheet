// models/User.js
const mongoose = require('mongoose');

const breakSchema = new mongoose.Schema({
  start: Date,
  end: Date,
}, { _id: false });

const workLogSchema = new mongoose.Schema({
  clockIn: Date,
  breaks: [breakSchema],
  clockOut: Date,
}, { _id: false });

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userWorkLogs: { type: Map, of: workLogSchema, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
