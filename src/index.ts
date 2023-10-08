import { promises as fsPromises } from "fs";
import { loadDataset } from "./generateDataSet";
import { BinaryNetwork } from "./network";
import { train_genetic_algorithm } from "./trainers";
const WIDTH = 14;
const HEIGHT = 14;

async function main() {
  const data = await loadDataset(WIDTH, HEIGHT, "np_dataset.txt");

  let network: BinaryNetwork = new BinaryNetwork(WIDTH * HEIGHT, 1, 1, 1);

  await train_genetic_algorithm({
    trainData: { network, data: data.slice(0, Math.floor(data.length / 2)) },
    population_size: 100,
    error_epsilon: 0.0617,
  });

  printNetwork(network);

  // Save the network to json
  fsPromises.writeFile("np_network.json", JSON.stringify(network));

  /**
   * Final check
   */
  for (let [input, result] of data) {
    network.setInputs(input);
    network.evaluateNetwork();
    const _result = network.OutputNodes[0].value;
    console.assert(result[0] === _result, `Expected ${result}. Got ${_result}`);
  }
}
main();

function printNetwork(network: BinaryNetwork) {
  for (let i = 0; i < network.Layers.length; i++) {
    console.log(`Layer ${i}:`, network.Layers[i].map((e) => "⚪️").join(""));
  }
}
