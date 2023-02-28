import { JsonObject, JsonProperty } from 'json2typescript';
import { PageParams } from '/@/api/model/base';

@JsonObject('robot.param')
export class RobotParam extends PageParams {
  @JsonProperty('use', Number)
  use?: number = undefined;
}

@JsonObject('robotgrp.param')
export class RobotgrpParam extends PageParams {
  @JsonProperty('useYn', Number)
  useYn?: number = undefined;
}
