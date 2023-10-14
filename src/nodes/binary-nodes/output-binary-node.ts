import { BinaryNode, Node_Type } from "./binary-node";

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
      // if (coefficient == -1) val = !val; // The input is transformed
      // SHORTCUT: If any value is true, the output of OR must also true
      if (val) {
        this.value = true;
        return;
      }
    }
  }
}
