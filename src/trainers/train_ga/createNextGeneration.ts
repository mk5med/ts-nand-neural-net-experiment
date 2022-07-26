import lodash from "lodash";
import { BinaryNetwork } from "../../network";
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
  const coefficientCount = args.networks[0].coefficients.length;
  const { coef, commonTraits } = findCommonCoefficients(
    args.topPerformers,
    coefficientCount,
  );

  // For half the networks take the first half
  // For half
  args.networks = spawnGeneration(
    args.trainData.network,
    args.population_size,
    () => {
      // Generate random data
      const data = generateRandomCoefficients(coefficientCount);

      // Ensure the common coefficients of the networks that performed well are in each generation
      commonTraits.forEach((val, index) => {
        // Only introduce the coefficient if it is common and distribute it with probability
        if (val && Math.random() <= 0.8) {
          data[index] = coef[0][index];
        }
      });
      return data;
    },
  );

  return args.networks;
}

/**
 * Finds common coefficients between top performers to ideally move toward an optimal solution
 * @param topPerformers An array of networks that have a high score
 * @param coefficientCount The amount of coefficients to generate
 * @returns
 */
function findCommonCoefficients(
  topPerformers: BinaryNetwork[],
  coefficientCount: number,
) {
  const commonTraits = [];
  const coef = topPerformers.map((_) => _.coefficients);
  for (let i = 0; i < coefficientCount; i++) {
    // Get the coefficient from each network at the current index
    const coefs = coef.map((_) => _[i]);

    // Find the unique coefficients
    const uniqueCoefficients = lodash.uniq(coefs);

    // Mark the location
    commonTraits.push(uniqueCoefficients.length == 1);
  }
  return { coef, commonTraits };
}
