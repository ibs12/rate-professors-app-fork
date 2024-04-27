import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewForm.css';
import defaultPic from './Unknown.jpeg';

const importProfessorImage = (imagePath) => {
  try {
    const images = require.context('../../images/professorpfp', false, /\.(png|jpe?g|svg)$/);
    return images(`./${imagePath}`);
  } catch (error) {
    return defaultPic;
  }
};

const ReviewForm = ({ professorImage }) => {
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
    comment: '',
    coursePrefix: '',
    courseNumber: '',
    grade:''
  });
  const [charCount, setCharCount] = useState(0);
  const [profName, setProfName] = useState('');
  const [department, setDepartment] = useState('');
  const [pfppath, setPfppath] = useState('');
  const [ID, setProid] = useState('');
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState(['Spring', 'Summer', 'Fall', 'Winter']);
  const [coursePrefixes, setCoursePrefixes] = useState([]);
  const [courseNumbers, setCourseNumbers] = useState([]);
  const [currentname, setCurrentName] = useState('');
  const [major, setMajor] = useState('');


  useEffect(() => {
    const [profNameParam, departmentParam, path, ID] = name.split('+');
    setProfName(profNameParam);
    setDepartment(departmentParam);
    setPfppath(path);
    setProid(ID);

    // Fetch years from 2000 to 2023
    const yearsArray = [];
    for (let i = 2024; i >= 2000; i--) {
      yearsArray.push(i.toString());
    }
    setYears(yearsArray);

    // Set the course prefixes
    const prefixes = [
      'AAS',
      'ASL',
      'AMS',
      'APY',
      'ARI',
      'ARC',
      'ART',
      'AHI',
      'AS',
      'BCH',
      'BIO',
      'BE',
      'BMI',
      'BMS',
      'STA',
      'CE',
      'CHE',
      'CHI',
      'CIE',
      'CL',
      'COM',
      'CDS',
      'CHB',
      'COL',
      'CDA',
      'CSE',
      'CPM',
      'CEP',
      'DAC',
      'ECO',
      'ELP',
      'EE',
      'EAS',
      'ENG',
      'ELI',
      'EVS',
      'END',
      'ES',
      'FR',
      'MGG',
      'GEO',
      'GLY',
      'GER',
      'GGS',
      'GR',
      'GRE',
      'HEB',
      'HIN',
      'HIS',
      'HON',
      'IDS',
      'IE',
      'ITA',
      'JPN',
      'JDS',
      'KOR',
      'LAT',
      'LLS',
      'LAW',
      'LAI',
      'ULC',
      'LIS',
      'LIN',
      'MGA',
      'MGT',
      'MGE',
      'MGF',
      'MGI',
      'MGM',
      'MGO',
      'MGQ',
      'MGS',
      'MDI',
      'MTH',
      'MAE',
      'DMS',
      'MT',
      'MCH',
      'MIC',
      'MLS',
      'MUS',
      'MTR',
      'NRS',
      'NMD',
      'NTR',
      'OT',
      'MGB',
      'PAS',
      'PHC',
      'PMY',
      'PHM',
      'PHI',
      'PHY',
      'PGY',
      'POL',
      'PS',
      'PSC',
      'PSY',
      'PUB',
      'REC',
      'NBC',
      'RLL',
      'RUS',
      'SSC',
      'SW',
      'SOC',
      'SPA',
      'TH',
      'NBS',
      'UGC',
      'UE',
      'NSG',
      'YID'
    ];
    
    setCoursePrefixes(prefixes);
  }, [name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Limit course number to 3 characters
    if (name === 'newCourse') {
      const newValue = value.replace(/\D/g, '').slice(0, 3); // Remove non-numeric characters and limit to 3 characters
      setFormData({
        ...formData,
        [name]: newValue
      });
    } else if (name === 'comment' && value.length > 500) {
      return;
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  
    if (name === 'comment') {
      setCharCount(value.length);
    }
  
    if (name === 'semester' || name === 'year') {
      setFormData(prevFormData => ({
        ...prevFormData,
        term: prevFormData.semester && prevFormData.year ? `${prevFormData.semester} ${prevFormData.year}` : ''
      }));
    }
  
    // Handle course prefix selection
    if (name === 'coursePrefix') {
      // Update course prefix state
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
    if (name === 'grade') {
      setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };
  

  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (formData.course === 'add' && (!formData.coursePrefix||!formData.newCourse || formData.newCourse.trim() === '')) ||
      !formData.course ||
      !formData.term ||
      !formData.difficulty ||
      !formData.helpfulness ||
      !formData.clarity ||
      !formData.feedback ||
      !formData.accessibility ||
      !formData.grade ||
      !formData.comment
    ) {
      alert('You must fill out all fields.');
      return;
    }


  
    const reviewData = {
      userID: localStorage.getItem('userID'), // Assuming you store userID in localStorage after login
      professorID: ID, // Assuming professorID is derived from pfppath
      author: currentname,
      authormajor: major,
      difficulty: formData.difficulty,
      helpfulness: formData.helpfulness,
      clarity: formData.clarity,
      Feedback_Quality: formData.feedback, // Assuming it's Feedback_Quality in PHP
      accessibility: formData.accessibility, // You need to handle this in your form
      comment: formData.comment,
      grade: formData.grade,
      course: formData.course === 'add' ? `${formData.coursePrefix} ${formData.newCourse}` : formData.course,
      term: formData.term === 'add' ? formData.newTerm : formData.term // If term is 'add', use newTerm, otherwise use term
    };
    const webServerUrl = 'https://www-student.cse.buffalo.edu/CSE442-542/2024-Spring/cse-442ac';
    const apiUrl = 'http://localhost:8000';
    console.log(formData);

    fetch(`${webServerUrl}/backend/createReview/createReview.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('sessionID')}` // Assuming you have a sessionID after login
      },
      body: JSON.stringify(reviewData)
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to submit review');
        }
      })
      .then((data) => {
        // Handle success response, if needed
        alert('Review submitted successfully');
        navigate(`/professor/${profName + '+' + department + '+' + pfppath + '+' + ID}`);
      })
      .catch((error) => {
        // Handle error
        console.error('Review submission error:', error);
        alert('Failed to submit review. Please try again.');
      });
  };

  const handleCancel = () => {
    const confirmation = window.confirm(
      'This review will not save. Are you sure you want to cancel?'
    );
    if (confirmation) {
      setFormData({
        course: '',
        term: '',
        difficulty: '',
        helpfulness: '',
        clarity: '',
        feedback: '',
        professorType: '',
        comment: '',
        grade:'',
      });
      setCharCount(0);
      navigate(`/professor/${profName + '+' + department + '+' + pfppath + '+' + ID}`);
    }
  };

  return (
    <div className="review-page-review-form-container">
      <div className="review-page-flex-container">
        <div className="review-page-comment-section">
          <form onSubmit={handleSubmit} className="review-page-review-form">
            <div className="review-page-form-group">
              <label htmlFor="course">Course:</label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
              >
                <option value="">-- Select Course --</option>
                <option value="add">Add Course</option>
              </select>
              {formData.course === 'add' && (
                <div>
                  <div className="review-page-form-group">
                    <select
                      id="coursePrefix"
                      name="coursePrefix"
                      value={formData.coursePrefix}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Select Course Prefix --</option>
                      {coursePrefixes.map((prefix) => (
                        <option key={prefix} value={prefix}>
                          {prefix}
                        </option>
                      ))}
                    </select>
                  </div>
                  {formData.course === 'add' && (
                <input
                  type="text"
                  name="newCourse"
                  placeholder="Enter the course number(Only 3 number)"
                  value={formData.newCourse}
                  onChange={handleInputChange}
                  style={{ width: '95.5%' }}
                />
              )}
                </div>
              )}

            </div>
            <div className="review-page-form-group">
              <label htmlFor="term">Term:</label>
              <div className="term-dropdowns">
                <select id="semester" name="semester" value={formData.semester} onChange={handleInputChange}>
                  <option value="">-- Select Semester --</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
                <select id="year" name="year" value={formData.year} onChange={handleInputChange}>
                  <option value="">-- Select Year --</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {formData.term === 'add' && (
                <input
                  type="text"
                  name="newTerm"
                  placeholder="Enter new term"
                  value={formData.newTerm}
                  onChange={handleInputChange}
                />
              )}
            </div>
            <div className="review-page-form-group">
              <label htmlFor="difficulty">Ease of Class:</label>
              <select id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                <option value="">-- Select Ease of Class: --</option>
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
              <label htmlFor="grade">Final Grade:</label>
              <select id="grade" name="grade" value={formData.grade} onChange={handleInputChange}>
                <option value="">-- Select Final Grade: --</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D+">D+</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
          </form>
        </div>
        <div className="review-page-professor-info">
          <img src={importProfessorImage(pfppath)} alt="Professor" className="review-page-professor-image" />
          <div className="review-page-professor-details">
            <p><strong>Name:</strong> {profName}</p>
            <p><strong>Department:</strong> {department}</p>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="review-page-comment-form">
        <div className="review-page-form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea id="comment" name="comment" value={formData.comment} onChange={handleInputChange} />
          <div className="review-page-char-count">Character count: {charCount}/500</div>
        </div>
        <div className="review-page-form-buttons">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;