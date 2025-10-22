// FILE 23: src/components/Booking/BookingList.jsx

import React, { useState } from 'react';
import { Trash2, Calendar, Phone, User } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { deleteBooking, updateBooking } from '../../services/bookingService';
import { formatDisplayDate } from '../../utils/dateValidation';
import './Booking.css';

const BookingList = () => {
  const { bookings, loading, refreshBookings } = useBookings();
  const [filter, setFilter] = useState('all');

  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const { error } = await deleteBooking(bookingId);
      if (!error) {
        refreshBookings();
      } else {
        alert('Error deleting booking: ' + error);
      }
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    if (window.confirm('Mark this booking as completed?')) {
      const { error } = await updateBooking(bookingId, { status: 'completed' });
      if (!error) {
        refreshBookings();
      } else {
        alert('Error updating booking: ' + error);
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'active') return booking.status === 'active';
    if (filter === 'completed') return booking.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="bookings-container">
        <div className="loading-state">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <div className="bookings-header">
        <div>
          <h1>Bookings</h1>
          <p>Manage your rental bookings</p>
        </div>

        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Active ({bookings.filter(b => b.status === 'active').length})
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="bookings-list">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-item-info">
                {booking.items?.photo_url && (
                  <img src={booking.items.photo_url} alt={booking.items.item_name} />
                )}
                <div>
                  <h3>{booking.items?.item_name || 'Unknown Item'}</h3>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <User size={16} />
                  <span>{booking.customer_name}</span>
                </div>
                <div className="detail-row">
                  <Phone size={16} />
                  <span>{booking.customer_mobile}</span>
                </div>
                <div className="detail-row">
                  <Calendar size={16} />
                  <span>
                    {formatDisplayDate(booking.start_date)} - {formatDisplayDate(booking.end_date)}
                  </span>
                </div>
                <div className="detail-row price">
                  <span>Total:</span>
                  <strong>₹{booking.rent_price}</strong>
                </div>
              </div>

              <div className="booking-actions">
                {booking.status === 'active' && (
                  <button 
                    className="btn-complete" 
                    onClick={() => handleCompleteBooking(booking.id)}
                  >
                    Mark Complete
                  </button>
                )}
                <button 
                  className="btn-delete-small" 
                  onClick={() => handleDeleteBooking(booking.id)}
                  title="Delete Booking"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;