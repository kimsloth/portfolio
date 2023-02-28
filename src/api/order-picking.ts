import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import type { ErrorMessageMode, RequestOptions } from '/#/axios';
// import { PageParams, Response } from './model/base';
import * as Model from '/@/model/order/picking';
import * as putAwayModel from '/@/model/order/putaway';
import * as ModelDetail from '/@/model/order/pickingDetail';
import * as Params from './model/order';

/**
 * api path list
 */
const Path = {
  pickings: '/pickings',
  status: (dateType) => `/wcs_orders/code/status?todayType=${dateType}`,
  dostatus: `/delivery_orders/code/status`,
  deliveryOrder: (waveId) => `/delivery_orders?waveId=${waveId}`,
  DoDetailWork: (deliveryoOderId) => `/delivery_orders/${deliveryoOderId}`,
  pickingDetail: (waveId) => `/pickings/${waveId}`,
};
Object.freeze(Path);

/*
  export : api Path, data-models, request-params
 */
export { Path, Model, Params, putAwayModel, ModelDetail };

const getOptions = (options: RequestOptions = {}) => {
  return getGlobalRequestOptions({
    ...{
      // apiUrl: '/mock',
    },
    ...options,
  });
};

/**
 * post
 * request-params
 */
export async function pickings(params?: Params.PickingSearch, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.WaveList>(
    { url: Path.pickings, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.WaveList);
}

export async function pickingsDetail(waveId, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<ModelDetail.PickingDetail>(
    { url: Path.pickingDetail(waveId) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, ModelDetail.PickingDetail);
}

export async function getDeliveryOrderList(
  waveId,
  params?: Params.deliveryOrdersSearch,
  mode: ErrorMessageMode = 'none',
) {
  const data = await defHttp.get<ModelDetail.DeliveryOrderList>(
    { url: Path.deliveryOrder(waveId), params },
    getOptions({ errorMessageMode: mode }),
  );

  const result: ModelDetail.DeliveryOrderList = jsonParsing.deserializeObject(
    data,
    ModelDetail.DeliveryOrderList,
  );
  return result;
}

export async function getDoDetailWork(deliveryoOderId, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<ModelDetail.DoDetailWork>(
    { url: Path.DoDetailWork(deliveryoOderId) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, ModelDetail.DoDetailWork);
}

export async function pickingsStatus(dateType, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.waveStatus>(
    { url: Path.status(dateType) },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.waveStatus);
}

export async function doStatus(mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<putAwayModel.DoStatus>(
    { url: Path.dostatus },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, putAwayModel.DoStatus);
}
