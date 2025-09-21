import { AreaUnit } from '../types';

export const formatPrice = (price: number): string => {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  } else {
    return `₹${price}`;
  }
};

export const formatArea = (area: number, unit: AreaUnit): string => {
  return `${area} ${unit}`;
};

export const formatPhone = (phone: string): string => {
  if (phone.startsWith('+92')) {
    const number = phone.slice(3);
    return `+92 ${number.slice(0, 3)} ${number.slice(3)}`;
  }
  return phone;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
