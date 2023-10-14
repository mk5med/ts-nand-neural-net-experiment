import { promises as fsPromises } from "fs";
import { loadDataset } from "./generateDataSet";
import { BinaryNetwork } from "./network";
import { train_genetic_algorithm } from "./trainers";
const WIDTH = 14;
const HEIGHT = 14;

async function main() {
  const testData = await loadDataset(WIDTH, HEIGHT, "np_dataset.txt");

  let network: BinaryNetwork = new BinaryNetwork(WIDTH * HEIGHT, 3, 3, 1);

  await train_genetic_algorithm({
    trainData: { network, data: testData },
    population_size: 200,
    error_epsilon: 0.0617,
    // maxGenerations: 100
  });

  // Save the network to json
  fsPromises.writeFile("np_network.json", JSON.stringify(network));

  /**
   * Final check
   */
  for (let [input, result] of testData) {
    network.setInputs(input);
    network.run();
    const _result = network.OutputNodes[0].value;
    const resultToBool = result > 0;
    console.assert(
      resultToBool === _result,
      `Expected ${resultToBool}. Got ${_result}. Input: ${JSON.stringify(
        input,
      )}`,
    );
  }
}
main();

function printNetwork(network: BinaryNetwork) {
  for (let i = 0; i < network.Layers.length; i++) {
    console.log(`Layer ${i}:`, network.Layers[i].map((e) => "⚪️").join(""));
  }
}
