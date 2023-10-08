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
  const tests = testData[0][1].length * testData.length;
  const maxScore = tests;

  // For each test...
  for (let testIndex = 0; testIndex < tests; testIndex++) {
    const test = testData[testIndex];
    let result = networkEvaluateInput(network, test);
    score += evaluateTest(test, result);
  }

  // console.log(score, maxScore)
  return fitnessScore(score, maxScore);
}

function evaluateTest(test: TestData, result: boolean[]) {
  let score = 0;
  const testResults = test[1];

  for (
    let testResultIndex = 0;
    testResultIndex < testResults.length;
    testResultIndex++
  ) {
    // If the result of the network matches the result of the test
    if (result[testResultIndex] == testResults[testResultIndex]) {
      score -= 0;
    } else {
      // Decrease the networks score for failing tests
      score += 100000000;
    }
  }
  return score;
}

/**
 * Evaluate a network when given test data
 * @param network The network to evaluate
 * @param testData The test data to use
 * @returns An array representing the result of the output nodes
 */
function networkEvaluateInput(network: BinaryNetwork, testData: boolean[][]) {
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
