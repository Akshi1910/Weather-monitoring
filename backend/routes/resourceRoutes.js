// routes/disasterRoutes.js
const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// Route to submit a disaster report
router.post('/report', async (req, res) => {
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
    });
 // Handle resource requests/offers

 import express from 'express';
import Resource from '../models/Resource.js'; // Adjust the import path as needed


// Route to get resources for a specific disaster
router.get('/disasters/:disasterId/resources', async (req, res) => {
    try {
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

export default router;


module.exports = router;
