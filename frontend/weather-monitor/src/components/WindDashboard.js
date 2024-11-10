import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from './EnergyDashboard.module.css';
import Navbar from './Navbar';

const WindDashboard = () => {
  const [input, setInput] = useState('');
  const [turbineCount, setTurbineCount] = useState();
  const [weatherData, setWeatherData] = useState(null);
  const [energyProduction, setEnergyProduction] = useState([]);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);

  const [monthlyEnergy, setMonthlyEnergy] = useState(null); // State for monthly energy

  const AIR_DENSITY = 1.225; // kg/m³ at sea level
  const TURBINE_AREA = 10; // Assuming 10 m² area for simplicity
  const TURBINE_EFFICIENCY = 0.4; // 40% efficiency for wind turbines

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`);
      setWeatherData(response.data);
      calculateEnergyProduction(response.data.list);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Please enter a valid location');
    }
  };

  const calculateEnergyProduction = (forecasts) => {
    const productionData = forecasts.map((forecast) => {
      const windSpeed = forecast.wind.speed; // Assuming the wind speed is in m/s
      const energy = calculateWindEnergy(windSpeed);
      return {
        time: forecast.dt_txt,
        windSpeed,
        energy,
      };
    });

    // Calculate the total energy produced and the average energy
    const totalEnergy = productionData.reduce((total, data) => total + data.energy, 0);
    const averageEnergy = totalEnergy / productionData.length;

    // Calculate the total energy produced for a month (30 days)
    const monthlyEnergy = averageEnergy * 30;  // Assuming 30 days in a month

    setEnergyProduction(productionData);
    setMonthlyEnergy(monthlyEnergy);  // Store the monthly energy estimate
  };

  const calculateWindEnergy = (windSpeed) => {
    const area = TURBINE_AREA * turbineCount;
    return 0.5 * AIR_DENSITY * area * Math.pow(windSpeed, 3) * TURBINE_EFFICIENCY;
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleMonthly = () => {
    setShowMonthly(!showMonthly);
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Wind Energy Production Forecast</h1>
        <p>Please enter a city or country</p><br/>

        <div className={styles.flexContainer}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter Location"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
            /><br />
            <input
              type="number"
              placeholder="Enter Number of Turbines"
              value={turbineCount}
              onChange={(e) => setTurbineCount(e.target.value)}
              className={styles.input}
              min="1"
            />
            <button onClick={fetchWeather} className={styles.button}>
              Get Forecast
            </button>
            <button onClick={toggleDetails} className={styles.button}>
              {showDetails ? 'Hide Details' : 'More Details'}
            </button>
            <button onClick={toggleMonthly} className={styles.button}>
              {showMonthly ? 'Hide Monthly Average' : 'Get Monthly Average'}
            </button>
          </div>

          <div className={styles.chartContainer}>
            {weatherData && (
              <LineChart width={800} height={400} data={energyProduction}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#82ca9d" name="Energy Production (W)" />
              </LineChart>
            )}
            {!weatherData && (
              <div className={styles.inputContainer}>
                <p>Enter a city or country to get the data!</p>
                <p>This dashboard allows users to input a location and the number of wind turbines to estimate energy production based on wind speed forecasts. Users can easily see how much energy the wind turbines will generate over time through an interactive chart. Detailed wind conditions and energy output values are available via the 'More Details' button, making it a valuable tool for planning wind energy installations based on specific weather conditions.</p>
              </div>
            )}
          </div>
        </div>

        {showMonthly && monthlyEnergy && (
          <div className={styles.monthlyEnergyContainer}>
            <h3>Estimated Monthly Energy Production: {monthlyEnergy.toFixed(2)} W</h3>
          </div>
        )}

        {showDetails && weatherData && (
          <div className={styles.detailsContainer}>
            <h3>Weather Forecast for {input}</h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Wind Speed (m/s)</th>
                  <th>Description</th>
                  <th>Energy Production (W)</th>
                </tr>
              </thead>
              <tbody>
                {energyProduction.map((data, index) => (
                  <tr key={index}>
                    <td>{data.time}</td>
                    <td>{data.windSpeed} m/s</td>
                    <td>{weatherData.list[index].weather[0].description}</td>
                    <td>{data.energy.toFixed(2)} W</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindDashboard;
