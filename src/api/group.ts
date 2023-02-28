import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import type { ErrorMessageMode, RequestOptions } from '/#/axios';

import * as Model from '/@/model/group';

const Path = {
  groups: '/grps',
  save: (id) => `/grps/${id}`,
  _delete: (id) => `/grps/${id}`,
  detail: (id) => `/grps/${id}`,
  item: (id, item) => Path.groups + `/${id}/${item}`,
  robotList: '/robots',
  deviceList: '/devices',
  spotsList: '/spots',
};
Object.freeze(Path);

export { Path, Model };
export type resultType = {
  code: number;
};
const getOptions = (options: RequestOptions = {}) => {
  return getGlobalRequestOptions({
    ...{
      apiUrl: '/mock',
    },
    ...options,
  });
};

export async function getSpotList(params, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.SpotList>(
    { url: Path.spotsList, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.SpotList);
}

export async function getRobotList(params, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.RobotList>(
    { url: Path.robotList, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.RobotList);
}

export async function getDeviceList(params, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.DeviceList>(
    { url: Path.deviceList, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.DeviceList);
}

export async function getGroupList(params, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.GroupList>(
    { url: Path.groups, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.GroupList);
}

export async function getGroupDetail(id: number) {
  const data = await defHttp.get<Model.GroupDetail>({ url: Path.detail(id) }, getOptions());
  return jsonParsing.deserializeObject(data, Model.GroupDetail);
}

export async function getGroupDetailItem<T>(id: number, itemName: string, refModel: any) {
  const data = await defHttp.get<Model.GroupItems<T>>(
    { url: Path.item(id, itemName) },
    getOptions(),
  );
  return jsonParsing.deserializeArray(data.content, refModel);
}

export async function putItem<T>(
  id: number,
  itemName: string,
  params: any,
  mode: ErrorMessageMode = 'none',
) {
  return await defHttp.put<T>(
    { url: Path.item(id, itemName), params },
    { errorMessageMode: mode, isTransformResponse: false },
  );
}

export async function save(params: any, mode: ErrorMessageMode = 'message') {
  await defHttp.put<Model.GroupSave>(
    { url: Path.save(params.id), params },
    { errorMessageMode: mode },
  );
}

export async function add(params: any, mode: ErrorMessageMode = 'message') {
  console.log(params);
  await defHttp.post<Model.GroupSave>({ url: Path.groups, params }, { errorMessageMode: mode });
}

export async function _delete(id: any, mode: ErrorMessageMode = 'message') {
  await defHttp.delete<Model.GroupSave>({ url: Path._delete(id) }, { errorMessageMode: mode });
}
