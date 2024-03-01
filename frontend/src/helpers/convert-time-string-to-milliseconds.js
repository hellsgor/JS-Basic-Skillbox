export function convertTimeStringToMilliseconds(timeString) {
  const multiplier = timeString.includes('s') ? 1000 : 1;
  const numericValue = parseFloat(timeString);
  return isNaN(numericValue) ? null : numericValue * multiplier;
}
