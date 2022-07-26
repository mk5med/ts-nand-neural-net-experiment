import { BinaryNetwork, NodeCoefficient } from "../../network";
import { randomMerge } from "./randomMerge";

export function errorDidNotImprove(count_minimumEvents: number, err: number) {
  count_minimumEvents++;

  return count_minimumEvents;
}
