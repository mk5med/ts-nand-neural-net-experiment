import { BinaryNode, Node_Type } from "./binary-node";

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

      // if (coefficient == -1) val = !val; // The input is transformed
      //// GENERAL NAND. !(a ^ b ^ ... N) => NAND(a, b, ...N)
      // SHORTCUT: If any value is false, the output of NAND must be true
      if (val === false) {
        this.value = true;
        return;
      }
    }
  }
}
