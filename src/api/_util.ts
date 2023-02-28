import type { RequestOptions } from '/#/axios';

/**
 * generate request options
 * <pre>
 *   {
 *     / * .env >> VITE_GLOB_API_URL * /
 *     // apiUrl: '/mock',
 *     / *
 *       src/utils/http/axios/index.ts: transform.transformRequestHook()
 *         hook 처리 이후 response data 전달
 *           - true : { payload } : code 분석하여 성공 여부 판단 및 alert 생성 (default)
 *           - false : { code, msg, payload }
 *      * /
 *     isTransformResponse: true,
 *     / *
 *       src/utils/http/axios/index.ts: transform.transformRequestHook()
 *       기본 응답 헤더 포함
 *         - true : {config, data, headers, request, status, statusText}
 *         - false : { payload } : code 분석하여 성공 여부 판단 및 alert 생성 (default)
 *      * /
 *     isReturnNativeResponse: false,
 *   }
 * </pre>
 */
export const getGlobalRequestOptions = (options: RequestOptions = {}) => {
  const defaultOptions: RequestOptions = {
    // apiUrl: '/mock',
    isTransformResponse: true,
    isReturnNativeResponse: false,
  };
  return { ...defaultOptions, ...options };
};
