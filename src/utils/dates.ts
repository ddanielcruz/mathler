/**
 * Gets the Unix timestamp (in milliseconds) for the start of the current day (midnight).
 *
 * @returns {number} Unix timestamp in milliseconds representing midnight of the current day
 */
export function getTodayTimestamp(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today.getTime();
}
