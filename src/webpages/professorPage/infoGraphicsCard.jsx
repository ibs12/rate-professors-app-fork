import React from 'react';
import './infoGraphicsCard.css';  // Assuming you have styles defined here as previously described

const InfoGraphicsCard = ({ averageGPA }) => {
    return (
        <div className="info-graphics-card">
            <div class="info-graphics-card-header">Exclusive information</div>
            <div className="info-graphics-card-content">
                <div className="info-graphics-card-content">
                    <div className="info-graphics-item">
                        <p>Average GPA: {averageGPA}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoGraphicsCard;
