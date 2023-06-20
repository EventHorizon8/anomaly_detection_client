import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import {getSysStat} from "./src/ReadSysStat";
import appConfig from "./src/appConfig";
import {getSysStatDemo} from "./src/ReadSysStatDemo";
import {readAwsLogs, readAwsLogsDemo} from "./src/ReadAwsLogs";

dotenv.config();

const app: Express = express();
const port = appConfig.serverPort;

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/data', async (req: Request, res: Response) => {
  console.log('Входящий запрос от Core');
  const token = req.query.access_token || '';
  const lastTs = parseFloat(req.query.last_ts as string || '0') || 0;
  const lastHash = req.query.last_hash as string || '';
  const awsLogLimit = parseInt(req.query.aws_log_limit as string || '0', 10) || null;
  // Сверяем токен
  if (token !== appConfig.verifyToken) {
    return res.status(401).send({ error: true, message: 'Invalid access token'})
  }

  const awsLogs = appConfig.awsLogFileRotateMode
    ? await readAwsLogsDemo()
    : await readAwsLogs(lastTs, lastHash);

  return res.send({
    stats: appConfig.sysStatDemoMode ? getSysStatDemo() : await getSysStat(),
    logsType: 'AWSSystemLog',
    logs: awsLogLimit ? awsLogs.slice(0, awsLogLimit) : awsLogs ,
  });
});

// app.post("/test", async (req, res) => {
//   // Parse the request body from the POST
//   const body = req.body;
//
//   // const prompt = 'Tell me about M1 processors';
//   const prompt = req.body.prompt;
//   console.log('Prompt: ' + prompt + "\n\n");
//   return res.status(200).send({ message: 'test' });
// });
app.listen(port, () => {
  console.log(`⚡️[server]: Сервер запущен http://localhost:${port}`);
});
