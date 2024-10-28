import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css'; // Import CSS Module

const images = [
  { src: 'https://media.istockphoto.com/id/1257951336/photo/transparent-umbrella-under-rain-against-water-drops-splash-background-rainy-weather-concept.jpg?s=612x612&w=0&k=20&c=lNvbIw1wReb-owe7_rMgW8lZz1zElqs5BOY1AZhyRXs=', alt: 'Image 1' },
  { src: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/beautiful-winter-mountain-scenery-sunset-with-snow-covered-trees-and-inversion-free-photo.jpg?w=600&quality=80', alt: 'Image 2' },
  { src: 'https://tentsupply.com/wp-content/uploads/tent-supply-windy.jpg', alt: 'Image 3' },
  { src: 'https://tse3.mm.bing.net/th?id=OIP.BMzBM_-rMoBo58OSntlAfgHaE8&pid=Api&P=0&h=180', alt: 'Image 4' },
  { src: 'https://wallpaperaccess.com/full/3956845.jpg', alt: 'Image 5' }
];

const Home = () => {
  const [startIndex, setStartIndex] = useState(0);
  const imagesToShow = 4;

  // Auto-slide function
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prevIndex) =>
        prevIndex + 1 >= images.length ? 0 : prevIndex + 1
      );
    }, 3000); // Slides every 3 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const nextImages = () => {
    setStartIndex((prevIndex) =>
      prevIndex + 1 >= images.length ? 0 : prevIndex + 1
    );
  };

  const prevImages = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const getDisplayedImages = () => {
    const displayedImages = [];
    for (let i = 0; i < imagesToShow; i++) {
      const imageIndex = (startIndex + i) % images.length; // Cycle through images circularly
      displayedImages.push(images[imageIndex]);
    }
    return displayedImages;
  };

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navbar}>
        <h1 className={styles.logo}>Weather Monitoring System</h1>
        <ul className={styles.navLinks}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/weather">Weather</Link></li>
          <li><Link to="/energy">Solar Energy</Link></li>
          <li><Link to="/wind">Wind Energy</Link></li>
          <li><Link to="/map">Map</Link></li>
        </ul>
      </nav>

      <div className={styles.content}>
        <div className={styles.introduction}>
          <h2>Welcome to the Weather Monitoring System</h2>
          <p>Get real-time weather updates for your location!Monitor solar energy and wind energy production based on your location's weather conditions</p>
        </div>

        <div className={styles.buttonContainer}>
          <Link to="/register">
            <button className={styles.styledButton}>Register</button>
          </Link>
          <Link to="/login">
            <button className={styles.styledButton}>Login</button>
          </Link>
        </div>

        {/* Image Slider */}
        <div className={styles.slider}>
          <button className={styles.sliderButton} onClick={prevImages}>‹</button>
          <div className={styles.sliderImageContainer}>
            {getDisplayedImages().map((image, index) => (
              <img key={index} src={image.src} alt={image.alt} className={styles.sliderImage} />
            ))}
          </div>
          <button className={styles.sliderButton} onClick={nextImages}>›</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
