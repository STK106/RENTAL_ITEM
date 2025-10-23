// FILE 23: src/components/Booking/BookingList.jsx
import React, { useState } from 'react';
import { Trash2, Calendar, Phone, User, Search, Filter } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { deleteBooking, updateBooking } from '../../services/bookingService';
import { formatDisplayDate } from '../../utils/dateValidation';
import ConfirmModal from '../common/ConfirmModal'; // 🔥 NEW IMPORT
import './Booking.css';

const BookingList = () => {
  const { bookings, loading, refreshBookings } = useBookings();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // 🔥 NEW: Confirmation modals state
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    bookingId: null,
    customerName: ''
  });

  const [completeConfirm, setCompleteConfirm] = useState({
    isOpen: false,
    bookingId: null,
    customerName: ''
  });

  // 🔥 NEW: Open delete confirmation
  const handleDeleteBooking = (booking) => {
    setDeleteConfirm({
      isOpen: true,
      bookingId: booking.id,
      customerName: booking.customer_name
    });
  };

  // 🔥 NEW: Confirm deletion
  const confirmDeleteBooking = async () => {
    const { error } = await deleteBooking(deleteConfirm.bookingId);
    if (!error) {
      refreshBookings();
    } else {
      alert('Error deleting booking: ' + error);
    }
    setDeleteConfirm({ isOpen: false, bookingId: null, customerName: '' });
  };

  // 🔥 NEW: Open complete confirmation
  const handleCompleteBooking = (booking) => {
    setCompleteConfirm({
      isOpen: true,
      bookingId: booking.id,
      customerName: booking.customer_name
    });
  };

  // 🔥 NEW: Confirm completion
  const confirmCompleteBooking = async () => {
    const { error } = await updateBooking(completeConfirm.bookingId, { status: 'completed' });
    if (!error) {
      refreshBookings();
    } else {
      alert('Error updating booking: ' + error);
    }
    setCompleteConfirm({ isOpen: false, bookingId: null, customerName: '' });
  };

  // 🔥 NEW: Filter and search logic
  const filteredBookings = bookings
    .filter(booking => {
      // Status filter
      if (filter === 'active' && booking.status !== 'active') return false;
      if (filter === 'completed' && booking.status !== 'completed') return false;

      // Search filter - search in item name, customer name, and phone
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const itemName = booking.items?.item_name?.toLowerCase() || '';
        const customerName = booking.customer_name?.toLowerCase() || '';
        const customerMobile = booking.customer_mobile || '';

        const matchesSearch = 
          itemName.includes(search) ||
          customerName.includes(search) ||
          customerMobile.includes(search);

        if (!matchesSearch) return false;
      }

      // Date filter
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const bookingEndDate = new Date(booking.end_date);
      bookingEndDate.setHours(0, 0, 0, 0);

      if (dateFilter === 'ongoing') {
        const bookingStartDate = new Date(booking.start_date);
        bookingStartDate.setHours(0, 0, 0, 0);
        return bookingStartDate <= today && bookingEndDate >= today;
      }
      if (dateFilter === 'upcoming') {
        const bookingStartDate = new Date(booking.start_date);
        bookingStartDate.setHours(0, 0, 0, 0);
        return bookingStartDate > today;
      }
      if (dateFilter === 'past') {
        return bookingEndDate < today;
      }

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

      {/* 🔥 NEW: Search and Filter Bar */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by item name, customer name, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={18} />
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
              <option value="all">All Dates</option>
              <option value="ongoing">Ongoing</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* 🔥 NEW: Search Results Info */}
      {searchTerm && (
        <div className="search-results-info">
          <p>
            Found <strong>{filteredBookings.length}</strong> booking(s) matching "{searchTerm}"
          </p>
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          {searchTerm ? (
            <p>No bookings found matching your search</p>
          ) : (
            <p>No bookings found</p>
          )}
          {searchTerm && (
            <button 
              className="btn-secondary" 
              onClick={() => setSearchTerm('')}
              style={{ marginTop: '15px' }}
            >
              Clear Search
            </button>
          )}
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
                
                {/* 🔥 NEW: Show discount if applied */}
                {booking.discount && booking.discount > 0 && (
                  <div className="detail-row discount-info">
                    <span>Discount:</span>
                    <span className="discount-value">- ₹{booking.discount}</span>
                  </div>
                )}
                
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
      
      {/* 🔥 NEW: Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, bookingId: null, customerName: '' })}
        onConfirm={confirmDeleteBooking}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking for "${deleteConfirm.customerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* 🔥 NEW: Complete Confirmation Modal */}
      <ConfirmModal
        isOpen={completeConfirm.isOpen}
        onClose={() => setCompleteConfirm({ isOpen: false, bookingId: null, customerName: '' })}
        onConfirm={confirmCompleteBooking}
        title="Mark as Completed"
        message={`Mark the booking for "${completeConfirm.customerName}" as completed?`}
        confirmText="Mark Complete"
        cancelText="Cancel"
        type="info"
      />
    </div>
  );
};

export default BookingList;