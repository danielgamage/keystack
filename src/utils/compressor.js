export const compressSample = (input, threshold, ratio, knee) => {
  if (input > threshold) {
    return 1 * (input - threshold) / ratio + threshold;
  } else {
    return input;
  }
};
