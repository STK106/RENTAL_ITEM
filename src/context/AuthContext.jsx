// FILE 9: src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    const { user: currentUser } = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};