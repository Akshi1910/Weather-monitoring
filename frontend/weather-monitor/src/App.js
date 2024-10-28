import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Weather from './components/Weather';
import EnergyDashboard from './components/EnergyDashboard'; // Your energy dashboard
import WindDashboard from './components/WindDashboard';
import axios from 'axios';
import DisasterReporting from './components/DisasterReporting';
import DisasterList from './components/DisasterList';
import ResourceForm from './components/ResourceForm';
import DisasterResources from './components/DisasterResources';
import RealTimeDisaster from './components/DisasterByContinent';
import WeatherDataDisplay from './components/WeatherDataDisplay';
import DisasterKit from './components/DisasterKit';
import WeatherMap from './components/WeatherMap';

const App = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null); // Store fetched weather data
  const [error, setError] = useState(null); // Handle any errors

  // Function to fetch weather data for the location entered
  const fetchWeather = async (input) => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`); // API call to backend
      setWeatherData(response.data); // Store weather data
      setLocation(input); // Store the location name
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    }
  };
  return (
    <>
    <Router>
       <div>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/energy" element={<EnergyDashboard location={location} weatherData={weatherData} />} />
          <Route path="/wind" element={<WindDashboard location={location} weatherData={weatherData} />} />
          <Route path="/disaster" element={<DisasterReporting />} />
          <Route path="/disasterlist" element={<DisasterList />} />
          <Route path="/resource" element={<ResourceForm/>} />
          <Route path="/resourcelist" element={<DisasterResources/>} />
          <Route path="/real" element={<RealTimeDisaster/>} />
          <Route path="/weather" element={<WeatherDataDisplay/>} />
          <Route path="/emergency" element={<DisasterKit/>} />
          <Route path="/map" element={<WeatherMap/>} />
        </Routes>
      </div>
      
    </Router>
    
    </>
  );
};

export default App;
