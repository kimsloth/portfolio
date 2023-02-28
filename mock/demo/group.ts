import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess } from '../_util';

const spotList: any[] = [
  {
    id: 35,
    actionId: 376,
    actionName: '834c9c4140924fb99726b18413e6f35cc74695e2e14d4bb09f',
    taskId: 7,
    taskName: '6b163f47662543b4bed127e5e02c6e535541979d44b842859f',
    pointTypeCode: 2040101,
    useYn: 0,
    createUserId: 3,
    createUserName: 'admin',
    createDt: '2022-12-14 15:48:30',
    modUserId: 3,
    modUserName: 'admin',
    modDt: '2022-12-21 11:28:35',
  },
  {
    id: 1,
    actionId: 375,
    actionName: 'e54e9a9a9c924d2499f8f4a24da439d27c1ed8b406cc478b86',
    taskId: 7,
    taskName: '6b163f47662543b4bed127e5e02c6e535541979d44b842859f',
    pointTypeCode: 2040101,
    useYn: 0,
    createUserId: 3,
    createUserName: 'admin',
    createDt: '2022-05-12 11:37:18',
    modUserId: 3,
    modUserName: 'admin',
    modDt: '2022-12-22 16:19:59',
  },
];

const groupList: any[] = [
  {
    id: 37,
    remark: 'Group test',
    name: 'group test',
  },
  {
    id: 34,
    remark: 'BMA1라인 테스트 그룹',
    name: 'BMA #1 라인',
  },
  {
    id: 32,
    remark: 'BMA2라인 테스트 그룹',
    name: 'BMA #2 라인',
  },
];

export default [
  {
    url: '/mock/grps',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, groupList);
    },
  },
  {
    url: '/mock/spots',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, spotList);
    },
  },
] as MockMethod[];
