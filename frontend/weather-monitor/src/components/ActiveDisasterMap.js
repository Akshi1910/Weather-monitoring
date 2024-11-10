import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from "../WeatherDashboard.module.css";
function ActiveDisastersMap() {
    const [disasters, setDisasters] = useState([]);

    useEffect(() => {
        const fetchDisasters = async () => {
            try {
                const response = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
                setDisasters(response.data.features); // Accessing GeoJSON features
            } catch (error) {
                console.error('Error fetching disaster data:', error);
            }
        };

        fetchDisasters();
    }, []);

    // Custom icon for markers
    const customIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28]
    });

    return (
        <div>
            <h2 className={styles.h2}>Active Earthquakes WorldWide</h2>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {disasters.map((disaster, index) => {
                const [longitude, latitude] = disaster.geometry.coordinates;
                console.log(`Disaster Coordinates: Latitude: ${latitude}, Longitude: ${longitude}`);
                return (
                    <Marker
                        key={index}
                        position={[latitude, longitude]}  // Corrected order: [latitude, longitude]
                        icon={customIcon}
                    >
                        <Popup>
                            <h3>{disaster.properties.place}</h3>
                            <p>Magnitude: {disaster.properties.mag}</p>
                            <p>{new Date(disaster.properties.time).toLocaleString()}</p>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
        </div>
    );
}

export default ActiveDisastersMap;
