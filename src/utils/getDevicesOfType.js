export default (state, devices, type) => {
  return devices
    .map(el => state.devices[el])
    .filter(el => el.deviceType === type);
};
