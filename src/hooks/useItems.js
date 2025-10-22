// FILE 14: src/hooks/useItems.js

import { useState, useEffect } from 'react';
import { getAllItems } from '../services/itemService';
import { useAuth } from './useAuth';

export const useItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchItems = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error: fetchError } = await getAllItems(user.id);
    
    if (fetchError) {
      setError(fetchError);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, [user]);

  const refreshItems = () => {
    fetchItems();
  };

  return { items, loading, error, refreshItems };
};