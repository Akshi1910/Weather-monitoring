// routes/disasterRoutes.js
const express = require('express');
const router = express.Router();
const Disaster = require('../models/Disaster');
const Resource=require('../models/Resource');
const { getDisasterTypes } = require('../controllers/disastersController');
// Route to submit a disaster report
router.post('/report', async (req, res) => {
  const { location, type, status, description } = req.body;

  try {
    const newDisaster = new Disaster({ location, type, status, description });
    await newDisaster.save();
    res.status(201).json({ message: 'Disaster reported successfully!' });
  } catch (error) {
    console.error('Error saving disaster report:', error.message);
    res.status(500).json({ error: 'Failed to save disaster report.' });
  }
});
router.get(':disasterId/resources', async (req, res) => {
    try {
        // Use req.params.disasterId to access the route parameter
        const resources = await Resource.find({ disasterId: req.params.disasterId });

        // If no resources found, respond with a message
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found for this disaster.' });
        }

        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Failed to load resources.' });
    }
});

router.get('/resources', async (req, res) => {
    try {
        const resources = await Resource.find().populate('location'); // Populate the location field

        // If no resources found, respond with a message
        if (resources.length === 0) {
            return res.status(404).json({ message: 'No resources found.' });
        }

        res.json(resources);
    } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Failed to load resources.' });
    }
});

router.get('/types', getDisasterTypes); // Route to get disaster types



// Route to fetch all disaster reports
router.get('/', async (req, res) => {
  try {
    const disasters = await Disaster.find();
    res.json(disasters);
  } catch (error) {
    console.error('Error fetching disaster reports:', error.message);
    res.status(500).json({ error: 'Failed to fetch disaster reports.' });
  }
});

module.exports = router;
