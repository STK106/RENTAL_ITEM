// FILE 26: src/components/Reports/ExportButtons.jsx

import React from 'react';
import { Download, FileText } from 'lucide-react';
import './Reports.css';

const ExportButtons = ({ onExportCSV, onExportPDF, disabled }) => {
  return (
    <div className="export-buttons">
      <button 
        className="btn-export csv" 
        onClick={onExportCSV}
        disabled={disabled}
      >
        <Download size={18} />
        Export CSV
      </button>
      <button 
        className="btn-export pdf" 
        onClick={onExportPDF}
        disabled={disabled}
      >
        <FileText size={18} />
        Export PDF
      </button>
    </div>
  );
};

export default ExportButtons;