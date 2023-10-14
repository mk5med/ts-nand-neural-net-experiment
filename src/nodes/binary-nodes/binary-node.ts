import { NodeCoefficient } from "../../network";
import { BaseNode } from "../base-node";

export enum Node_Type {
  INPUT,
  NAND,
  OUTPUT,
}

export abstract class BinaryNode extends BaseNode {
  public value: boolean = false;
  public coefficients: {
    [id: number]: number;
  } = {};

  constructor(private type: Node_Type) {
    super();
  }

  abstract evaluate(nodes: BinaryNode[]): void;

  setCoefficient(nodeIndex: number, coefficient: NodeCoefficient) {
    this.coefficients[nodeIndex] = coefficient;
  }
}
