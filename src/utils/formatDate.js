/**
 * Format a date object into a readable string
 * @param {Date} date - The date to format
 * @param {string} format - The format to use (default: 'MM/DD/YYYY')
 * @returns {string} - Formatted date string
 */
const formatDate = (date, format = 'MM/DD/YYYY') => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  let formattedDate = format;
  formattedDate = formattedDate.replace('DD', day);
  formattedDate = formattedDate.replace('MM', month);
  formattedDate = formattedDate.replace('YYYY', year);
  
  return formattedDate;
};

export default formatDate; 