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
    professorType: '',
    comment: ''
  });
  const [charCount, setCharCount] = useState(0);
  const [profName, setProfName] = useState('');
  const [department, setDepartment] = useState('');
  const [pfppath, setPfppath] = useState('');

  useEffect(() => {
    const [profNameParam, departmentParam,path] = name.split('+');
    setProfName(profNameParam);
    setDepartment(departmentParam);
    setPfppath(path);
  }, [name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    if (!formData.course || !formData.term || !formData.difficulty || !formData.helpfulness || !formData.clarity || !formData.feedback || !formData.comment) {
      alert('You must fill out all fields.');
      return;
    }
    navigate(`/professor/${profName+'+'+department+'+'+pfppath}`);
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
        professorType: '',
        comment: ''
      });
      setCharCount(0);
      navigate(`/professor/${profName+'+'+department+'+'+pfppath}`);
    }
  };


  return (
    <div className="review-form-container">
      <div className="professor-info-">
        <img src={importProfessorImage(pfppath)}  alt="Professor" className="professor-image" />
        <div className="professor-details">
        <p><strong>Name:</strong> {profName}</p>
            <p><strong>Department:</strong> {department}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="course">Course:</label>
          <select id="course" name="course" value={formData.course} onChange={handleInputChange}>
            <option value="">-- Select Course --</option>
            <option value="add">Add Course</option>
          </select>
          {formData.course === 'add' && (
            <input type="text" name="newCourse" placeholder="Enter new course" value={formData.newCourse} onChange={handleInputChange} />
          )}
        </div>
        <div className="form-group">
          <label htmlFor="term">Term:</label>
          <select id="term" name="term" value={formData.term} onChange={handleInputChange}>
            <option value="">-- Select Term --</option>
            <option value="add">Add Term</option>
          </select>
          {formData.term === 'add' && (
            <input type="text" name="newTerm" placeholder="Enter new term" value={formData.newTerm} onChange={handleInputChange} />
          )}
        </div>
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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

        <div className="form-group">
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