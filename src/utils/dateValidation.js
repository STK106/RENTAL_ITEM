// FILE 8: src/utils/dateValidation.js

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};

export const datesOverlap = (start1, end1, start2, end2) => {
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);

  return s1 <= e2 && e1 >= s2;
};

export const getTodayDate = () => {
  return formatDate(new Date());
};

export const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

export const isPastDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const formatDisplayDate = (date) => {
  if (!date) return '';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-IN', options);
};