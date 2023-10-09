import { tests as NAND_TESTS } from "./nand-node.test";
import { tests as Output_TESTS } from "./output-node.test";
function run() {
  NAND_TESTS.forEach((e) => e());
  Output_TESTS.forEach((e) => e());
}

run();
