import React, { useState } from "react";
import styles from "./WeatherDashboard.module.css"; // Import the CSS module

const WeatherDashboard = () => {
    const [cityInput, setCityInput] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const API_KEY = "f614beb3883d3c749d24656bc16816be";

    const createWeatherCard = (weatherItem, index) => {
        const date = weatherItem.dt_txt.split(" ")[0];
        return (
            <li className={styles.card} key={index}>
                <h3>{cityInput} {date}</h3>
                
                <img src={`https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png`} alt="weather-icon" />
                <h4>Temperature: {(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                <h4>Wind Speed: {weatherItem.wind.speed} m/s</h4>
                <h4>Humidity: {weatherItem.main.humidity}%</h4>
            </li>
        );
    };

    const getWeatherDetails = (cityName, lat, lon) => {
        const weather_url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        fetch(weather_url)
            .then(res => res.json())
            .then(data => {
                setCurrentWeather(data.list[0]);

                // Filter out unique dates for the next 5 days
                const uniqueDates = {};
                const filteredForecast = data.list.filter(item => {
                    const date = item.dt_txt.split(" ")[0];
                    if (!uniqueDates[date]) {
                        uniqueDates[date] = true;
                        return true; // Keep this item
                    }
                    return false; // Skip this item
                }).slice(0, 5); // Take the first 5 unique days

                setForecast(filteredForecast);
                setCityInput(""); // Clear input
            })
            .catch(() => {
                alert("Error fetching weather data");
            });
    };

    const getCityCoordinates = () => {
        const api_url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${API_KEY}`;
        fetch(api_url)
            .then(res => res.json())
            .then(data => {
                if (!data.length) return alert("No coordinates found");
                const { lat, lon } = data[0];
                getWeatherDetails(cityInput, lat, lon);
                console.log(data);
            })
            .catch(() => {
                alert("Error fetching city coordinates");
            });
    };

    const getUserCoordinates = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                const REVERSE_GEO_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
                fetch(REVERSE_GEO_URL)
                    .then(res => res.json())
                    .then(data => {
                        if (!data.length) return alert("No coordinates found");
                        const { name } = data[0];
                        getWeatherDetails(name, latitude, longitude);
                    })
                    .catch(() => {
                        alert("Error fetching location data");
                    });
            },
            error => {
                if (error.code === error.PERMISSION_DENIED) {
                    alert("Permission denied for location access");
                }
            }
        );
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.h1}>Weather Dashboard</h1>
            <div className={styles.container}>
                <div className={styles.weatherInput}>
                    <h3>Enter a city name</h3>
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        placeholder="Eg: London, New York, Tokyo"
                    />
                    <button className={styles.searchBtn} onClick={getCityCoordinates}>Search</button>
                    <div className={styles.separator}></div>
                    <button className={styles.locationBtn} onClick={getUserCoordinates}>Use Current Location</button>
                </div>
                <div className={styles.weatherData}>
                    {currentWeather && (
                        <div className={styles.currentWeather}>
                            <div className={styles.details}>
                                <h2>{currentWeather.dt_txt.split(" ")[0]}</h2>
                                <h4>Temperature: {(currentWeather.main.temp - 273.15).toFixed(2)}°C</h4>
                                <h4>Wind Speed: {currentWeather.wind.speed} m/s</h4>
                                <h4>Humidity: {currentWeather.main.humidity}%</h4>
                            </div>
                            <div className={styles.icon}>
                                <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="weather-icon" />
                                <h4>{currentWeather.weather[0].description}</h4>
                            </div>
                        </div>
                    )}
                    <div className={styles.dayForecast}>
                        <h2>5 Day Forecast</h2>
                        <ul className={styles.weatherCards}>
                            {forecast.map((weatherItem, index) => createWeatherCard(weatherItem, index))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherDashboard;
