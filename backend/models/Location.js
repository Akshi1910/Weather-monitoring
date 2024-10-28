const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // Add other fields as necessary
});

const Location = mongoose.model('Location', LocationSchema);
module.exports = Location;
