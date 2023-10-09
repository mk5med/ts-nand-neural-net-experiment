export enum Node_Type {
  INPUT,
  NAND,
  OUTPUT,
}
export abstract class BinaryNode {
  public value: boolean = false;
  public coefficients: {
    [id: number]: number;
  } = {};
  constructor(private type: Node_Type) {}
  /**
   * Evaluate a node
   * @param nodes The nodes connected to this node. This is usually all the nodes of the previous layer
   */
  abstract evaluate(nodes: BinaryNode[]): void;

  setCoefficient(nodeIndex: number, coefficient: -1 | 0 | 1) {
    this.coefficients[nodeIndex] = coefficient;
  }
}
