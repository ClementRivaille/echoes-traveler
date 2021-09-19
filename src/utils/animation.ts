export function yieldTimeout(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
