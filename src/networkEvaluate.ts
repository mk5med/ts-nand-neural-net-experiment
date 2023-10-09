import { BinaryNetwork } from "./network";
import { TestData } from "./types";

/**
 * Network evaluation
 * @param testData The data to test
 * @param network The network to evaluate
 * @returns
 */

export function networkError(testData: TestData[], network: BinaryNetwork) {
  let score = 0;
  // The maximum score is: maxScore of one test * count of all tests
  // The max score in each test is identical as they have the same size
  const tests = testData.length;
  const maxScore = tests;

  // For each test...
  for (let testIndex = 0; testIndex < tests; testIndex++) {
    const test = testData[testIndex];
    let result = networkEvaluateInput(network, test);
    score += evaluateTest(test, result[0]);
  }

  // console.log(score, maxScore)
  return fitnessScore(score, maxScore);
}

function evaluateTest(test: TestData, result: boolean) {
  let score = 0;
  let proximity = test[1];
  // The test has a score of zero
  if (proximity === 0 && !result) {
    return 0;
  }

  // The test has a proximity scale, but the result was false
  if (0 < proximity && !result) {
    // Set the proximity to zero
    proximity = 0;
  }

  // The score is weighted by the proximity
  score += 10000 * (1 - proximity);

  return score;
}

/**
 * Evaluate a network when given test data
 * @param network The network to evaluate
 * @param testData The test data to use
 * @returns An array representing the result of the output nodes
 */
function networkEvaluateInput(network: BinaryNetwork, testData: TestData) {
  // Set the inputs
  network.setInputs(testData[0]);
  network.evaluateNetwork();

  // Collect the outputs
  let result = network.OutputNodes.map((node) => node.value);
  return result;
}

export function getNetworkError(
  network: BinaryNetwork,
  data: TestData[],
  verbose = false,
) {
  return networkError(data, network);
}
function fitnessScore(score: number, maxScore: number) {
  return score;
  return 1 - score / maxScore;
}
