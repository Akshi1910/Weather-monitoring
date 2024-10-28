import React, { useState } from "react";
import axios from "axios";
import styles from './DisasterByContinent.module.css';

const DisasterByContinent = () => {
  const [continent, setContinent] = useState("ant");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const eventTypeMapping = {
    EQ: "Earthquake",
    FL: "Flood",
    CY: "Cyclone",
    HW: "Heat Wave",
    WS: "Wildfire",
    TS: "Tsunami",
    HUR: "Hurricane",
    TOR: "Tornado",
    SW: "Severe Weather",
    DR: "Drought",
    WF: "Wildfire",        // Added Wildfire mapping
    TC: "Tropical Cyclone"// Add more mappings as needed
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/disasters/by-continent", {
        params: { continent },
      });
      setEvents(response.data); // Update this based on your response structure
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.disasterContainer}>
      <h1 className={styles.title}>Disaster Events by Continent</h1>
      <div className={styles.selectContainer}>
        <select value={continent} onChange={(e) => setContinent(e.target.value)}>
          <option value="afr">Africa</option>
          <option value="ant">Antarctica</option>
          <option value="asia">Asia</option>
          <option value="aus">Australia</option>
          <option value="eur">Europe</option>
          <option value="nar">North America</option>
          <option value="sar">South America</option>
          <option value="ocean">Oceania</option>
        </select>
        <button className={styles.fetchButton} onClick={fetchEvents}>
          Fetch Events
        </button>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <div className={styles.cardContainer}>
          {events.length > 0 ? (
            events.map((event) => (
              <div className={styles.card} key={event._id}>
                <h2>{event.event_name}</h2>
                <p>Disaster : {eventTypeMapping[event.event_type] || event.event_type}</p>
                <p>Date: {event.date}</p>
                <p>Country: {event.country_code}</p>
              </div>
            ))
          ) : (
            <p>No events found for the selected continent.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DisasterByContinent;
