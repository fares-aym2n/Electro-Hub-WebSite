/**
 * Helper formatters for Electro Hub currency, numbers, and dates
 */

export function formatPrice(price: string | number | undefined | null): string {
  if (price === undefined || price === null || price === '') {
    return 'EGP 0';
  }
  const num = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(num)) {
    return 'EGP 0';
  }
  const rounded = Math.round(num);
  return `EGP ${rounded.toLocaleString('en-US')}`;
}

export function formatRating(rating: string | number | undefined | null): string {
  if (rating === undefined || rating === null || rating === '') {
    return '0.0';
  }
  const num = typeof rating === 'string' ? parseFloat(rating) : rating;
  if (isNaN(num)) {
    return '0.0';
  }
  return num.toFixed(1);
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
