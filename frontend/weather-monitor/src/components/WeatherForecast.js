import React, { useState } from 'react';
import axios from 'axios';

const WeatherForecast = ({ setLocation, setWeatherData }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!input) {
      setError('Please enter a valid location.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`);
      setWeatherData(response.data); // Update weather data here
      setLocation(input); // Set location for future use
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather Forecast</h1>
      <input
        type="text"
        placeholder="Enter Location"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Forecast</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default WeatherForecast;
