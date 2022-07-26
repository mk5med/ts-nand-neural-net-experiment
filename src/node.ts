enum Node_Type {
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

export class InputNode extends BinaryNode {
  constructor(value: boolean) {
    super(Node_Type.INPUT);
    this.value = value;
  }

  evaluate(nodes: BinaryNode[]) {}
}

export class NANDNode extends BinaryNode {
  constructor() {
    super(Node_Type.NAND);
  }
  evaluate(nodes: BinaryNode[]): void {
    // The node is initially false
    this.value = false;
    for (let i = 0; i < nodes.length; i++) {
      let coefficient = this.coefficients[i];
      if (coefficient == 0) continue; // The input is ignored
      let val = nodes[i].value;

      if (coefficient == -1) val = !val; // The input is transformed
      //// GENERAL NAND. !(a ^ b ^ ... N) => NAND(a, b, ...N)
      // SHORTCUT: If any value is false, the output of NAND must be true
      if (val === false) {
        this.value = true;
        return;
      }
    }
  }
}

export class OutputNode extends BinaryNode {
  constructor() {
    super(Node_Type.OUTPUT);
  }
  evaluate(nodes: BinaryNode[]): void {
    this.value = false;
    for (let i = 0; i < nodes.length; i++) {
      let coefficient = this.coefficients[i];
      if (coefficient == 0) continue; // The input is ignored

      let val = nodes[i].value;
      if (coefficient == -1) val = !val; // The input is transformed
      // SHORTCUT: If any value is true, the output of OR must also true
      if (val) {
        this.value = true;
        return;
      }
    }
  }
}
