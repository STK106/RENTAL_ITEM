// FILE 31: src/components/Layout/Footer.jsx

import React from 'react';
import './Layout.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; 2024 Chaniya Choli Rental Management System. All rights reserved.</p>
        <p className="footer-credit">Built with React & Supabase</p>
      </div>
    </footer>
  );
};

export default Footer;