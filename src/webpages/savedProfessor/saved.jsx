import React from 'react';
import NavBar from '../navBar/NavBar';
import './saved.css';
import Default from '../../images/defaultPic.png';

const Saved = () => {
  const professors = [
    {
        id: 1,
        name: 'John Doe',
        department: 'Computer Science',
        rating: '4.5',
        image: Default // Placeholder image
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
  ];

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Saved;
