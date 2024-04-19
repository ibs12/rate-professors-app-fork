import React, { useState } from 'react';
import NavBar from '../navBar/NavBar';
import './accountsettings.css';
import defaultProfilePic from "../../images/eye.png";
import { useNavigate } from 'react-router-dom';

const AccountSettingsPage = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [major, setMajor] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [currentname, setCurrentName] = useState('');
    const [name, setName] = useState('');
    const [coursesTaken, setCoursesTaken] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const quizResult = localStorage.getItem('quizResult') || 'No quiz result yet';
    const [isPasswordSection, setIsPasswordSection] = useState(true); 

    const handleProfilePicChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setProfilePic(fileUrl);
        }
    };

    const handleDeleteAccount = () => {
        setIsModalOpen(true);
    };

    const navigate = useNavigate();

    const handleResetPassword = () => {
        const sessionId = localStorage.getItem('sessionID');
        const oldPassword = currentPassword;
        const newPasswordValue = newPassword; // Rename variable to avoid shadowing
    
        const confirmPassword = confirmNewPassword;
    
        if (newPasswordValue !== confirmPassword) {
            alert("New password and confirm password do not match.");
            return;
        }
    
        const data = {
            sessionID: sessionId,
            oldpassword: oldPassword,
            newpassword: newPasswordValue // Use the correct variable here
        };
        console.log("Data sent to backend:", data); // Print out the data
    
        const backendUrl = 'http://localhost:8000/backend/changePassword/changePassword.php';
    
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Password changed successfully');
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Change password error:', error);
            alert(`Failed to change password: ${error.message}`);
        });
    };
    

    const toggleSection = () => {
        setIsPasswordSection(prev => !prev);
    };

    const handleConfirmDelete = () => {
        const email = localStorage.getItem('email');
        const sessionId = localStorage.getItem('sessionID');
        const userID = localStorage.getItem('userID');

        const data = {
            email,
            sessionId,
            userID
        };

        const backendUrl = 'http://localhost:8000/backend/removeuser/remove.php';
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Account successfully deleted');
                navigate('/signuppage');
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Delete account error:', error);
            alert(`Failed to delete account: ${error.message}`);
        });

        setIsModalOpen(false);
    };

    const handleChangeUsername = () => {
        const sessionId = localStorage.getItem('sessionID');
        const newUsername = name;

        const data = {
            sessionID: sessionId,
            username: newUsername
        };
        console.log("Data sent to backend:", data); // Print out the data

        const backendUrl = 'http://localhost:8000/backend/changeUsername/changeUsername.php';
        fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update username');
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                alert('Username updated successfully');
            } else {
                throw new Error(data.message || 'Unknown error occurred');
            }
        })
        .catch(error => {
            console.error('Update username error:', error);
            alert(`Failed to update username: ${error.message}`);
        });
    };

    const handleSaveChanges = () => {
        if (isPasswordSection) {
            handleResetPassword();
        } else {
            handleChangeUsername();
        }
    };

    const SimpleModal = ({ isOpen, onClose, onConfirm }) => {
        if (!isOpen) return null;

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2>Are you sure you want to delete your account?</h2>
                    <div className="modal-actions">
                        <button onClick={onConfirm} className="modal-button confirm">Yes</button>
                        <button onClick={onClose} className="modal-button cancel">No</button>
                    </div>
                </div>
            </div>
        );
    };

    const handleRetakeQuiz = () =>{
        navigate('/quizPage');  // Navigate to the quiz page
    }

    return (
        <div className="main-container">
            <NavBar />
            <div className="left-side">
                <div className="profile-pic-container">
                    <label htmlFor="profile-upload" style={{ cursor: 'pointer' }}>
                        <img src={profilePic || defaultProfilePic} alt="Profile" className="profile-image" />
                        <div className="upload-text">Upload a picture</div>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfilePicChange}
                        />
                    </label>
                </div>
                <div className="field-container">
                    <input
                        type="text"
                        placeholder="Major"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="text-field"
                    />
                    <input
                        type="text"
                        placeholder="Graduation Year"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="text-field"
                    />
                    <label className="text-field">Quiz Result: {quizResult}</label>
                </div>
                <div >
                    <button classname = "retake-quiz-button" onClick= {handleRetakeQuiz}>
                        Retake Quiz?
                    </button>
                </div>
                <div className="delete-account-container">
                    <button className="delete-account-button" onClick={handleDeleteAccount}>
                        Delete Account
                    </button>
                </div>
            </div>
            <SimpleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
            />
            <div className="right-side">
                <div className='field-group'>
                    <label className="field-label">Current Username:</label>
                    <input
                        type="text"
                        placeholder="Name"
                        value={currentname}
                        onChange={(e) => setCurrentName(e.target.value)}
                        className="text-field"
                    />
                </div>

                <div className='field-group'>
                    <label className="field-label">Courses Taken:</label>
                    <input
                        type="text"
                        placeholder="Courses Taken"
                        value={coursesTaken}
                        onChange={(e) => setCoursesTaken(e.target.value)}
                        className="text-field"
                    />
                </div>

                <hr className="divider" />
                <div className="section-toggle-buttons">
                    <button className={isPasswordSection ? 'active' : ''} onClick={toggleSection}>
                        Change Password
                    </button>
                    <button className={!isPasswordSection ? 'active' : ''} onClick={toggleSection}>
                        Update Username
                    </button>
                </div>
                {isPasswordSection && (
                    <div className="password-change-section">
                        <div className='field-group'>
                            <label className="field-label">Current Password:</label>
                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="text-field"
                            />
                        </div>
                        <div className='field-group'>
                            <label className="field-label">New Password:</label>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="text-field"
                            />
                        </div>
                        <div className='field-group'>
                            <label className="field-label">Confirm New Password:</label>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="text-field"
                            />
                        </div>
                    </div>
                )}
                {!isPasswordSection && (
                    <div className="username-update-section">
                        <div className='field-group'>
                            <label className="field-label">New Username:</label>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="text-field"
                            />
                        </div>
                    </div>
                )}
                <div className="button-container">
                    <button className="save-button" onClick={handleSaveChanges}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccountSettingsPage;
