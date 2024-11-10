import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherAlertsMap = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch('https://api.weather.gov/alerts/active');
        const data = await response.json();
        setAlerts(data.features || []);
      } catch (error) {
        console.error('Failed to fetch alerts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <div>Loading alerts...</div>;
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MapContainer center={[37.7749, -122.4194]} zoom={5} style={{ width: '100%', height: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {alerts.map((alert, index) => {
          const coordinates = alert.geometry && alert.geometry.coordinates ? alert.geometry.coordinates[0].map(coord => [coord[1], coord[0]]) : null;
          if (!coordinates) return null; // Skip alerts without coordinates

          return (
            <Polygon key={index} positions={coordinates} color="red">
              <Popup>
                <h4>{alert.properties.headline}</h4>
                {/* <p>{alert.properties.description}</p> */}
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default WeatherAlertsMap;
