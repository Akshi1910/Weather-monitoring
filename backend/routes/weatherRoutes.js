const express = require('express');
const axios = require('axios');
const router = express.Router();

// Define the route for fetching weather data
router.get('/', async (req, res) => {
  const { location } = req.query; // Get the location from query parameters
  const apiKey = 'f614beb3883d3c749d24656bc16816be'; // Your OpenWeatherMap API key

  if (!location) {
    return res.status(400).json({ message: 'Location is required' });
  }

  try {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        appid: apiKey,
        units: 'metric', // Optional: use 'metric' for Celsius
      },
    });
    res.json(response.data); // Send the fetched weather data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;
