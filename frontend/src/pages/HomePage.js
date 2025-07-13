// ✅ pages/HomePage.js

import React from 'react';
import CourseCarousel from '../components/CourseCarousel';
import '../styles/page/dashboard.css';
// import '../styles/components/courseCard.css';
// import '../styles/components/carousel.css';

const HomePage = ({ recommendations, trendingCourses, enrollCourse }) => {
  return (
    <div className="dashboard">
      <div className="dashboard-main">
        <CourseCarousel
          title="Recommended For You"
          courses={recommendations}
          enrollCourse={enrollCourse}
        />

        <CourseCarousel
          title="Trending Courses"
          courses={trendingCourses}
          enrollCourse={enrollCourse}
        />
      </div>
    </div>
  );
};

export default HomePage;
