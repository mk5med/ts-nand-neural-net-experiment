import * as fs from "fs";
import {
  generateBlankImage,
  generateRandomImage,
} from "./helpers/imageGeneration";
import { TestData } from "./types";

export function generateDataSet(width: number, height: number) {
  let arr: TestData[] = [];

  for (let i = 0; i < 10; i++) {
    arr.push([generateRandomImage(width, height), 0]);
  }

  // Check that the element immediately after the half is empty
  arr.push([generateHalfFilledImage(width, height, 0.5), 1]);
  for (let i = 0; i < 0.5; i += 0.01) {
    arr.push([generateHalfFilledImage(width, height, i), i]);
  }

  return arr;
}

function generateHalfFilledImage(
  width: number,
  height: number,
  fillFactor: number,
) {
  let input = generateBlankImage(width, height);

  // Check that the first half of the image is filled
  for (let i = 0; i < Math.floor(width * height * fillFactor); i++) {
    input[i] = true;
  }
  return input;
}

function correctDataset(width: number, height: number) {
  let input = generateBlankImage(width, height);
  let val = true;

  // Check that the first half of the image is filled
  for (let i = 0; i < (width * height) / 2; i++) {
    input[i] = true;
    val = val && input[i];
  }

  // Check that the element immediately after the half is empty
  val = val && !input[(width * height) / 2];
  return { input, val };
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
