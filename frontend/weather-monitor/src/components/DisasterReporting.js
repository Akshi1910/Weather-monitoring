import React, { useState } from 'react';
import axios from 'axios';
import styles from './DisasterReporting.module.css'; // Import the CSS module

const DisasterReporting = () => {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/disasters/report', {
        location,
        type,
        status,
        description,
      });

      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Error reporting disaster:', err);
      setError('Failed to report disaster. Please try again.');
      setMessage('');
    }

    // Clear the form fields after submission
    setLocation('');
    setType('');
    setStatus('');
    setDescription('');
  };

  return (
    <div className={styles.form}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Report a Disaster</h2>
        <form onSubmit={handleSubmit}>
          <input 
            className={styles.input}
            type="text" 
            placeholder="Location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            required 
          />
          <select 
            className={styles.input} 
            value={type} 
            onChange={(e) => setType(e.target.value)} 
            required
          >
            <option value="">Select Disaster Type</option>
            <option value="Flood">Flood</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Other">Other</option>
          </select>
          <select 
            className={styles.input} 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            required
          >
            <option value="">Select Status</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Alert">Alert</option>
          </select>
          <textarea 
            className={styles.input}
            placeholder="Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          <button type="submit" className={styles.submit}>Report Disaster</button>
        </form>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.signin}>
          {/* You can add a sign-in link or any other links here if needed */}
        </div>
      </div>
    </div>
  );
};

export default DisasterReporting;
