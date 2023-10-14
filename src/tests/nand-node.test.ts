import { describe, it, expect } from "vitest";
import { InputNode } from "../nodes/binary-nodes/input-binary-node";
import { NANDNode } from "../nodes/binary-nodes/nand-binary-node";

function NANDNode_can_create() {
  let node = new NANDNode();
}

function evaluate(node: NANDNode, input: boolean[], expected: boolean) {
  node.evaluate(input.map((val) => new InputNode(val)));
  expect(node.value).toStrictEqual(expected); // `NAND(${input.join(', ')}) returned ${node.value}`
  return node.value;
}

function NANDNode_logic_2() {
  let node = new NANDNode();
  evaluate(node, [false, false], true);
  evaluate(node, [false, true], true);
  evaluate(node, [true, false], true);
  evaluate(node, [true, true], false);
}

function NANDNode_logic_1() {
  let node = new NANDNode();
  evaluate(node, [false], true);
  evaluate(node, [true], false);
}

export const tests = [NANDNode_can_create, NANDNode_logic_1, NANDNode_logic_2];

describe("NAND node tests", () => {
  tests.forEach((test) => {
    it(`Testing ${test.name}`, () => {
      test();
    });
  });
});
