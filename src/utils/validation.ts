// Egyptian phone number validation
export const validateEgyptianPhone = (phone: string): boolean => {
  // Remove any non-digit characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // Check if the number starts with 01 and has 11 digits
  if (cleanedPhone.length !== 11) return false;

  // Check if it starts with 01
  if (!cleanedPhone.startsWith("01")) return false;

  // Check if the third digit is valid (0, 1, 2, 5)
  const thirdDigit = cleanedPhone[2];
  if (!["0", "1", "2", "5"].includes(thirdDigit)) return false;

  return true;
};

// Format phone number for display
export const formatPhoneNumber = (phone: string, countryCode: string = '+385'): string => {
  // Remove all non-digit characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // For Croatia: expect 9 digits
  if (cleanedPhone.length === 9) {
    // Format as +385 XXX XXX XXX
    const part1 = cleanedPhone.slice(0, 3);
    const part2 = cleanedPhone.slice(3, 6);
    const part3 = cleanedPhone.slice(6);
    return `${countryCode} ${part1} ${part2} ${part3}`;
  }

  // Return original input if invalid
  return phone;
};

// Get phone number error message
export const getPhoneErrorMessage = (phone: string): string | null => {
  if (!phone) return "Phone number is required";

  // Remove all non-digit characters
  const cleanedPhone = phone.replace(/\D/g, "");

  // Expect exactly 9 digits for Croatian mobile numbers
  if (cleanedPhone.length !== 9) {
    return "Phone number must consist of 9 digits";
  }

  // Ensure the number starts with a valid Croatian mobile prefix (e.g., 9)
  if (!cleanedPhone.startsWith('9')) {
    return "Phone number must start with 9";
  }

  return null;
};

// Discount utility functions
export const calculateDiscountedPrice = (
  originalPrice: number,
  discountPercentage: number
): number => {
  if (discountPercentage <= 0 || discountPercentage > 100) {
    return originalPrice;
  }
  return originalPrice * (1 - discountPercentage / 100);
};

export const isDiscountValid = (
  discountEndDate?: Date | { toDate: () => Date }
): boolean => {
  if (!discountEndDate) return false;

  let date: Date;
  // Handle Firestore Timestamp object which has a toDate method
  if (typeof (discountEndDate as any).toDate === "function") {
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

export const getActiveDiscount = (product: {
  discountPercentage?: number;
  discountEndDate?: any;
}): number | null => {
  if (
    !product.discountPercentage ||
    product.discountPercentage <= 0 ||
    !isDiscountValid(product.discountEndDate)
  ) {
    return null;
  }
  return product.discountPercentage;
};
