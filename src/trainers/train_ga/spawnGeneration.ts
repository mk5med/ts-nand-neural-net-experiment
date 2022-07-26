import { BinaryNetwork, NodeCoefficient } from "../../network";

// create generations
// test generations
// rank generations
// take top performers and combine dna
// create new generations with the combined DNA
/**
 * Creates a collection of networks with a certain size that are configured for a specific network configuration
 * @param trainData The data to train against
 * @param population_size The desired size of the population
 * @param generateCoefficients A callable method to generate coefficients
 * @returns The next generation of networks
 */
export function spawnGeneration(
  network: BinaryNetwork,
  population_size = 500,
  generateCoefficients: () => NodeCoefficient[],
) {
  let networks = [];

  for (let i = 0; i < population_size; i++) {
    networks.push(
      new BinaryNetwork(
        network.inputNodesCount,
        network.hiddenLayersCount,
        network.nodesPerHiddenLayerCount,
        network.outputNodesCount,
        generateCoefficients(),
      ),
    );
  }
  return networks;
}
