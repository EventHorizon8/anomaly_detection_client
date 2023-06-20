import fs from 'fs';
import { parse } from 'csv-parse';
import appConfig from "./appConfig";
import { finished } from 'stream/promises';
import crypto from 'crypto';
import {AwsHashedLogInterface} from "./type/AwsLogType";

const readCsvFile = async (): Promise<AwsHashedLogInterface[]> => {
  const filePath = appConfig.awsLogFileLocation;

  let logList: AwsHashedLogInterface[] = [];

  const parser = parse(
    {delimiter: ','},
    (err, data: string[]) => {
      data.forEach((dataRow, key) => {
        if (!key) {
          return;
        }
        const md5encoder = crypto.createHmac("md5", 'AwsLogReader');
        let stack;
        try {
          stack = JSON.parse(dataRow[10]);
        } catch (error) {
          stack = [];
        }
        logList.push({
          // timestamp: (+ new Date()) - 500 + parseFloat(dataRow[0]),
          timestamp: parseFloat(dataRow[0]),
          processId: dataRow[1],
          threadId: dataRow[2],
          parentProcessId: dataRow[3],
          userId: dataRow[4],
          mountNamespace: dataRow[5],
          processName: dataRow[6],
          hostName: dataRow[7],
          eventId: dataRow[8],
          eventName: dataRow[9],
          stackAddresses: stack,
          argsNum: dataRow[11],
          returnValue: dataRow[12],
          args: dataRow[13],
          sus: dataRow[14],
          evil: dataRow[15],
          // Генерируем хеш
          hash: md5encoder.update(JSON.stringify(dataRow)).digest("hex"),
        });
      });
    }
  );


  fs.createReadStream(filePath).pipe(parser);
  await finished(parser);
  return logList;
}

export const readAwsLogs = async (lastTs: number, lastHash: string) => {
  const logList = await readCsvFile();
  if (lastTs && lastHash) {
    // Ищем искомую строку по timestamp и  хешу
    for (let logIdx = 0; logIdx < logList.length; logIdx ++) {
      const row = logList[logIdx];
      if ((row.timestamp === lastTs) && (row.hash === lastHash)) {
        if (logIdx === (logList.length - 1)) {
          return [];
        }
        return logList.slice(logIdx + 1);
      }
    }

  }

  return logList;
};

export const readAwsLogsDemo = async (): Promise<AwsHashedLogInterface[]> => {
  const logList = await readCsvFile();

  const result: AwsHashedLogInterface[] = [];
  let currentTs = (+ new Date()) / 1000;

  while (result.length < 1000) {
    currentTs -= Math.random();
    const logIdx = Math.floor(Math.random() * logList.length);
    const logRow = logList[logIdx];
    const md5encoder = crypto.createHmac("md5", 'AwsLogReader');
    const dataRow = {
      ...logRow,
      timestamp: currentTs,
    }

    result.push({
      ...dataRow,
      hash: md5encoder.update(JSON.stringify(dataRow)).digest("hex"),
    })
  }

  return result.reverse();
};
