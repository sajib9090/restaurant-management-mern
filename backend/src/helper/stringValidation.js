const stringValidation = (itemName) => {
  const trimmedName = itemName.trim();
  const sanitizedName = trimmedName.replace(/\s+/g, "-");

  // Check if the sanitizedName starts with a number or special character
  if (/^[0-9!@#$%^&*(),.?":{}|<>]/.test(sanitizedName)) {
    throw createError(
      400,
      "Item name cannot start with a number or special character."
    );
  }

  return sanitizedName;
};

export default stringValidation;
