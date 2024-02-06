const stringToNumber = (value) => {
  if (typeof value === "string") {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      throw new Error(`Invalid numeric value: ${value}`);
    }
    return numericValue;
  }
  return value;
};
export default stringToNumber;
