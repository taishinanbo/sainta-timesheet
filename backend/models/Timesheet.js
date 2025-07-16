// backend/models/Timesheet.js
const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Timesheet', timesheetSchema);