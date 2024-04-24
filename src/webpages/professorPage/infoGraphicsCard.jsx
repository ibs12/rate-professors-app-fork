import React from 'react';
import './infoGraphicsCard.css'; 

const InfoGraphicsCard = ({ 
    difficultyAverage,
    feedbackQualityAverage,
    accessibilityAverage,
    clarityAverage,
    helpfulnessAverage,
    averageGrade
}) => {
    // Function to handle null values
    const renderValue = (value) => {
        return value !== null ? value : '-/5';
    };

    // Function to handle null average grade
    const renderGrade = (grade) => {
        return grade !== null ? grade : '-';
    };

    return (
        <div className="info-graphics-card">
            <div className="info-graphics-card-header">Exclusive information</div>
            <div className="info-graphics-card-content">
                <div className="info-graphics-item">
                    <p>Average Difficulty: {renderValue(difficultyAverage)}</p>
                </div>
                <div className="info-graphics-item">
                    <p>Average Feedback Quality: {renderValue(feedbackQualityAverage)}</p>
                </div>
                <div className="info-graphics-item">
                    <p>Average Accessibility: {renderValue(accessibilityAverage)}</p>
                </div>
                <div className="info-graphics-item">
                    <p>Average Clarity: {renderValue(clarityAverage)}</p>
                </div>
                <div className="info-graphics-item">
                    <p>Average Helpfulness: {renderValue(helpfulnessAverage)}</p>
                </div>
                <div className="info-graphics-item">
                    <p>Average Grade: {renderGrade(averageGrade)}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoGraphicsCard;
