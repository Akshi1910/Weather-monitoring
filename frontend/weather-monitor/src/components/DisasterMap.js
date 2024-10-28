import React, { useEffect, useRef, useState } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';

const DisasterMap = () => {
  const mapRef = useRef(null);
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState(null); // Store API errors if any

  // Fetch disaster data from the GeoDisasters API
  const fetchDisasterData = async () => {
    try {
      const response = await axios.get(
        'https://geodisasters.p.rapidapi.com/query',
        {
          params: { from: '2023-05-24', to: '2023-05-31', format: 'geojson' },
          headers: {
            'x-rapidapi-host': 'geodisasters.p.rapidapi.com',
            'x-rapidapi-key': 'e73911fd89mshb2e892ec135c9e6p10f41fjsnbae769610e8d',
          },
        }
      );

      console.log('Disaster Data:', response.data); // Log the API response
      setDisasters(response.data.features); // Store the disaster features
    } catch (err) {
      console.error('Error fetching disaster data:', err);
      setError('Failed to fetch disaster data. Please check the console.');
    }
  };

  useEffect(() => {
    fetchDisasterData(); // Fetch data on component load

    // Load ArcGIS modules
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic'], { css: true })
      .then(([Map, MapView, Graphic]) => {
        const map = new Map({ basemap: 'streets-navigation-vector' });

        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [0, 20], // Adjust the center to display disaster points globally
          zoom: 2,
        });

        // Add disaster points to the map as graphics
        disasters.forEach((disaster) => {
          const [longitude, latitude] = disaster.geometry.coordinates;

          const point = {
            type: 'point',
            longitude,
            latitude,
          };

          const symbol = {
            type: 'simple-marker',
            color: 'red',
            size: '8px',
            outline: { color: 'white', width: 1 },
          };

          const graphic = new Graphic({
            geometry: point,
            symbol: symbol,
            attributes: disaster.properties,
            popupTemplate: {
              title: `Disaster: ${disaster.properties.event || 'Unknown Event'}`,
              content: `
                <p><strong>Location:</strong> ${disaster.properties.place || 'Unknown'}</p>
                <p><strong>Date:</strong> ${new Date(disaster.properties.date).toLocaleDateString()}</p>
                <p><strong>Description:</strong> ${disaster.properties.description || 'No description available.'}</p>
              `,
            },
          });

          view.graphics.add(graphic); // Add each disaster point to the map
        });
      })
      .catch((err) => console.error('Error loading ArcGIS modules:', err));
  }, [disasters]); // Re-run when disasters state changes

  return (
    <div style={{ height: '100vh', width: '100%' }} ref={mapRef}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DisasterMap;
