import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Define custom icon for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const NearbyPlacesWithWeather = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]); // To hold markers added by clicks
  const centerLocation = { lat: 37.422, lng: -122.084 }; // Default center coordinates

  // Fetch nearby places on component mount
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(
          'https://google-map-places.p.rapidapi.com/maps/api/place/nearbysearch/json',
          {
            params: {
              location: `${centerLocation.lat},${centerLocation.lng}`,
              radius: 5000,
              type: 'point_of_interest',
            },
            headers: {
              'X-RapidAPI-Key': 'e73911fd89mshb2e892ec135c9e6p10f41fjsnbae769610e8d',
              'X-RapidAPI-Host': 'google-map-places.p.rapidapi.com',
            },
          }
        );
        setPlaces(response.data.results);
      } catch (error) {
        console.error('Error fetching places:', error);
        setError('Failed to fetch places. Please try again.');
      }
    };

    fetchPlaces();
  }, []);

  // Fetch weather data based on coordinates
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: lat,
            lon: lon,
            units: 'metric',
            appid: 'f614beb3883d3c749d24656bc16816be',
          },
        }
      );

      setWeatherData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again.');
      setWeatherData(null);
    }
  };

  // Handle map click to add a marker and fetch weather data
  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng; // Get latitude and longitude from click event
    // Add a new marker
    setMarkers((prevMarkers) => [...prevMarkers, { lat, lng }]);
    // Fetch weather data for the clicked location
    await fetchWeatherData(lat, lng);
  };

  return (
    <div>
      <h3>Nearby Places with Weather Information</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <div>
          <h4>Weather in {weatherData.name}</h4>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
      <MapContainer 
        center={centerLocation} 
        zoom={13} 
        style={{ height: '500px', width: '100%' }} 
        onClick={handleMapClick} // Add onClick event handler
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {places.map((place, index) => (
          <Marker
            key={index}
            position={{
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            }}
          >
            <Popup>
              <strong>{place.name}</strong><br />
              Address: {place.vicinity}<br />
            </Popup>
          </Marker>
        ))}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
          >
            <Popup>
              <strong>Weather data:</strong><br />
              Clicked location<br />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default NearbyPlacesWithWeather;
