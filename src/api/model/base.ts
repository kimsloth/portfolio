import { JsonObject, JsonProperty } from 'json2typescript';

/*
  api response를 기반으로 vue에서 사용 될 model을 정의

  * json2typescript 설명  https://github.com/appvision-gmbh/json2typescript
    - @JsonObject( classIdentifier )
      - (필수) classIdentifier: 프로젝트에 유니크한 class naem
    - @JsonProperty( jsonProperty, conversionOption, convertingMode )
      - (필수) jsonProperty: json key name
      - (선택) conversionOption: json value type, 정의 하지 않으면 default any
      - (선택) convertingMode: nullable type mode ( enum PropertyConvertingMode )
    - class properties는 초기화 필수, 초기화 하지 않으면 json2typescript 에서 해당 properties는 mapping에서 제외
      - message?: string | null = undefined

 */

@JsonObject('api.Response')
export class Response<T = any> {
  @JsonProperty('code', Number)
  code = -1;

  @JsonProperty('msg', String)
  msg = '';

  @JsonProperty('payload')
  payload?: Nullable<T> = null;
}

type Direction = 'ASC' | 'DESC';

@JsonObject('api.PageParams')
export class PageParams {
  @JsonProperty('page', Number)
  page = 1;
  @JsonProperty('size', Number)
  size = 20;
  @JsonProperty('sort', String)
  sort = 'id';
  @JsonProperty('direction', String)
  direction: Direction = 'DESC';
}
