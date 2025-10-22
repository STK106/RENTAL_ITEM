// FILE 16: src/components/Dashboard/ItemForm.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createItem, updateItem, uploadItemPhoto } from '../../services/itemService';
import { useAuth } from '../../hooks/useAuth';
import './Dashboard.css';

const ItemForm = ({ item, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    rent_price: '',
    rent_type: 'per_day',
    photo_url: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        description: item.description || '',
        rent_price: item.rent_price || '',
        rent_type: item.rent_type || 'per_day',
        photo_url: item.photo_url || ''
      });
      setPreviewUrl(item.photo_url || '');
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let photoUrl = formData.photo_url;

      if (photoFile) {
        const { url, error: uploadError } = await uploadItemPhoto(photoFile, user.id);
        if (uploadError) {
          setError(uploadError);
          setLoading(false);
          return;
        }
        photoUrl = url;
      }

      const itemData = {
        ...formData,
        photo_url: photoUrl,
        rent_price: parseFloat(formData.rent_price),
        user_id: user.id
      };

      let result;
      if (item) {
        result = await updateItem(item.id, itemData);
      } else {
        result = await createItem(itemData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{item ? 'Edit Item' : 'Add New Item'}</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="item-form">
          <div className="form-group">
            <label htmlFor="item_name">Item Name *</label>
            <input
              type="text"
              id="item_name"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              required
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter item description"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="rent_price">Rent Price (₹) *</label>
              <input
                type="number"
                id="rent_price"
                name="rent_price"
                value={formData.rent_price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>

            <div className="form-group">
              <label htmlFor="rent_type">Price Type *</label>
              <select
                id="rent_type"
                name="rent_type"
                value={formData.rent_type}
                onChange={handleChange}
              >
                <option value="per_day">Per Day</option>
                <option value="per_booking">Per Booking</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Item Photo</label>
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;