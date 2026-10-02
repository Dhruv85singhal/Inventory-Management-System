// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
//import './Navbar.css'; // CSS file for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Store</h2>
        </div>
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link">Logout</Link></li>
          <li><Link to="/store" className="navbar-link">Store</Link></li>
          <li><Link to="/cart" className="navbar-link">Cart</Link></li>
          
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
