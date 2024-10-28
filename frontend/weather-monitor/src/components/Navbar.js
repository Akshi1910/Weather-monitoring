import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.css'; // Add CSS for the navbar

const Navbar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username'); // Retrieve username from localStorage

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('username'); // Clear username
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className={styles.navbar}>
      {username && <p className={styles.welcome}>Welcome, {username}!</p>}
      <button className={styles.logout} onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
