import { rval } from "./math";

// Suppose a 16x16 black and white photo
export function generateBlankImage(
  initial: boolean[] = [],
  w: number,
  h: number,
) {
  let arr = [];
  for (let i = 0; i < w * h; i++)
    if (i < initial.length) arr.push(initial[i]);
    else arr.push(false);
  return arr;
}

export function generateRandomImage(w: number, h: number) {
  let arr: boolean[] = [];
  for (let i = 0; i < w * h; i++) {
    arr.push(rval());
  }
  return arr;
}
