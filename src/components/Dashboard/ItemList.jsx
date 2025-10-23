// FILE 17: src/components/Dashboard/ItemList.jsx

import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ItemCard from './ItemCard';
import './Dashboard.css';

const ItemList = ({ items, onEdit, onDelete, onBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesPrice = true;
      if (priceFilter === 'low') matchesPrice = item.rent_price < 500;
      else if (priceFilter === 'medium') matchesPrice = item.rent_price >= 500 && item.rent_price <= 1500;
      else if (priceFilter === 'high') matchesPrice = item.rent_price > 1500;
      
      return matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'price-low') return a.rent_price - b.rent_price;
      if (sortBy === 'price-high') return b.rent_price - a.rent_price;
      if (sortBy === 'name') return a.item_name.localeCompare(b.item_name);
      return 0;
    });

  return (
    <div className="item-list-container">
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <Filter size={18} />
            <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
              <option value="all">All Prices</option>
              <option value="low">Under ₹500</option>
              <option value="medium">₹500 - ₹1500</option>
              <option value="high">Above ₹1500</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-state">
          <p>No items found</p>
        </div>
      ) : (
        <div className="items-grid">
          {filteredItems.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}  // 🔥 Now passes entire item object
              onBook={onBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemList;