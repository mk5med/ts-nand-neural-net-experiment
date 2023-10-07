# ts-nand-neural-net-experiment
Experiments to make a neural net with NAND gates.

Universal logic primitives:

- AND
- OR
- NOT
- NAND (Minimal)
- NOR (Minimal)

The design of this machine is:

- A set of _n_ binary inputs set by the programmer
- A set of _o_ binary outputs set by the programmer which are true if any input is true
- A unitary NAND node which accepts _n_ inputs and generates outputs

Example neural net for AND operations: `a ^ b`

```
Layers: 0, 1, 2, 3
(i1) - | NAND(i1, i2, o) | - | NAND(o, o, o2) | - (o2)
(i2) - |                 | - |                |
```

## Getting started
1. Install `yarn` with `npm i -g yarn`.
2. Install dependencies with `yarn --frozenLockfile`.
3. Run `yarn start` to run the neural net training.
4. Run `yarn test` to run tests with vitest.

## Training
The training is currently done with a [genetic algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm) that generates coefficients and tries to find locally optimal solutions.
The top _n_ networks share their common coefficients with the next generation of networks and the loop continues until the calculated error passes a developer-specified threshold.
