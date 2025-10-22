// FILE 30: src/components/Layout/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, Package } from 'lucide-react';
import './Layout.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/bookings', icon: Calendar, label: 'Bookings' },
    { path: '/reports', icon: BarChart3, label: 'Reports' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;