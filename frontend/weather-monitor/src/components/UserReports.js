import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './EnergyDashboard.module.css';  // Ensure this imports the CSS file

const UserReports = () => {
  const { user, isAuthenticated } = useAuth0();
  const [savedReports, setSavedReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user && user.name) {
      fetchSavedReports(user.name);
    } else {
      setError('User is not authenticated');
    }
  }, [isAuthenticated, user]);

  const fetchSavedReports = async (userName) => {
    try {
      const response = await axios.get(`http://localhost:5000/get-reports?userName=${userName}`);
      const reportsWithDetailsToggle = response.data.map((report) => ({
        ...report,
        showDetails: false,  // Add a showDetails property to each report
      }));
      setSavedReports(reportsWithDetailsToggle);
      setError(null);
    } catch (error) {
      console.error('Error fetching saved reports:', error);
      setError('Error fetching saved reports');
    }
  };

  const toggleDetails = (index) => {
    setSavedReports((prevReports) =>
      prevReports.map((report, idx) =>
        idx === index ? { ...report, showDetails: !report.showDetails } : report
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Solar Energy Reports</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      {savedReports.length > 0 ? (
        <ul className={styles.detailsContainer}>
          {savedReports.map((report, index) => (
            <li key={index} className={styles.inputContainer}>
              <div><strong>Location:</strong> {report.location}</div>
              <div><strong>Panel Type:</strong> {report.panelType}</div>
              <div><strong>Panel Count:</strong> {report.panelCount}</div>
              <div><strong>Monthly Energy:</strong> {report.monthlyEnergy.toFixed(2)} W</div>

              {/* Button to toggle visibility of Energy Production details */}
              <button 
                className={styles.button} 
                onClick={() => toggleDetails(index)}
              >
                {report.showDetails ? "Hide Details" : "View Details"}
              </button>

              {/* Conditionally display Energy Production details */}
              {report.showDetails && (
                <div className={styles.detailsContainer}>
                  <ul className={styles.table}>
                    <li><strong>Energy Production:</strong></li>
                    {report.energyProduction.map((energy, idx) => (
                      <li key={idx} className={styles.table}>
                        <div><strong>Time:</strong> {energy.time}</div>
                        <div><strong>Energy:</strong> {energy.energy.toFixed(2)} W</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No saved reports found.</p>
      )}
    </div>
  );
};

export default UserReports;
