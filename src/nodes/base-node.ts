export abstract class BaseNode {
  /**
   * Evaluate a node
   * @param nodes The nodes connected to this node. This is usually all the nodes of the previous layer
   */
  abstract evaluate(nodes: any): void;
  abstract setCoefficient(nodeIndex: number, coefficient: number): void;
}
