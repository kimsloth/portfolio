import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import { ErrorMessageMode, RequestOptions } from '/#/axios';
// import { PageParams, Response } from './model/base';
import * as Params from '/@/api/params/device';
import * as Model from '/@/model/device';
import { Response } from '/@/api/model/base';
const Path = {
  exDeviceType: '/deviceTypes',
  deviceType: '/deviceTypes/list',
  Device: '/devices',
  deviceInfo: (id) => `/devices/${id}`,
  deviceRealTimeData: (id) => `/devices/${id}/data`,
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

export async function getExternalDevice(params?: any, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<{ content: Model.DeviceList }>(
    { url: Path.Device, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.DeviceList);
}

export async function getExternalDeviceArray(mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.DeviceTypelist>(
    { url: Path.Device, params: { deTy: 2, size: 1000 } },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeArray(data.content, Model.DeviceType);
}

export async function getExternalDeviceObject(mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.DeviceTypelist>(
    { url: Path.Device },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.DeviceTypelist);
}

export async function getExternalDeviceType(mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.exDeviceTypelist>(
    { url: Path.deviceType },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeArray(data.deviceTypes, Model.DeviceType);
}

export async function deleteDeviceInfo(id, mode: ErrorMessageMode = 'modal') {
  const data = await defHttp.delete<Response>(
    { url: Path.deviceInfo(id) },
    getOptions({ errorMessageMode: mode, isTransformResponse: false }),
  );
  return jsonParsing.deserializeObject(data, Response) as Response;
}

export async function putDeviceInfo(params: any, mode: ErrorMessageMode = 'message') {
  const path = Path.deviceInfo(params.id);
  const data = await defHttp.put(
    { url: path, params },
    getOptions({ errorMessageMode: mode, isTransformResponse: false }),
  );
  return data;
}

export async function postDeviceInfo(params: any, mode: ErrorMessageMode = 'message') {
  const path = Path.Device;
  const data = await defHttp.post(
    { url: path, params },
    getOptions({ errorMessageMode: mode, isTransformResponse: false }),
  );
  return data;
}

export async function getDeviceDetail(id, mode: ErrorMessageMode = 'modal') {
  const data = await defHttp.get<Model.DeviceDetail>(
    { url: Path.deviceInfo(id) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.DeviceDetail);
}

export async function getDeviceDetailData(id, mode: ErrorMessageMode = 'modal') {
  const data = await defHttp.get<Model.DeviceRealTimeData>(
    { url: Path.deviceRealTimeData(id) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.DeviceRealTimeData);
}
