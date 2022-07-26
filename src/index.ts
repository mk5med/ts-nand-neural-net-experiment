import { BinaryNetwork, getNetworkError } from "./network";
import { train_genetic_algorithm } from "./trainers";

import { loadDataset } from "./generateDataSet";
const WIDTH = 14;
const HEIGHT = 14;

async function main() {
  const data = await loadDataset(WIDTH, HEIGHT /* "dataset.txt" */);

  let network: BinaryNetwork = new BinaryNetwork(WIDTH * HEIGHT, 1, 1, 1);

  await train_genetic_algorithm({
    trainData: { network, data },
    population_size: 10,
    error_epsilon: 0.0617,
  });

  console.log("Final error:", getNetworkError(network, data, false));

  for (let i = 0; i < network.Layers.length; i++) {
    console.log(
      `Layer ${i}:`,
      network.Layers[i]
        .map((e) => JSON.stringify(e.coefficients))
        .join("--------"),
    );
  }
  const [input, result] = data[0];
  network.setInputs(input);
  network.evaluateNetwork();
  console.log(
    `Expected ${result}. Got ${JSON.stringify(network.OutputNodes[0].value)}`,
  );
}
main();
