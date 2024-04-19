import React, { useState } from 'react';
import './NavBar.css'; // Ensure this CSS file is properly linked
import Logo from "../../images/Logo.png";
import MenuIcon from "../../images/menu(white).png";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function NavBar() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { isAuthenticated, setIsAuthenticated } = useAuth();  // Simplified use of AuthContext

    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuVisible(prevState => !prevState);  // Correctly toggle the state
    };

    const handleLogout = async () => {
        console.log("Initiating logout process");
        const email = localStorage.getItem('email');
        const sessionID = localStorage.getItem('sessionID');
        const userID = localStorage.getItem('userID');
        console.log("Retrieved session data:", { email, sessionID, userID });

        const webServerUrl = "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442ac/backend/logout/logout.php";
        if (email && sessionID && userID) {
            console.log("Session data exists. Proceeding with logout.");
            try {
                const response = await fetch(webServerUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, sessionID, userID, action: 'logout' }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Logout response:", data);

                    localStorage.removeItem('email');
                    localStorage.removeItem('sessionID');
                    localStorage.removeItem('userID');

                    setIsAuthenticated(false);
                    navigate('/signinpage');
                } else {
                    console.error("Logout failed with status:", response.status, response.statusText);
                }
            } catch (error) {
                console.error('Logout error caught:', error);
            }
        } else{
            console.log("No active session found. Redirecting to login page.");
            const confirmRedirect = window.confirm("Sorry! This feature is only for sign-up users. Would you like to sign up?");
            if (confirmRedirect) {
                navigate('/signuppage');
            } else {
            }
        }
    };


    const handleNavigationAttempt = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            const confirmSignUp = window.confirm("Sorry! This feature is only for registered users. Would you like to sign up?");
            if (confirmSignUp) {
                navigate('/signuppage');
            }
        }
    };

    return (
        <nav className="navbar">
            <div>
                <img src={Logo} alt="Logo" className="navbar-logo" />
            </div>
            <div onClick={toggleMenu} className="navbar-menu-icon-container">
                <img src={MenuIcon} alt="Menu" className="navbar-menu-icon" />
            </div>
            <div className={`navbar-menu ${isMenuVisible ? 'active' : ''}`}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    <li>
                        <Link to="/homepage" className="navbar-menu-item">
                            Homepage
                        </Link>
                    </li>
                    <li onClick={() => handleNavigationAttempt('/saved')} style={{ cursor: 'pointer' }} className="navbar-menu-item">
                        Saved
                    </li>
                    <li onClick={() => handleNavigationAttempt('/accountsettings')} style={{ cursor: 'pointer' }} className="navbar-menu-item">
                        Account Settings
                    </li>
                    <li onClick={() => handleNavigationAttempt('/recommendpage')} style={{ cursor: 'pointer' }} className="navbar-menu-item">
                        Recommendation
                    </li>
                    <li onClick={handleLogout} style={{ cursor: 'pointer' }} className="navbar-menu-item">
                        Logout
                    </li>
                </ul>
            </div>
            {isMenuVisible && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    backgroundColor: 'white',
                    color: '#005bbb',
                    padding: '1.5rem',
                    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                    zIndex: 1
                }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{marginBottom: '0.5rem'}}>
                            <Link to="/homepage" style={{ color: '#005bbb', textDecoration: 'none' }}>
                                Homepage
                            </Link>
                        </li>
                        <li style={{marginBottom: '0.5rem'}}>
                            <Link to="/quizPage" style={{ color: '#005bbb', textDecoration: 'none' }}>
                                Quiz
                            </Link>
                        </li>

                        <li style={{marginBottom: '0.5rem'}}>Messages</li>
                        <li style={{marginBottom: '0.5rem'}}>Saved</li>
                        <li style={{marginBottom: '0.5rem'}}>
                            <Link to="/accountsettings" style={{ color: '#005bbb', textDecoration: 'none' }}>
                                Account Settings
                            </Link>
                        </li>
                        <li style={{marginBottom: '0.5rem'}}>
                            <button onClick={handleLogout} style={{ color: '#005bbb', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}

        </nav>
    );
}

export default NavBar;
