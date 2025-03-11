/**
 * Utility functions for unit conversion between metric and imperial systems
 */

/**
 * Convert kilograms to pounds
 * @param kg Weight in kilograms
 * @returns Weight in pounds (rounded to 1 decimal place)
 */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

/**
 * Convert pounds to kilograms
 * @param lbs Weight in pounds
 * @returns Weight in kilograms (rounded to 1 decimal place)
 */
export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

/**
 * Convert centimeters to feet and inches
 * @param cm Height in centimeters
 * @returns Object containing feet and inches
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

/**
 * Format centimeters as feet and inches string
 * @param cm Height in centimeters
 * @returns Formatted string (e.g., "5'11\"")
 */
export function formatCmToFeetInches(cm: number): string {
  const { feet, inches } = cmToFeetInches(cm);
  return `${feet}'${inches}\"`;
}

/**
 * Convert feet and inches to centimeters
 * @param feet Feet component of height
 * @param inches Inches component of height
 * @returns Height in centimeters (rounded to nearest whole number)
 */
export function feetInchesToCm(feet: number, inches: number): number {
  return Math.round((feet * 12 + inches) * 2.54);
}
