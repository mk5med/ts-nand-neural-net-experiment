import { BinaryNetwork } from "../../network";
import { TrainData } from "../../types";
import { generateRandomCoefficients } from "./coefficients";
import { createNextGeneration } from "./createNextGeneration";
import { getTopPerformers } from "./getTopPerformers";
import { spawnGeneration } from "./spawnGeneration";

interface EvaluateGenerationArgs {
  error_epsilon: number;
  trainData: TrainData;
  population_size: number;
  coefficientCount: number;

  networks: BinaryNetwork[];
  previousBestError: number;
  isAtLocalMinimum: boolean;
}
export async function evaluateGeneration({
  networks,
  error_epsilon,
  trainData,
  previousBestError,
  population_size,
  coefficientCount,
  ...args
}: EvaluateGenerationArgs): Promise<{
  newNetworks: BinaryNetwork[];
  topPerformers: BinaryNetwork[];
  newError: number;
}> {
  //// 1) EVALUATE
  //// 2) Score
  // Evaluate the current generation and sort them in descending order of their performance
  const { arr: topPerformers, results } = await getTopPerformers({
    networks,
    trainData,
    performerCount: 5,
  });

  //// Check for end state
  // Get the error of the top performer
  let bestErrorOfGeneration = results[0].error;

  // 4) Create the next generation
  if (args.isAtLocalMinimum) {
    networks = spawnGeneration(trainData.network, population_size, () =>
      generateRandomCoefficients(coefficientCount),
    );
  } else {
    networks = createNextGeneration({
      networks,
      trainData,
      population_size,
      topPerformers,
    }); // Ensure that the best error will at least never increase
  }

  return {
    newNetworks: networks,
    newError: bestErrorOfGeneration,
    topPerformers,
  };
}
