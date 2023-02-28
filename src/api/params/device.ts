import { JsonObject, JsonProperty } from 'json2typescript';
import { PageParams } from '/@/api/model/base';

@JsonObject('device.DeviceParam')
export class DeviceParam extends PageParams {
  @JsonProperty('tyCd', Number)
  tyCd?: number | null = null;

  @JsonProperty('deTy', String)
  deTy?: string | null = null;

  @JsonProperty('name', String)
  name?: string | null = null;

  @JsonProperty('use', Number)
  use?: number | null = null;
}

export interface DeviceSearch {
  deviceType?: number;
}
