import { BinaryNetwork, NodeCoefficient } from "../../network";
import { TrainData } from "../../types";
import { generateRandomCoefficients } from "./coefficients";
import { spawnGeneration } from "./spawnGeneration";

interface CreateNextGenerationArgs {
  networks: BinaryNetwork[];
  trainData: TrainData;
  population_size: number;
  topPerformers: BinaryNetwork[];
}
export function createNextGeneration(args: CreateNextGenerationArgs) {
  // Convert the coefficients to BigInts for easier processing
  const coefficients = args.topPerformers.map((_) =>
    coefficientsToNumber(_.coefficients),
  );
  const coefficientCount = args.networks[0].coefficients.length;

  // Find the common coefficients by bitwise-and'ing each value
  const commonCoefficients = coefficients.reduce((prev, curr) => prev & curr);

  // Calculate the mean and ensure the commonCoefficients are still enabled
  const meanCoefficient = bigIntMean(coefficients) | commonCoefficients;

  const networks = spawnGeneration(
    args.trainData.network,
    args.population_size,
    () => {
      // Generate random data
      const data = generateRandomCoefficients(coefficientCount);
      const direction = BigInt(Math.random() < 0.5 ? 1 : -1);

      // Compute
      const deviation =
        (coefficientsToNumber(data) / BigInt(100 / 0.1)) * direction;

      const outVal = meanCoefficient + deviation;
      return numberToCoefficients(outVal);
    },
  );

  // Insert the top performers into the network for the next generation
  for (let i = 0; i < 2; i++) networks[i] = args.topPerformers[i];

  return networks;
}

/**
 *
 * @param coefficients
 * @returns A BigInt of encoded coefficients
 */
function coefficientsToNumber(coefficients: NodeCoefficient[]) {
  // -1 | 0 | 1
  const binaryEncoding = coefficients
    .map((val) => {
      // val = 1
      let encoded = "111";
      if (val === -1) encoded = "110";
      else if (val === 0) encoded = "100";
      return encoded;
    })
    .join("");

  // Parse the number as binary
  return BigInt(`0b${binaryEncoding}`);
}

function numberToCoefficients(number: BigInt) {
  const binNumber = number.toString(2);
  const decodedArray: NodeCoefficient[] = [];
  for (let i = 0; i < binNumber.length; i += 3) {
    // Extract the slice of 3 characters and convert it to a number
    const num = binNumber.slice(i, i + 3);

    let decodedVal: NodeCoefficient = 1;

    // Convert the bitmask to a NodeCoefficient
    if (num === "110") decodedVal = -1;
    else if (num === "100") decodedVal = 0;

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
function bigIntMean(bigInts: bigint[]) {
  const len = BigInt(bigInts.length);
  const sum = bigInts.reduce((prev, curr) => prev + curr);
  return sum / len;
}
