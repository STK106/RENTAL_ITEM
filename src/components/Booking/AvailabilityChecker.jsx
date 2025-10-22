// FILE 21: src/components/Booking/AvailabilityChecker.jsx

import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatDisplayDate } from '../../utils/dateValidation';
import './Booking.css';

const AvailabilityChecker = ({ availability, conflictingBookings }) => {
  if (!availability) return null;

  if (availability.checking) {
    return (
      <div className="availability-check checking">
        <AlertCircle size={20} />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (availability.available) {
    return (
      <div className="availability-check available">
        <CheckCircle size={20} />
        <span>✅ Item available for booking!</span>
      </div>
    );
  }

  return (
    <div className="availability-check unavailable">
      <XCircle size={20} />
      <div>
        <p className="main-message">❌ Item already booked for selected dates</p>
        {conflictingBookings && conflictingBookings.length > 0 && (
          <div className="conflict-details">
            <p className="conflict-title">Conflicting bookings:</p>
            {conflictingBookings.map((booking, index) => (
              <p key={index} className="conflict-item">
                • {formatDisplayDate(booking.start_date)} to {formatDisplayDate(booking.end_date)} 
                ({booking.customer_name})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailabilityChecker;