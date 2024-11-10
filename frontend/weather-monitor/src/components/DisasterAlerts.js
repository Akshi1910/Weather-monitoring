import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './EnergyDashboard.module.css';
const DisasterAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  useEffect(() => {
    const fetchDisasterAlerts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/disaster-alerts', {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' }
        });
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, 'application/xml');
        
        const items = xmlDoc.getElementsByTagName('item');
        const alertsArray = Array.from(items).map(item => ({
          title: item.getElementsByTagName('title')[0]?.textContent,
          description: item.getElementsByTagName('description')[0]?.textContent,
          link: item.getElementsByTagName('link')[0]?.textContent,
          pubDate: item.getElementsByTagName('pubDate')[0]?.textContent,
          latitude: item.getElementsByTagName('geo:lat')[0]?.textContent,
          longitude: item.getElementsByTagName('geo:long')[0]?.textContent,
        }));

        setAlerts(alertsArray);
      } catch (error) {
        console.error("Error fetching disaster alerts:", error);
      }
    };

    fetchDisasterAlerts();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className="title">Disaster Alerts</h1>
      <div className="detailsContainer">
        {alerts.length > 0 ? (
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} className="alertItem">
                <h3>{alert.title}</h3>
                <p>{alert.description}</p>
                <a href={alert.link} target="_blank" rel="noopener noreferrer" className="button">
                  View Alert
                </a>
                <p>Date: {alert.pubDate}</p>
                <p>Location: {alert.latitude}, {alert.longitude}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="errorMessage">No alerts found.</p>
        )}
      </div>
    </div>
  );
};

export default DisasterAlerts;
