import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';

@JsonObject('putaway.PutawayWave')
export class PutawayWave {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('workGroupId', String)
  workGroupId?: string = undefined;

  @JsonProperty('destination', String)
  destination?: string = undefined;

  @JsonProperty('msgFirst', String)
  msgFirst?: string = undefined;

  @JsonProperty('msgSecond', String)
  msgSecond?: string = undefined;

  @JsonProperty('workNo', String)
  workNo?: string = undefined;

  @JsonProperty('itemCode', String)
  itemCode?: string = undefined;

  @JsonProperty('itemName', String)
  itemName?: string = undefined;

  @JsonProperty('totalWorks', String)
  totalWorks?: string | null = undefined;

  @JsonProperty('unit', String)
  unit?: string = undefined;

  @JsonProperty('qtyea', String)
  qtyea?: string = undefined;

  @JsonProperty('confirmQty', Number)
  confirmQty?: number = undefined;

  @JsonProperty('orderQty', Number)
  orderQty?: number = undefined;

  @JsonProperty('robots', [])
  robots: string[] = [];

  @JsonProperty('robotlist', String)
  robotlist: string | undefined = undefined;

  @JsonProperty('toteBoxes', [])
  toteBoxes: string[] = [];

  @JsonProperty('toteBoxGroup', String)
  toteBoxGroup: string | undefined = undefined;

  @JsonProperty('shipperId', String)
  shipperId?: string | null = undefined;

  @JsonProperty('status', String)
  status?: string | null = undefined;

  @JsonProperty('inboundDate', String)
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

@JsonObject('putaway.PutawayWaveList')
export class PutawayWaveList extends Paging {
  @JsonProperty('content', [PutawayWave])
  content: PutawayWave[] = [];
}

@JsonObject('putaway.Status')
export class DoStatus {
  @JsonProperty('content', [])
  content: string[] = [];
}
