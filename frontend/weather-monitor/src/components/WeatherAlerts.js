import React, { useState, useEffect } from 'react';

const WeatherAlerts = ({ latitude, longitude }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.weather.gov/alerts?point=${latitude},${longitude}`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          setAlerts(data.features);
        } else {
          setAlerts([]);
        }
      } catch (error) {
        setError('Failed to fetch weather alerts');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [latitude, longitude]);

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Weather Alerts</h3>
      {alerts.length === 0 ? (
        <p>No active alerts in your area.</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            <li key={alert.id}>
              <h4>{alert.properties.headline}</h4>
              <p>{alert.properties.description}</p>
              <p><strong>Effective:</strong> {alert.properties.onset}</p>
              <p><strong>Expires:</strong> {alert.properties.expires}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WeatherAlerts;
