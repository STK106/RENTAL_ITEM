// FILE 18: src/components/Dashboard/Dashboard.jsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useItems } from '../../hooks/useItems';
import { deleteItem } from '../../services/itemService';
import ItemList from './ItemList';
import ItemForm from './ItemForm';
import BookingForm from '../Booking/BookingForm';
import './Dashboard.css';

const Dashboard = () => {
  const { items, loading, refreshItems } = useItems();
  const [showItemForm, setShowItemForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemForBooking, setSelectedItemForBooking] = useState(null);

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await deleteItem(itemId);
      if (!error) {
        refreshItems();
      } else {
        alert('Error deleting item: ' + error);
      }
    }
  };

  const handleBookItem = (item) => {
    setSelectedItemForBooking(item);
    setShowBookingForm(true);
  };

  const handleFormSuccess = () => {
    refreshItems();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>My Items</h1>
          <p>Manage your Chaniya Choli collection</p>
        </div>
        <button className="btn-primary" onClick={handleAddItem}>
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Items</h3>
          <p className="stat-value">{items.length}</p>
        </div>
        <div className="stat-card">
          <h3>Available</h3>
          <p className="stat-value">{items.length}</p>
        </div>
      </div>

      <ItemList
        items={items}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        onBook={handleBookItem}
      />

      {showItemForm && (
        <ItemForm
          item={selectedItem}
          onClose={() => setShowItemForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showBookingForm && (
        <BookingForm
          item={selectedItemForBooking}
          onClose={() => setShowBookingForm(false)}
          onSuccess={() => {
            setShowBookingForm(false);
            refreshItems();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;