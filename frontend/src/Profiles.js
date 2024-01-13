// Profiles.js
import React, { useState, useEffect } from 'react';
import './Profiles.css'; // Import your CSS file

function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [profileType, setProfileType] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [allergies, setAllergies] = useState('');
  const [petType, setPetType] = useState('');
  const [specialConcerns, setSpecialConcerns] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSelectionMade, setIsSelectionMade] = useState(false);

  // Load profiles from local storage on component mount
  useEffect(() => {
    const savedProfiles = JSON.parse(localStorage.getItem('GLOBAL_PROFILE_INFO')) || [];
    setProfiles(savedProfiles);
  }, []); // Empty dependency array means this effect runs once on mount

  const handleProfileTypeChange = (event) => {
    setProfileType(event.target.value);
    setIsSelectionMade(!!event.target.value); // Set isSelectionMade to true if a value is selected
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  const handleAllergiesChange = (event) => {
    setAllergies(event.target.value);
  };

  const handlePetTypeChange = (event) => {
    setPetType(event.target.value);
  };

  const handleSpecialConcernsChange = (event) => {
    setSpecialConcerns(event.target.value);
  };

  const handleAddProfile = () => {
    setShowPopup(true);
  };

  const handleSaveProfile = () => {
    // Check if a valid selection is made before saving
    if (isSelectionMade) {
      // Save the new profile
      let newProfile;
      if (profileType === 'person') {
        newProfile = { type: 'person', name, age, allergies, specialConcerns };
      } else if (profileType === 'pet') {
        newProfile = { type: 'pet', name, petType, specialConcerns };
      }

      setProfiles((prevProfiles) => {
        const updatedProfiles = [...prevProfiles, newProfile];

        // Save data to local storage
        localStorage.setItem('GLOBAL_PROFILE_INFO', JSON.stringify(updatedProfiles));

        return updatedProfiles;
      });

      // Reset form fields
      setProfileType('');
      setName('');
      setAge('');
      setAllergies('');
      setPetType('');
      setSpecialConcerns('');

      // Close the popup
      setShowPopup(false);
    }
  };

  return (
    <div className="profiles-container">
      <h1 className="title">My Household</h1>
      <h2 className="subtitle">Please include everyone from your household</h2>
      <button className="continue-button">Continue to Harness</button>

      <table className="profiles-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Age</th>
            <th>Allergies</th>
            <th>Pet Type</th>
            <th>Special Concerns</th>
          </tr>
        </thead>
        <tbody>
          {/* Render profiles in the table */}
          {profiles.map((profile, index) => (
            <tr key={index}>
              <td>{profile ? profile.type || '' : ''}</td>
              <td>{profile ? profile.name || '' : ''}</td>
              <td>{profile ? profile.age || '' : ''}</td>
              <td>{profile ? profile.allergies || '' : ''}</td>
              <td>{profile ? profile.petType || '' : ''}</td>
              <td>{profile ? profile.specialConcerns || '' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-profile-button" onClick={handleAddProfile}>
        Add a Profile
      </button>

      {showPopup && (
        <div className="popup">
          <div>
            <label>
              Add a person or a pet:
              <br />
              <select value={profileType} onChange={handleProfileTypeChange}>
                <option value="">Selection</option>
                <option value="person">Person</option>
                <option value="pet">Pet</option>
              </select>
            </label>
          </div>

          {isSelectionMade && (
            <div>
              {profileType === 'person' && (
                <div>
                  <label>
                    Name:
                    <br />
                    <input type="text" value={name} onChange={handleNameChange} />
                  </label>
                  <br />
                  <label>
                    Age:
                    <br />
                    <input type="text" value={age} onChange={handleAgeChange} />
                  </label>
                  <br />
                  <label>
                    Any allergies:
                    <br />
                    <input type="text" value={allergies} onChange={handleAllergiesChange} />
                  </label>
                  <br />
                </div>
              )}

              {profileType === 'pet' && (
                <div>
                  <label>
                    Name:
                    <br />
                    <input type="text" value={name} onChange={handleNameChange} />
                  </label>
                  <br />
                  <label>
                    Type of pet:
                    <br />
                    <input type="text" value={petType} onChange={handlePetTypeChange} />
                  </label>
                  <br />
                </div>
              )}

              <label>
                Special Concerns:
                <br />
                <input type="text" value={specialConcerns} onChange={handleSpecialConcernsChange} />
              </label>
              <br />

              <button className="save-profile-button" onClick={handleSaveProfile} disabled={!isSelectionMade}>
                Save Profile
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Profiles;
