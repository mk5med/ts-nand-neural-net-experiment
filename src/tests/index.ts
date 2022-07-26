import { tests as NAND_TESTS } from "./NANDNode.test";
import { tests as Output_TESTS } from "./OutputNode.test";
function run() {
  NAND_TESTS.forEach((e) => e());
  Output_TESTS.forEach((e) => e());
}

run();
