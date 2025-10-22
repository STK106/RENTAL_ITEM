// FILE 27: src/components/Reports/ReportView.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { useItems } from '../../hooks/useItems';
import { exportToCSV, exportToPDF } from '../../utils/exportHelpers';
import { formatDisplayDate } from '../../utils/dateValidation';
import ExportButtons from './ExportButtons';
import './Reports.css';

const ReportView = () => {
  const { bookings, loading: bookingsLoading } = useBookings();
  const { items, loading: itemsLoading } = useItems();
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    completedBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0
  });

  useEffect(() => {
    filterBookings();
  }, [bookings, dateRange]);

  const filterBookings = () => {
    let filtered = [...bookings];

    if (dateRange.startDate && dateRange.endDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.created_at);
        const start = new Date(dateRange.startDate);
        const end = new Date(dateRange.endDate);
        return bookingDate >= start && bookingDate <= end;
      });
    }

    setFilteredBookings(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (bookingsData) => {
    const totalRevenue = bookingsData.reduce((sum, b) => sum + parseFloat(b.rent_price || 0), 0);
    
    setStats({
      totalBookings: bookingsData.length,
      activeBookings: bookingsData.filter(b => b.status === 'active').length,
      completedBookings: bookingsData.filter(b => b.status === 'completed').length,
      totalRevenue: totalRevenue,
      averageBookingValue: bookingsData.length > 0 ? totalRevenue / bookingsData.length : 0
    });
  };

  const handleDateChange = (e) => {
    setDateRange(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleExportCSV = () => {
    exportToCSV(filteredBookings);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredBookings);
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
  };

  if (bookingsLoading || itemsLoading) {
    return (
      <div className="reports-container">
        <div className="loading-state">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>View and export your booking reports</p>
        </div>
        <ExportButtons 
          onExportCSV={handleExportCSV}
          onExportPDF={handleExportPDF}
          disabled={filteredBookings.length === 0}
        />
      </div>

      <div className="date-filter">
        <div className="filter-inputs">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
            />
          </div>
          {(dateRange.startDate || dateRange.endDate) && (
            <button className="btn-clear" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bookings">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Bookings</h3>
            <p className="stat-value">{stats.totalBookings}</p>
            <span className="stat-label">All time bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>Active Bookings</h3>
            <p className="stat-value">{stats.activeBookings}</p>
            <span className="stat-label">Currently active</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toFixed(2)}</p>
            <span className="stat-label">Total earnings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon items">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Items</h3>
            <p className="stat-value">{items.length}</p>
            <span className="stat-label">In inventory</span>
          </div>
        </div>
      </div>

      <div className="report-table-container">
        <h2>Booking Details</h2>
        {filteredBookings.length === 0 ? (
          <div className="empty-state">
            <p>No bookings found for the selected period</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Customer Name</th>
                  <th>Mobile</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Rent Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.items?.item_name || 'N/A'}</td>
                    <td>{booking.customer_name}</td>
                    <td>{booking.customer_mobile}</td>
                    <td>{formatDisplayDate(booking.start_date)}</td>
                    <td>{formatDisplayDate(booking.end_date)}</td>
                    <td>₹{booking.rent_price}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filteredBookings.length > 0 && (
        <div className="report-summary">
          <h3>Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span>Total Bookings:</span>
              <strong>{stats.totalBookings}</strong>
            </div>
            <div className="summary-item">
              <span>Total Revenue:</span>
              <strong>₹{stats.totalRevenue.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Average Booking Value:</span>
              <strong>₹{stats.averageBookingValue.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Completed:</span>
              <strong>{stats.completedBookings}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;