import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import styles from './EnergyDashboard.module.css';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';

const WindDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [input, setInput] = useState('');
  const [turbineCount, setTurbineCount] = useState();
  const [weatherData, setWeatherData] = useState(null);
  const [energyProduction, setEnergyProduction] = useState([]);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);
  const [monthlyEnergy, setMonthlyEnergy] = useState(null);
  const [savedReports, setSavedReports] = useState([]);

  const AIR_DENSITY = 1.225;
  const TURBINE_AREA = 10;
  const TURBINE_EFFICIENCY = 0.4;

  useEffect(() => {
    if (!isAuthenticated) {
      
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && user.name) {
      fetchSavedReports(user.name);
    }
  }, [user]);

  const fetchSavedReports = async (userName) => {
    try {
      const response = await axios.get(`http://localhost:5000/get-wind-reports?userName=${userName}`);
      setSavedReports(response.data);
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      setError('Error fetching saved reports');
    }
  };

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
      const windSpeed = forecast.wind.speed;
      const energy = calculateWindEnergy(windSpeed);
      return {
        time: forecast.dt_txt,
        windSpeed,
        energy,
      };
    });

    const totalEnergy = productionData.reduce((total, data) => total + data.energy, 0);
    const averageEnergy = totalEnergy / productionData.length;
    const monthlyEnergy = averageEnergy * 30;

    setEnergyProduction(productionData);
    setMonthlyEnergy(monthlyEnergy);
  };

  const calculateWindEnergy = (windSpeed) => {
    const area = TURBINE_AREA * turbineCount;
    return 0.5 * AIR_DENSITY * area * Math.pow(windSpeed, 3) * TURBINE_EFFICIENCY;
  };

  const toggleDetails = () => setShowDetails(!showDetails);
  const toggleMonthly = () => setShowMonthly(!showMonthly);

  const saveDetails = async () => {
    try {
      if (!user || !user.name) {
        alert('User not authenticated');
        return;
      }

      const details = {
        location: input,
        turbineCount,
        energyProduction,
        monthlyEnergy,
        userName: user.name,
      };

      await axios.post('http://localhost:5000/save-wind-details', details);
      alert('Details saved successfully!');
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Failed to save details');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Wind Energy Production Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Location: ${input}`, 14, 30);
    doc.text(`Number of Turbines: ${turbineCount}`, 14, 40);
    doc.text(`Monthly Energy Estimate: ${monthlyEnergy ? monthlyEnergy.toFixed(2) : 'N/A'} W`, 14, 50);

    doc.text('Energy Production Data:', 14, 60);
    let yOffset = 70;
    energyProduction.forEach((data) => {
      doc.text(`Time: ${data.time}, Wind Speed: ${data.windSpeed} m/s, Energy: ${data.energy.toFixed(2)} W`, 14, yOffset);
      yOffset += 10;
    });

    doc.save('wind_energy_report.pdf');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Wind Energy Production Forecast</h1>
        <a href='/windreports'>Saved reports</a>
        <p>Please enter a location</p><br />

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
            <button onClick={saveDetails} className={styles.button}>
              Save Report
            </button>
            <button onClick={downloadPDF} className={styles.button}>
              Download PDF
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
                  <th>Energy Production (W)</th>
                </tr>
              </thead>
              <tbody>
                {energyProduction.map((data, index) => (
                  <tr key={index}>
                    <td>{data.time}</td>
                    <td>{data.windSpeed} m/s</td>
                    <td>{data.energy.toFixed(2)} W</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.savedReports}>
        <h2>Saved Reports</h2>
        <ul>
          {savedReports.map((report, index) => (
            <li key={index}>
              Location: {report.location}, Turbines: {report.turbineCount}, Monthly Energy: {report.monthlyEnergy} W
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WindDashboard;
