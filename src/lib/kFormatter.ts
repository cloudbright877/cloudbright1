

/**
 * @param {number} num The number to format.
 * @returns {string} The formatted string.
 */
export default function kFormatter(num: number): string {
  if(!num) return "0";
  if (Math.abs(num) > 999999) {
    return `${Math.sign(num) * parseFloat((Math.abs(num) / 1000000).toFixed(1))} m`;
  } else if (Math.abs(num) > 999) {
    return `${Math.sign(num) * parseFloat((Math.abs(num) / 1000).toFixed(1))} k`;
  } else {
    return `${Math.sign(num) * parseFloat(Math.abs(num).toFixed(0))}`; // correct
  }
}
