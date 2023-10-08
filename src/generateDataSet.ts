import * as fs from "fs";
import { generateRandomImage } from "./helpers/imageGeneration";
import { TestData } from "./types";

export function generateDataSet(width: number, height: number) {
  let arr: TestData[] = [];
  // Iterate to create a dataset of images
  for (let i = 0; i < 20000; i++) {
    let input = generateRandomImage(width, height);
    let val = input[0];

    // Check that the first half of the image is filled
    for (let i = 0; i < (width * height) / 2; i++) {
      val = val && input[i];
    }

    // Check that the element immediately after the half is empty
    val = val && !input[(width * height) / 2];

    // Append the test to the dataset
    arr.push([input, [val]]);
  }
  return arr;
}

export async function loadDataset(
  width: number,
  height: number,
  fileName?: string,
): Promise<TestData[]> {
  // No file name given
  if (fileName == undefined) {
    // Generate a random dataset without saving it
    return generateDataSet(width, height);
  }

  // Check if the file exists
  const fileAccess = await fs.promises
    .access(fileName)
    .then((_) => true)
    .catch((e) => false);

  // The file does not exist
  if (fileAccess === false) {
    // Create a new dataset
    const data = generateDataSet(width, height);

    // Save the dataset to the file
    await fs.promises.writeFile(fileName, JSON.stringify(data));
    return data;
  }

  // The file exists
  // Load an existing dataset
  const data = await fs.promises.readFile(fileName);
  return JSON.parse(data.toString());
}
