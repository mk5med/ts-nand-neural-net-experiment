import { describe, it, expect } from "vitest";
import { BinaryNetwork } from "../network";

describe("Network tests", () => {
  it("Should have 1 output layer", () => {
    let network: BinaryNetwork = new BinaryNetwork(15 * 15, 1, 2, 1);
    expect(network.outputNodesCount).toEqual(network.OutputNodes.length);
  });
});
