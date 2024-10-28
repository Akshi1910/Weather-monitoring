import React, { useState } from 'react';
import axios from 'axios';
import styles from './Weather.module.css'; // Import the CSS Module

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/weather`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { location: location },
      });
      setWeatherData(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch weather data. Please try again.');
    }
  };

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.weatherCard}>
        <h2>Weather Information</h2>
        <input
          className={styles.weatherInput}
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button className={styles.weatherButton} onClick={fetchWeather}>
          Get Weather
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
        {weatherData && (
          <div className={styles.weatherData}>
            <h3>Weather in {weatherData.name}</h3>
            <p>Temperature: {weatherData.main.temp} °C</p>
            <p>Condition: {weatherData.weather[0].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
