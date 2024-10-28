import React, { useState } from 'react';
import styles from './DisasterKit.module.css'; // Import CSS module

const disasterKits = {
  Cyclone: [
    "Battery-operated torch",
    "Extra batteries",
    "Battery-operated radio or hand-crank radio",
    "First aid kit with essential medicines",
    "Non-perishable food items and sealed water bottles",
    "Water purifying tablets or filter",
    "Candles and waterproof matches/lighters",
    "Multipurpose tool or knife",
    "Personal identification (Aadhar, Ration Card, Passport)",
    "Important documents sealed in a waterproof bag",
    "Whistle for signaling",
    "Sturdy shoes or boots",
    "Thick ropes and cords",
    "Raincoat or waterproof clothing",
    "Cash and coins for emergency purchases",
  ],
  Flood: [
    "Waterproof bags for documents and devices",
    "First aid kit and essential medicines",
    "Life jackets or inflatable rafts",
    "Whistle and torch for signaling",
    "Dry clothes and waterproof shoes",
    "Bottled water and water purification tablets",
    "Non-perishable food items",
    "Power bank for charging devices",
    "Candles and waterproof matches",
    "Multipurpose knife and toolkit",
  ],
  Earthquake: [
    "Emergency whistle",
    "Battery-operated radio and extra batteries",
    "First aid kit with medications",
    "Emergency food and water supplies",
    "Sturdy shoes and gloves",
    "Dust mask to filter debris",
    "Multipurpose tool or knife",
    "Flashlight with extra batteries",
    "Copy of important documents",
    "Blanket or sleeping bag",
  ],
  Wildfire: [
    "N95 masks or respirators",
    "Goggles to protect eyes",
    "Emergency food and water",
    "Battery-operated radio",
    "First aid kit and medications",
    "Long-sleeved clothing and sturdy shoes",
    "Whistle and signaling tools",
    "Copy of personal documents",
    "Cash in small bills",
    "Evacuation map with routes marked",
  ],
};

const DisasterKit = () => {
  const [selectedDisaster, setSelectedDisaster] = useState('Cyclone');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Natural Disaster Emergency Kit</h2>

      <select
        className={styles.dropdown}
        value={selectedDisaster}
        onChange={(e) => setSelectedDisaster(e.target.value)}
      >
        {Object.keys(disasterKits).map((disaster) => (
          <option key={disaster} value={disaster}>
            {disaster}
          </option>
        ))}
      </select>

      <div className={styles.kitList}>
        {disasterKits[selectedDisaster].map((item, index) => (
          <div key={index} className={styles.card}>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisasterKit;
