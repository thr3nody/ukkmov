export const useFormatFloat = (
  floatValue: number | string,
): number | string => {
  const value = parseFloat(String(floatValue));
  if (isNaN(value)) {
    return "N/A";
  }
  return value.toFixed(1);
};
