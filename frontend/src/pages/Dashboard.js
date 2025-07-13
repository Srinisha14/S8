// ✅ Updated DashboardPage.js with pie chart, circular timer, and resume buttons
import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import '../styles/page/dashboard1.css';

const DashboardPage = ({ username, enrolledCourses, progress }) => {
  const [timeSpent, setTimeSpent] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [styleData, setStyleData] = useState([]);
const totalMinutes = Math.floor(timeSpent / 60);
const hours = Math.floor(totalMinutes / 60);
const minutes = totalMinutes % 60;

useEffect(() => {
  const username = localStorage.getItem('username');
  if (username) {
    const savedTime = localStorage.getItem(`timeSpent_${username}`);
    if (savedTime) {
      setTimeSpent(parseInt(savedTime, 10));
    }
  }
}, []);

useEffect(() => {
  const username = localStorage.getItem('username');
  if (!username) return;

  const interval = setInterval(() => {
    setTimeSpent(prev => {
      const updated = prev + 1;
      localStorage.setItem(`timeSpent_${username}`, updated.toString());
      return updated;
    });
  }, 1000);

  return () => clearInterval(interval);
}, []);


// useEffect(() => {
//   if (!enrolledCourses || enrolledCourses.length === 0) return;

//   const completed = enrolledCourses.filter(c => c.status === 'completed').length;
//   const ongoing = enrolledCourses.filter(c => c.status !== 'completed').length;

//   setPerformanceData([
//     { name: 'Completed', value: completed },
//     { name: 'Ongoing', value: ongoing }
//   ]);
// }, [enrolledCourses]);


  useEffect(() => {
    const chart = Object.entries(progress).map(([name, value]) => ({ name, value }));
    setStyleData(chart);
  }, [progress]);

  const ongoingCount = enrolledCourses.filter(c => c.status !== 'completed').length;
  const completedCount = enrolledCourses.filter(c => c.status === 'completed').length;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  useEffect(() => {
  const data = [
    { name: 'Week 1', value: 20 },
    { name: 'Week 2', value: 30 },
    { name: 'Week 3', value: 91 },
    { name: 'Week 4', value: 45 },
    { name: 'Week 5', value: 12 },
  ];
  setPerformanceData(data);
}, []);


  return (
    <div className="dashboard-container">
      <h1 className="welcome">Welcome back, {username}!</h1>

      <div className="stats-row">
        <div className="progress-group">
          <div className="progress-box colorful">
            <CircularProgressbar
              value={ongoingCount}
              maxValue={enrolledCourses.length || 1}
              text={`${ongoingCount}`}
              styles={buildStyles({ pathColor: '#3498db', textColor: '#3498db', trailColor: '#ecf0f1' })}
            />
            <p>Ongoing Courses</p>
          </div>
          <div className="progress-box colorful">
            <CircularProgressbar
              value={completedCount}
              maxValue={enrolledCourses.length || 1}
              text={`${completedCount} / ${enrolledCourses.length}`}
              styles={buildStyles({ pathColor: '#2ecc71', textColor: '#2ecc71', trailColor: '#ecf0f1' })}
            />
            <p>Completed Courses</p>
          </div>
          
          <div className="progress-box colorful">
            <CircularProgressbar
              value={Math.min(timeSpent, 3600)}
              maxValue={3600}
              text={`${Math.floor(timeSpent / 3600)}h ${(Math.floor(timeSpent / 60) % 60)}m`}
              styles={buildStyles({ pathColor: '#9b59b6', textColor: '#9b59b6', trailColor: '#ecf0f1' })}
            />
            <p>Time Spent</p>
          </div>
        </div>

        <div className="stat-box">
          <h3>Learning Progress by Style</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={styleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {styleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-box">
        <h3>Performance Overview</h3>
        {performanceData.length > 0 && performanceData.some(d => d.value > 0) && (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={performanceData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#3498db"
        strokeWidth={3}
        dot={{ r: 4 }}
      />
    </LineChart>
  </ResponsiveContainer>
)}

      </div>

      <div className="continue-box">
        <h3>Continue Learning</h3>
        <div className="continue-list">
          {enrolledCourses.filter(c => c.status !== 'completed').map((course, index) => (
            <div className="continue-card wide" key={index}>
              <div className="card-body">
                <div>
                  <h4>{course.Title}</h4>
                  <p>{course.short_intro}</p>
                  <span className={`course-category category-${course.Category?.toLowerCase()}`}>{course.Category}</span>
                </div>
                <button
                  className="btn btn-primary resume-button"
                  onClick={() => window.open(course.URL, '_blank')}
                >
                  Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
