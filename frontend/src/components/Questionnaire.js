import React, { useState } from 'react';
import axios from 'axios';
import '../styles/components/questionnaire.css';
import CourseCard from './CourseCard'; // To reuse consistent card format

const Questionnaire = ({ onClose, onRecommend }) => {
  const [form, setForm] = useState({
    study_level: '',
    domain: '',
    knowledge_level: '',
    learning_style: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);

    axios
      .post('http://localhost:5000/questionnaire-recommend', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        onRecommend(res.data);      // Pass results to parent
        onClose();                  // Close modal
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="questionnaire-modal-overlay">
      <div className="questionnaire-modal">
        <h2>Find the Right Course for You</h2>
        <form onSubmit={handleSubmit} className="questionnaire-form">
          <label>Highest Level of Study:</label>
          <select name="study_level" onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option>High School</option>
            <option>Undergraduate</option>
            <option>Postgraduate</option>
          </select>

          <label>Interested Domain:</label>
          <select name="domain" onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option>Machine Learning</option>
            <option>Data Analysis</option>
            <option>Business Essentials</option>
          </select>

          <label>Level of Knowledge:</label>
          <select name="knowledge_level" onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <label>Preferred Learning Style:</label>
          <select name="learning_style" onChange={handleChange} required>
            <option value="">-- Select --</option>
            <option>Visual</option>
            <option>Auditory</option>
            <option>Kinesthetic</option>
            <option>General</option>
          </select>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendations'}
          </button>
        </form>

        <button className="btn btn-outline" onClick={onClose} style={{ marginTop: '20px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Questionnaire;
