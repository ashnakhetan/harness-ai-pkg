// Welcome.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css'; // Import your CSS file

function Welcome() {
  // Log the value of 
  console.log('GLOBAL_PROFILE_INFO:', localStorage.getItem('GLOBAL_PROFILE_INFO'));
  localStorage.removeItem('GLOBAL_PROFILE_INFO');

  return (
    <div className="Welcome-container center-40">
      <h1>Welcome to HarnessAI!</h1>
      <p>Let's Get Started</p>
      <Link to="/profiles">
        <button className="create-profile-button">Create Household Profile</button>
      </Link>
    </div>
  );
}

export default Welcome;
