// ✅ Enhanced Settings Page with improved layout and styling + more FAQs + dark theme improvement
import React, { useState, useEffect } from 'react';
import '../styles/page/settings.css';
import { FaMoon, FaSun, FaKey, FaQuestionCircle, FaUser } from 'react-icons/fa';
import axios from 'axios';

const SettingsPage = () => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-mode'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/user-info', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUsername(res.data.username || ''))
    .catch(err => console.error('Failed to fetch user info:', err));
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      return alert("Please fill in all fields");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const token = localStorage.getItem('token');
    try {
      const res = await axios.put('http://localhost:5000/change-password', {
        new_password: newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage("Password updated successfully!");
      setShowPasswordInput(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage("Failed to update password");
      console.error(err);
    }
  };

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-section">
        <h2><FaMoon className="icon" /> Theme</h2>
        <button className="toggle-btn" onClick={toggleDarkMode}>
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="settings-section">
        <h2><FaKey className="icon" /> Change Password</h2>
        <button className="btn btn-outline" onClick={() => setShowPasswordInput(!showPasswordInput)}>
          {showPasswordInput ? 'Cancel' : 'Change Password'}
        </button>
        {showPasswordInput && (
          <form className="password-form" onSubmit={(e) => { e.preventDefault(); handlePasswordChange(); }}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              readOnly
              className="username-input"
            />
            <label>New Password:</label>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Save Password
            </button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>

      <div className="settings-section">
        <h2><FaQuestionCircle className="icon" /> FAQ</h2>
        <ul className="faq-list">
          <li><strong>How do I enroll in a course?</strong> - Click on the "Enroll" button below any course.</li>
          <li><strong>Can I change my learning style?</strong> - Yes, go to the Recommendations page and retake the questionnaire.</li>
          <li><strong>How can I reset my password?</strong> - Use the change password feature above while logged in.</li>
          <li><strong>Why is my progress not updating?</strong> - Ensure you're logged in and have an active internet connection.</li>
          <li><strong>How do I access completed courses?</strong> - Go to the Profile page and check the Completed Courses section.</li>
          <li><strong>What is the Dashboard?</strong> - The Dashboard shows your overall progress, performance, and recommendations.</li>
          <li><strong>How do I switch themes?</strong> - Use the Theme toggle button above to switch between Light and Dark modes.</li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsPage;
