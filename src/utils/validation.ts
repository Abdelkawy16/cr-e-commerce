// Egyptian phone number validation
export const validateEgyptianPhone = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Check if the number starts with 01 and has 11 digits
  if (cleanedPhone.length !== 11) return false;
  
  // Check if it starts with 01
  if (!cleanedPhone.startsWith('01')) return false;
  
  // Check if the third digit is valid (0, 1, 2, 5)
  const thirdDigit = cleanedPhone[2];
  if (!['0', '1', '2', '5'].includes(thirdDigit)) return false;
  
  return true;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  const cleanedPhone = phone.replace(/\D/g, '');
  
  // Format as: 01X-XXXX-XXXX
  if (cleanedPhone.length === 11) {
    return `${cleanedPhone.slice(0, 3)}-${cleanedPhone.slice(3, 7)}-${cleanedPhone.slice(7)}`;
  }
  
  return phone;
};

// Get phone number error message
export const getPhoneErrorMessage = (phone: string): string | null => {
  if (!phone) return 'رقم الهاتف مطلوب';
  
  const cleanedPhone = phone.replace(/\D/g, '');
  
  if (cleanedPhone.length !== 11) {
    return 'يجب أن يتكون رقم الهاتف من 11 رقم';
  }
  
  if (!cleanedPhone.startsWith('01')) {
    return 'يجب أن يبدأ رقم الهاتف بـ 01';
  }
  
  const thirdDigit = cleanedPhone[2];
  if (!['0', '1', '2', '5'].includes(thirdDigit)) {
    return 'رقم الهاتف غير صالح';
  }
  
  return null;
};

// Discount utility functions
export const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number): number => {
  if (discountPercentage <= 0 || discountPercentage > 100) {
    return originalPrice;
  }
  return originalPrice * (1 - discountPercentage / 100);
};

export const isDiscountValid = (discountEndDate?: Date | { toDate: () => Date }): boolean => {
  if (!discountEndDate) return false;

  let date: Date;
  // Handle Firestore Timestamp object which has a toDate method
  if (typeof (discountEndDate as any).toDate === 'function') {
    date = (discountEndDate as any).toDate();
  } else {
    // Handle a regular Date object or a date string
    date = new Date(discountEndDate as Date);
  }

  // Check if the created date is valid
  if (isNaN(date.getTime())) {
      return false;
  }
  
  return new Date() < date;
};

export const getActiveDiscount = (product: { discountPercentage?: number; discountEndDate?: any }): number | null => {
  if (!product.discountPercentage || product.discountPercentage <= 0 || !isDiscountValid(product.discountEndDate)) {
    return null;
  }
  return product.discountPercentage;
}; 