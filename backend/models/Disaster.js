// models/Disaster.js
const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema({
  location: { type: String, required: true },
  type: { type: String, required: true, enum: ['Flood', 'Cyclone', 'Earthquake', 'Other'] },
  status: { type: String, required: true, enum: ['Ongoing', 'Alert'] },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Disaster', disasterSchema);
