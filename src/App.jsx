// FILE 35: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import BookingList from './components/Booking/BookingList';
import ReportView from './components/Reports/ReportView';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Footer from './components/Layout/Footer';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return !user ? children : <Navigate to="/" />;
};

const AppLayout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {user && <Navbar />}
      <div className="main-layout">
        {user && <Sidebar />}
        <main className={`main-content ${user ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
      {user && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/bookings" 
              element={
                <PrivateRoute>
                  <BookingList />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <PrivateRoute>
                  <ReportView />
                </PrivateRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;