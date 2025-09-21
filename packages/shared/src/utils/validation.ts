export const ValidationRegex = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+92|92|0)?3[0-9]{9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
};

export const validateEmail = (email: string): boolean => {
  return ValidationRegex.EMAIL.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return ValidationRegex.PHONE.test(phone);
};

export const validatePassword = (password: string): boolean => {
  return ValidationRegex.PASSWORD.test(password);
};

export const normalizePhone = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('92') && digits.length === 12) {
    return `+${digits}`;
  } else if (digits.startsWith('0') && digits.length === 11) {
    return `+92${digits.slice(1)}`;
  } else if (digits.length === 10 && digits.startsWith('3')) {
    return `+92${digits}`;
  }
  
  return phone; // Return original if can't format
};

export const validatePropertyPrice = (price: number): boolean => {
  return price > 0 && price <= 10000000; // Max 10 million PKR
};

export const validatePropertyArea = (area: number): boolean => {
  return area > 0 && area <= 1000; // Max 1000 units
};
