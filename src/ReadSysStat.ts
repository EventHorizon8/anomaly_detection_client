import osu from 'node-os-utils';
import moment from "moment";
import appConfig from "./appConfig";
import {getDiskIoDemo, getNetworkIoDemo} from "./ReadSysStatDemo";


const getDiskSpace = async (): Promise<number> => {
  try {
    const freeData = await osu.drive.free(appConfig.sysStatDrive);
    return parseFloat(freeData.freeGb) || 0;
  } catch (error) {
    return -1;
  }
};

const getDiskIo = async (): Promise<number> => {
  return appConfig.sysStatFallbackMode ? getDiskIoDemo() : -1
};

const getCpuUtilization = async (): Promise<number> => {
  try {
    return osu.cpu.usage();
  } catch (error) {
    return -1;
  }
};

const getTotalRam = async (): Promise<number> => {
  try {
    const ramInfo =  await osu.mem.used();
    return Math.round(ramInfo.usedMemMb);
  } catch (error) {
    return -1;
  }
};

const getFreeRam = async (): Promise<number> => {
  try {
    const ramInfo =  await osu.mem.free();
    return Math.round(ramInfo.freeMemMb);
  } catch (error) {
    return -1;
  }
};

const getNetworkIo = async (): Promise<number> => {
  try {
    const networkInfo = await osu.netstat.inOut();
    if (typeof networkInfo === 'string') {
      return appConfig.sysStatFallbackMode ? getNetworkIoDemo() : -1
    } else {
      return networkInfo.total.inputMb + networkInfo.total.outputMb;
    }
  } catch (error) {
    return -1;
  }
};

export const getSysStat = async () => {
  return {
    diskSpace: await getDiskSpace(),
    cpu: await getCpuUtilization(),
    ram: await getTotalRam(),
    freeRam: await getFreeRam(),
    networkIo: await getNetworkIo(),
    diskIo: await getDiskIo(),
    dateTime: moment().toISOString(),
  }
}
