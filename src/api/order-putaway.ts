import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import type { ErrorMessageMode, RequestOptions } from '/#/axios';

import * as Model from '/@/model/order/putaway';
import * as Params from './model/order';

/**
 * api path list
 */
const Path = {
  putaway: '/putaways',
};
Object.freeze(Path);

/*
  export : api Path, data-models, request-params
 */
export { Path, Model, Params };

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
export async function putAway(params?: Params.PutawaySearch, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.PutawayWaveList>(
    { url: Path.putaway, params },
    getOptions({ errorMessageMode: mode }),
  );
  return jsonParsing.deserializeObject(data, Model.PutawayWaveList);
}
