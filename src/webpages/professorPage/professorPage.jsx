import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProfessorCard.css';
import NavBar from '../navBar/NavBar';
import defaultPic from "../../images/defaultPic.png";
import savedIcon from "../../images/saved_icon.png";
import savedIconColored from "../../images/saved_icon_colored.png";

const webServerUrl = "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442ac"
const apiUrl = "http://localhost:8000";

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
        checkSavedStatus(name);
    }, [name]);

    const fetchProfessorInfo = (Data) => {
        const [name, department, path, ID] = Data.split('+');
        setProfName(name);
        setProfDepartment(department);
        setPfppath(path);
        setProid(ID);
    
        const request = {
            professorID: ID
        };
    
        fetch(`${webServerUrl}/backend/searchFilter/searchprofessorreviews.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
            })
            .then(data => {
                console.log('Fetched reviews:', data);
                const updatedReviews = data.map(review => {
                    // Extract individual ratings
                    const { Feedback_Quality, accessibility, clarity, difficulty, helpfulness } = review;
    
                    // Calculate average rating
                    const totalRating = parseInt(Feedback_Quality) + parseInt(accessibility) + parseInt(clarity) + parseInt(difficulty) + parseInt(helpfulness);
                    const averageRating = totalRating / 5; // Assuming 5 attributes
    
                    // Update review object with average rating
                    return {
                        ...review,
                        rating: averageRating
                    };
                });
    
                const filteredReviews = updatedReviews.filter(review => review.professorID === ID);
                setProfessorInfo({
                    name: name,
                    department: department,
                    profilePicture: '',
                    rating: 5, // You may want to calculate the overall rating based on all reviews
                    reviews: filteredReviews
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
        const checkSavedStatus = (Data) => {
            const [name, department, path, ID] = Data.split('+');
            setProfName(name);
            setProfDepartment(department);
            setPfppath(path);
            setProid(ID);
        const sessionID = localStorage.getItem('sessionID');
    
        // If session ID is not found, handle the error
        if (!sessionID) {
            console.error('Session ID not found in local storage');
            return;
        }
    
        const requestBody = {
            sessionID: sessionID,
            professorID: ID 
        };
    
        console.log('Request Body:', requestBody); // Print requestBody
    
        fetch(`${webServerUrl}/backend/saveProfessor/checkSavedStatus.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            setIsSaved(data.isSaved);
            console.log('Fetched saved status:', data); // Print fetched data
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
    
    const toggleSave = () => {
        const sessionID = localStorage.getItem('sessionID');

        if (!sessionID) {
            console.error('Session ID not found in local storage');
            return;
        }

        const requestBody = {
            sessionID: sessionID,
            professorName: profname,
            action: isSaved ? 'remove' : 'save'
        };

        fetch(`${webServerUrl}/backend/saveProfessor/saveList.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
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
                return b.rating - a.rating;
            } else if (sortBy === "author") {
                return a.author.localeCompare(b.author);
            }
            return 0;
        });

        setProfessorInfo({ ...professorInfo, reviews: sortedReviews });
    };

    const Review = ({ author, comment, rating, term, course }) => {
        return (
            <div className="profile-page-review">
                <div className="profile-page-review-header">
                    <h4>Anonymous</h4>
                    <span>{term} - {course}</span>
                    <span>Rating: {rating}</span>
                </div>
                <p>{comment}</p>
            </div>
        );
    };

    return (
        <div className='profile-page-professor-main'>
            <NavBar/>
            <div className="profile-page-professor-card">
                <img
                    src={isSaved ? savedIconColored : savedIcon}
                    alt="Save Professor"
                    className="profile-page-saved-icon"
                    onClick={toggleSave}
                />
                <img src={importProfessorImage(pfppath)} alt="Professor" className="profile-page-professor-img" />
                <div className="profile-page-professor-info">
                    <h2>{professorInfo.name}</h2>
                    <p>{professorInfo.department}</p>
                </div>
                <div className="profile-page-professor-rating">
                    <span>{professorInfo.rating}/5</span>
                </div>
            </div>
            <div className='profile-page-sort-button-container'>
                <button className='profile-page-sort-button' onClick={() => sortReviews("rating")}>Sort by Rating</button>
                <button className='profile-page-sort-button' onClick={() => sortReviews("author")}>Sort by Author</button>
            </div>

            <div className="profile-page-reviews">
                {professorInfo.reviews.length === 0 ? (
                    <p>No Reviews</p>
                ) : (
                    professorInfo.reviews.map((review, index) => (
                        <Review
                            key={index}
                            author={review.author}
                            comment={review.comment}
                            rating={review.rating}
                            term={review.term}
                            course={review.course}
                        />
                    ))
                )}
            </div>

            <div className="profile-page-write-review-container">
                <button className="profile-page-write-review-button" onClick={handleWriteReview}>Write a Review</button>
            </div>
        </div>
    );
};

export default ProfessorCard;