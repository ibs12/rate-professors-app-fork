import React, { useState } from 'react';
import './NavBar.css'; // Ensure this CSS file is properly linked
import Logo from "../../images/Logo.png";
import MenuIcon from "../../images/menu(white).png";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function NavBar() {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const { setIsAuthenticated } = useAuth();
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

        const webServerUrl = "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442ac"
        const apiUrl = "http://localhost:8000";
        if (email && sessionID && userID) {
            console.log("Session data exists. Proceeding with logout.");
            try {
                const response = await fetch(`${webServerUrl}/backend/logout/logout.php`, {
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
        } else {
            console.log("No active session found. Redirecting to login page.");
            navigate('/signinpage');
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
                    <li>
                        <Link to="/saved" className="navbar-menu-item">
                            Saved
                        </Link>
                    </li>
                    <li>
                        <Link to="/accountsettings" className="navbar-menu-item">
                            Account Settings
                        </Link>
                    </li>
                    <li className="navbar-menu-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                        Logout
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
