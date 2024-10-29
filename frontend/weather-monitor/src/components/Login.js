import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './Login.module.css'; // Assuming you save the CSS in a file named Login.module.css

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get the message from local storage
    const loginMessage = localStorage.getItem('loginMessage');
    if (loginMessage) {
      setMessage(loginMessage);
      localStorage.removeItem('loginMessage'); // Clear message after displaying
    }
  }, []);

  return (
    <div className={styles.form}>
      <div className={styles.formCard}>
        <h2>Login Page</h2>
        {message && <p>{message}</p>} {/* Display the message if it exists */}
        <button className={styles.submit} onClick={loginWithRedirect}>Log In</button>
        <div className={styles.signin}>
          <p>Don't have an account? <a href="/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
