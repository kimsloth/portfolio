import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';

@JsonObject('picking.PickingWave')
export class PickingWave {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('type', String)
  type?: string = undefined;

  @JsonProperty('code', String)
  code?: string = undefined;

  @JsonProperty('waveNo', String)
  waveNo?: string = undefined;

  @JsonProperty('totalDos', Number)
  totalDos?: string = undefined;

  @JsonProperty('totalWorks', Number)
  totalWorks?: string | null = undefined;

  @JsonProperty('status', String)
  status?: string = undefined;

  @JsonProperty('inboundDate ', String)
  inboundDate?: string | null = undefined;

  @JsonProperty('createdDate', String)
  createdDate?: string | null = undefined;

  @JsonProperty('expectedDate', String)
  expectedDate?: string | null = undefined;

  @JsonProperty('startedDate', String)
  startedDate?: string | null = undefined;

  @JsonProperty('finishedDate', String)
  finishedDate?: string | null = undefined;
}

@JsonObject('picking.WaveList')
export class WaveList extends Paging {
  @JsonProperty('content', [PickingWave])
  content: PickingWave[] = [];
}

@JsonObject('picking.waveStatus')
export class waveStatus {
  @JsonProperty('content', [])
  content: string[] = [];
}
