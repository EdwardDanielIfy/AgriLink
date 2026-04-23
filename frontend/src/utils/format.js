/**
 * Format a number as Nigerian Naira.
 * @param {number|string} amount
 * @param {boolean} [showDecimals=true]
 * @returns {string}  e.g. ₦1,234.00
 */
export function formatNaira(amount, showDecimals = true) {
  const num = parseFloat(amount);
  if (isNaN(num)) return '₦0.00';
  return (
    '₦' +
    num.toLocaleString('en-NG', {
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    })
  );
}

/**
 * Format a date string or Date object nicely.
 * @param {string|Date} date
 * @returns {string}  e.g. 17 Apr 2026
 */
export function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a phone number for display.
 * Ensures Nigerian format like 0801 234 5678.
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return phone;
}

/**
 * Truncate text to a max length.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export function truncate(text, max = 40) {
  if (!text) return '';
  return text.length <= max ? text : text.slice(0, max).trimEnd() + '…';
}
