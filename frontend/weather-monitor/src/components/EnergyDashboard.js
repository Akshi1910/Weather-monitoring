import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import jsPDF from 'jspdf';
import styles from './EnergyDashboard.module.css';
import Navbar from './Navbar';
import { useAuth0 } from '@auth0/auth0-react';
import UserReports from './UserReports';
const EnergyDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [input, setInput] = useState('');
  const [panelType, setPanelType] = useState('60');
  const [panelCount, setPanelCount] = useState();
  const [weatherData, setWeatherData] = useState(null);
  const [energyProduction, setEnergyProduction] = useState([]);
  const [error, setError] = useState(null);            
  const [showDetails, setShowDetails] = useState(false);
  const [showmonth, setShowmonth] = useState(false);
  const [monthlyEnergy, setMonthlyEnergy] = useState(null);
  const [savedReports, setSavedReports] = useState([]);

  const PANEL_AREAS = {
    '60': 1.458,
    '72': 1.746,
    '96': 2.3328
  };
  const PANEL_EFFICIENCY = 0.18;

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
      const response = await axios.get(`http://localhost:5000/get-reports?userName=${userName}`);
      setSavedReports(response.data);  // Set the saved reports data to state
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

    const totalEnergy = productionData.reduce((total, data) => total + data.energy, 0);
    const averageEnergy = totalEnergy / productionData.length;

    const monthlyEnergy = averageEnergy * 30;

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

  const saveDetails = async () => {
    try {
      // Make sure user is authenticated and has a name
      if (!user || !user.name) {
        alert('User not authenticated');
        return;
      }

      // Include user.name in the details to be saved
      const details = {
        location: input,
        panelType,
        panelCount,
        energyProduction,
        monthlyEnergy,
        userName: user.name,  // Add user name from Auth0
      };

      await axios.post('http://localhost:5000/save-energy-details', details);
      alert('Details saved successfully!');
    } catch (error) {
      console.error('Error saving details:', error);
      alert('Failed to save details');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Solar Energy Production Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Location: ${input}`, 14, 30);
    doc.text(`Panel Type: ${panelType}-cell`, 14, 40);
    doc.text(`Number of Panels: ${panelCount}`, 14, 50);
    doc.text(`Monthly Energy Estimate: ${monthlyEnergy ? monthlyEnergy.toFixed(2) : 'N/A'} W`, 14, 60);

    doc.text('Energy Production Data:', 14, 70);

    let yOffset = 80;
    energyProduction.forEach((data) => {
      doc.text(`Time: ${data.time}, DNI: ${data.dni} W/m², Energy: ${data.energy.toFixed(2)} W`, 14, yOffset);
      yOffset += 10;
    });

    doc.save('solar_energy_report.pdf');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Solar Energy Production Forecast</h1>
        <a href='/reports'>Saved reports</a>
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
            <button onClick={saveDetails} className={styles.button}>
              Save
            </button>
            <button onClick={downloadPDF} className={styles.button}>
              Download Report
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
