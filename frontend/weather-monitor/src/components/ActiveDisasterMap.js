import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

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

    return (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '600px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {disasters.map((disaster, index) => (
                <Marker
                    key={index}
                    position={[
                        disaster.geometry.coordinates[1], 
                        disaster.geometry.coordinates[0]
                    ]}
                >
                    <Popup>
                        <h3>{disaster.properties.place}</h3>
                        <p>Magnitude: {disaster.properties.mag}</p>
                        <p>{new Date(disaster.properties.time).toLocaleString()}</p>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default ActiveDisastersMap;
