// ✅ CourseCarousel.js (fully functional)

import React, { useState, useEffect, useRef } from 'react';
import '../styles/components/carousel.css';
//import '../styles/components/courseCard.css';

const CourseCarousel = ({ title, courses, enrollCourse }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef(null);

  const getVisibleItems = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 992) return 2;
    return 3;
  };

  const [visibleItems, setVisibleItems] = useState(getVisibleItems());

  useEffect(() => {
    const handleResize = () => {
      setVisibleItems(getVisibleItems());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!courses || courses.length <= visibleItems) return;
    const interval = setInterval(() => handleNext(), 7000);
    return () => clearInterval(interval);
  }, [currentIndex, courses, visibleItems]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, courses.length - visibleItems);
    setCurrentIndex(prev => (prev + 1 > maxIndex ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) handleNext();
    if (touchStart - touchEnd < -150) handlePrev();
  };

  const categoryClass = (category) => `category-${category?.toLowerCase() || 'general'}`;

  if (!courses || courses.length === 0) {
    return (
      <div className="carousel-section">
        <h2 className="section-title">{title}</h2>
        <p>No courses available</p>
      </div>
    );
  }

  return (
    <div className="carousel-section">
      <h2 className="section-title">{title}</h2>
      <div className="carousel-container">
        <div
          className="carousel-wrapper"
          ref={carouselRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            width: `${(courses.length / visibleItems) * 100}%`
          }}
        >
          {courses.map((course, index) => (
            <div key={index} className="carousel-card">
              <div className="course-card">
                <div className="course-header">
                  <h3 className="course-title">{course.Title}</h3>
                  <span className={`course-category ${categoryClass(course.Category)}`}>
                    {course.Category}
                  </span>
                </div>
                <div className="course-content">
                  <p className="course-description">{course.short_intro}</p>
                </div>
                <div className="course-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => alert(`Viewing course: ${course.Title}`)}
                  >
                    View Course
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (typeof enrollCourse === 'function') {
                        console.log("Enroll button clicked", course);
                        enrollCourse(course);
                      }
                    }}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-controls">
          <button
            className="carousel-button"
            onClick={handlePrev}
            disabled={courses.length <= visibleItems}
          >
            ←
          </button>
          <button
            className="carousel-button"
            onClick={handleNext}
            disabled={courses.length <= visibleItems}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
