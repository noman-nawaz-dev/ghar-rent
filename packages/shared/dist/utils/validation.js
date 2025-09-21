"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePropertyArea = exports.validatePropertyPrice = exports.normalizePhone = exports.validatePassword = exports.validatePhone = exports.validateEmail = exports.ValidationRegex = void 0;
exports.ValidationRegex = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^(\+92|92|0)?3[0-9]{9}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};
const validateEmail = (email) => {
    return exports.ValidationRegex.EMAIL.test(email);
};
exports.validateEmail = validateEmail;
const validatePhone = (phone) => {
    return exports.ValidationRegex.PHONE.test(phone);
};
exports.validatePhone = validatePhone;
const validatePassword = (password) => {
    return exports.ValidationRegex.PASSWORD.test(password);
};
exports.validatePassword = validatePassword;
const normalizePhone = (phone) => {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('92') && digits.length === 12) {
        return `+${digits}`;
    }
    else if (digits.startsWith('0') && digits.length === 11) {
        return `+92${digits.slice(1)}`;
    }
    else if (digits.length === 10 && digits.startsWith('3')) {
        return `+92${digits}`;
    }
    return phone;
};
exports.normalizePhone = normalizePhone;
const validatePropertyPrice = (price) => {
    return price > 0 && price <= 10000000;
};
exports.validatePropertyPrice = validatePropertyPrice;
const validatePropertyArea = (area) => {
    return area > 0 && area <= 1000;
};
exports.validatePropertyArea = validatePropertyArea;
//# sourceMappingURL=validation.js.map