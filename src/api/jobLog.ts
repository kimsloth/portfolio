import { getGlobalRequestOptions } from '/@/api/_util';
import { defHttp, jsonParsing } from '/@/utils/http/axios';
import { ErrorMessageMode, RequestOptions } from '/#/axios';
import * as Model from '/@/model/jobLog';
import * as Params from '/@/api/model/jobLog';

const Path = {
  joblog: '/jobs',
  joblogExelDownload: '/jobs/excel',
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

export async function getJobLogList(params?: Params.JobLogSearch, mode: ErrorMessageMode = 'none') {
  const data = await defHttp.get<Model.JobLogList>(
    { url: Path.joblog, params: params },
    getOptions({ errorMessageMode: mode }),
  );
  console.log(data, '???????????');

  return jsonParsing.deserializeObject(data, Model.JobLogList);
}

export async function exelJobLogDownload(
  params?: Params.JobLogSearch,
  mode: ErrorMessageMode = 'none',
): Promise<BlobPart> {
  const data = await defHttp.get<BlobPart>(
    { url: Path.joblogExelDownload, params: params, responseType: 'blob' },
    getOptions({ isTransformResponse: false, errorMessageMode: mode }),
  );
  return data;
}
