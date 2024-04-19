import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './QuizPage.css';
import questions from './questions.jsx';
import rick from '../../images/tenor.gif';


const Quiz = () => {
  const [answers, setAnswers] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [showTable, setShowTable] = useState(false); // State to control table visibility

  const navigate = useNavigate(); // Use the useNavigate hook

  const webServerUrl = "https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442ac"
  const apiUrl = "http://localhost:8000";

  const addToProfile = () => {
    const sessionID = localStorage.getItem('sessionID');
    if (sessionID) {
      fetch(`${webServerUrl}/backend/saveQuiz/savequiz.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionID: sessionID,
          quizResult: result,
        }),
      })
        .then(response => {
          if (response.ok) {
            alert('Result added to profile!');
            navigate('/homepage');
          } else {
            throw new Error('Failed to save quiz result');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to save quiz result');
        });
    } else {
      alert('SessionID not found');
    }
  };
  // Questions array remains the same...

  const handleSelectOption = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const calculateResult = () => {
    if (Object.keys(answers).length !== questions.length) {
      setErrorMessage('Please fill out all the questions');
      return;
    }

    setErrorMessage('');
    alert("Great! We're now in the process of referring you to a professor");
    navigate('/homepage');
  };

  const handleDecline = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='quiz-main'>
      <div className="quiz-container">
        <div className="quiz-header">Let's find your type of professor!</div>
        <p>Embarking on your educational path is not just about choosing the right courses; it's also about connecting with the right mentors...</p>

        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <div className="question">{q.question}</div>
            <div className="options">
              {q.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  className={`option-button ${answers[index] === option.charAt(0) ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(index, option.charAt(0))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button className="submit-btn" onClick={calculateResult}>Submit</button>
        <button className="submit-btn" onClick={handleDecline}>Decline</button>

        {errorMessage && <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{errorMessage}</div>}

        {showPopup && (
          <div className="popup">
            <img src={rick} alt="Rick Roll" />
            <p>Once again, this quiz helps us find a suitable professor for you!</p>
            <button onClick={handleClosePopup}>Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

