// FILE 29: src/components/Layout/Navbar.jsx

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/authService';
import './Layout.css';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>Chaniya Choli Rental</h2>
        </Link>

        <div className="navbar-menu">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/bookings" 
            className={location.pathname === '/bookings' ? 'active' : ''}
          >
            Bookings
          </Link>
          <Link 
            to="/reports" 
            className={location.pathname === '/reports' ? 'active' : ''}
          >
            Reports
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <User size={20} />
            <span>{user.email}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;