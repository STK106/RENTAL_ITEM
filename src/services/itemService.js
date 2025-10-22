// FILE 6: src/services/itemService.js

import { supabase } from './supabaseClient';

export const uploadItemPhoto = async (file, userId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('item-photos')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('item-photos')
      .getPublicUrl(filePath);

    return { url: publicUrl, error: null };
  } catch (error) {
    return { url: null, error: error.message };
  }
};

export const createItem = async (itemData) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getAllItems = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const getItemById = async (itemId) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const updateItem = async (itemId, updates) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const deleteItem = async (itemId) => {
  try {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const searchItems = async (userId, searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .ilike('item_name', `%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};