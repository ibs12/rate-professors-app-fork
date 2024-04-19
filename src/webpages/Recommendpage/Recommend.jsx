import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Default from '../../images/defaultPic.png';
import { useNavigate } from 'react-router-dom';
import './Recommend.css';
import NavBar from '../navBar/NavBar';

const apiUrl = "http://localhost:8000"; // Assuming your backend runs on localhost port 8000

const importProfessorImage = (imagePath) => {
    try {
        const images = require.context('../../images/professorpfp', false, /\.(png|jpe?g|svg)$/);
        return images(`./${imagePath}`);
    } catch (error) {
        return Default;
    }
};

// Recursive function to remove 'Department of' prefix from all departments
const removeDepartmentPrefix = (department) => {
    if (department.startsWith('Department of')) {
        return removeDepartmentPrefix(department.replace(/^Department of\s+/i, ''));
    }
    return department;
};

const RecommendedProfessorsPage = () => {
    const navigate = useNavigate();
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [professorsData, setProfessorsData] = useState([]);
    const [quizPromptVisible, setQuizPromptVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userID = localStorage.getItem('userID');
                console.log('User ID sent to backend:', userID);

                const response = await fetch(`${apiUrl}/backend/recommendProfessors/recommendByType.php`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userID })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                console.log('Received professor data:', data);

                // Process department names to remove 'Department of' prefix from all departments
                data.professors.forEach(professor => {
                    professor.Department = professor.Department.split(';').map(dept => removeDepartmentPrefix(dept.trim())).join('; ');
                });

                if (data.message === 'Quiz result not found for the given user ID.') {
                    setQuizPromptVisible(true);
                    const interval = setInterval(() => {
                        setCountdown(prevCountdown => prevCountdown - 1);
                    }, 1000);
                    setTimeout(() => {
                        clearInterval(interval);
                        navigate('/quizpage');
                    }, 3000);
                } else {
                    setProfessorsData(data.professors);
                }
                setIsLoading(false); // Update loading state
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleDepartmentChange = (event) => {
        setSelectedDepartment(event.target.value);
    };

    const filteredProfessors = selectedDepartment
        ? professorsData.filter(professor =>
            professor.Department.split(';').some(dept => dept.trim() === selectedDepartment)
        )
        : professorsData;

    return (
        <div>
            <NavBar />
            <div className="recommended-professors-page-content">
                <h1 className="recommended-professors-page-title">Recommended Professors</h1>
                {isLoading && ( // Display loading prompt if isLoading is true
                    <p>In the process of generating your personalized recommended professors...</p>
                )}
                {quizPromptVisible && !isLoading && (
                    <div className="quiz-prompt">
                        <p>It seems you haven't completed the quiz yet.</p>
                        <p>Redirecting to the quiz page in {countdown} seconds...</p>
                    </div>
                )}
                {!quizPromptVisible && !isLoading && (
                    <div>
                        <label htmlFor="departmentFilter">Filter by Department:</label>
                        <select id="departmentFilter" value={selectedDepartment} onChange={handleDepartmentChange}>
                            <option value="">All Departments</option>
                            {[...new Set(professorsData.flatMap(professor => professor.Department.split(';').map(dept => dept.trim())))].map((department, index) => (
                                <option key={index} value={department}>{department}</option>
                            ))}
                        </select>
                    </div>
                )}
                {!quizPromptVisible && !isLoading && (
                    <div className="recommended-professors-container">
                        {filteredProfessors.map((professor, index) => (
                            <div key={index} className="recommended-professor-cards">
                                <div className="recommended-professor-infos-container">
                                    <img
                                        src={importProfessorImage(professor.PfpPath.split('/').pop())}
                                        alt="Professor"
                                        className="recommended-professor-img"
                                        onError={(e) => e.target.src = Default}
                                    />
                                    <div className="recommended-professor-infos">
                                        <Link
                                            to={{
                                                pathname: `/professor/${professor.Name + '+' + professor.Department + '+' + professor.PfpPath.split('/').pop() + '+' + professor.ProfessorID}`
                                            }}
                                        >
                                            {professor.Name}
                                        </Link>
                                        <p className="recommended-professor-department">{professor.Department}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendedProfessorsPage;
