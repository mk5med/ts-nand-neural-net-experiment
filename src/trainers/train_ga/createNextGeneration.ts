import { BinaryNetwork, NodeCoefficient } from "../../network";
import { TrainData } from "../../types";
import {
  coefficientsToNumber,
  numberToCoefficients,
} from "./coefficientsHelper";
import { generateRandomCoefficients } from "./generateCoefficients";
import { selectSliceFromBigInt } from "./selectSliceFromBigInt";
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

  const networks = spawnGeneration(
    args.trainData.network,
    args.population_size,
    generateGenerationWithCommonCoefficients(
      coefficientCount,
      commonCoefficients,
    ),
  );

  // Insert the top performers into the network for the next generation
  // for (let i = 0; i < 1; i++) networks[i] = args.topPerformers[i];

  return networks;
}

export function generateGenerationWithCommonCoefficients(
  coefficientCount: number,
  commonCoefficients: bigint,
): () => NodeCoefficient[] {
  return () => {
    // Generate random data
    const data = generateRandomCoefficients(coefficientCount);

    // Compute
    let deviation = coefficientsToNumber(data);
    const len = deviation.toString(2).padStart(coefficientCount, "0").length;
    deviation = selectSliceFromBigInt(
      deviation,
      Math.floor(Math.random() * 20),
      Math.floor(len / 20),
    );

    const randomFromCommonSelections = [2, 4, 8, 16];
    const randomFromCommon = Math.floor(
      Math.random() * randomFromCommonSelections.length,
    );
    const randomIterations = Math.floor(Math.random() * 4);
    let randomCommon = BigInt(0b0);
    for (let i = 0; i < randomIterations; i++) {
      randomCommon |= selectSliceFromBigInt(
        commonCoefficients,
        Math.floor(
          Math.random() * randomFromCommonSelections[randomFromCommon],
        ),
        Math.floor(len / randomFromCommonSelections[randomFromCommon]),
      );
    }

    const outVal = randomCommon | deviation;

    // console.log(`\tDeviation slice: ${deviation.toString(2).padStart(len, "0").length} ${len}`);
    return numberToCoefficients(outVal, len);
  };
}
