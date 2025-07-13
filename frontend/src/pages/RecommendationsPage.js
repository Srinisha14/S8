// ✅ pages/RecommendationsPage.js

import React, { useState } from 'react';
import axios from 'axios';
import SearchInput from '../components/SearchInput';
import CourseCard from '../components/CourseCard';
import Questionnaire from '../components/Questionnaire';
import '../styles/page/recommendation.css';

const RecommendationsPage = ({ enrolledCourses, setEnrolledCourses }) => {
  const [query, setQuery] = useState('');
  const [vakg, setVakg] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);

  const handleSearch = (page = 1, searchQuery = query) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let url = `http://localhost:5000/search?query=${encodeURIComponent(searchQuery)}&page=${page}`;
    if (vakg.length > 0) {
      vakg.forEach(style => {
        url += `&vakg=${encodeURIComponent(style)}`;
      });
    }

    axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setCourses(res.data.courses);
      setTotalPages(res.data.total_pages);
      setCurrentPage(res.data.current_page);
    })
    .catch(err => console.error(err));
  };

  const enrollCourse = (course) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.post('http://localhost:5000/enroll', { course }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert('Enrolled successfully!');
      setEnrolledCourses([...enrolledCourses, { ...course, progress: 0 }]);
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="recommendations-page">
      <div className="search-container">
        <div className="search-header">
          <h2 className="section-title">Find Courses</h2>
          <button
            className="btn btn-secondary help-button"
            onClick={() => setShowQuestionnaire(true)}
          >
            Don't know what to choose?
          </button>
        </div>

        <SearchInput
          initialQuery={query}
          onSearch={(searchQuery) => {
            setQuery(searchQuery);
            handleSearch(1, searchQuery);
          }}
        />

        <div className="filter-group">
          {['Visual', 'Auditory', 'Kinesthetic', 'General'].map(style => (
            <label key={style} className="filter-label">
              <input
                type="checkbox"
                value={style}
                checked={vakg.includes(style)}
                onChange={e => {
                  setVakg(e.target.checked
                    ? [...vakg, style]
                    : vakg.filter(v => v !== style))
                }}
              />
              {style}
            </label>
          ))}
        </div>
      </div>

      {showQuestionnaire && (
        <Questionnaire
          onClose={() => setShowQuestionnaire(false)}
          onRecommend={(recommended) => {
            setCourses(recommended);
            setCurrentPage(1);
            setTotalPages(1);
          }}
        />
      )}

      <h2 className="section-title">Search Results</h2>
      <div className="course-grid">
        {courses.length > 0 ? courses.map((course, index) => (
          <CourseCard key={index} course={course} enrollCourse={enrollCourse} />
        )) : <p>No courses found matching your criteria.</p>}
      </div>

      {courses.length > 0 && (
        <div className="pagination">
          <button
            disabled={currentPage <= 1}
            onClick={() => handleSearch(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => handleSearch(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
