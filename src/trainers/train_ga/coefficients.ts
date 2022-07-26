import { NodeCoefficient } from "../../network";

/// This involves creating many generations of networks
const coefficients: NodeCoefficient[] = [-1, 0, 1];
const randomCoefficient = () => coefficients[Math.floor(Math.random() * 3)];

export function generateRandomCoefficients(length: number) {
  let arr: NodeCoefficient[] = [];
  for (let i = 0; i < length; i++) {
    let d = randomCoefficient();
    arr.push(d);
  }
  return arr;
}

export function generateChildCoefficient(
  superior: NodeCoefficient[],
  propogationChance = 0.75,
) {
  let arr: NodeCoefficient[] = [];
  for (let i = 0; i < superior.length; i++) {
    if (Math.random() <= propogationChance) arr.push(superior[i]);
    else arr.push(randomCoefficient());
  }
  return arr;
}
