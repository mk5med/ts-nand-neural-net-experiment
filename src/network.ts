import { BinaryNode, InputNode, NANDNode, OutputNode } from "./node";
import { TestData } from "./types";
import { v4 } from "uuid";

const DEBUG_VERBOSE = true;
const log = (...data: any[]) => {
  if (DEBUG_VERBOSE) console.debug(...data);
};
export type NodeCoefficient = -1 | 0 | 1;
export class BinaryNetwork {
  public readonly Layers: BinaryNode[][] = [];
  public readonly InputNodes: InputNode[] = [];
  public readonly NANDNodes: NANDNode[] = [];
  public readonly OutputNodes: OutputNode[] = [];
  public totalConnectionCount: number;
  public readonly id = v4();

  constructor(
    public readonly inputNodesCount: number,
    public readonly hiddenLayersCount: number,
    public readonly nodesPerHiddenLayerCount: number,
    public readonly outputNodesCount: number,
    public coefficients: NodeCoefficient[] = [],
  ) {
    this.Layers.push([]);
    this.InputNodes = this.Layers[0];

    // Initialise the input nodes
    this.initializeInputNodes(inputNodesCount);

    this.initializeHiddenLayers(hiddenLayersCount, nodesPerHiddenLayerCount);

    let index = this.Layers.push([]) - 1;
    this.OutputNodes = this.Layers[index];
    this.initializeOutputLayers(outputNodesCount, index);

    if (coefficients.length != 0) {
      this.setCoefficients(coefficients);
    } else {
      this.initializeCoefficients(hiddenLayersCount, 1);
    }

    this.totalConnectionCount =
      inputNodesCount * nodesPerHiddenLayerCount +
      nodesPerHiddenLayerCount ** hiddenLayersCount +
      nodesPerHiddenLayerCount * outputNodesCount;
  }

  private initializeCoefficients(
    hiddenLayersCount: number,
    coefficientValue: -1 | 0 | 1,
  ) {
    for (
      let layerIndex = 1;
      layerIndex < 1 + hiddenLayersCount + 1;
      layerIndex++
    ) {
      for (
        let nodeIndex = 0;
        nodeIndex < this.Layers[layerIndex].length;
        nodeIndex++
      ) {
        for (
          let prevLayerNodeIndex = 0;
          prevLayerNodeIndex < this.Layers[layerIndex - 1].length;
          prevLayerNodeIndex++
        ) {
          // Set all coefficients to 1
          this.Layers[layerIndex][nodeIndex].setCoefficient(
            prevLayerNodeIndex,
            coefficientValue,
          );
        }
      }
    }
  }

  private initializeOutputLayers(outputNodesCount: number, index: number) {
    for (let i = 0; i < outputNodesCount; i++) {
      this.Layers[index].push(new OutputNode());
    }
  }

  private initializeHiddenLayers(
    hiddenLayersCount: number,
    nodesPerHiddenLayerCount: number,
  ) {
    for (let i = 0; i < hiddenLayersCount; i++) {
      let index = this.Layers.push([]) - 1;
      for (let j = 0; j < nodesPerHiddenLayerCount; j++) {
        let node = new NANDNode();
        this.Layers[index].push(node);
        this.NANDNodes.push(node);
      }
    }
  }

  private initializeInputNodes(inputNodesCount: number) {
    for (let i = 0; i < inputNodesCount; i++) {
      this.Layers[0].push(new InputNode(false));
    }
  }

  evaluateNetwork(startLayer = 1) {
    if (startLayer <= 0) {
      throw new Error("Start layers less than 1 are unsupported.");
    }

    if (startLayer >= this.Layers.length) {
      throw new Error(
        `Start layer is out of bounds. startLayer: ${startLayer}. available layers: ${this.Layers.length}`,
      );
    }

    // Iterate through all layers starting at startLayer
    for (
      let layerIndex = startLayer;
      layerIndex < this.Layers.length;
      layerIndex++
    ) {
      const layer = this.Layers[layerIndex];
      // Iterate through all nodes on each layer
      for (
        let nodeIndex = 0;
        nodeIndex < this.Layers[layerIndex].length;
        nodeIndex++
      ) {
        const previousLayer = this.Layers[layerIndex - 1];
        const currentNode = layer[nodeIndex];
        currentNode.evaluate(previousLayer);
      }
    }

    return;
  }

  setInputs(inputs: boolean[]) {
    // Set the inputs to each element in `args`
    for (let i = 0; i < this.InputNodes.length && i < inputs.length; i++) {
      this.InputNodes[i].value = inputs[i];
    }
  }

  clearInputs() {
    for (let i = 0; i < this.InputNodes.length; i++) {
      this.InputNodes[0].value = false;
    }
  }

  setCoefficients(coefficients: NodeCoefficient[]) {
    let count = 0;
    this.coefficients = coefficients;
    // Iterate through the layers
    for (let layerIndex = 1; layerIndex < this.Layers.length; layerIndex++) {
      // Iterate through each node
      for (
        let nodeIndex = 0;
        nodeIndex < this.Layers[layerIndex].length;
        nodeIndex++
      ) {
        // For each node, iterate through all nodes in the previous layer
        for (
          let prevLayerNodeIndex = 0;
          prevLayerNodeIndex < this.Layers[layerIndex - 1].length;
          prevLayerNodeIndex++
        ) {
          this.Layers[layerIndex][nodeIndex].setCoefficient(
            prevLayerNodeIndex,
            coefficients[count],
          );
          count++;
        }
      }
    }
  }

  toString() {
    return this.coefficients.join("-");
  }
}

export function networkError(testData: TestData[], network: BinaryNetwork) {
  let score = 0;
  // The maximum score is: maxScore of one test * count of all tests
  // The max score in each test is identical as they have the same size
  let maxScore = testData[0][1].length * testData.length;

  // For each test...
  for (let testIndex = 0; testIndex < maxScore; testIndex++) {
    const test = testData[testIndex];
    let result = networkEvaluateInput(network, test);

    for (let resultIndex = 0; resultIndex < test[1].length; resultIndex++) {
      score += Number(result[resultIndex] == test[1][resultIndex]);
    }
  }
  // console.log(score, maxScore)
  return fitnessScore(score, maxScore);
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

export function networkTest(outputMap: boolean[][][], network: BinaryNetwork) {
  let score = 0;
  let maxScore = outputMap[0][1].length * outputMap.length;

  for (let testIndex = 0; testIndex < maxScore; testIndex++) {
    network.setInputs(outputMap[testIndex][0]);
    network.evaluateNetwork();
    let result = network.OutputNodes.map((node) => node.value);

    for (let i = 0; i < outputMap[testIndex][1].length; i++) {
      log(
        `\t([${outputMap[testIndex][0]}] = ${outputMap[testIndex][1][i]}) => ${result[i]}`,
      );
      score += result[i] == outputMap[testIndex][1][i] ? 1 : 0;
    }
  }
  return fitnessScore(score, maxScore);
}

export function getNetworkError(
  network: BinaryNetwork,
  data: TestData[],
  verbose = false,
) {
  if (verbose) return networkTest(data, network);
  return networkError(data, network);
}

function fitnessScore(score: number, maxScore: number) {
  return 1 - score / maxScore;
}
