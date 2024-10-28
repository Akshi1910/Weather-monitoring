const express = require('express');
const Disaster = require('../models/Disaster'); // Assume this is your model

// Endpoint to fetch unique disaster types from the database
const getDisasterTypes = async (req, res) => {
  try {
    const disasters = await Disaster.find().select('type -_id'); // Get only the 'type' field
    const types = [...new Set(disasters.map(d => d.type))]; // Extract unique types
    res.status(200).json(types);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disaster types' });
  }
};

module.exports = { getDisasterTypes };