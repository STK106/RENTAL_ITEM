// FILE 18: src/components/Dashboard/Dashboard.jsx

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useItems } from '../../hooks/useItems';
import { deleteItem } from '../../services/itemService';
import ItemList from './ItemList';
import ItemForm from './ItemForm';
import BookingForm from '../Booking/BookingForm';
import ConfirmModal from '../common/ConfirmModal'; // 🔥 NEW IMPORT
import './Dashboard.css';

const Dashboard = () => {
  const { items, loading, refreshItems } = useItems();
  const [showItemForm, setShowItemForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemForBooking, setSelectedItemForBooking] = useState(null);
  
  // 🔥 NEW: Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    itemId: null,
    itemName: ''
  });

  const handleAddItem = () => {
    setSelectedItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setShowItemForm(true);
  };

  // 🔥 NEW: Open confirmation modal
  const handleDeleteItem = (item) => {
    setConfirmModal({
      isOpen: true,
      itemId: item.id,
      itemName: item.item_name
    });
  };

  // 🔥 NEW: Confirm deletion
  const confirmDeleteItem = async () => {
    const { error } = await deleteItem(confirmModal.itemId);
    if (!error) {
      refreshItems();
    } else {
      alert('Error deleting item: ' + error);
    }
    setConfirmModal({ isOpen: false, itemId: null, itemName: '' });
  };

  // 🔥 NEW: Cancel deletion
  const cancelDelete = () => {
    setConfirmModal({ isOpen: false, itemId: null, itemName: '' });
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
        onDelete={handleDeleteItem}  // Pass item object instead of just ID
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

      {/* 🔥 NEW: Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDeleteItem}
        title="Delete Item"
        message={`Are you sure you want to delete "${confirmModal.itemName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Dashboard;