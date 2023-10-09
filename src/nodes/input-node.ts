import { BinaryNode, Node_Type } from "./node";

export class InputNode extends BinaryNode {
  constructor(value: boolean) {
    super(Node_Type.INPUT);
    this.value = value;
  }

  evaluate(nodes: BinaryNode[]) {}
}
