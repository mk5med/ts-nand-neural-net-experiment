import { v4 } from "uuid";
import { BinaryNode } from "./nodes/node";
import { InputNode } from "./nodes/input-node";
import { OutputNode } from "./nodes/output-node";
import { NANDNode } from "./nodes/nand-node";

const DEBUG_VERBOSE = true;
export const log = (...data: any[]) => {
  if (DEBUG_VERBOSE) console.debug(...data);
};
export type NodeCoefficient = 0 | 1;
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
    this.initializeOutputLayer(outputNodesCount, index);

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

  /**
   * Initialises the coefficients array
   * @param hiddenLayersCount
   * @param coefficientValue
   */
  private initializeCoefficients(
    hiddenLayersCount: number,
    coefficientValue: NodeCoefficient,
  ) {
    // For all layers
    for (
      let layerIndex = 1;
      layerIndex < 1 + hiddenLayersCount + 1;
      layerIndex++
    ) {
      // For all nodes
      for (
        let nodeIndex = 0;
        nodeIndex < this.Layers[layerIndex].length;
        nodeIndex++
      ) {
        // For all node connections from the previous layer
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

  /**
   * Initialises the output layer
   * @param outputNodesCount
   * @param index
   */
  private initializeOutputLayer(outputNodesCount: number, index: number) {
    for (let i = 0; i < outputNodesCount; i++) {
      this.Layers[index].push(new OutputNode());
    }
  }

  /**
   * Initialises the hidden layers
   * @param hiddenLayersCount
   * @param nodesPerHiddenLayerCount
   */
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

  /**
   * Initialises the input nodes
   * @param inputNodesCount
   */
  private initializeInputNodes(inputNodesCount: number) {
    for (let i = 0; i < inputNodesCount; i++) {
      this.Layers[0].push(new InputNode(false));
    }
  }

  /**
   * Evaluates the network from a starting layer
   * If the `startLayer` is not specified this will evaluate from the start of the network
   * @param startLayer The layer to start at. Defaults to 1
   * @returns
   */
  run(startLayer = 1) {
    //// Check the startLayer is in bounds
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
      // Create a reference to the layer
      const layer = this.Layers[layerIndex];
      // Iterate through all nodes on each layer
      for (let nodeIndex = 0; nodeIndex < layer.length; nodeIndex++) {
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

  /**
   * Set the coefficients of the network for each node
   * @param coefficients
   */
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
