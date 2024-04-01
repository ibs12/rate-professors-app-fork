import React, { useState, useEffect } from 'react';

import NavBar from '../navBar/NavBar';
import './saved.css';
import Default from '../../images/defaultPic.png';
import TrashPic from '../../images/trash_bin.png';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const importProfessorImage = (imagePath) => {
  try {
    const images = require.context('../../images/professorpfp', false, /\.(png|jpeg|svg)$/);
    return images(`./${imagePath}`);
  } catch (error) {
      console.error('Failed to import image:', error);
      return Default;
  }
  };

const Saved = () => {
    const [professors, setProfessors] = useState([]);

    useEffect(() => {
        const userID = localStorage.getItem('userID'); // Get sessionID from local storage

        if (!userID) {
            console.error('Session ID not found');
            return;
        }

        const fetchSavedProfessors = async () => {
            const requestBody = { userID: userID, action: 'fetch' }; // Add action 'fetch'

            const response = await fetch(`${apiUrl}/backend/saveProfessor/fetchSaved.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                console.error('Failed to fetch saved professors');
                return;
            }

            const data = await response.json();
            console.log(data);

            if (data.saved_professors) {
                setProfessors(data.saved_professors);
            } else {
                console.error('No saved professors found');
            }
        };
        fetchSavedProfessors();
    }, []);
  return (
    <div>
        <NavBar />
        <div className="page-content">
            <h1 className="page-title">Saved Professors</h1>
            <div className="saved-professors-container">
                {professors.map((professor, index) => (
                    <div key={index} className="professor-card">
                        <img src={importProfessorImage(professor.pfppath)} alt="Professor" className="professor-img" />
                        <div className="professor-info">
                            <h2 className="professor-name">{professor.professors}</h2>
                            <p className="professor-department">{professor.department}</p>
                            {/* Assuming you have a rating value in your professor object */}
                            <p className="professor-rating">Rating: {professor.rating || 'Not Rated'}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>

      </div>
  );
};

export default Saved;
