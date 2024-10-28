import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';

const OPENWEATHER_API_KEY = 'f614beb3883d3c749d24656bc16816be'; // Replace with your OpenWeather API key

const WeatherMap = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const mapRef = useRef(null); // Reference to the map DOM element

  useEffect(() => {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic'], { css: true })
      .then(([Map, MapView, Graphic]) => {
        const map = new Map({
          basemap: 'streets-night-vector',
        });

        const view = new MapView({
          container: mapRef.current,
          map: map,
          center: [0, 0],
          zoom: 2,
        });

        view.on('click', async (event) => {
          const { longitude, latitude } = event.mapPoint;
          console.log(`Clicked at: [${longitude}, ${latitude}]`);
          await fetchWeatherData(longitude, latitude); // Fetch weather data directly
        });

        viewRef.current = view; // Store view reference for adding markers later
      })
      .catch((err) => console.error('Error loading ArcGIS modules:', err));
  }, []);

  const viewRef = useRef(null);

  // Fetch weather data directly using coordinates
  const fetchWeatherData = async (lon, lat) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      console.log('Weather API Response:', response.data); // Debugging
      setWeatherData(response.data);
      setError(null);
      addMarker(lon, lat, response.data); // Add marker on the map with weather info
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    }
  };

  const addMarker = (lon, lat, data) => {
    loadModules(['esri/Graphic']).then(([Graphic]) => {
      const point = {
        type: 'point',
        longitude: lon,
        latitude: lat,
      };

      const markerSymbol = {
        type: 'simple-marker',
        color: 'blue',
        size: '12px',
      };

      const popupTemplate = {
        title: `Weather in ${data.name}`,
        content: `
          <p><b>Temperature:</b> ${data.main.temp} °C</p>
          <p><b>Weather:</b> ${data.weather[0].description}</p>
          <p><b>Humidity:</b> ${data.main.humidity}%</p>
          <p><b>Wind Speed:</b> ${data.wind.speed} m/s</p>
        `,
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        popupTemplate: popupTemplate,
      });

      viewRef.current.graphics.removeAll(); // Clear previous markers
      viewRef.current.graphics.add(pointGraphic); // Add new marker
      viewRef.current.goTo({ center: [lon, lat], zoom: 10 }); // Zoom to location
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Weather Map</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }}></div>
      {weatherData && (
        <div>
          <h2>Weather Details:</h2>
          <p><b>Location:</b> {weatherData.name}</p>
          <p><b>Temperature:</b> {weatherData.main.temp} °C</p>
          <p><b>Weather:</b> {weatherData.weather[0].description}</p>
          <p><b>Humidity:</b> {weatherData.main.humidity}%</p>
          <p><b>Wind Speed:</b> {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherMap;
