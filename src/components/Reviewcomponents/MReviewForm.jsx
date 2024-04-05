import React, { useState, useEffect } from 'react';
import { useParams,useNavigate} from 'react-router-dom';
import './MReviewForm.css';
import defaultPic from './Unknown.jpeg';

const importProfessorImage = (imagePath) => {
  try {
    const images = require.context('../../images/professorpfp', false, /\.(png|jpe?g|svg)$/);
    return images(`./${imagePath}`);
  } catch (error) {
    return defaultPic;
  }
};

const MReviewForm = ({ professorImage }) => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [formData, setFormData] = useState({
    course: '',
    term: '',
    difficulty: '',
    helpfulness: '',
    clarity: '',
    feedback: '',
    accessibility: '',
    comment: ''
  });
  const [charCount, setCharCount] = useState(0);
  const [profName, setProfName] = useState('');
  const [department, setDepartment] = useState('');
  const [pfppath, setPfppath] = useState('');
  const [ID, setProid] = useState('');

  useEffect(() => {
    const [profNameParam, departmentParam, path,ID] = name.split('+');
    setProfName(profNameParam);
    setDepartment(departmentParam);
    setPfppath(path);
    setProid(ID);
  }, [name]);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  if (name === 'comment' && value.length > 500) {
    return; 
  }
  setFormData({
    ...formData,
    [name]: value
  });
  if (name === 'comment') {
    setCharCount(value.length);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.course || !formData.term || !formData.difficulty || !formData.helpfulness || !formData.clarity || !formData.feedback || !formData.accessibility|| !formData.comment) {
      alert('You must fill out all fields.');
      return;
    }

    const reviewData = {
      userID: localStorage.getItem('userID'), // Assuming you store userID in localStorage after login
      professorID: ID, // Assuming professorID is derived from pfppath
      difficulty: formData.difficulty,
      helpfulness: formData.helpfulness,
      clarity: formData.clarity,
      Feedback_Quality: formData.feedback, // Assuming it's Feedback_Quality in PHP
      accessibility: formData.accessibility, // You need to handle this in your form
      comment: formData.comment,
      course: formData.course === 'add' ? formData.newCourse : formData.course, // If course is 'add', use newCourse, otherwise use course
      term: formData.term === 'add' ? formData.newTerm : formData.term // If term is 'add', use newTerm, otherwise use term
    };


    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    fetch(`${apiUrl}/backend/createReview/createReview.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('sessionID')}` // Assuming you have a sessionID after login
      },
      body: JSON.stringify(reviewData)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to submit review');
        }
      })
      .then(data => {
        // Handle success response, if needed
        alert('Review submitted successfully');
        navigate(`/professor/${profName + '+' + department + '+' + pfppath+ '+' +ID}`);
      })
      .catch(error => {
        // Handle error
        console.error('Review submission error:', error);
        alert('Failed to submit review. Please try again.');
      });
    };

  const handleCancel = () => {
    const confirmation = window.confirm("This review will not save. Are you sure you want to cancel?");
    if (confirmation) {
      setFormData({
        course: '',
        term: '',
        difficulty: '',
        helpfulness: '',
        clarity: '',
        feedback: '',
        accessibility: '',
        comment: ''
      });
      setCharCount(0);
      navigate(`/professor/${profName + '+' + department + '+' + pfppath+'+'+ID}`);
    }
  };


  return (
    <div className="review-form-container">
      <div className="professor-info-">
        <img src={importProfessorImage(pfppath)}  alt="Professor" className="professor-image-" />
        <div className="professor-details">
        <p><strong>Name:</strong> {profName}</p>
            <p><strong>Department:</strong> {department}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="review-page-form-group">
          <label htmlFor="course">Course:</label>
          <select id="course" name="course" value={formData.course} onChange={handleInputChange}>
            <option value="">-- Select Course --</option>
            <option value="add">Add Course</option>
          </select>
          {formData.course === 'add' && (
            <input type="text" name="newCourse" placeholder="Enter new course" value={formData.newCourse} onChange={handleInputChange} />
          )}
        </div>
        <div className="review-page-form-group">
          <label htmlFor="term">Term:</label>
          <select id="term" name="term" value={formData.term} onChange={handleInputChange}>
            <option value="">-- Select Term --</option>
            <option value="add">Add Term</option>
          </select>
          {formData.term === 'add' && (
            <input type="text" name="newTerm" placeholder="Enter new term" value={formData.newTerm} onChange={handleInputChange} />
          )}
        </div>
        <div className="review-page-form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
            <option value="">-- Select Difficulty --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="review-page-form-group">
          <label htmlFor="helpfulness">Helpfulness:</label>
          <select id="helpfulness" name="helpfulness" value={formData.helpfulness} onChange={handleInputChange}>
            <option value="">-- Select Helpfulness --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="review-page-form-group">
          <label htmlFor="clarity">Clarity:</label>
          <select id="clarity" name="clarity" value={formData.clarity} onChange={handleInputChange}>
            <option value="">-- Select Clarity --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="review-page-form-group">
          <label htmlFor="feedback">Feedback:</label>
          <select id="feedback" name="feedback" value={formData.feedback} onChange={handleInputChange}>
            <option value="">-- Select Feedback --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="review-page-form-group">
              <label htmlFor="accessibility">Accessibility:</label>
              <select id="accessibility" name="accessibility" value={formData.accessibility} onChange={handleInputChange}>
                <option value="">-- Select Accessibility: --</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

        <div className="review-page-form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea id="comment" name="comment" value={formData.comment} onChange={handleInputChange} />
          <div className="char-count">Character count: {charCount}/500</div>
        </div>
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default MReviewForm; 