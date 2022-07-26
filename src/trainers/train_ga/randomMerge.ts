import { NodeCoefficient } from "../../network";

/**
 * Generate coefficients by randomly selecting values from a collection of other coefficients
 * This is a random merge
 * @param coefficients The set of coefficients to merge
 */
export function randomMerge(
  coefficients: NodeCoefficient[][],
): NodeCoefficient[] {
  // Get the size of the output array
  // This length is assumed to be the same for all coefficients in the coefficients array
  let coefficientsSize = coefficients[0].length;

  let arr: NodeCoefficient[] = [];
  for (let i = 0; i < coefficientsSize; i++) {
    // Select a random index
    const randomIndex = Math.floor(Math.random() * coefficients.length);

    // Use the random index to populate the array
    arr.push(coefficients[randomIndex][i]);
  }
  return arr;
}
