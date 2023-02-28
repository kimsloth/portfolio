import { useI18n } from '/@/hooks/web/useI18n';

const t = (key) => useI18n().t(key);

/*
  codes.job.allocPriority.datas.filter(({ code }) => code == 102010);
 */
export function getCodesByFilter(array: { code: number }[], value: number) {
  return array.filter(({ code }) => code == value);
}

/*
  codes.job.allocPriority.datas.map(({ code }) => code);
 */
export function getCodesByFind(array: { code: number }[], value: number) {
  return array.find(({ code }) => code == value);
}

/*
  console.log(codes.job.allocPriority.datas.map(({ code }) => code));
*/
export function getCodesByMap(array: { [key: string]: any }[], keyName: string) {
  return array.map((value) => {
    const temp = value[keyName];
    if (typeof temp === 'function') {
      return temp();
    }
    return temp;
  });
}

export { codes as default };

/**
 * back-end 에서 사용하는 공통 코드 정의 및 언어 설정
 */
export const codes = {
  device: {
    type: {
      code: 200,
      name: () => t('code.device.type.name'),
      datas: [
        { code: 201, name: () => t('code.device.type.201') },
        { code: 202, name: () => t('code.device.type.202') },
        { code: 203, name: () => t('code.device.type.203') },
      ],
    },
    outerDeviceType: {
      code: 203,
      name: () => t('code.device.outerDeviceType.name'),
      datas: [
        { code: 2030001, name: () => t('code.device.outerDeviceType.2030001') },
        { code: 2030002, name: () => t('code.device.outerDeviceType.2030002') },
        { code: 2030003, name: () => t('code.device.outerDeviceType.2030003') },
      ],
    },
    communicationType: {
      code: 301,
      name: () => t('code.device.communicationType.name'),
      datas: [
        { code: 3010001, name: () => t('code.device.communicationType.3010001') },
        { code: 3010002, name: () => t('code.device.communicationType.3010002') },
        { code: 3010003, name: () => t('code.device.communicationType.3010003') },
        { code: 3010004, name: () => t('code.device.communicationType.3010004') },
        { code: 3010005, name: () => t('code.device.communicationType.3010005') },
        { code: 3010006, name: () => t('code.device.communicationType.3010006') },
      ],
    },
  },
  spot: {
    type: {
      code: 204,
      name: () => t('code.device.type.name'),
      datas: [
        { code: 2040101, name: () => t('code.spot.type.2040101') },
        { code: 2040102, name: () => t('code.spot.type.2040102') },
      ],
    },
  },
  robot: {
    workState: {
      code: 10204,
      name: () => t('code.robot.workState.name'),
      datas: [
        { code: 1020401, name: () => t('code.robot.workState.1020401') },
        { code: 1020402, name: () => t('code.robot.workState.1020402') },
        { code: 1020403, name: () => t('code.robot.workState.1020403') },
        { code: 1020404, name: () => t('code.robot.workState.1020404') },
        { code: 1020405, name: () => t('code.robot.workState.1020405') },
        { code: 1020406, name: () => t('code.robot.workState.1020406') },
        { code: 1020407, name: () => t('code.robot.workState.1020407') },
        { code: 1020408, name: () => t('code.robot.workState.1020408') },
        { code: 1020409, name: () => t('code.robot.workState.1020409') },
        { code: 1020410, name: () => t('code.robot.workState.1020410') },
        { code: 1020411, name: () => t('code.robot.workState.1020411') },
        { code: 1020412, name: () => t('code.robot.workState.1020412') },
      ],
    },
    mode: {
      code: 10205,
      name: () => t('code.robot.mode.name'),
      datas: [
        { code: 1020501, name: () => t('code.robot.mode.1020501') },
        { code: 1020502, name: () => t('code.robot.mode.1020502') },
      ],
    },
    type: {
      code: 201,
      name: () => t('code.robot.type.name'),
      datas: [
        { code: 2010001, name: () => t('code.robot.type.2010001') },
        { code: 2010002, name: () => t('code.robot.type.2010002') },
        { code: 2010003, name: () => t('code.robot.type.2010003') },
        { code: 2010004, name: () => t('code.robot.type.2010004') },
        { code: 2010005, name: () => t('code.robot.type.2010005') },
        { code: 2010006, name: () => t('code.robot.type.2010006') },
        { code: 2010007, name: () => t('code.robot.type.2010007') },
      ],
    },
  },
  job: {
    allocPriority: {
      code: 10201,
      name: () => t('code.job.allocPriority.name'),
      datas: [
        { code: 1020101, name: () => t('code.job.allocPriority.1020101') },
        { code: 1020102, name: () => t('code.job.allocPriority.1020102') },
        { code: 1020103, name: () => t('code.job.allocPriority.1020103') },
        { code: 1020104, name: () => t('code.job.allocPriority.1020104') },
      ],
    },
    status: {
      code: 10202,
      name: () => t('code.job.status.name'),
      datas: [
        { code: 1020201, name: () => t('code.job.status.1020201') },
        { code: 1020202, name: () => t('code.job.status.1020202') },
        { code: 1020203, name: () => t('code.job.status.1020203') },
        { code: 1020204, name: () => t('code.job.status.1020204') },
        { code: 1020205, name: () => t('code.job.status.1020205') },
        { code: 1020206, name: () => t('code.job.status.1020206') },
      ],
    },
    type: {
      code: 20403,
      name: () => t('code.job.type.name'),
      datas: [
        { code: 2040301, name: () => t('code.job.type.2040301') },
        { code: 2040302, name: () => t('code.job.type.2040302') },
      ],
    },
    makeType: {
      code: 20407,
      name: () => t('code.job.makeType.name'),
      datas: [
        { code: 2040701, name: () => t('code.job.makeType.2040701') },
        { code: 2040702, name: () => t('code.job.makeType.2040702') },
        { code: 2040703, name: () => t('code.job.makeType.2040703') },
        { code: 2040704, name: () => t('code.job.makeType.2040704') },
      ],
    },
    spot: {
      code: 20401,
      name: () => t('code.job.spot.name'),
      datas: [
        { code: 2040101, name: () => t('code.job.spot.2040101') },
        { code: 2040102, name: () => t('code.job.spot.2040102') },
      ],
    },
  },
  mission: {
    step: {
      code: 10206,
      name: () => t('code.mission.step.name'),
      datas: [
        { code: 1020600, name: () => t('code.mission.step.1020600') },
        { code: 1020601, name: () => t('code.mission.step.1020601') },
        { code: 1020602, name: () => t('code.mission.step.1020602') },
        { code: 1020603, name: () => t('code.mission.step.1020603') },
      ],
    },
  },
  mapEditor: {
    zoneType: {
      code: 20402,
      name: () => t('code.mapEditor.zoneType.name'),
      datas: [
        { code: 2040201, name: () => t('code.mapEditor.zoneType.2040201') },
        { code: 2040202, name: () => t('code.mapEditor.zoneType.2040202') },
      ],
    },
  },
};

const logger = (msg, ...params: any[]) => {
  if (!true) {
    if (params) console.log(msg, params);
    else console.log(msg);
  }
};

const sampleCodes = {
  key1: {
    key2: {
      code: 10204,
      name: () => t('code.robot.workState.name'),
      datas: [
        { code: 1020401, name: () => t('code.robot.workState.1020401') },
        { code: 1020402, name: () => t('code.robot.workState.1020402') },
      ],
    },
  },
};
logger('sample-codes', sampleCodes);

/**
 * codes 구조를 통한 언어파일 자동 설정
 * @see sampleCodes
 */
/*
function initCodeNames() {
  for (const [key1, value1] of Object.entries<any>(codes)) {
    logger(key1, value1);
    for (const [key2, value2] of Object.entries<any>(value1)) {
      logger(key2, value2);
      const prefix = `code.${key1}.${key2}`;
      value2.name = () => t(`${prefix}.name`);
      value2.prefix = prefix;
      if (Array.isArray(value2.datas)) {
        value2.datas.forEach((value) => {
          value.name = () => t(`${prefix}.${value.code}`);
        });
      }
    }
  }
}
*/
