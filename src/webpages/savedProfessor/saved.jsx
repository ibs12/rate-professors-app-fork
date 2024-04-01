import React, { useState } from 'react';
import NavBar from '../navBar/NavBar';
import './saved.css';
import Default from '../../images/defaultPic.png';
import TrashPic from '../../images/trash_bin.png';

const Saved = () => {
  const [professors, setProfessors] = useState([
    {
        id: 1,
        name: 'John Doe',
        department: 'Computer Science',
        rating: '4.5',
        image: Default
    },
    {
        id: 2,
        name: 'Jane Smith',
        department: 'Mathematics',
        rating: '4.7',
        image: Default
    },
    {
        id: 3,
        name: 'William Johnson',
        department: 'Physics',
        rating: '4.2',
        image: Default
    }
  ]);

  const removeProfessor = (id) => {
    setProfessors(professors.filter(professor => professor.id !== id));
  };

  return (
    <div>
      <NavBar />
      <div className="page-content">
        <h1 className="page-title">Saved Professors</h1>
        <div className="saved-professors-container">
          {professors.map(professor => (
            <div key={professor.id} className="professor-card">
                <img src={professor.image} alt={professor.name} className="professor-image" />
                <div className="professor-info">
                    <h2 className="professor-name">{professor.name}</h2>
                    <p className="professor-department">{professor.department}</p>
                    <p className="professor-rating">Rating: {professor.rating}</p>
                </div>
                <img src={TrashPic} alt="Delete" className="delete-icon" onClick={() => removeProfessor(professor.id)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saved;
