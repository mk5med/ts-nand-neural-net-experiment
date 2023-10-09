import { NodeCoefficient } from "../../network";

/**
 *
 * @param coefficients
 * @returns A BigInt of encoded coefficients
 */
export function coefficientsToNumber(coefficients: NodeCoefficient[]) {
  // -1 | 0 | 1
  const binaryEncoding = coefficients
    .map((val) => {
      // val = 1
      let encoded = "1";
      if (val === 0) encoded = "0";
      return encoded;
    })
    .join("");

  // Parse the number as binary
  return BigInt(`0b${binaryEncoding}`);
}

export function numberToCoefficients(number: BigInt, len: number) {
  const binNumber = number.toString(2).padStart(len, "0");
  const decodedArray: NodeCoefficient[] = [];

  for (let i = 0; i < binNumber.length; i++) {
    // Extract the slice of 3 characters and convert it to a number
    const num = binNumber[i];

    let decodedVal: NodeCoefficient = 1;

    // Convert the bitmask to a NodeCoefficient
    if (num === "0") decodedVal = 0;

    // Add the decoded value to the coefficients array
    decodedArray.push(decodedVal);
  }

  return decodedArray;
}

/**
 * Calculate the mean of a list of BigInt's
 * @param bigInts A list of BigInts
 * @returns The mean of the bigInts list
 */
export function bigIntMean(bigInts: bigint[]) {
  const len = BigInt(bigInts.length);
  const sum = bigInts.reduce((prev, curr) => prev + curr);
  return sum / len;
}
