export const formatNumber = (number) => {
  // Convert to string with 3 decimal places
  const strNum = Number(number).toFixed(3);
  
  // If the number ends with .000, remove the decimal part
  if (strNum.endsWith('.000')) {
    return strNum.slice(0, -4);
  }
  
  return strNum;
};
