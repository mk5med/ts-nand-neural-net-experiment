import { generateRandomImage } from "./helpers/imageGeneration";
import * as fs from "fs";
import { TestData } from "./types";

export function generateDataSet(width: number, height: number) {
  let arr: TestData[] = [];
  for (let i = 0; i < 10000; i++) {
    let input = generateRandomImage(width, height);
    
    arr.push([
      input,
      input[0] && input[1] && input[2] && input[3] ? [true] : [false],
    ]);
  }
  return arr;
}
export async function loadDataset(
  width: number,
  height: number,
  fileName?: string,
) {
  if (fileName == undefined) {
    return generateDataSet(width, height);
  }
  // Check if the file exists
  const fileAccess = await fs.promises
    .access(fileName)
    .then((_) => true)
    .catch((e) => false);

  if (fileAccess === false) {
    // Create a new dataset
    const data = generateDataSet(width, height);

    // Save the dataset to the file
    await fs.promises.writeFile(fileName, JSON.stringify(data));
    return data;
  } else {
    // Load an existing dataset
    const data = await fs.promises.readFile(fileName);
    return JSON.parse(data.toString());
  }
}
