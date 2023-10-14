import { BinaryNetwork } from "../../network";
import { evaluateNetworkWrapper } from "../../evaluateNetworkHelper";
import { TrainData } from "../../types";

interface Args {
  networks: BinaryNetwork[];
  trainData: TrainData;
  performerCount: number;
}

/**
 * Evaluate a list of networks and return the top performers.
 * Top performers have the lowest network error.
 * @param networks A list of networks to compare
 * @param trainData The data that was trained against
 * @param performerCount The top performers to return
 * @returns A list of top-performing networks sorted in descending order. The length of the list is `performerCount`
 */
export async function getTopPerformers(args: Args) {
  const promises = args.networks.map(
    (network) =>
      new Promise<number>((res) => {
        const error = evaluateNetworkWrapper(network, args.trainData.data);
        res(error);
      }),
  );

  const promisifiedResults = await Promise.all(promises);

  // Create a list of tuples showing network indices and their errors
  let results: { index: number; error: number }[] = args.networks.map(
    (network, index) => ({ index, error: promisifiedResults[index] }),
  );

  // Sort the tuple by the network error in ascending order
  results.sort((a, b) => a.error - b.error);
  let arr: BinaryNetwork[] = [];

  // Save the top performers into the output array
  for (let i = 0; i < args.performerCount; i++) {
    arr.push(args.networks[results[i].index]);
  }
  return { arr, results };
}
