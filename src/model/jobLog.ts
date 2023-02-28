import { JsonObject, JsonProperty } from 'json2typescript';
import { Paging } from '/@/model/common';
import dayjs from 'dayjs';

@JsonObject('joblog.JobLogDetail')
export class JobLogDetail {
  @JsonProperty('id', Number)
  id?: number = undefined;

  @JsonProperty('fromDeviceId', Number)
  fromDeviceId?: number = undefined;

  @JsonProperty('fromDeviceName', String)
  fromDeviceName?: string = '-';

  @JsonProperty('toDeviceId', Number)
  toDeviceId?: number = undefined;

  @JsonProperty('toDeviceName', String)
  toDeviceName?: string = '-';

  @JsonProperty('productType', Number)
  productType?: string | null = null;

  @JsonProperty('taskId', Number)
  taskId?: number = undefined;

  @JsonProperty('taskName', String)
  taskName?: string = undefined;

  @JsonProperty('priority', Number)
  priority?: number = undefined;

  @JsonProperty('robotId', String)
  robotId?: string = undefined;

  @JsonProperty('robotName', String)
  robotName?: string = undefined;

  @JsonProperty('state', Number)
  _state?: string | number = undefined;

  get state() {
    return this.getJobStateParse(this._state);
  }

  set state(value) {
    this._state = value;
  }

  getJobStateParse(value) {
    try {
      if (value) {
        if (value == 1020201) {
          value = 'Not Assign';
        } else if (value == 1020202) {
          value = 'Assigning';
        } else if (value == 1020203) {
          value = 'Assigned';
        } else if (value == 1020204) {
          value = 'Job Pocessing';
        } else if (value == 1020205) {
          value = 'Job Finished';
        } else if (value == 1020206) {
          value = 'Job Cancel';
        }
        return value;
      }
    } catch (e) {
      console.error('date parse error', e);
    }
    return 0;
  }

  @JsonProperty('allocDt', String)
  _allocDt?: string | null = null;

  get allocDt() {
    return this.getDateParse(this._allocDt);
  }

  set allocDt(value) {
    this._allocDt = value;
  }

  @JsonProperty('finishDt', String)
  _finishDt?: string | null = null;

  get finishDt() {
    return this.getDateParse(this._finishDt);
  }

  set finishDt(value) {
    this._finishDt = value;
  }

  @JsonProperty('eventDt', String)
  _eventDt?: string | null = null;

  get eventDt() {
    return this.getDateParse(this._eventDt);
  }

  set eventDt(value) {
    this._eventDt = value;
  }

  getDateParse(value) {
    try {
      if (value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
      }
    } catch (e) {
      console.error('date parse error', e);
    }
    return '';
  }

  @JsonProperty('runtime', Number)
  runtime?: number | null = null;

  @JsonProperty('type', Number)
  type?: number = undefined;

  @JsonProperty('mappingId', Number)
  mappingId?: number = undefined;

  @JsonProperty('allocId', Number)
  allocId?: number = undefined;
}

@JsonObject('joblog.JobLogList')
export class JobLogList extends Paging {
  @JsonProperty('content', [JobLogDetail])
  content?: JobLogDetail[] = [];
}
