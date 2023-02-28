import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';
import { codes, getCodesByFind } from '/@/config/codes';

@JsonObject('device.DeviceType')
export class DeviceType {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('remark', String)
  remark?: string | null = null;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('code', String)
  code?: string = undefined;

  @JsonProperty('name', String)
  name?: string | null = null;
}

@JsonObject('device.Device')
export class Device {
  @JsonProperty('name', String)
  name?: string | null = null;

  @JsonProperty('id', Number)
  id?: number | null = null;
}

@JsonObject('device.DeviceInfo')
export class DeviceInfo {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('ccTypeCode', Number)
  ccTypeCode?: number = undefined;

  get ccTypeCodeString() {
    const val = getCodesByFind(codes.device.communicationType.datas, this.ccTypeCode as number) as {
      code: number;
      name: Function;
    };
    if (val != null) return val.name();
    else return this.ccTypeCode;
  }

  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('width', Number)
  width?: number = undefined;

  @JsonProperty('height', Number)
  height?: number = undefined;

  @JsonProperty('x', Number)
  x?: number = undefined;

  @JsonProperty('y', Number)
  y?: number = undefined;

  @JsonProperty('theta', Number)
  theta?: number = undefined;

  @JsonProperty('dataSize', Number)
  dataSize?: number | null = undefined;

  @JsonProperty('remark', String)
  remark?: string = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('typeId', Number)
  typeId?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;

  @JsonProperty('typeName', String)
  typeName?: string = undefined;

  @JsonProperty('typeCode', Number)
  typeCode?: number = undefined;

  @JsonProperty('alias', String)
  alias?: number = undefined;

  get codeString() {
    const val = getCodesByFind(codes.device.type.datas, this.typeId as number) as {
      code: number;
      name: Function;
    };
    if (val != null) return val.name();
    else return this.typeId;
  }

  @JsonProperty('area', String)
  area?: string | null = undefined;

  get location() {
    return '[' + this.x + ', ' + this.y + ', ' + this.theta + ' ]';
  }
}

@JsonObject('device.ReqDeviceInfo')
export class ReqDeviceInfo {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('ccTypeCode', Number)
  ccTypeCode?: number = undefined;

  @JsonProperty('ip', String)
  ip?: string = undefined;

  @JsonProperty('port', Number)
  port?: number = undefined;

  @JsonProperty('x', Number)
  x?: number = undefined;

  @JsonProperty('y', Number)
  y?: number = undefined;

  @JsonProperty('theta', Number)
  theta?: number = undefined;

  @JsonProperty('dataSize', Number)
  dataSize?: number | null = undefined;

  @JsonProperty('typeId', Number)
  typeId?: number = undefined;

  @JsonProperty('name', String)
  name?: string = undefined;

  @JsonProperty('width', Number)
  width?: number = undefined;

  @JsonProperty('height', Number)
  height?: number = undefined;
}

@JsonObject('device.DeviceList')
export class DeviceList extends Paging {
  @JsonProperty('content', [DeviceInfo])
  content: DeviceInfo[] = [];
}

@JsonObject('device.DeviceTypelist')
export class DeviceTypelist {
  @JsonProperty('content', [DeviceType])
  content: DeviceType[] = [];
}

@JsonObject('device.exDeviceTypelist')
export class exDeviceTypelist {
  @JsonProperty('deviceTypes', [DeviceType])
  deviceTypes: DeviceType[] = [];
}

@JsonObject('device.OutPlcinfo')
export class OutPlcinfo {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('definition', String)
  definition?: string = undefined;

  @JsonProperty('dataType', String)
  dataType?: string = undefined;

  @JsonProperty('streamYn', Number)
  streamYn?: number = undefined;

  @JsonProperty('actionDtlYn', Number)
  actionDtlYn?: number = undefined;

  @JsonProperty('readwrite', String)
  readwrite?: number = undefined;

  @JsonProperty('register', Number)
  register?: number = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('remark', String)
  remark?: number = undefined;

  @JsonProperty('name', String)
  name?: number = undefined;
}

@JsonObject('device.DeviceDetail')
export class DeviceDetail extends DeviceInfo {
  @JsonProperty('data', [OutPlcinfo])
  data: OutPlcinfo[] = [];
}

@JsonObject('device.RealTimeData')
export class RealTimeData {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('register', String)
  register?: string = undefined;

  @JsonProperty('value', String)
  value?: string = undefined;

  @JsonProperty('remark', String)
  remark?: string = undefined;

  @JsonProperty('readWrite', String)
  readWrite?: string = undefined;

  @JsonProperty('useYn', Number)
  useYn?: number = undefined;

  @JsonProperty('typeId', Number)
  typeId?: number = undefined;

  @JsonProperty('typeName', String)
  typeName?: string = undefined;

  @JsonProperty('seq', Number)
  seq?: number = undefined;
}

@JsonObject('device.DeviceRealTimeData')
export class DeviceRealTimeData {
  @JsonProperty('acs', [RealTimeData])
  acs: RealTimeData[] = [];
  @JsonProperty('device', [RealTimeData])
  device: RealTimeData[] = [];
}
