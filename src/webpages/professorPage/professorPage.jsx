import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfessorCard.css';
import NavBar from '../navBar/NavBar';
import defaultPic from "../../images/defaultPic.png";
import savedIcon from "../../images/saved_icon.png";
import savedIconColored from "../../images/saved_icon_colored.png";

const webServerUrl = process.env.REACT_APP_WEB_SERVER_URL
const apiUrl = process.env.REACT_APP_API_BASE_URL;


const importProfessorImage = (imagePath) => {
    try {
      const images = require.context('../../images/professorpfp', false, /\.(png|jpe?g|svg)$/);
      return images(`./${imagePath}`);
    } catch (error) {
        console.error('Failed to import image:', error);
        return defaultPic;
    }
  };
  
const ProfessorCard = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const [profname, setProfName] = useState('');
    const [profdepartment, setProfDepartment] = useState('');
    const [ID, setProid] = useState('');
    const [isSaved, setIsSaved] = useState(false);



    const [pfppath, setPfppath] = useState('');


    const [professorInfo, setProfessorInfo] = useState({
        name: '',
        department: '',
        profilePicture: '',
        rating: 0,
        reviews: []
    });

    useEffect(() => {
        fetchProfessorInfo(name);
    }, [name]);
    
    const fetchProfessorInfo = (Data) => {
        const [name, department,path,ID] = Data.split('+');
        setProfName(name);
        setProfDepartment(department);
        setPfppath(path);
        setProid(ID)
        setTimeout(() => {
            setProfessorInfo({
                name: name,
                department: department,
                profilePicture: '',
                rating: 4.5,
                reviews: [
                    { author: "John Doe", content: "Great professor!", rating: 5, term: "Fall 2023", course: "CS101" },
                    { author: "Jane Smith", content: "Very knowledgeable", rating: 4, term: "Spring 2022", course: "CS202" }
                ]
            });
        }, 1000);
    };

    const toggleSave = () => {
        // Retrieve session ID from local storage
        const sessionID = localStorage.getItem('sessionID');
    
        // If session ID is not found, handle the error
        if (!sessionID) {
            console.error('Session ID not found in local storage');
            return;
        }
    
        // Construct the request body
        const requestBody = {
            sessionID: sessionID,
            professorName: profname, // Assuming profname contains the professor's name
            action: isSaved ? 'remove' : 'save'
        };
    
        // Send request to backend
        fetch(`${apiUrl}/backend/saveProfessor/saveList.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                // Update saved status based on response
                setIsSaved(!isSaved);
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    

    const handleWriteReview = () => {
        navigate(`/review/${profname+'+'+profdepartment+'+'+pfppath+'+'+ID}`);
    };
    const sortReviews = (sortBy) => {
        const sortedReviews = [...professorInfo.reviews].sort((a, b) => {
            if (sortBy === "rating") {
                return b.rating - a.rating; // For descending order
            } else if (sortBy === "author") {
                return a.author.localeCompare(b.author); // For alphabetical order
            }
            return 0;
        });

        setProfessorInfo({ ...professorInfo, reviews: sortedReviews });
    };

    const Review = ({ author, content, rating, term, course }) => {
        return (
            <div className="review">
                <div className="review-header">
                    <h4>{author}</h4>
                    <span>{term} - {course}</span>
                    <span>Rating: {rating}</span>
                </div>
                <p>{content}</p>
            </div>
        );
    };

    return (
        <div className='professor-main'>
            <NavBar/>
            <div className="professor-card">
                <img
                    src={isSaved ? savedIconColored : savedIcon}
                    alt="Save Professor"
                    className="saved-icon"
                    onClick={toggleSave}
                />

                <img src={importProfessorImage(pfppath)} alt="Professor" className="professor-img" />
                <div className="professor-info">
                    <h2>{professorInfo.name}</h2>
                    <p>{professorInfo.department}</p>
                </div>
                <div className="professor-rating">
                    <span>{professorInfo.rating}/5</span>
                </div>
            </div>
            <div className='sort-button-container'>
                <button className='sort-button' onClick={() => sortReviews("rating")}>Sort by Rating</button>
                <button className='sort-button' onClick={() => sortReviews("author")}>Sort by Author</button>
            </div>

            {/* Render the sorted reviews */}
            <div className="reviews">
                {professorInfo.reviews.map((review, index) => (
                    <Review
                        key={index}
                        author={review.author}
                        content={review.content}
                        rating={review.rating}
                        term={review.term}
                        course={review.course}
                    />
                ))}
            </div>

            {/* Write a review button */}
            <div className="write-review-container">
                <button className="write-review-button" onClick={handleWriteReview}>Write a Review</button>
            </div>
        </div>
    );
};

export default ProfessorCard;
