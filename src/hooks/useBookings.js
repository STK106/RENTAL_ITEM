// FILE 20: src/hooks/useBookings.js

import { useState, useEffect } from 'react';
import { getAllBookings } from '../services/bookingService';
import { useAuth } from './useAuth';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error: fetchError } = await getAllBookings(user.id);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const refreshBookings = () => {
    fetchBookings();
  };

  return { bookings, loading, error, refreshBookings };
};