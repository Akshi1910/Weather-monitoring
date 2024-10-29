import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Weather from './components/Weather';
import EnergyDashboard from './components/EnergyDashboard';
import WindDashboard from './components/WindDashboard';
import DisasterReporting from './components/DisasterReporting';
import DisasterList from './components/DisasterList';
import ResourceForm from './components/ResourceForm';
import DisasterResources from './components/DisasterResources';
import RealTimeDisaster from './components/DisasterByContinent';
import WeatherDataDisplay from './components/WeatherDataDisplay';
import DisasterKit from './components/DisasterKit';
import WeatherMap from './components/WeatherMap';
import LoginButton from './components/LoginButton';
import LogOut from './components/LogOut';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import axios from 'axios';
import Header from './components/Header';
import WeatherComponent from './components/WeatherComponent';
const App = () => {
  const { isAuthenticated } = useAuth0();
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeather = async (input) => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`);
      setWeatherData(response.data);
      setLocation(input);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  return (
    
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/weather" element={<WeatherDataDisplay />} />
          <Route path="/map" element={<WeatherMap />} />

          {/* Protected Routes */}
          <Route path="/energy" element={<EnergyDashboard location={location} weatherData={weatherData} />} />
          <Route path="/wind" element={<WindDashboard location={location} weatherData={weatherData} />} />
          <Route path="/disaster" element={<ProtectedRoute><DisasterReporting /></ProtectedRoute>} />
          <Route path="/disasterlist" element={<DisasterList />} />
          <Route path="/resource" element={<ProtectedRoute><ResourceForm /></ProtectedRoute>} />
          <Route path="/resourcelist" element={<ProtectedRoute><DisasterResources /></ProtectedRoute>} />
          <Route path="/real" element={<ProtectedRoute><RealTimeDisaster /></ProtectedRoute>} />
          <Route path="/emergency" element={<ProtectedRoute><DisasterKit /></ProtectedRoute>} />
          <Route path="/myweather" element={<WeatherComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
