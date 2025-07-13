// ✅ components/CourseCard.js

import '../styles/components/courseCard.css';


const CourseCard = ({ course, enrollCourse }) => {
  const categoryClass = `category-${course.Category.toLowerCase()}`;

  return (
    <div className="course-card">
      <div className="course-header">
        <h3 className="course-title">{course.Title}</h3>
        <span className={`course-category ${categoryClass}`}>{course.Category}</span>
      </div>

      <div className="course-content">
        <p className="course-description">{course.short_intro}</p>
      </div>

      <div className="course-actions">
        <button
          className="btn btn-outline"
          onClick={() => window.open(course.URL, '_blank')}
        >
          View Course
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            enrollCourse(course)}}
        >
          Enroll
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
