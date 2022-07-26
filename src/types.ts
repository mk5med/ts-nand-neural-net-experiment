import { BinaryNetwork } from "./network";

export type TestData = [input: boolean[], result: boolean[]];

export interface TrainData {
  network: BinaryNetwork;
  data: TestData[];
}
