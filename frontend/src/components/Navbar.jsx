import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Add styles if needed

function Navbar() {
  return (
    <nav className="navbar">
      <h2>Exam Seating</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/student">Student</Link>
        <Link to="/admin">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;
