// LogOut.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

function LogOut() {
  const { logout } = useAuth0();

  return (
    <button 
      onClick={() => logout({ returnTo: 'https://localhost:3000' })} // Make sure to use HTTP
      className="logoutButton" // Add your CSS class here if you want to style it
    >
      Log Out
    </button>
  );
}

export default LogOut;
