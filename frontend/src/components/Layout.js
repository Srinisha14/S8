// layout/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import '../styles/layout/header.css';
import '../styles/layout/sidebar.css'; // ✅ This must exist

const Layout = ({ children, logout }) => {

  const username = localStorage.getItem('username');

  return (
    <div className="app-layout">
      <header className="main-header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          <span className="header-title">Course Recommender</span>
        </div>
        <div className="header-right">
          <input
    type="text"
    className="header-search"
    placeholder="Search..."
    onChange={(e) => console.log('Search:', e.target.value)}
  />
          <button>🔔</button>
          <img src="/assets/avatar.png" alt="Profile" className="profile-avatar" />
          <span className="username">{username}</span>
        </div>
      </header>

      <div className="layout-body">
        <Sidebar logout={logout} />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
