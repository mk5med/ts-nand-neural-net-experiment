import { BinaryNetwork } from "../../network";
import { TrainData } from "../../types";
import { generateRandomCoefficients } from "./generateCoefficients";
import { evaluateGeneration } from "./evaluateGeneration";
import { spawnGeneration } from "./spawnGeneration";

interface TrainArgs {
  trainData: TrainData;
  population_size?: number;
  maxGenerations?: number;
  error_epsilon?: number;
  isAtLocalMinimumThreshold?: number;
}

export async function train({
  trainData,
  population_size = 10,
  maxGenerations = -1,
  error_epsilon = 0,
  isAtLocalMinimumThreshold = 10000,
  ...args
}: TrainArgs) {
  // The total number of connections (coefficients)
  const coefficientCount = trainData.network.totalConnectionCount;

  // Create an initial network
  let networks: BinaryNetwork[] = spawnGeneration(
    trainData.network,
    population_size,
    () => generateRandomCoefficients(coefficientCount),
  );

  let topPerformers: BinaryNetwork[] = [];
  let bestError: number | null = null;
  let count_generations = 0;
  let errorHasNotImprovedCount = 0;

  do {
    const isAtLocalMinimum =
      errorHasNotImprovedCount == isAtLocalMinimumThreshold;
    const vals = await evaluateGeneration({
      error_epsilon,
      trainData,
      population_size,
      coefficientCount,

      networks,
      isAtLocalMinimum,
    });
    console.log(
      `Generation ${count_generations} with error`,
      bestError,
      vals.newError,
    );
    networks = vals.newNetworks;
    topPerformers = vals.topPerformers;

    // Reset the count if it has reached the limit
    if (isAtLocalMinimum) {
      errorHasNotImprovedCount = 0;
    }

    // Initialise the error if it is unset
    if (bestError == null) {
      bestError = vals.newError;
    }
    // Increment a flag if the error has not improved this round
    else if (bestError <= vals.newError) {
      errorHasNotImprovedCount++;
    }
    // Reset a flag if the error has improved
    else {
      errorHasNotImprovedCount = 0;
      bestError = vals.newError;
      break;
    }

    // Exit if the error of the model is close to the accepted error rate
    if (vals.newError <= error_epsilon) {
      break;
    }

    count_generations++;
  } while (
    maxGenerations == -1 ||
    (maxGenerations != -1 && count_generations < maxGenerations)
  );

  console.log(`Solution found. Best error: ${bestError}`);

  trainData.network.setCoefficients(topPerformers[0].coefficients);
}
