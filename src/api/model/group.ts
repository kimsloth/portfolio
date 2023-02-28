import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';
import { codes, getCodesByFind } from '/@/config/codes';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
@JsonObject('group.group')
export class Group {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('name', String)
  name: string | undefined = undefined;

  @JsonProperty('remark', String)
  remark?: string = undefined;
}

@JsonObject('group.grouplist')
export class GroupList extends Paging {
  @JsonProperty('content', [Group])
  content: Group[] = [];
}

@JsonObject('group.groupitems')
export class GroupItems<T> {
  @JsonProperty('content', [])
  content: T[] = [];
}

@JsonObject('group.robot')
export class Robot {
  @JsonProperty('id', String)
  id = '';

  @JsonProperty('name', String)
  name: string | undefined = undefined;

  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  get typeCodeString() {
    const val = getCodesByFind(codes.robot.type.datas, parseInt(this.typeCode as number, 10)) as {
      code: number;
      name: Function;
    };
    if (val != null) return val.name();
    else return 'Undetermined';
  }
}

@JsonObject('group.RobotList')
export class RobotList extends Paging {
  @JsonProperty('content', [Robot])
  content: Robot[] = [];
}

@JsonObject('group.device')
export class Device {
  @JsonProperty('id', Number)
  id = -1;

  @JsonProperty('name', String)
  name: string | undefined = undefined;
}

@JsonObject('group.DeviceList')
export class DeviceList extends Paging {
  @JsonProperty('content', [Device])
  content: Device[] = [];
}

@JsonObject('group.spot')
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

@JsonObject('group.SpotList')
export class SpotList extends Paging {
  @JsonProperty('content', [Spot])
  content: Spot[] = [];
}

@JsonObject('group.groupdetail')
export class GroupDetail {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('name', String)
  name: string | undefined = undefined;

  @JsonProperty('remark', String)
  remark?: string = undefined;

  @JsonProperty('robots', [Robot])
  robots: Robot[] = [];

  @JsonProperty('devices', [Device])
  devices?: Device[] = [];

  @JsonProperty('spots', [Spot])
  spots?: Spot[] = [];
}

@JsonObject('group.reqrobot')
export class ReqRobot {
  @JsonProperty('id', String)
  id = '';
}

@JsonObject('group.reqdevice')
export class ReqDevice {
  @JsonProperty('id', Number)
  id = -1;
}

@JsonObject('group.groupsave')
export class GroupSave {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('name', String)
  name: string | undefined = undefined;

  @JsonProperty('remark', String)
  remark?: string = undefined;
}
