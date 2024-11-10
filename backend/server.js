const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); 
const weatherRoutes = require('./routes/weatherRoutes'); 
const User = require('./models/User'); // Import the User model
const disasterRoutes = require('./routes/disasterRoutes'); // Import the disaster routes
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const axios = require('axios');
const Resource=require('./models/Resource');
//const resourceRoutes =require('./routes/resourceRoutes')
dotenv.config();
const app = express();
app.use(express.json());

const corsOptions = {
    //origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use user routes
app.use('/api/users', userRoutes); // Ensure userRoutes is set up correctly
// Use weather routes
app.use('/api/disasters', disasterRoutes);


app.get('/api/disaster-alerts', async (req, res) => {
  try {
    const response = await axios.get('https://www.gdacs.org/xml/rss_24h.xml');
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching disaster alerts:", error);
    res.status(500).send("Failed to fetch disaster alerts");
  }
});


app.post('/api/resources/report', async (req, res) => {
  const { name, type, quantity, location, contactInfo, description, disasterId } = req.body;

  try {
      const newResource = new Resource({
          name,
          type,
          quantity,
          location,
          contactInfo,
          description,
          disasterId,
      });
      await newResource.save();
      res.status(201).json({ message: 'Resource reported successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Error reporting resource', error });
  }
});

const disasterSchema = new mongoose.Schema({
  event_name: String,
  event_type: String,
  date: String,
  continent: String,
  country_code: String,
  lat: Number,
  lng: Number,
  created_time: String,
});

const Realtime = mongoose.model("Realtime", disasterSchema);

// Route to Fetch Data from API and Save to DB
app.get("/api/realtime/fetch-and-save", async (req, res) => {
  const { continent, from, to } = req.query;

  const options = {
    method: "GET",
    url: `https://api.ambeedata.com/disasters/history/by-continent`,
    params: { continent, from, to },
    headers: {
      "x-api-key": process.env.AMBEE_API_KEY,
      "Content-type": "application/json",
    },
  };

  try {
    const response = await axios.request(options);
    const events = response.data.result || [];

    // Save events to MongoDB
    await Realtime.insertMany(events);
    res.status(201).json({ message: "Events saved to database", events });
  } catch (error) {
    console.error("Error fetching and saving events:", error);
    res.status(500).json({ message: "Error fetching and saving events", error: error.message });
  }
});

// Route to Retrieve Events from DB
app.get("/api/realtime", async (req, res) => {
  try {
    const events = await Realtime.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving events", error: error.message });
  }
});
app.get("/api/disasters/by-continent", async (req, res) => {
  const { continent } = req.query;

  try {
    const events = await Realtime.find({ continent }); // Assuming 'Realtime' is your model
    if (events.length > 0) {
      res.json(events);
    } else {
      res.status(404).json({ message: "No events found for this continent." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data", error: error.message });
  }
});


// Weather endpoint
app.get('/weather/:location', async (req, res) => {
  const location = req.params.location;

  if (!location) {
    return res.status(400).json({ error: 'Location parameter is missing.' });
  }

  const apiKey = process.env.API_KEY;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch weather data.' });
  }
});



const energySchema = new mongoose.Schema({
  location: String,
  panelType: String,
  panelCount: Number,
  energyProduction: Array,  // Store energy production data
  monthlyEnergy: Number,
  userName: String,  // Store the user's name
});

const Energy = mongoose.model('Energy', energySchema);

const windEnergySchema = new mongoose.Schema({
  location: String,            // Location of wind turbines
  turbineCount: Number,        // Number of turbines used
  energyProduction: Array,     // Array to store energy production data
  monthlyEnergy: Number,       // Total energy produced monthly
  userName: String,            // Name of the user submitting the report
});

const WindReport = mongoose.model('WindReport', windEnergySchema);


// Route to save energy details
app.post('/save-energy-details', async (req, res) => {
  const { location, panelType, panelCount, energyProduction, monthlyEnergy, userName } = req.body;

  try {
    const energyDetails = new Energy({
      location,
      panelType,
      panelCount,
      energyProduction,
      monthlyEnergy,
      userName,  // Save the user's name
    });

    await energyDetails.save();
    res.status(200).send('Energy details saved successfully!');
  } catch (error) {
    console.error('Error saving energy details:', error);
    res.status(500).send('Failed to save energy details');
  }
});

// Route to get saved energy details for the logged-in user
app.get('/get-reports', async (req, res) => {
  try {
    const userName = req.query.userName;  // Get the logged-in user's name from query params
    if (!userName) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Fetch reports from the database for the given user
    const reports = await Energy.find({ userName });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});


app.post('/save-wind-details', async (req, res) => {
  try {
    const { userName, location, turbineCount, energyProduction, monthlyEnergy } = req.body;

    const newReport = new WindReport({
      userName,
      location,
      turbineCount,
      energyProduction,
      monthlyEnergy,
    });

    await newReport.save();
    res.status(201).json({ message: 'Wind energy report saved successfully' });
  } catch (error) {
    console.error('Error saving wind energy report:', error);
    res.status(500).json({ message: 'Failed to save wind energy report' });
  }
});

// Route to fetch saved wind energy reports for a specific user
// Backend (Express.js)
// Backend (Express.js)
app.get('/get-wind-reports', async (req, res) => {
  try {
    const { userName } = req.query;
    // Make sure you're using the WindReport model (not Energy model or SolarReport model)
    const reports = await WindReport.find({ userName }); // Adjust based on your model
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wind reports' });
  }
});


// Energy endpoint
app.get('/energy/:location', async (req, res) => {
  const location = req.params.location;

  // Static data for testing
  const staticEnergyData = {
    forecasts: [
      { dt: '2024-10-23 18:00:00', solarEnergy: 500, windEnergy: 300 },
      { dt: '2024-10-23 21:00:00', solarEnergy: 450, windEnergy: 350 },
      { dt: '2024-10-24 00:00:00', solarEnergy: 400, windEnergy: 400 },
      { dt: '2024-10-24 03:00:00', solarEnergy: 350, windEnergy: 250 },
      { dt: '2024-10-24 06:00:00', solarEnergy: 300, windEnergy: 200 },
    ],
  };

  res.json(staticEnergyData);
});









const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));