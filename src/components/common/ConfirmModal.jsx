// src/components/common/ConfirmModal.jsx

import React, { useEffect } from 'react';  // 🔥 Add useEffect import
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger" // danger, warning, info
}) => {
  // 🔥 NEW: ESC key support
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirm-modal-overlay" onClick={onClose}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className={`confirm-modal-icon ${type}`}>
          <AlertTriangle size={48} />
        </div>

        <div className="confirm-modal-body">
          <h2>{title}</h2>
          <p>{message}</p>
        </div>

        <div className="confirm-modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`btn-confirm ${type}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;