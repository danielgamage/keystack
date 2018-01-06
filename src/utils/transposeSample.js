export default (noteIndex, tuning) => {
  return 2 ** ((-27 + noteIndex) / 12);
};
