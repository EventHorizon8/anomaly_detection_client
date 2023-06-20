import moment from "moment";

export const getDiskSpaceDemo = (): number => {
  return 12.5 + Math.random();
};

export const getDiskIoDemo = (): number => {
  return Math.round(Math.random() * 100);
};

export const getCpuUtilizationDemo = (): number => {
  return 50 + Math.round(Math.random() * 15);
};

export const getTotalRamDemo = (): number => {
  return 1400 + Math.round(Math.random() * 50);
};

export const getFreeRamDemo = (): number => {
  return 16000 - (1400 + Math.round(Math.random() * 50));
};

export const getNetworkIoDemo = (): number => {
  return Math.round(Math.random() * 50);
};

export const getSysStatDemo = () => {
  return {
    diskSpace: getDiskSpaceDemo(),
    cpu: getCpuUtilizationDemo(),
    ram: getTotalRamDemo(),
    freeRam: getFreeRamDemo(),
    networkIo: getNetworkIoDemo(),
    diskIo: getNetworkIoDemo(),

    dateTime: moment().toISOString(),
  }
}
