// ✅ App.js (complete and working with Layout integration)
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Login from './auth/Login';
import Register from './auth/Register';
import DashboardPage from './pages/Dashboard';
import HomePage from './pages/HomePage';
import RecommendationsPage from './pages/RecommendationsPage';
import ProfilePage from './pages/ProfilePage';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import SettingsPage from './pages/Settings.js';

// Global / Layout styles
import './styles/layout/sidebar.css';
import './styles/layout/main.css';
import './styles/layout/header.css';

// Component styles
import './styles/components/courseCard.css';
import './styles/components/carousel.css';
import './styles/components/questionnaire.css';

// Utilities (variables, buttons, responsive, etc.)
import './styles/base/variables.css';
import './styles/utils/buttons.css';
import './styles/utils/responsive.css';

function App() {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [progress, setProgress] = useState({ Visual: 0, Auditory: 0, Kinesthetic: 0, General: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    if (token) {
      axios.get('http://localhost:5000/user-info', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          setUsername(res.data.username || 'User');
          setEnrolledCourses(res.data.enrolled_courses || []);
        })
        .catch(handleAuthError);

      axios.get('http://localhost:5000/progress', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setProgress(res.data))
        .catch(handleAuthError);

      axios.get('http://localhost:5000/recommend', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => setRecommendations(res.data))
        .catch(handleAuthError);

      setTrendingCourses([
        {
          Title: 'Advanced Deep Learning',
          Category: 'Visual',
          short_intro: 'Master deep learning techniques with real-world applications.'
        },
        {
          Title: 'Data Storytelling',
          Category: 'Auditory',
          short_intro: 'Communicate data insights effectively through narratives.'
        },
        {
          Title: 'Hands-on Robotics',
          Category: 'Kinesthetic',
          short_intro: 'Build robots and learn mechanical engineering by doing.'
        }
      ]);
    }

    setIsLoading(false);
  }, []);

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      alert('Session expired. Please log in again.');
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleEnrollCourse = async (course) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/enroll', { course }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Enrolled successfully:", res.data);
      alert(`Enrolled in "${course.Title}" successfully!`);
      if (!enrolledCourses.find(c => c.Title === course.Title)) {
        setEnrolledCourses(prev => [...prev, course]);
      }
    } catch (err) {
      console.error("❌ Enroll API failed:", err);
      alert("Enrollment failed. Please try again.");
    }
  };

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />}
        />
        {isAuthenticated && (
          <Route
            path="/*"
            element={
              <Layout logout={logout}>
                <Routes>
                       <Route
                    path="/"
                    element={<DashboardPage username={username} enrolledCourses={enrolledCourses} progress={progress} />}
                  />
                  <Route
                    path="/home"
                    element={
                      <HomePage
                        enrolledCourses={enrolledCourses}
                        recommendations={recommendations}
                        trendingCourses={trendingCourses}
                        setEnrolledCourses={setEnrolledCourses}
                        enrollCourse={handleEnrollCourse}
                      />
                    }
                  />
                  <Route
                    path="/recommendations"
                    element={
                      <RecommendationsPage
                        enrolledCourses={enrolledCourses}
                        setEnrolledCourses={setEnrolledCourses}
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProfilePage
                        username={username}
                        enrolledCourses={enrolledCourses}
                        progress={progress}
                      />
                    }
                  />
                  <Route
  path="/settings"
  element={
    isAuthenticated ? (
      <SettingsPage />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            }
          />
        )}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
