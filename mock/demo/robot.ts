import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess, resultSuccess } from '../_util';

const robotList: any[] = [
  {
    id: 'R_011',
    autoChargeYn: 0,
    chargeOnBattery: 0,
    chargeOffBattery: 0,
    assignMinBattery: 0,
    width: 0,
    height: 0,
    useYn: 1,
    name: 'Robot 11',
    typeCode: 2010007,
    state: {
      robotMode: 1020501,
      theta: -0.0101,
      workState: '1020401',
      isConnected: 0,
      battery: 0,
      x: -0.0201,
      y: 0,
    },
    bms: {
      voltage: -1,
      current: -1,
      capacity: -1,
      health: -1,
      maxTemp: -1,
      minTemp: -1,
      maxCellVoltage: -1,
      minCellVoltage: -1,
    },
  },
  {
    id: 'R_012',
    autoChargeYn: 0,
    chargeOnBattery: 0,
    chargeOffBattery: 0,
    assignMinBattery: 0,
    width: 0,
    height: 0,
    useYn: 1,
    name: 'Robot 12',
    typeCode: 2010007,
    state: {
      robotMode: 1020501,
      theta: -0.0101,
      workState: '1020401',
      isConnected: 0,
      battery: 0,
      x: -0.0201,
      y: 0,
    },
    bms: {
      voltage: -1,
      current: -1,
      capacity: -1,
      health: -1,
      maxTemp: -1,
      minTemp: -1,
      maxCellVoltage: -1,
      minCellVoltage: -1,
    },
  },
];

const robot11 = {
  id: 'R_011',
  autoChargeYn: 0,
  chargeOnBattery: 0,
  chargeOffBattery: 0,
  assignMinBattery: 0,
  width: 0,
  height: 0,
  useYn: 1,
  name: 'Robot 11',
  typeCode: 2010007,
  state: {
    robotMode: 1020501,
    theta: -0.0101,
    workState: '1020401',
    isConnected: 0,
    battery: 0,
    x: -0.0201,
    y: 0,
  },
  bms: {
    voltage: -1,
    current: -1,
    capacity: -1,
    health: -1,
    maxTemp: -1,
    minTemp: -1,
    maxCellVoltage: -1,
    minCellVoltage: -1,
  },
};

const robot12 = {
  id: 'R_012',
  autoChargeYn: 0,
  chargeOnBattery: 0,
  chargeOffBattery: 0,
  assignMinBattery: 0,
  width: 0,
  height: 0,
  useYn: 1,
  name: 'Robot 11',
  typeCode: 2010007,
  state: {
    robotMode: 1020501,
    theta: -0.0101,
    workState: '1020401',
    isConnected: 0,
    battery: 0,
    x: -0.0201,
    y: 0,
  },
  bms: {
    voltage: -1,
    current: -1,
    capacity: -1,
    health: -1,
    maxTemp: -1,
    minTemp: -1,
    maxCellVoltage: -1,
    minCellVoltage: -1,
  },
};

export default [
  {
    url: '/mock/robots',
    timeout: 100,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      return resultPageSuccess(page, pageSize, robotList);
    },
  },
  {
    url: '/mock/robots/R_011',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(robot11);
    },
  },
  {
    url: '/mock/robots/R_012',
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(robot12);
    },
  },
] as MockMethod[];
