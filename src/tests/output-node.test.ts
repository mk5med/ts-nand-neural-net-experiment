import { describe, it, expect } from "vitest";
import { InputNode } from "../nodes/input-node";
import { OutputNode } from "../nodes/output-node";

function can_create() {
  new OutputNode();
}

function evaluate(node: OutputNode, input: boolean[], expected: boolean) {
  node.evaluate(input.map((val) => new InputNode(val)));
  expect(node.value).toStrictEqual(expected); // `Output(${input.join(', ')}) returned ${node.value}`)
  return node.value;
}

function can_handle_two_arg_or() {
  let node = new OutputNode();
  evaluate(node, [false, false], false);
  evaluate(node, [false, true], true);
  evaluate(node, [true, false], true);
  evaluate(node, [true, true], true);
}

function can_handle_one_arg_or() {
  let node = new OutputNode();
  evaluate(node, [false], false);
  evaluate(node, [true], true);
}

export const tests = [can_create, can_handle_two_arg_or, can_handle_one_arg_or];

describe("OutputNode tests", () => {
  tests.forEach((test) => {
    it(`Testing ${test.name}`, () => {
      test();
    });
  });
});
