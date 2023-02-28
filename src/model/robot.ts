import { JsonObject, JsonProperty } from 'json2typescript';
// @ts-ignore
import { Paging } from '/@/model/common';

import { codes, getCodesByFind } from '/@/config/codes';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// import { useI18n } from '/@/hooks/web/useI18n';

// const { t } = useI18n();

@JsonObject('robot.RobotSpots')
export class RobotSpots {
  @JsonProperty('actionId', Number)
  actionId?: number = undefined;

  @JsonProperty('actionName')
  actionName?: string = undefined;

  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('pointTypeCode', Number)
  pointTypeCode?: number = undefined;

  get PointTypeCodeString() {
    const val = getCodesByFind(codes.spot.type.datas, this.pointTypeCode as number) as {
      code: number;
      name: Function;
    };
    if (val != null) return val.name();
    else return this.pointTypeCode;
  }

  @JsonProperty('pointTypeCodeView', String)
  pointTypeCodeView?: string = '';

  @JsonProperty('taskId', Number)
  taskId?: number = undefined;

  @JsonProperty('taskName', String)
  taskName?: string = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;
}

@JsonObject('robot.RobotBms')
export class RobotBms {
  @JsonProperty('voltage', Number)
  _voltage?: number = undefined;

  @JsonProperty('current', Number)
  current?: number = undefined;

  @JsonProperty('capacity', Number)
  capacity?: number = undefined;

  @JsonProperty('maxTemp', Number)
  _maxTemp?: number = undefined;

  get maxTemp() {
    return this.getmaxTempParse(this._maxTemp);
  }

  set maxTemp(value) {
    this._maxTemp = value;
  }

  getmaxTempParse(value) {
    try {
      if (value) {
        value.toFixed(2);
        return value;
      } else {
        return value;
      }
    } catch (e) {
      console.error('date parse error', e);
    }
    return '';
  }

  @JsonProperty('health', Number)
  health?: number = undefined;

  @JsonProperty('temperature', Number)
  temperature?: number = undefined;
}

@JsonObject('robot.RobotDevice')
export class RobotDevice {
  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('ccTypeCode', Number)
  ccTypeCode?: number = undefined;

  @JsonProperty('ccTypeCodeView', String)
  ccTypeCodeView?: string = undefined;

  get ccTypeCodeString() {
    const val = getCodesByFind(codes.device.communicationType.datas, this.ccTypeCode as number) as {
      code: number;
      name: Function;
    };
    if (val != null) {
      this.ccTypeCodeView = val.name();
    } else return this.ccTypeCode;
  }

  @JsonProperty('dataSize', Number)
  dataSize?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;
}

@JsonObject('robot.RobotGroup')
export class RobotGroup {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;
}

@JsonObject('robot.RobotModifyInfo')
export class RobotModifyInfo {
  @JsonProperty('robotName', String)
  name?: string = undefined;

  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('portStream', Number)
  portStream?: number = undefined;

  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  @JsonProperty('width', Number)
  width?: number = undefined;

  @JsonProperty('height', Number)
  height?: number = undefined;

  @JsonProperty('loader', String)
  loader?: string = undefined;

  @JsonProperty('mapId', Number)
  mapId?: number = undefined;

  @JsonProperty('autoChargeYn', Number)
  autoChargeYn?: number = undefined;

  @JsonProperty('chargeOnBattery', Number)
  chargeOnBattery?: number = undefined;

  @JsonProperty('chargeOffBattery', Number)
  chargeOffBattery?: number = undefined;

  @JsonProperty('assignMinBattery', Number)
  assignMinBattery?: number = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('filler1', Number)
  filler1?: number = undefined;
  @JsonProperty('filler2', Number)
  filler2?: number = undefined;
  @JsonProperty('filler3', Number)
  filler3?: number = undefined;
  @JsonProperty('filler4', Number)
  filler4?: number = undefined;
  @JsonProperty('filler5', Number)
  filler5?: number = undefined;

  @JsonProperty('spots', [])
  spots?: number[] = [];

  @JsonProperty('groups', [])
  groups?: number[] = [];
}

@JsonObject('robot.RobotCreateInfo')
export class RobotCreateInfo {
  @JsonProperty('id', String)
  id?: string = undefined;

  @JsonProperty('Name', String)
  name?: string = undefined;

  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('portStream', Number)
  portStream?: number = undefined;

  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  @JsonProperty('typeCodeView', String)
  typeCodeView?: string = undefined;

  @JsonProperty('mapId', Number)
  mapId?: number = undefined;

  @JsonProperty('autoChargeYn', Number)
  autoChargeYn?: number = undefined;

  @JsonProperty('chargeOnBattery', Number)
  chargeOnBattery?: number = undefined;

  @JsonProperty('chargeOffBattery', Number)
  chargeOffBattery?: number = undefined;

  @JsonProperty('assignMinBattery', Number)
  assignMinBattery?: number = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('filler1', Number)
  filler1?: number = undefined;
  @JsonProperty('filler2', Number)
  filler2?: number = undefined;
  @JsonProperty('filler3', Number)
  filler3?: number = undefined;
  @JsonProperty('filler4', Number)
  filler4?: number = undefined;
  @JsonProperty('filler5', Number)
  filler5?: number = undefined;
}

@JsonObject('robot.RobotDetailInfo')
export class RobotDetailInfo {
  @JsonProperty('id', String)
  id: string | null = null;

  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('portStream', Number)
  portStream?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;

  /**
   * 지정 Robot Type명 (Ex, SR5, SR7)
   */
  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  @JsonProperty('mapVer', String)
  mapVer?: string = undefined;

  @JsonProperty('height', Number)
  height?: number = undefined;

  @JsonProperty('width', Number)
  width?: number = undefined;

  /**
   * 자동충전 여부
   * <pre>
   *    0:자동충전 안함
   *    1?: 자동충전 모드로 chargeOnBattery값 이하인 경우 자동 충전 모드로 진입
   * </pre>
   */
  @JsonProperty('autoChargeYn', Number)
  autoChargeYn?: number = undefined;

  /**
   * 자동 충전 시작 값
   */
  @JsonProperty('chargeOnBattery', Number)
  chargeOnBattery?: number = undefined;

  /**
   * 자동 충전 종료 값
   */
  @JsonProperty('chargeOffBattery', Number)
  chargeOffBattery?: number = undefined;

  /**
   * Job 할당 Battery 최소 값
   */
  @JsonProperty('assignMinBattery', Number)
  assignMinBattery?: number = undefined;

  /**
   * 사용여부 (0:사용안함, 1:사용)
   */
  @JsonProperty('useYn', Number)
  _useYn?: number | string = undefined;
  get useYn() {
    return this.getUSEParse(this._useYn);
  }

  set useYn(value) {
    this._useYn = value;
  }

  getUSEParse(value) {
    try {
      if (value == 1) {
        value = 'Use';
      } else {
        value = 'Not Use';
      }
      return value;
    } catch (e) {
      console.error('date parse error', e);
    }
    return '';
  }

  @JsonProperty('bms', RobotBms)
  bms?: Nullable<RobotBms> = null;

  @JsonProperty('spots', [RobotSpots])
  spots: RobotSpots[] = [];

  @JsonProperty('device', RobotDevice)
  device: Nullable<RobotDevice> = null;

  @JsonProperty('spotsid', String)
  spotsid: string | undefined = undefined;

  @JsonProperty('groups', [RobotGroup])
  groups: RobotGroup[] = [];

  @JsonProperty('groups1', String)
  groups1: string | undefined = undefined;
}

@JsonObject('robot.RobotInfo')
export class RobotInfo {
  @JsonProperty('id', String)
  id?: string = undefined;

  @JsonProperty('width', Number)
  width?: number = undefined;

  @JsonProperty('height', Number)
  height?: number = undefined;

  @JsonProperty('autoChargeYn', Number)
  autoChargeYn?: number = undefined;

  /**
   * 자동 충전 시작 값
   */
  @JsonProperty('chargeOnBattery', Number)
  chargeOnBattery?: number = undefined;

  /**
   * 자동 충전 종료 값
   */
  @JsonProperty('chargeOffBattery', Number)
  chargeOffBattery?: number = undefined;

  /**
   * Job 할당 Battery 최소 값
   */
  @JsonProperty('assignMinBattery', Number)
  assignMinBattery?: number = undefined;

  /**
   * 사용여부 (0:사용안함, 1:사용)
   */
  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;
  /**
   * 지정 Robot Type명 (Ex, SR5, SR7)
   */
  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  @JsonProperty('bms', RobotBms)
  bms?: Nullable<RobotBms> = null;
}

@JsonObject('robot.RobotList')
export class RobotList extends Paging {
  @JsonProperty('content', [RobotInfo])
  content: RobotInfo[] = [];
}

@JsonObject('robot.JobDetail')
export class JobDetail {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('actionTypeId', Number)
  actionTypeId?: number = undefined;

  @JsonProperty('actionName', String)
  actionName?: string = undefined;

  @JsonProperty('workId', String)
  workId?: string = undefined;

  @JsonProperty('missionId', Number)
  missionId?: number = undefined;

  @JsonProperty('isRun', Number)
  isRun?: number = undefined;

  @JsonProperty('isCancled', Number)
  isCancled?: number = undefined;

  @JsonProperty('startDt', String)
  startDt: string | null = null;

  @JsonProperty('finishDt', String)
  finishDt: string | null = null;

  @JsonProperty('runtime', Number)
  runtime?: number = undefined;

  @JsonProperty('seq', Number)
  seq?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;
}

@JsonObject('robot.JobInfo')
export class JobInfo {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('taskId', Number)
  taskId?: number = undefined;

  @JsonProperty('taskName', String)
  taskName?: string = undefined;

  @JsonProperty('robotId', String)
  robotId?: string = undefined;

  @JsonProperty('dtls', [JobDetail])
  dtls: JobDetail[] = [];
}

@JsonObject('robot.option')
export class option {
  @JsonProperty('value', Number)
  value?: number;

  @JsonProperty('label', String)
  label?: string;
}

@JsonObject('robot.spot')
export class Spot {
  @JsonProperty('id', Number)
  id = -1;

  @JsonProperty('actionId', Number)
  actionId = -1;

  @JsonProperty('taskId', Number)
  taskId = -1;

  @JsonProperty('taskName', String)
  taskName: string | undefined = undefined;

  @JsonProperty('pointTypeCode', Number)
  pointTypeCode = 0;

  @JsonProperty('useYn', Number)
  useYn = 1;

  get userYnString() {
    return this.useYn == 1 ? t('common.useY') : t('common.useN');
  }

  get pointTypeCodeString() {
    const val = getCodesByFind(codes.job.spot.datas, this.pointTypeCode) as {
      code: number;
      name: Function;
    };
    if (val != null) return val.name();
    else return this.pointTypeCode;
  }
}

@JsonObject('robot.SpotList')
export class SpotList extends Paging {
  @JsonProperty('content', [Spot])
  content: Spot[] = [];
}
