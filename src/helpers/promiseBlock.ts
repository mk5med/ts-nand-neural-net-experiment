export function promiseBlock<T>(promise: Promise<T>, defaultVal = null) {
  let result: T | any = defaultVal;
  const x = promise
    .then((res) => {
      result = res;
    })
    .catch((err) => {
      throw new Error("promiseBlock Error: " + err);
    });
  // while (x && result == defaultVal);
  return result as T;
}
