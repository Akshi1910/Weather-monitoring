const Resource = require('../models/Resource');

// Controller to create a new resource request/offer
const requestOrOfferResources = async (req, res) => {
  try {
    const { name, type, quantity, location, contactInfo, disasterType } = req.body;

    // Validate input
    if (!name || !type || !quantity || !location || !contactInfo || !disasterType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Create a new resource document
    const resource = new Resource({
      name,
      type,
      quantity,
      location,
      contactInfo,
      disasterType,
    });

    await resource.save(); // Save to database
    res.status(201).json({ message: 'Resource added successfully!', resource });
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { requestOrOfferResources };
