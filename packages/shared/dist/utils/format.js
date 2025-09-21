"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitials = exports.truncateText = exports.slugify = exports.formatDateTime = exports.formatDate = exports.formatPhone = exports.formatArea = exports.formatPrice = void 0;
const formatPrice = (price) => {
    if (price >= 100000) {
        return `₹${(price / 100000).toFixed(1)}L`;
    }
    else if (price >= 1000) {
        return `₹${(price / 1000).toFixed(1)}K`;
    }
    else {
        return `₹${price}`;
    }
};
exports.formatPrice = formatPrice;
const formatArea = (area, unit) => {
    return `${area} ${unit}`;
};
exports.formatArea = formatArea;
const formatPhone = (phone) => {
    if (phone.startsWith('+92')) {
        const number = phone.slice(3);
        return `+92 ${number.slice(0, 3)} ${number.slice(3)}`;
    }
    return phone;
};
exports.formatPhone = formatPhone;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
};
exports.formatDate = formatDate;
const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
};
exports.formatDateTime = formatDateTime;
const slugify = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
exports.slugify = slugify;
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
};
exports.truncateText = truncateText;
const getInitials = (name) => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};
exports.getInitials = getInitials;
//# sourceMappingURL=format.js.map