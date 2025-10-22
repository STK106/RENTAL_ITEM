// FILE 15: src/components/Dashboard/ItemCard.jsx

import React from 'react';
import { Trash2, Edit, Calendar } from 'lucide-react';
import './Dashboard.css';

const ItemCard = ({ item, onEdit, onDelete, onBook }) => {
  return (
    <div className="item-card">
      <div className="item-image">
        {item.photo_url ? (
          <img src={item.photo_url} alt={item.item_name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="item-details">
        <h3>{item.item_name}</h3>
        <p className="item-description">{item.description}</p>
        
        <div className="item-price">
          <span className="price">₹{item.rent_price}</span>
          <span className="price-type">/{item.rent_type === 'per_day' ? 'day' : 'booking'}</span>
        </div>
        
        <div className="item-actions">
          <button className="btn-icon btn-book" onClick={() => onBook(item)} title="Create Booking">
            <Calendar size={18} />
            Book
          </button>
          <button className="btn-icon btn-edit" onClick={() => onEdit(item)} title="Edit Item">
            <Edit size={18} />
          </button>
          <button className="btn-icon btn-delete" onClick={() => onDelete(item.id)} title="Delete Item">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;