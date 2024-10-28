import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import styles from './EnergyDashboard.module.css'; // Import the CSS module

const WindDashboard = () => {
  const [input, setInput] = useState(''); // Store user input for location
  const [windData, setWindData] = useState([]); // Store wind energy data
  const [error, setError] = useState(null); // Store any errors

  // Calculate wind energy production based on wind speed
  const calculateWindEnergy = (speed) => {
    const airDensity = 1.225; // kg/m³ at sea level
    const area = 1; // m² (Assuming 1 m² area for simplicity)
    return 0.5 * airDensity * area * Math.pow(speed, 3); // Energy in watts
  };

  // Fetch weather data from backend API
  const fetchWindData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`); // Replace with your backend endpoint
      const forecasts = response.data.list;

      const windProduction = forecasts.map((forecast) => {
        const speed = forecast.wind.speed;
        const energy = calculateWindEnergy(speed);

        return {
          time: forecast.dt_txt,
          speed: speed,
          energy: energy.toFixed(2), // Energy in watts
        };
      });

      setWindData(windProduction); // Store the calculated wind data
      setError(null); // Clear any errors
    } catch (err) {
      console.error('Error fetching wind data:', err);
      setError('Enter a valid location(county or city)');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Wind Energy Production Forecast</h1>
      <p>Please enter a country or city</p><br/>
      {/* Input field to enter location */}
      <div className={styles.inputSection}>
        <input
          type="text"
          placeholder="Enter Location"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
        />
        <button onClick={fetchWindData} className={styles.button}>
          Get Wind Energy Data
        </button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {windData.length > 0 && (
        <div>
          <h3>Wind Data</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Wind Speed (m/s)</th>
                <th>Energy Production (W)</th>
              </tr>
            </thead>
            <tbody>
              {windData.map((data, index) => (
                <tr key={index}>
                  <td>{data.time}</td>
                  <td>{data.speed} m/s</td>
                  <td>{data.energy} W</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {windData.length > 0 && (
        <div>
          <h3>Wind Energy Production Graph</h3>
          
          <LineChart width={900} height={500} data={windData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#4287f5" name="Wind Energy Production (W)" />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default WindDashboard;
