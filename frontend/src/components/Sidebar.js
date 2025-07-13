import { NavLink } from 'react-router-dom';
import '../styles/layout/sidebar.css';

const Sidebar = ({ logout }) => {
  return (
    <div className="sidebar">
      <nav className="nav">
         <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Dashboard</NavLink>
        <NavLink to="/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Recommendations</NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Explore</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Your Courses</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Settings</NavLink>
        <button onClick={logout} className="btn btn-outline">Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;
