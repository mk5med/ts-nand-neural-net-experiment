import { BinaryNetwork } from "./network";

export type TestData = [input: boolean[], proximity: number];

export interface TrainData {
  network: BinaryNetwork;
  data: TestData[];
}
