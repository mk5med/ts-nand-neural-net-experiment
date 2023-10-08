import { describe, it, expect } from "vitest";
import { BinaryNetwork } from "../network";

describe("Network tests", () => {
  it("Should correctly create output layers", () => {
    let network: BinaryNetwork = new BinaryNetwork(15 * 15, 1, 2, 1);
    expect(network.outputNodesCount).toEqual(network.OutputNodes.length);
  });
});
