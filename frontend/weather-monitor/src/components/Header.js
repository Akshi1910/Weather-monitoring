// components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogOut from './LogOut';
import UserProfile from './UserProfile';
import styles from './header.module.css';

const Header = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <header className={styles.header}>
      <h1 className={styles.appTitle}>Weather & Disaster App</h1>
      <nav className={styles.nav}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/weather">Weather</Link>
        <Link to="/energy">Solar Energy</Link>
        <Link to="/wind">Wind Energy</Link>
        <Link to="/map">Map</Link>
        
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.profileContainer}>
              <img src={user.picture} alt="User" className={styles.profileImage} />
              <div className={styles.profileInfo}>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
              <LogOut className={styles.logoutButton} />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
