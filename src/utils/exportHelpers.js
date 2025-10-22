// FILE 25: src/utils/exportHelpers.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { formatDisplayDate } from './dateValidation';

export const exportToCSV = (bookings) => {
  const csvData = bookings.map(booking => ({
    'Item ID': booking.item_id,
    'Item Name': booking.items?.item_name || 'N/A',
    'Customer Name': booking.customer_name,
    'Mobile': booking.customer_mobile,
    'Start Date': formatDisplayDate(booking.start_date),
    'End Date': formatDisplayDate(booking.end_date),
    'Rent Price': `₹${booking.rent_price}`,
    'Status': booking.status,
    'Created At': formatDisplayDate(booking.created_at)
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (bookings) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Chaniya Choli Rental - Booking Report', 14, 20);
  
  // Add date
  doc.setFontSize(11);
  doc.text(`Generated on: ${formatDisplayDate(new Date())}`, 14, 30);
  
  // Prepare table data
  const tableData = bookings.map(booking => [
    booking.items?.item_name || 'N/A',
    booking.customer_name,
    booking.customer_mobile,
    formatDisplayDate(booking.start_date),
    formatDisplayDate(booking.end_date),
    `₹${booking.rent_price}`,
    booking.status.toUpperCase()
  ]);
  
  // Add table
  doc.autoTable({
    startY: 40,
    head: [['Item', 'Customer', 'Mobile', 'Start Date', 'End Date', 'Price', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [102, 126, 234],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 5
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Add summary
  const finalY = doc.lastAutoTable.finalY || 40;
  doc.setFontSize(12);
  doc.text(`Total Bookings: ${bookings.length}`, 14, finalY + 15);
  
  const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.rent_price), 0);
  doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`, 14, finalY + 25);
  
  // Save PDF
  doc.save(`bookings_report_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportItemsToCSV = (items) => {
  const csvData = items.map(item => ({
    'Item ID': item.id,
    'Item Name': item.item_name,
    'Description': item.description || 'N/A',
    'Rent Price': `₹${item.rent_price}`,
    'Price Type': item.rent_type === 'per_day' ? 'Per Day' : 'Per Booking',
    'Created At': formatDisplayDate(item.created_at)
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `items_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};