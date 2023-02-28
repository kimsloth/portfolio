// @ts-ignore
import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import { ErrorMessageMode, RequestOptions } from '/#/axios';
import { Response } from '/@/api/model/base';
import * as Model from '/@/model/robot';
// @ts-ignore
import * as Params from '/@/api/params/robot';

const Path = {
  robotList: '/robots',
  robotDetail: (rid) => `/robots/${rid}`,
  robotCommand: (rid, command) => `/robots/${rid}/${command}`,
  currentJobOfRobot: (robotId) => `/robots/${robotId}/jobs`,
  manualTask: (robotId, taskId) => `/robots/${robotId}/assign/${taskId}`,
  jogOfRobot: (robotId) => `/robots/${robotId}/cmdVel`,
  initailPos: (robotId) => `/robots/${robotId}/initPose`,
};
Object.freeze(Path);

export { Path, Model, Params };

const getOptions = (options: RequestOptions = {}) => {
  return getGlobalRequestOptions({
    ...{
      apiUrl: '/mock',
    },
    ...options,
  });
};

export enum Command {
  AUTO = 'auto',
  MANUAL = 'manual',
  RESUME = 'resume',
  PAUSE = 'pause',
  CANCEL = 'cancel',
  WAKEUP = 'wakeup',
}

export async function getRobotList(params) {
  const data = await defHttp.get<Model.RobotList>({ url: Path.robotList, params }, getOptions());
  return jsonParsing.deserializeObject(data, Model.RobotList);
}

export async function getRobotDetail(id: string, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.RobotDetailInfo>(
    { url: Path.robotDetail(id) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.RobotDetailInfo);
}

export async function sendTask(params: { robotId: string; taskId: number }) {
  const data = await defHttp.post<Response>(
    { url: Path.manualTask(params.robotId, params.taskId) },
    getOptions({ errorMessageMode: 'modal', isTransformResponse: false }),
  );
  return data.code;
}

export async function getRobotListArray() {
  const data = await defHttp.get<Model.RobotList>(
    { url: Path.robotList, params: { size: 1000 } },
    getOptions(),
  );
  return jsonParsing.deserializeArray(data.content, Model.RobotInfo);
}

/**
 * 로봇 정보 수정
 */
export async function modifyRobot(
  id: string,
  params: Model.RobotModifyInfo,
  mode: ErrorMessageMode = 'modal',
) {
  await defHttp.put<Model.RobotModifyInfo>(
    { url: Path.robotDetail(id), params },
    { errorMessageMode: mode },
  );
}

export async function createRobot(params: Model.RobotCreateInfo, mode: ErrorMessageMode = 'modal') {
  await defHttp.post<Model.RobotCreateInfo>(
    { url: Path.robotList, params },
    { errorMessageMode: mode },
  );
}

/*export async function updateUserInfo(id: number, params: Params.Signup) {
  const data = await defHttp.put<Response>(
    { url: Path.userInfo(id), params },
    getOptions({ errorMessageMode: 'modal', isTransformResponse: false }),
  );
  return jsonParsing.deserializeObject(data, Response) as Response;
}*/

/**
 * 로봇별 현재 수행중인 Job 조회
 */
export async function getCurrentJobOfRobot(robotId: string) {
  const data = await defHttp.get<Response>(
    { url: Path.currentJobOfRobot(robotId) },
    getOptions({ isTransformResponse: false }),
  );
  if (data.hasOwnProperty('payload')) {
    if (data) return jsonParsing.deserializeObject(data.payload, Model.JobInfo);
  } else {
    return null;
  }
}

/**
 * 로봇별 현재 수행중인 Job 조회
 */
export async function getCurrentJobOfRobotV1(robotId: string) {
  const data = await defHttp.get<Response>(
    { url: Path.currentJobOfRobot(robotId) },
    getOptions({ isTransformResponse: false }),
  );

  return jsonParsing.deserializeObject(data, Response);
}

/**
 * 로봇 명령
 */
export async function setRobotCommand(
  robotId: string,
  command: Command,
  mode: ErrorMessageMode = 'modal',
) {
  const path = Path.robotCommand(robotId, command);
  const reulst = await defHttp.post(
    { url: path },
    getOptions({ errorMessageMode: mode, isTransformResponse: false }),
  );
  return reulst;
}

/**
 * 로봇 명령
 */
export async function setRobotInitailPos(
  robotId: string,
  params: any,
  mode: ErrorMessageMode = 'modal',
) {
  const path = Path.initailPos(robotId);
  const result = await defHttp.post(
    { url: path, params },
    getOptions({ errorMessageMode: mode, isTransformResponse: false }),
  );

  return result;
}

/**
 * 로봇 조그
 */
export async function setJogCmdVel(robotId: string, params: { linear: number; angular: number }) {
  const path = Path.jogOfRobot(robotId);
  await defHttp.post({ url: path, params });
}
