import React from 'react';
import { Link } from 'react-router-dom';
import styles from './About.module.css'; // Import CSS Module

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Weather Monitoring System</h1>
        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/weather">Weather</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
        </ul>
      </nav>

      <div className={styles.cardContainer}>
  <div className={styles.card}>
    <h2>About Us</h2>
    <p>
      Our Weather Monitoring System is designed to deliver real-time weather data 
      to help you stay ahead of any changes. From temperature and humidity updates 
      to rainfall and wind forecasts, we provide detailed insights for your location.
    </p>
  </div>
  
  <div className={styles.card}>
    <h2>Our Technology</h2>
    <p>
      We use state-of-the-art sensors and APIs to collect and present accurate weather 
      information. By leveraging advanced weather models, we aim to provide forecasts 
      that are reliable and precise.
    </p>
  </div>
  
  <div className={styles.card}>
    <h2>Why Choose Us?</h2>
    <p>
      Whether you're planning an event, managing crops, or preparing for your commute, 
      our system ensures you have the weather data you need. With easy access and regular 
      updates, you can make informed decisions anytime.
    </p>
  </div>
  
  <div className={styles.card}>
    <h2>Community & Support</h2>
    <p>
      We're committed to making weather information accessible to everyone. If you have 
      questions or need assistance, our support team is always ready to help. Your feedback 
      also drives our improvements to serve you better.
    </p>
  </div>
</div>

      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h3>Our Mission</h3>
          <p>To empower people with reliable weather data for informed decisions.</p>
        </div>
        <div className={styles.card}>
          <h3>Technology Stack</h3>
          <p>We use the MERN stack with data from OpenWeather API to provide accurate weather updates.</p>
        </div>
        <div className={styles.card}>
          <h3>Meet the Team</h3>
          <p>Our team consists of developers, meteorologists, and data analysts working together.</p>
        </div>
        <div className={styles.card}>
          <h3>Contact Us</h3>
          <p>Have any questions? Reach out to us at <strong>support@weathermonitor.com</strong>.</p>
        </div>
      </div>
    </div>
  );
};

export default About;
