import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';

@JsonObject('pickingDetail.PickingWaveDetail')
export class PickingDetail {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('code', String)
  code?: string = undefined;

  @JsonProperty('status', String)
  status?: string = undefined;

  @JsonProperty('waveNo', String)
  waveNo?: string = undefined;

  @JsonProperty('totalDos', Number)
  totalDos?: number = undefined;

  @JsonProperty('totalWorks', Number)
  totalWorks?: number | null = undefined;

  @JsonProperty('createdDate', String)
  createdDate?: string | null = undefined;

  @JsonProperty('startedDate', String)
  startedDate?: string | null = undefined;

  @JsonProperty('expectedDate', String)
  expectedDate?: string | null = undefined;

  @JsonProperty('finishedDate', String)
  finishedDate?: string | null = undefined;
}

@JsonObject('pickingDetail.DeliveryOrder')
export class DeliveryOrder {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('doId', String)
  doId?: string = undefined;

  @JsonProperty('status', String)
  status?: string = undefined;

  @JsonProperty('startedDate', String)
  startedDate?: string | null = undefined;

  @JsonProperty('finishedDate', String)
  finishedDate?: string | null = undefined;
}

@JsonObject('pickingDetail.Works')
export class Works {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('workNo', String)
  workNo?: string = undefined;

  @JsonProperty('itemCode', String) //미구현
  itemCode?: string = undefined;

  @JsonProperty('itemName', String)
  itemName?: string = undefined;

  @JsonProperty('msgFirst', String)
  msgFirst?: string = undefined;

  @JsonProperty('msgSecond', String)
  msgSecond?: string = undefined;

  @JsonProperty('qtyunit', String)
  qtyunit?: string = undefined;

  @JsonProperty('orderQty', Number)
  orderQty?: number = undefined;

  @JsonProperty('confirmQty', Number)
  confirmQty?: number = undefined;

  @JsonProperty('unit', String)
  unit?: string = undefined;

  @JsonProperty('source', String)
  source?: string = undefined;

  @JsonProperty('shipperId', String)
  shipperId?: string = undefined;

  @JsonProperty('status', String)
  status?: string = undefined;

  @JsonProperty('startedDate', String)
  startedDate?: string | null = '-';

  @JsonProperty('finishedDate', String)
  finishedDate?: string | null = undefined;
}

@JsonObject('pickingDetail.DoDetailWork')
export class DoDetailWork {
  @JsonProperty('status', String)
  status?: string = undefined;

  @JsonProperty('totalWork', Number)
  totalWork?: number = undefined;

  @JsonProperty('totalBoxQty', Number)
  totalBoxQty?: number = undefined;

  @JsonProperty('toteBoxes', [])
  toteBoxes?: string[] = [];

  @JsonProperty('toteBoxeString', String)
  toteBoxeString?: string = undefined;

  @JsonProperty('shipperId', String)
  shipperId?: string = undefined;

  @JsonProperty('totalQty', Number)
  totalQty?: number = undefined;

  @JsonProperty('robots', [])
  workingAMR?: string[] = [];

  @JsonProperty('AMRString', String)
  AMRString?: string = undefined;

  @JsonProperty('itemVarieties', Number)
  itemVarieties?: number = undefined;

  @JsonProperty('startedDate', String)
  startedDate?: string | null = undefined;

  @JsonProperty('finishedDate', String)
  finishedDate?: string | null = undefined;

  @JsonProperty('works', [Works])
  works: Works[] = [];

  @JsonProperty('doId', String)
  doId?: string = undefined;
}

@JsonObject('pickingDetail.DeliveryOrderList')
export class DeliveryOrderList extends Paging {
  @JsonProperty('content', [DeliveryOrder])
  content: DeliveryOrder[] = [];
}

@JsonObject('pickingDetail.Status')
export class DoStatus {
  @JsonProperty('content', [])
  content: [] = [];
}
