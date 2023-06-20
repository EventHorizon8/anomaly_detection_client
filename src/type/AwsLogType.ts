
export interface AwsPureLogInterface {
  timestamp: number,
  processId: string,
  threadId: string,
  parentProcessId: string,
  userId: string,
  mountNamespace: string,
  processName: string,
  hostName: string,
  eventId: string,
  eventName: string,
  stackAddresses: string[],
  argsNum: string,
  returnValue: string,
  args: string,
  sus: string,
  evil: string,
}


export interface AwsHashedLogInterface extends AwsPureLogInterface {
  hash: string,
}
