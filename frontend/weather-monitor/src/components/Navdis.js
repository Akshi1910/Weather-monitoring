import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Import the useAuth0 hook
import LogOut from './LogOut'; // Import the LogOut component
import styles from './Home.module.css';

const Navdis = () => {
  const { loginWithRedirect, user, isAuthenticated } = useAuth0(); // Get user info
  const [dropdownOpen, setDropdownOpen] = useState(false); 
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev); // Toggle dropdown
  };
 
 
  return (
    <div>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Weather Monitoring System</h1>
        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/my">Weather</Link></li>
          <li><Link to="/m">Active Disaster</Link></li>
          <li><Link to="/n">Alerts</Link></li>
        
          {isAuthenticated && user ? (
            <div className={styles.userProfile}>
              <img
                src={user.picture} // User's profile picture
                alt="User Profile"
                className={styles.profileImage} // Class for styling
                onClick={toggleDropdown} // Toggle dropdown on click
              />
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <LogOut /> {/* Include the logout component here */}
                </div>
              )}
            </div>
          ) : (
            <button className={styles.styledButton} onClick={() => loginWithRedirect()}>
              Login
            </button>
          )}
        </ul>
      </nav>
</div>
  );
};

export default Navdis;

