import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './disaster.module.css'; // Import CSS module
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Import the useAuth0 hook
import LogOut from './LogOut';

const DisasterList = () => {
    const [disasters, setDisasters] = useState([]); // Store disaster reports
    const [filteredDisasters, setFilteredDisasters] = useState([]); // Store filtered disasters
    const [resources, setResources] = useState({}); // Store resources by disaster ID
    const [error, setError] = useState(''); // Error handling
    const [selectedType, setSelectedType] = useState('- Any -'); // Store selected disaster type
    const { loginWithRedirect, user, isAuthenticated } = useAuth0(); 

    useEffect(() => {
        // Fetch all disasters from the backend
        const fetchDisasters = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/disasters');
                setDisasters(response.data);
                setFilteredDisasters(response.data); // Initialize filtered disasters

                // Fetch resources for each disaster after fetching disasters
                response.data.forEach(disaster => {
                    fetchResources(disaster._id);
                });
            } catch (err) {
                console.error('Error fetching disasters:', err);
                setError('Failed to load disasters. Please try again.');
            }
        };
        fetchDisasters();
    }, []);

    // Fetch resources for a specific disaster by its ID
    const fetchResources = async (disasterId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/disasters/${disasterId}/resources`);
            setResources((prevResources) => ({
                ...prevResources,
                [disasterId]: response.data, // Store resources under disaster ID
            }));
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('');
        }
    };

    // Filter disasters based on selected type
    const handleFilterChange = (event) => {
        const type = event.target.value;
        setSelectedType(type);
        if (type === '- Any -') {
            setFilteredDisasters(disasters); // Show all disasters if no filter
        } else {
            const filtered = disasters.filter(disaster => disaster.type === type);
            setFilteredDisasters(filtered); // Update the displayed disasters
        }
    };

    return (
        <div className={styles.homeContainer}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <h1 className={styles.logo}>Weather Monitoring System</h1>
                <ul className={styles.navLinks}>
                    <li><Link to="/resource">Resource</Link></li>
                    <li><Link to="/disaster">Report a Disaster</Link></li>
                    <li><Link to="/real">Across world</Link></li>
                    
                    {isAuthenticated && user ? (
                        <div className={styles.userProfile}>
                            <img
                                src={user.picture} // Use the user's profile picture
                                alt="User Profile"
                                className={styles.profileImage} // Class for styling
                            />
                            <LogOut /> 
                        </div>
                    ) : (
                        <button className={styles.styledButton} onClick={() => loginWithRedirect()}>
                            Login
                        </button>
                    )}
                </ul>
            </nav>

            {/* Filter Dropdown */}
            <div className={styles.filterContainer}>
                <label htmlFor="disasterType">Filter by type of disaster:</label>
                <select id="disasterType" value={selectedType} onChange={handleFilterChange}>
                    <option value="- Any -">- Any -</option>
                    <option value="Conflict">Conflict</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Disease">Disease</option>
                    <option value="Drought">Drought</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Famine">Famine</option>
                    <option value="Flood">Flood</option>
                    <option value="Hunger">Hunger</option>
                    <option value="Hurricane">Hurricane</option>
                    <option value="Pandemic">Pandemic</option>
                    <option value="Refugee">Refugee</option>
                    <option value="Tsunami">Tsunami</option>
                    <option value="Typhoon">Typhoon</option>
                </select>
            </div>

            {/* Disaster Cards */}
            <div className={styles.cardContainer}>
                <h2 className={styles.title}>Disaster Reports</h2>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <div className={styles.cards}>
                    {filteredDisasters.length > 0 ? (
                        filteredDisasters.map((disaster) => (
                            <div key={disaster._id} className={styles.card}>
                                <h3>{disaster.location}</h3>
                                <p><strong>Type:</strong> {disaster.type}</p>
                                <p><strong>Status:</strong> {disaster.status}</p>
                                <p><strong>Description:</strong> {disaster.description}</p>
                                <p><strong>Date:</strong> {new Date(disaster.date).toLocaleString()}</p>

                                {/* Display Resources if Available */}
                                {resources[disaster._id] && (
                                    <div className={styles.resourceList}>
                                        <h4>Resources:</h4>
                                        {resources[disaster._id].length > 0 ? (
                                            resources[disaster._id].map((resource) => (
                                                <div key={resource._id} className={styles.resourceItem}>
                                                    <p><strong>Name:</strong> {resource.name}</p>
                                                    <p><strong>Type:</strong> {resource.type}</p>
                                                    <p><strong>Quantity:</strong> {resource.quantity}</p>
                                                    <p><strong>Location:</strong> {resource.location}</p>
                                                    <p><strong>Contact Info:</strong> {resource.contactInfo}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No resources available for this disaster.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No disaster reports available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DisasterList;
