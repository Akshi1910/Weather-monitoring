import React, { useState, useEffect, useRef } from 'react';
import { loadModules } from 'esri-loader';
import axios from 'axios';
import styles from './WeatherMap.module.css'; // Custom CSS import

const OPENWEATHER_API_KEY = 'f614beb3883d3c749d24656bc16816be'; // Use environment variables in production!

const Map = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [dniData, setDniData] = useState(null); // New state for DNI
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/Graphic'], { css: true })
      .then(([Map, MapView, Graphic]) => {
        const map = new Map({
          basemap: 'streets-vector',
        });

        const view = new MapView({
          container: mapRef.current,
          map,
          center: [0, 0],
          zoom: 2,
        });

        view.on('click', async (event) => {
          const { longitude, latitude } = event.mapPoint;
          console.log(`Clicked at: [${longitude}, ${latitude}]`);
          await fetchWeatherData(longitude, latitude);
          await fetchSolarData(longitude, latitude); // Fetch DNI data
        });

        viewRef.current = view;
      })
      .catch((err) => console.error('Error loading ArcGIS modules:', err));
  }, []);

  const fetchWeatherData = async (lon, lat) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      console.log('Weather Data:', response.data);
      setWeatherData(response.data);
      setError(null);
      addMarker(lon, lat, response.data);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    }
  };

  const fetchSolarData = async (lon, lat) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${OPENWEATHER_API_KEY}`
      );

      console.log('Solar Radiation Data:', response.data);
      const solarRadiation = response.data.current.sunshine_duration; // Adjust based on actual API response
      setDniData(solarRadiation);
      setError(null);
    } catch (err) {
      console.error('Error fetching solar data:', err);
      setError('Failed to fetch solar radiation data. Please try again.');
      setDniData(null);
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
          <div class="${styles.popupContent}">
            <p><b>Temperature:</b> ${data.main.temp} °C</p>
            <p><b>Weather:</b> ${data.weather[0].description}</p>
            <p><b>Humidity:</b> ${data.main.humidity}%</p>
            <p><b>Wind Speed:</b> ${data.wind.speed} m/s</p>
            <p><b>DNI (Solar Radiation):</b> ${dniData || 'N/A'} W/m²</p>
          </div>
        `,
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol,
        popupTemplate,
      });

      viewRef.current.graphics.removeAll();
      viewRef.current.graphics.add(pointGraphic);
      viewRef.current.popup.open({
        title: popupTemplate.title,
        content: popupTemplate.content,
        location: point
      });

      viewRef.current.goTo({ center: [lon, lat], zoom: 10 });
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Weather Map</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div ref={mapRef} className={styles.map}></div>
    </div>
  );
};

export default Map;
