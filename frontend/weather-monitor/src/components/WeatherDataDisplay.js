import React, { useState } from 'react';
import axios from 'axios';
import styles from './Weather.module.css';

const WeatherDataDisplay = () => {
  const [input, setInput] = useState(''); // Store user input for location
  const [weatherData, setWeatherData] = useState(null); // Store fetched weather data
  const [error, setError] = useState(null); // Store error message if any

  // Function to fetch weather data from your backend
  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`); // Replace with your backend API
      setWeatherData(response.data); // Update weather data here
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Please enter a country or city');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather Data Fetcher</h1>
      <p>Please enter a country or city</p><br/>
      <div className={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter Location"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
        />
        <button onClick={fetchWeather} className={styles.button}>
          Get Weather
        </button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {weatherData ? (
        <>
          <h3>Weather Forecast for {input}</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Temperature (°C)</th>
                <th>Humidity (%)</th>
                <th>Wind Speed (m/s)</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.list.map((data, index) => (
                <tr key={index}>
                  <td>{data.dt_txt}</td>
                  <td>{data.main.temp}°C</td>
                  <td>{data.main.humidity}%</td>
                  <td>{data.wind.speed} m/s</td>
                  <td>{data.weather[0].description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No data available. Please enter a location to get the weather.</p>
      )}
    </div>
  );
};

export default WeatherDataDisplay;
