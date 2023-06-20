import dotenv from "dotenv";
dotenv.config();

const appConfig = {
  serverPort: process.env.SERVER_PORT || '80',
  verifyToken: process.env.VERIFY_TOKEN || '',
  sysStatDemoMode: !!parseInt(process.env.SYS_STAT_DEMO_MODE || '0', 10),
  sysStatFallbackMode: !!parseInt(process.env.SYS_STAT_FALLBACK_MODE || '0', 10),
  sysStatDrive: process.env.SYS_STAT_DRIVE || "/",
  awsLogFileLocation: process.env.AWS_LOG_FILE_LOCATION || '',
  awsLogFileRotateMode: !!parseInt(process.env.AWS_LOG_FILE_ROTATE_MODE || '0', 10),
  projectDir: __dirname,
};

export default appConfig;
