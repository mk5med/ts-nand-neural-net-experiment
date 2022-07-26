import { BinaryNetwork } from "../../network";
import { TrainData } from "../../types";
import { generateRandomCoefficients } from "./coefficients";
import { evaluateGeneration } from "./evaluateGeneration";
import { spawnGeneration } from "./spawnGeneration";
import sha256 from "sha256";

interface TrainArgs {
  trainData: TrainData;
  population_size?: number;
  maxGenerations?: number;
  error_epsilon?: number;
}

export async function train({
  trainData,
  population_size = 10,
  maxGenerations = -1,
  error_epsilon = 0,
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
  let bestError = 1;
  let count_generations = 0;
  let errorHasNotImprovedCount = 0;

  do {
    const vals = await evaluateGeneration({
      error_epsilon,
      trainData,
      population_size,
      coefficientCount,

      networks,
      previousBestError: bestError,
      isAtLocalMinimum: errorHasNotImprovedCount == 10,
    });
    console.log(
      `Generation ${count_generations} with error`,
      bestError,
      vals.newError,
    );
    networks = vals.newNetworks;
    topPerformers = vals.topPerformers;

    // Exit if the error of the model is close to the accepted error rate
    if (vals.newError <= error_epsilon) {
      break;
    }

    // Reset the count if it has reached the limit
    if (errorHasNotImprovedCount == 10) {
      errorHasNotImprovedCount = 0;
    }

    // Increment a flag if the error has not improved this round
    if (bestError <= vals.newError) {
      errorHasNotImprovedCount++;
    }
    // Reset a flag if the error has improved
    else {
      errorHasNotImprovedCount = 0;
      bestError = vals.newError;
    }

    count_generations++;
  } while (
    maxGenerations == -1 ||
    (maxGenerations != -1 && count_generations < maxGenerations)
  );

  console.log("Solution found", bestError, topPerformers.length);

  trainData.network.setCoefficients(topPerformers[0].coefficients);
}
