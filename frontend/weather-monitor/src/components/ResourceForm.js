import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ReportForm.module.css'; // Import CSS module

const ReportForm = () => {
  const [disasters, setDisasters] = useState([]); // State to store reported disasters
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [resourceName, setResourceName] = useState(''); // New state for resource name
  const [resourceType, setResourceType] = useState(''); // New state for resource type
  const [quantity, setQuantity] = useState(''); // State for quantity
  const [contactInfo, setContactInfo] = useState(''); // New state for contact info
  const [description, setDescription] = useState(''); // State for description
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch reported disasters from the backend
  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/disasters'); // Ensure this endpoint returns the reported disasters
        setDisasters(response.data); // Assuming response.data is an array of disaster objects
      } catch (err) {
        console.error('Error fetching disasters:', err);
        setError('Failed to load disasters. Please try again.');
      }
    };
    fetchDisasters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/resources/report', {
        name: resourceName, // Resource name
        type: resourceType, // Resource type (Offer/Request)
        quantity,
        location: selectedDisaster, // Use selected disaster as location for resource
        contactInfo, // Contact information
        description, // Description
        disasterId: selectedDisaster, // Assuming you're using the disaster's ID
      });

      setMessage(response.data.message); // Handle success response
      setError('');
      // Clear form fields
      setResourceName('');
      setResourceType('');
      setQuantity('');
      setContactInfo('');
      setDescription('');
      setSelectedDisaster('');
    } catch (err) {
      console.error('Error reporting resource:', err);
      setError('Failed to report resource. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Report a Resource</h2>
        <form onSubmit={handleSubmit}>
          <select 
            className={styles.input} 
            value={selectedDisaster} 
            onChange={(e) => setSelectedDisaster(e.target.value)} 
            required
          >
            <option value="">Select Reported Disaster</option>
            {disasters.map((disaster) => (
              <option key={disaster._id} value={disaster._id}>
                {disaster.location} - {disaster.type} ({disaster.status})
              </option>
            ))}
          </select>

          <input
            className={styles.input}
            type="text"
            placeholder="Resource Name"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            required
          />

          <select 
            className={styles.input} 
            value={resourceType} 
            onChange={(e) => setResourceType(e.target.value)} 
            required
          >
            <option value="">Select Type (Offer/Request)</option>
            <option value="Offer">Offer</option>
            <option value="Request">Request</option>
          </select>

          <input
            className={styles.input}
            type="number" // Use number for quantity
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Contact Info"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />

          <textarea
            className={styles.input}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button type="submit" className={styles.submit}>Report Resource</button>
        </form>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default ReportForm;
