// ✅ Updated ProfilePage.js with certificate submission logic and learning journey chart

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import '../styles/page/profile.css';

const ProfilePage = ({ username, enrolledCourses, progress }) => {
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [certificateLink, setCertificateLink] = useState('');
  const [chartData, setChartData] = useState([]);
  const [updatedCourses, setUpdatedCourses] = useState([]);
  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/profile", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    const coursesWithStatus = (data.enrolled_courses || []).map(course => ({
      ...course,
      status: course.status || "ongoing"
    }));

    setUpdatedCourses(coursesWithStatus);

    const learningStats = {
      Visual: 0,
      Auditory: 0,
      Kinesthetic: 0,
      General: 0
    };
    coursesWithStatus.forEach(course => {
      learningStats[course.Category] += 1;
    });

    setChartData(Object.keys(learningStats).map(key => ({
      name: key,
      value: learningStats[key]
    })));
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleCertificateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCourse || !certificateLink) {
      alert("Please select a course and provide a certificate link");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/complete-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          course_title: selectedCourse,
          certificate_link: certificateLink
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Course marked as completed!");
        setShowCertificateForm(false);
        setSelectedCourse("");
        setCertificateLink("");
        fetchProfileData();
      } else {
        alert(data.error || "Failed to complete course");
      }
    } catch (error) {
      console.error("Error completing course:", error);
      alert("Failed to complete course. Please try again.");
    }
  };

  const ongoingCourses = updatedCourses.filter(course => course.status === "ongoing");
  const completedCourses = updatedCourses.filter(course => course.status === "completed");

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-section enrolled-courses">
          <div className="enrolled-header">
            <h2 className="section-title">Your Ongoing Courses</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCertificateForm(true)}
              disabled={ongoingCourses.length === 0}
            >
              Complete a Course
            </button>
          </div>

          {showCertificateForm && (
            <div className="certificate-form-container">
              <form onSubmit={handleCertificateSubmit} className="certificate-form">
                <h3>Submit Course Certificate</h3>

                <div className="form-group">
                  <label>Select Course:</label>
                  <select 
                    value={selectedCourse} 
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    required
                  >
                    <option value="">-- Select a course --</option>
                    {ongoingCourses.map((course, index) => (
                      <option key={index} value={course.Title}>{course.Title}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Certificate Link or Code:</label>
                  <input 
                    type="text" 
                    value={certificateLink}
                    onChange={(e) => setCertificateLink(e.target.value)}
                    placeholder="https://example.com/certificate or code"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-outline" onClick={() => setShowCertificateForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {ongoingCourses.length > 0 ? (
            <div className="enrolled-courses-list">
              {ongoingCourses.map((course, index) => (
                <div key={index} className="enrolled-course-card">
                  <div className="course-info">
                    <h3 className="course-title">{course.Title}</h3>
                    <span className={`course-category category-${course.Category.toLowerCase()}`}>{course.Category}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-courses-message">
              You don't have any ongoing courses.
              <br /><a href="/recommendations">Explore courses</a> to start your learning journey!
            </p>
          )}
        </div>

        <div className="profile-section completed-courses">
          <h2 className="section-title">Your Completed Courses</h2>

          {completedCourses.length > 0 ? (
            <div className="completed-courses-list">
              {completedCourses.map((course, index) => (
                <div key={index} className="completed-course-card">
                  <div className="course-info">
                    <h3 className="course-title">{course.Title}</h3>
                    <span className={`course-category category-${course.Category.toLowerCase()}`}>{course.Category}</span>
                    <span className="course-status status-completed">Completed</span>
                  </div>

                  {course.certificate_link && (
                    <div className="certificate-info">
                      <a 
                        href={course.certificate_link.startsWith('http') ? course.certificate_link : '#'} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="certificate-link"
                      >
                        {course.certificate_link.startsWith('http') ? 'View Certificate' : `Certificate Code: ${course.certificate_link}`}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-courses-message">
              You haven't completed any courses yet.
              <br />Complete your ongoing courses to see them here.
            </p>
          )}
        </div>

        <div className="profile-section learning-chart">
          <h2 className="section-title">Your Learning Journey</h2>
          <div className="chart-container">
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
