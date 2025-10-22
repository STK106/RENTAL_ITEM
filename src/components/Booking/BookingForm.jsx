// FILE 22: src/components/Booking/BookingForm.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createBooking, checkAvailability } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { isValidDateRange, getTodayDate, calculateDays } from '../../utils/dateValidation';
import AvailabilityChecker from './AvailabilityChecker';
import './Booking.css';

const BookingForm = ({ item, booking, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_mobile: '',
    start_date: '',
    end_date: '',
    rent_price: item ? item.rent_price : ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availability, setAvailability] = useState(null);
  const [conflictingBookings, setConflictingBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (booking) {
      setFormData({
        customer_name: booking.customer_name || '',
        customer_mobile: booking.customer_mobile || '',
        start_date: booking.start_date || '',
        end_date: booking.end_date || '',
        rent_price: booking.rent_price || ''
      });
    }
  }, [booking]);

  useEffect(() => {
    if (formData.start_date && formData.end_date && item) {
      calculateTotalPrice();
      checkItemAvailability();
    }
  }, [formData.start_date, formData.end_date]);

  const calculateTotalPrice = () => {
    if (!formData.start_date || !formData.end_date) return;

    if (item.rent_type === 'per_day') {
      const days = calculateDays(formData.start_date, formData.end_date);
      setTotalPrice(days * item.rent_price);
      setFormData(prev => ({ ...prev, rent_price: days * item.rent_price }));
    } else {
      setTotalPrice(item.rent_price);
      setFormData(prev => ({ ...prev, rent_price: item.rent_price }));
    }
  };

  const checkItemAvailability = async () => {
    if (!item || !formData.start_date || !formData.end_date) return;

    setAvailability({ checking: true });

    const result = await checkAvailability(
      item.id,
      formData.start_date,
      formData.end_date,
      booking?.id
    );

    setAvailability({
      available: result.available,
      checking: false
    });
    setConflictingBookings(result.conflictingBookings || []);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidDateRange(formData.start_date, formData.end_date)) {
      setError('End date must be after or equal to start date');
      return;
    }

    if (availability && !availability.available) {
      setError('Item is not available for the selected dates');
      return;
    }

    setLoading(true);

    const bookingData = {
      ...formData,
      item_id: item.id,
      user_id: user.id,
      status: 'active'
    };

    const { data, error: bookingError } = await createBooking(bookingData);

    if (bookingError) {
      setError(bookingError);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>{booking ? 'Edit Booking' : 'Create Booking'}</h2>
            {item && <p className="modal-subtitle">Item: {item.item_name}</p>}
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="customer_name">Customer Name *</label>
            <input
              type="text"
              id="customer_name"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer_mobile">Customer Mobile *</label>
            <input
              type="tel"
              id="customer_mobile"
              name="customer_mobile"
              value={formData.customer_mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start_date">Start Date *</label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                min={getTodayDate()}
              />
            </div>

            <div className="form-group">
              <label htmlFor="end_date">End Date *</label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                min={formData.start_date || getTodayDate()}
              />
            </div>
          </div>

          {formData.start_date && formData.end_date && item && (
            <div className="booking-summary">
              <div className="summary-row">
                <span>Duration:</span>
                <strong>{calculateDays(formData.start_date, formData.end_date)} day(s)</strong>
              </div>
              <div className="summary-row">
                <span>Price per {item.rent_type === 'per_day' ? 'day' : 'booking'}:</span>
                <strong>₹{item.rent_price}</strong>
              </div>
              <div className="summary-row total">
                <span>Total Price:</span>
                <strong>₹{totalPrice}</strong>
              </div>
            </div>
          )}

          <AvailabilityChecker 
            availability={availability} 
            conflictingBookings={conflictingBookings}
          />

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || (availability && !availability.available)}
            >
              {loading ? 'Creating...' : booking ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;