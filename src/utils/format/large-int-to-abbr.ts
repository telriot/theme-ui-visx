/**
 *
 * @param int number to check
 * @param precision numbers to return after decimal point
 * @returns a shortened form for numbers >= 1000
 */

export const largeIntToAbbr = (int: number, precision = 1): string => {
  if (int >= 1000000000) return `${(int / 1000000000).toFixed(precision)}b`;
  if (int >= 1000000) return `${(int / 1000000).toFixed(precision)}m`;
  if (int >= 1000) return `${(int / 1000).toFixed(precision)}k`;
  return int.toString();
};
