/**
 * Selects a random bitwise slice from a bigint
 * @param deviation
 * @returns A random slice from a bigint with the surrounding numbers set to zero
 */
export function selectSliceFromBigInt(
  deviation: bigint,
  _sliceIndex: number,
  _slices: number,
) {
  const len = deviation.toString(2).length;

  // Select a slice from the deviation
  const sliceSize = BigInt(Math.floor(len / _slices));
  const sliceIndex = BigInt(_sliceIndex);

  const moveForward = (BigInt(_slices - 1) - sliceIndex) * sliceSize;

  // Mask to hide the selected MSB
  const mask =
    // len - sliceIndex * sliceSize calculates the number of binary digits up to sliceIndex
    (BigInt(0b1) << (BigInt(len) - sliceIndex * sliceSize)) - BigInt(1);

  // Set the LSB outside the slice to zero
  deviation = (deviation >> moveForward) << moveForward;
  // Set the MSB outside the slice to zero
  deviation = deviation & mask;
  return deviation;
}
