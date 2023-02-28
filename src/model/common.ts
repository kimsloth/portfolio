import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('common.Sort')
export class Sort {
  @JsonProperty('sorted', Boolean)
  sorted = true;

  @JsonProperty('unsorted', Boolean)
  unsorted = false;
}

/**
 * 요청된 spring pageable 객체
 */
@JsonObject('common.Pageable')
export class Pageable {
  @JsonProperty('sort', Sort)
  sort = new Sort();

  @JsonProperty('offset', Number)
  offset = 0;

  @JsonProperty('pageSize', Number)
  pageSize = 0;

  @JsonProperty('pageNumber', Number)
  pageNumber = 0;

  @JsonProperty('paged', Boolean)
  paged = true;

  @JsonProperty('unpaged', Boolean)
  unpaged = false;
}

/**
 * Paging 객체 구현
 * ( json2typescript가 Generic을 지원하지 않아 extends 하여 각각 구현 필요 )
 * <pre>
 *    @JsonObject('sample.Info')
 *    export class Info extends Paging {
 *      @JsonProperty('content', Info)
 *      content: Info[] = [];
 *    }
 * </pre>
 */
@JsonObject('common.Paging')
export class Paging {
  @JsonProperty('pageable', Pageable)
  pageable = new Pageable();

  /**
   * 첫 페이지 여부
   */
  @JsonProperty('first', Boolean)
  isFirst = false;

  /**
   * 마지막 페이지 여부
   */
  @JsonProperty('last', Boolean)
  isLast = false;

  /**
   * 조회된 데이터 사이즈가 0일 때 true
   *
   * @see numberOfElements
   */
  @JsonProperty('empty', Boolean)
  isEmpty = false;

  /**
   * 현재 페이지의 데이터 요청 사이즈
   */
  @JsonProperty('size', Number)
  size = 0;

  /**
   * 현재 페이지의 조회된 데이터 사이즈
   * @see empty
   */
  @JsonProperty('numberOfElements', Number)
  numberOfElements = 0;

  @JsonProperty('totalPages', Number)
  totalPages = 0;

  @JsonProperty('totalElements', Number)
  totalElements = 0;
}
