// FILE 7: src/services/bookingService.js

import { supabase } from './supabaseClient';

export const checkAvailability = async (itemId, startDate, endDate, excludeBookingId = null) => {
  try {
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('item_id', itemId)
      .eq('status', 'active')
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (excludeBookingId) {
      query = query.neq('id', excludeBookingId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return {
      available: data.length === 0,
      conflictingBookings: data,
      error: null
    };
  } catch (error) {
    return {
      available: false,
      conflictingBookings: [],
      error: error.message
    };
  }
};

export const createBooking = async (bookingData) => {
  try {
    const availability = await checkAvailability(
      bookingData.item_id,
      bookingData.start_date,
      bookingData.end_date
    );

    if (!availability.available) {
      return {
        data: null,
        error: 'Item is already booked for the selected dates',
        conflictingBookings: availability.conflictingBookings
      };
    }

    // 🔥 This will now include discount field automatically
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])  // Includes discount
      .select()
      .single();


    if (error) throw error;
    return { data, error: null, conflictingBookings: [] };
  } catch (error) {
    return { data: null, error: error.message, conflictingBookings: [] };
  }
};

export const getAllBookings = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        items (
          item_name,
          photo_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getBookingsByItem = async (itemId) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('item_id', itemId)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateBooking = async (bookingId, updates) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const getActiveBookings = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        items (
          item_name,
          photo_url
        )
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .gte('end_date', today)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};