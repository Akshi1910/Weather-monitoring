import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from './EnergyDashboard.module.css';
const EnergyDashboard = () => {
  const [input, setInput] = useState(''); // Store user input for location
  const [weatherData, setWeatherData] = useState(null); // Store fetched weather data
  const [energyProduction, setEnergyProduction] = useState([]); // Store energy data
  const [error, setError] = useState(null); // Store error message if any

  // Function to fetch weather data from your backend
  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`); // Replace with your backend API
      setWeatherData(response.data); // Update weather data here
      calculateEnergyProduction(response.data.list); // Calculate energy based on weather data
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Please enter a country or city');
    }
  };

  // Calculate energy production based on temperature
  const calculateEnergyProduction = (forecasts) => {
    const productionData = forecasts.map((forecast) => {
      const temperature = forecast.main.temp;
      const energy = calculateSolarEnergy(temperature);
      return {
        time: forecast.dt_txt,
        temperature,
        energy,
      };
    });
    setEnergyProduction(productionData);
  };

  // Example energy calculation function
  const calculateSolarEnergy = (temperature) => {
    const baseEnergy = 100; // Base energy output in Watts
    return baseEnergy * (temperature / 25); // Optimal temp assumed to be 25°C
  };

  return (
    <div className={styles.container}>
  <h1 className={styles.title}>Solar Energy Production Forecast</h1>
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
      Get Forecast
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
            <th>Description</th>
            <th>Energy Production (W)</th>
          </tr>
        </thead>
        <tbody>
          {energyProduction.map((data, index) => (
            <tr key={index}>
              <td>{data.time}</td>
              <td>{data.temperature}°C</td>
              <td>{weatherData.list[index].weather[0].description}</td>
              <td>{data.energy.toFixed(2)} W</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.chartContainer}>
        <LineChart width={600} height={300} data={energyProduction}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="energy" stroke="#ffa726" name="Energy Production (W)" />
        </LineChart>
      </div>
    </>
  ) : (
    <p>No data available. Please enter a location to get the forecast.</p>
  )}
</div>

  );
};

export default EnergyDashboard;
