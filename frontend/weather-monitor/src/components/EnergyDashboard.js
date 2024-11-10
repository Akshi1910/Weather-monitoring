import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import styles from './EnergyDashboard.module.css';
import Navbar from './Navbar';

const EnergyDashboard = () => {
  const [input, setInput] = useState('');
  const [panelType, setPanelType] = useState('60');
  const [panelCount, setPanelCount] = useState();
  const [weatherData, setWeatherData] = useState(null);
  const [energyProduction, setEnergyProduction] = useState([]);
  const [error, setError] = useState(null);            
  const [showDetails, setShowDetails] = useState(false);
  const [showmonth, setShowmonth] = useState(false);

  const [monthlyEnergy, setMonthlyEnergy] = useState(null); // State for monthly energy

  const PANEL_AREAS = {
    '60': 1.458,
    '72': 1.746,
    '96': 2.3328
  };
  const PANEL_EFFICIENCY = 0.18;

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather/${input}`);
      setWeatherData(response.data);
      calculateEnergyProduction(response.data.list);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Please enter a country or city');
    }
  };

  const calculateEnergyProduction = (forecasts) => {
    const productionData = forecasts.map((forecast) => {
      const dni = forecast.main.temp;
      const energy = calculateSolarEnergy(dni);
      return {
        time: forecast.dt_txt,
        dni,
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

  const calculateSolarEnergy = (dni) => {
    const area = PANEL_AREAS[panelType] * panelCount;
    return dni * area * PANEL_EFFICIENCY;
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    
  };
  const togglemonth = () => {
    setShowmonth(!showmonth);
    
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Solar Energy Production Forecast</h1>
        <p>Please enter a country or city</p><br />

        <div className={styles.flexContainer}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Enter Location"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={styles.input}
            /><br />
            <select
              value={panelType}
              onChange={(e) => setPanelType(e.target.value)}
              className={styles.dropdown}
            >
              <option value="60">60-cell Panel</option>
              <option value="72">72-cell Panel</option>
              <option value="96">96-cell Panel</option>
            </select>
            <input
              type="number"
              placeholder="Enter Number of Panels"
              value={panelCount}
              onChange={(e) => setPanelCount(e.target.value)}
              className={styles.input}
              min="1"
            />
            <button onClick={fetchWeather} className={styles.button}>
              Get Forecast
            </button>
            <button onClick={toggleDetails} className={styles.button}>
              {showDetails ? 'Hide Details' : 'More Details'}
            </button>
            <button onClick={togglemonth} className={styles.button}>
              {showmonth ? 'Hide' : 'Get Monthly'}
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
                <Line type="monotone" dataKey="energy" stroke="#ffa726" name="Energy Production (W)" />
              </LineChart>
            )}
            {!weatherData && (
              <div className={styles.inputContainer}>
                <p>Enter a city or country to get the data!</p>
                <p>
                  It allows users to input a location (such as a country or city) and select from different types of solar panels (e.g., 60-cell, 72-cell, or 96-cell panels) to calculate estimated energy production. Once a location is entered and the "Get Forecast" button is clicked, the component simulates fetching weather and solar data. The dashboard displays the forecast visually through an easy-to-read line chart, showing how much energy the solar panels are likely to generate over time. Additionally, users can view detailed information, including sunlight intensity, weather descriptions, and specific energy output values, which can be accessed by clicking the "More Details" button. This feature is especially helpful for those planning solar installations or tracking potential solar energy outputs based on geographic and weather conditions. With this dashboard, users can make better decisions about solar panel investments and energy planning by understanding location-specific solar energy potential.
                </p>
              </div>
            )}
          </div>
        </div>

        {showmonth && monthlyEnergy && (
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
                  <th>DNI (W/m²)</th>
                  <th>Description</th>
                  <th>Energy Production (W)</th>
                </tr>
              </thead>
              <tbody>
                {energyProduction.map((data, index) => (
                  <tr key={index}>
                    <td>{data.time}</td>
                    <td>{data.dni} W/m²</td>
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

export default EnergyDashboard;
