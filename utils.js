/**
 * @module Utils
 */

/**
 * Parses a price string and converts it to a float.
 * @memberof module:Utils
 * @param {string} priceStr - The price string to be parsed.
 * @returns {number} - The parsed price as a float.
 */
export const parsePrice = (priceStr) => {
  return parseFloat(priceStr.replace(/[^0-9.-]+/g, '')) || 0;
};

/**
 * Parses a number from a string, returning a default value if NaN.
 * @memberof module:Utils
 * @param {string} str - The string to be parsed as a number.
 * @param {number} [defaultValue=0] - The default value to return if parsing fails.
 * @returns {number} - The parsed number or the default value.
 */
export const parseNumber = (str, defaultValue = 0) => {
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
};