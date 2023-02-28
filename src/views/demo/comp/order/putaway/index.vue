<template>
  <PageWrapper contentFullHeight fixedHeight :contentBackground="ui.pageWrapper.bg">
    <template #title>{{ ui.title }}</template>
    <Card
      :size="ui.card.size"
      :bordered="false"
      class="common-label"
      style="margin-bottom: 16px; margin-top: 6px"
    >
      <div class="header-first-stage-div">
        <strong class="w-140px"> {{ t('common.dateType') }} </strong>
        <RadioGroup name="radioGroup" @change="radioChange" v-model:value="dateType">
          <Radio value="EXPECTED_DATE">{{ t('order.expectedDate') }}</Radio>
          <Radio value="CREATED_DATE">{{ t('common.createdDate') }}</Radio>
        </RadioGroup>
      </div>
      <div class="header-first-stage-div">
        <strong class="header-span-div w-140px">
          {{ t('common.searchDate') }}
        </strong>
        <sapn class="mr_10">
          <DatePicker
            v-model:value="startDt"
            :format="dateUtil.Formats.day"
            :onChange="startDtChange"
            :allowClear="false"
          />
          ~
          <DatePicker
            v-model:value="endDt"
            :format="dateUtil.Formats.day"
            :onChange="endDtChange"
            :allowClear="false"
          />
        </sapn>
        <span>
          <Button class="mr_5" @click="setToday">
            <span>
              <b>
                {{ t('common.today') }}
              </b>
            </span>
          </Button>
          <Button class="mr_5" @click="setYesterday">
            <span>
              <b>
                {{ t('common.yesterday') }}
              </b>
            </span>
          </Button>
          <Button class="mr_5" @click="setSevenDaysAgo">
            <span>
              <b>
                {{ t('common.days', { num: 7 }) }}
              </b>
            </span>
          </Button>
        </span>
      </div>

      <div class="header-first-stage-div">
        <div class="second_child_first_div">
          <strong class="w-140px inline-block">{{ t('common.status') }}</strong>
          <span class="mr_20">
            <Select
              :placeholder="t('common.status')"
              @change="statusChange"
              :options="status_type"
              allowClear
              class="w-150px"
            />
          </span>
          <strong class="w-130px inline-block">{{ t('common.searchWord') }}</strong>
          <span class="mr_10">
            <Select
              :placeholder="t('common.searchType')"
              @change="searchTypeChange"
              :options="search_type"
              allowClear
              class="!w-130px"
            />
          </span>
          <span class="inline-block">
            <Input
              :allowClear="true"
              class="!w-130px"
              :key="state.params.searchType"
              :disabled="inputDisalbe ? false : true"
              :placeholder="state.searchwardPlaceHolder"
              v-model:value="state.searchWord"
            />
          </span>
        </div>
        <div class="second_child_second_div">
          <span>
            <Button type="primary" @click="searchlog(true)">{{ t('common.search') }}</Button></span
          >
        </div>
      </div>
    </Card>
    <BasicTable @register="registerTable" class="">
      <template #toolbar>
        <span class="">{{ t('common.orderBy') }}</span>
        <Select
          v-model:value="defalut"
          class="w-180px"
          :autofocus="true"
          :options="orderByOption"
          @change="handleChange"
        />
      </template>

      <template #bodyCell="{ column, value, record }">
        <template v-if="column.dataIndex === 'status' && value === 'UNSUCCESS'">
          <Tooltip :title="`${record.msgFirst} `" v-if="`${record.msgSecond}` === undefined">
            {{ value }}
          </Tooltip>
          <Tooltip v-else :title="`${record.msgFirst} (${record.msgSecond})`">
            {{ value }}
          </Tooltip>
        </template>
      </template>
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import {
    Card,
    DatePicker,
    Button,
    Select,
    SelectProps,
    RadioGroup,
    Radio,
    Input,
    Tooltip,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';

  import * as dateUtil from '/@/utils/custom/dateUtil';
  import * as orderPickingApi from '/@/api/order-picking';
  import * as msg from '/@/utils/msg';
  import dayjs, { Dayjs } from 'dayjs';
  import * as Model from '/@/model/order/picking';
  import * as putAwayModel from '/@/model/order/putaway';
  import { cloneDeep } from 'lodash-es';
  import { Pageable } from '/@/model/common';
  import * as orderPutwayApi from '/@/api/order-putaway';
  import { PutawaySearch } from '/@/api/model/order';

  // declare utils
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const dateType = ref('EXPECTED_DATE');
  const defalut = ref(`${t('common.createdDate')} ${t('common.desc')}`);
  const desc = 'DESC';
  const asc = 'ASC';

  let startDt = ref<Dayjs>(dayjs());

  let endDt = ref<Dayjs>(dayjs());

  let inputDisalbe = ref<boolean>(false);

  let status_type = ref<SelectProps['options']>([]);

  let search_type = ref<SelectProps['options']>([
    { value: '1', label: `${t('order.workGroup')} ${t('common.id')}` },
    { value: '2', label: t('order.workNo') },
  ]);

  const orderByOption = ref<SelectProps['options']>([
    {
      value: 'workGroupid DESC',
      label: `${t('order.workGroup')} ${t('common.id')} ${t('common.desc')}`,
    },
    {
      value: 'workGroupid ASC',
      label: `${t('order.workGroup')} ${t('common.id')} ${t('common.asc')}`,
    },
    /*{
      value: 'workNo DESC',
      label: `${t('order.workNo')} ${t('common.desc')}`,
    },
    {
      value: 'workNo ASC',
      label: `${t('order.workNo')} ${t('common.asc')}`,
    },*/
    {
      value: 'CreatedDate DESC',
      label: `${t('common.createdDate')} ${t('common.desc')}`,
    },
    {
      value: 'CreatedDate ASC',
      label: `${t('common.createdDate')} ${t('common.asc')}`,
    },
    {
      value: 'FinishedDate DESC',
      label: `${t('common.finishedDate')} ${t('common.desc')}`,
    },
    {
      value: 'FinishedDate ASC',
      label: `${t('common.finishedDate')} ${t('common.asc')}`,
    },
  ]);

  const basicColumns: BasicColumn[] = [
    {
      title: t('common.idx'),
      dataIndex: 'id',
      width: '50px',
      customRender: ({ record }) => {
        return record.id ? record.id : '-';
      },
    },
    {
      title: `${t('order.workGroup')} ${t('common.id')}`,
      dataIndex: 'workGroupId',
      width: '230px',
      customRender: ({ record }) => {
        return record.workGroupId ? record.workGroupId : '-';
      },
    },
    {
      title: t('order.workNo'),
      dataIndex: 'workNo',
      width: '80px',
      customRender: ({ record }) => {
        return record.workNo ? record.workNo : '-';
      },
    },
    {
      title: t('common.itemId'),
      dataIndex: 'itemCode',
      width: '180px',
      customRender: ({ record }) => {
        return record.itemCode ? record.itemCode : '-';
      },
    },
    {
      title: t('common.itemName'),
      dataIndex: 'itemName',
      width: '300px',
      customRender: ({ record }) => {
        return record.itemName ? record.itemName : '-';
      },
    },
    {
      title: t('order.qty'),
      dataIndex: 'qtyea',
      width: '100px',
      customRender: ({ record }) => {
        return record.qtyea ? record.qtyea : record.qty.toString();
      },
    },
    {
      title: t('common.cell'),
      dataIndex: 'destination',
      width: '100px',
      customRender: ({ record }) => {
        return record.destination ? record.destination : '-';
      },
    },
    {
      title: t('common.amr'),
      dataIndex: 'robotlist',
      width: '100px',
      customRender: ({ record }) => {
        return record.robotlist ? record.robotlist : '-';
      },
    },
    {
      title: t('order.toteBoxes'),
      dataIndex: 'toteBoxGroup',
      width: '100px',
      customRender: ({ record }) => {
        return record.toteBoxGroup ? record.toteBoxGroup : '-';
      },
    },
    {
      title: t('common.shipperId'),
      dataIndex: 'shipperId',
      width: '100px',
      customRender: ({ record }) => {
        return record.shipperId ? record.shipperId : '-';
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: '100px',
      customRender: ({ record }) => {
        return record.status ? record.status : '-';
      },
    },
    {
      title: t('order.inboundDate'),
      dataIndex: 'inboundDate',
      customRender: ({ record }) => {
        return record.inboundDate ? record.inboundDate : '-';
      },
    },
    {
      title: t('common.createdDate'),
      dataIndex: 'createdDate',
      customRender: ({ record }) => {
        return record.createdDate ? record.createdDate : '-';
      },
    },
    {
      title: t('order.expectedDate'),
      dataIndex: 'expectedDate',
      customRender: ({ record }) => {
        return record.expectedDate ? record.expectedDate : '-';
      },
    },
    {
      title: t('common.startedDate'),
      dataIndex: 'startedDate',
      customRender: ({ record }) => {
        return record.startedDate ? record.startedDate : '-';
      },
    },
    {
      title: t('common.finishedDate'),
      dataIndex: 'finishedDate',
      customRender: ({ record }) => {
        return record.finishedDate ? record.finishedDate : '-';
      },
    },
  ];

  // declare ui state
  const ui = reactive({
    title: `${t('common.work')} List`,
    path: `${route.path}`,
    pageWrapper: {
      bg: false,
      extra: 'extra area',
      headerContent: 'header contnte area',
      goBack: () => router.go(-1),
    },
    card: { size: 'small' },
    isLoading: false,
  });

  // declare data state
  const state = reactive({
    params: new orderPutwayApi.Params.PutawaySearch(),
    paginationParams: new orderPickingApi.Params.PutawaySearch(),
    putawayData: {} as putAwayModel.PutawayWave,
    // data: [] as Model.PickingWave,
    data: [] as any,
    putaway: [] as any,
    num: 0,
    searchWord: '',
    statusValue: '',
    logTypeValue: '',
    logTypeString: t('common.logType'),
    searchwardPlaceHolder: t('common.searchWord'),
    sort: 'createdDate',
    direction: 'DESC',
    dateType: 'EXPECTED_DATE',
    pagination: {
      total: 10,
      pageSize: 20,
      current: 1,
    },
  });

  const paginationProp = ref({
    showSizeChanger: true,
    showQuickJumper: false,
    pageSize: state.pagination.pageSize,
    current: state.pagination.current,
    total: state.pagination.total,
    showTotal: (total) => `total of ${total} `,
    onChange: pageChange,
  });

  function pageChange(p, pz) {
    state.pagination.current = p;
    state.pagination.pageSize = pz;
    state.paginationParams.size = state.pagination.pageSize;
    state.paginationParams.page = state.pagination.current;
    searchMain(state.paginationParams);
  }

  const [registerTable, { setTableData, setPagination }] = useTable({
    columns: basicColumns,
    rowClassName: (record: any) => {
      if (record.status == 'WORKING') {
        return 'text-indigo-500';
      } else if (record.status == 'UNSUCCESS') {
        return 'text-red-500';
      } else {
        return 'text-slate-900';
      }
    },
    ellipsis: false,
    dataSource: state.data,
    bordered: true,
    showIndexColumn: false,
    pagination: paginationProp,
  });

  type Direction = 'ASC' | 'DESC';

  const handleChange = (value: string) => {
    if (value == 'workGroupid DESC') {
      state.direction = 'DESC';
      state.sort = 'id';
    } else if (value == 'workGroupid ASC') {
      state.direction = 'ASC';
      state.sort = 'id';
    } else if (value == 'workNo DESC') {
      state.direction = 'DESC';
      state.sort = 'workNo';
    } else if (value == 'workNo ASC') {
      state.direction = 'ASC';
      state.sort = 'workNo';
    } else if (value == 'CreatedDate DESC') {
      state.direction = 'DESC';
      state.sort = 'createdDate';
    } else if (value == 'CreatedDate ASC') {
      state.direction = 'ASC';
      state.sort = 'createdDate';
    } else if (value == 'FinishedDate DESC') {
      state.direction = 'DESC';
      state.sort = 'finishedDate';
    } else if (value == 'FinishedDate ASC') {
      state.direction = 'ASC';
      state.sort = 'finishedDate';
    }

    state.paginationParams.page = 1;
    state.paginationParams.sort = state.sort;
    state.paginationParams.direction = state.direction as Direction;

    searchMain(state.paginationParams);
  };

  const statusChange = (change) => {
    if (change == 'ALL') {
      state.statusValue = '';
    } else {
      state.statusValue = change;
    }
  };

  const searchTypeChange = (change) => {
    if (change) {
      state.params.searchType = change;
      inputDisalbe.value = true;
    } else {
      state.searchWord = '';
      inputDisalbe.value = false;
      state.params.searchType = '';
    }
  };

  const radioChange = (change) => {
    if (change.target.value == 'EXPECTED_DATE') {
      state.params.todayType = change.target.value;
      setSelectProps(dateType.value);
    } else {
      state.params.todayType = change.target.value;
      setSelectProps(dateType.value);
    }
  };

  function startDtChange(e) {
    if (e != null) {
      let diffmilli = e.diff(endDt.value);
      if (diffmilli < 0) {
        let diffMonth = e.diff(endDt.value, 'month');
        let startDay = parseInt(startDt.value.format('DD'), 10);
        let endDay = parseInt(endDt.value.format('DD'), 10);
        if (diffMonth < -3 || (diffMonth == -3 && startDay < endDay)) {
          msg.warningSimpleNotifiCation(t('message.datewarning'));
          startDt.value = dayjs(endDt.value).add(-3, 'month');
          state.params.start = startDt.value.toString();
        } else {
          startDt.value = e;
          state.params.start = dateUtil.format(startDt.value, dateUtil.Formats.day);
        }
      } else {
        msg.warningSimpleNotifiCation(t('message.datewarning2'));
        startDt.value = dayjs();
        state.params.start = dateUtil.getNow(dateUtil.Formats.day);
      }
    }
  }

  function endDtChange(e) {
    if (e != null) {
      let diffmilli = e.diff(startDt.value);
      if (diffmilli > 0) {
        let diffMonth = e.diff(startDt.value, 'month');
        let startDay = parseInt(startDt.value.format('DD'), 10);
        let endDay = parseInt(endDt.value.format('DD'), 10);
        if (diffMonth > 3 || (diffMonth == 3 && startDay < endDay)) {
          msg.warningSimpleNotifiCation(t('message.datewarning'));
          endDt.value = dayjs(startDt.value).add(3, 'month');
          state.params.end = endDt.value.toString();
        } else {
          endDt.value = e;
          state.params.end = dateUtil.format(endDt.value, dateUtil.Formats.day);
        }
      } else {
        msg.warningSimpleNotifiCation(t('message.datewarning1'));
        endDt.value = dayjs();
        state.params.end = dateUtil.getNow(dateUtil.Formats.day);
      }
    }
  }

  const setToday = () => {
    startDt.value = dayjs();
    endDt.value = dayjs();
  };

  const setYesterday = () => {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    startDt.value = dayjs(yesterday);
    endDt.value = dayjs(today);
  };

  const setSevenDaysAgo = () => {
    const today = new Date();
    const seventAgoday = new Date(today);

    seventAgoday.setDate(today.getDate() - 7);

    startDt.value = dayjs(seventAgoday);
    endDt.value = dayjs(today);
  };

  async function searchlog(newsearch: boolean) {
    if (newsearch == true) {
      state.pagination.current = 1;
    } else {
    }
    ui.isLoading = true;
    state.params.start = dateUtil.format(startDt.value, dateUtil.Formats.day);
    state.params.end = dateUtil.format(endDt.value, dateUtil.Formats.day);
    state.params.sort = state.sort;
    state.params.size = state.pagination.pageSize;
    state.params.page = state.pagination.current;

    if (state.direction == desc) {
      state.params.direction = desc;
    } else {
      state.params.direction = asc;
    }

    if (state.searchWord != '') {
      state.params.searchWord = state.searchWord;
    } else {
      state.params.searchWord = undefined;
    }

    if (state.statusValue == '') {
      state.params.status = undefined;
    } else {
      state.params.status = state.statusValue;
    }

    let paramcopy = cloneDeep(state.params);

    state.paginationParams = cloneDeep(state.params);
    searchMain(paramcopy);
  }

  function searchMain(param: PutawaySearch) {
    orderPutwayApi
      .putAway(param)
      .then((result) => {
        state.data = [];
        state.data = cloneDeep(result.content);

        if (state.data) {
          state.putawayData = state.data;

          state.pagination.pageSize = (result.pageable as Pageable).pageSize as number;
          state.pagination.current = (((result.pageable as Pageable).pageNumber as number) +
            1) as number;
          state.pagination.total = result.totalElements as number;
        } else {
          state.pagination.total = 0;
          state.pagination.current = 1;
        }

        setPagination({
          total: state.pagination.total,
          current: state.pagination.current,
        });

        if (state.data) {
          let rValueRobot = '';
          let rValuetotebox = '';

          for (let g = 0; g < state.data.length; g++) {
            if (state.putawayData[g].toteBoxes.length == 0) {
              state.putawayData[g].toteBoxGroup = '-';
            }
            for (let h = 0; h < state.putawayData[g].toteBoxes.length; h++) {
              if (state.putawayData[g].toteBoxes[h] === undefined) {
              } else {
                if (state.putawayData[g].toteBoxes.length > 1) {
                  if (h == 0) {
                    rValuetotebox += state.putawayData[g].toteBoxes.length.toString();

                    rValuetotebox += '(' + state.putawayData[g].toteBoxes[0] + ', ';
                  } else {
                    if (h == state.putawayData[g].toteBoxes.length - 1) {
                      rValuetotebox += state.putawayData[g].toteBoxes[h] + ')';
                    } else {
                      rValuetotebox += state.putawayData[g].toteBoxes[h] + ', ';
                    }
                  }
                } else {
                  rValuetotebox += state.putawayData[g].toteBoxes.length.toString();
                  rValuetotebox += '(' + state.putawayData[g].toteBoxes[0] + ')';
                }

                state.putawayData[g].toteBoxGroup = rValuetotebox;
              }
            }
            rValuetotebox = '';
          }

          for (let f = 0; f < state.data.length; f++) {
            if (state.putawayData[f].robots.length > 0) {
              for (let i = 0; i < state.putawayData[f].robots.length; i++) {
                if (state.putawayData[f].robots.length > 1) {
                  if (Number(i) == 0) {
                    rValueRobot += state.putawayData[f].robots[0] + ', ';
                  } else {
                    if (i == state.putawayData[f].robots.length - 1) {
                      rValueRobot += state.putawayData[f].robots[i];
                    } else {
                      rValueRobot += state.putawayData[f].robots[i] + ', ';
                    }
                  }
                } else {
                  rValueRobot = state.putawayData[f].robots[0];
                }
                state.putawayData[f].robotlist = rValueRobot;
              }
            } else {
              state.putawayData[f].robotlist = '-';
            }

            rValueRobot = '';
          }

          for (let f = 0; f < state.data.length; f++) {
            state.putawayData[f].qtyea =
              state.putawayData[f].confirmQty +
              '/' +
              state.putawayData[f].orderQty +
              '(' +
              state.putawayData[f].unit +
              ')';
          }
        } else {
        }

        /*seleted.value = [];*/

        setTableData(state.data);
        state.data = [];
        ui.isLoading = false;
      })
      .catch((e) => {
        ui.isLoading = false;
        console.log('putaway', e);
      });
  }

  onMounted(async () => {
    await setSelectProps(dateType.value);
    await searchlog(true);
  });

  const setSelectProps = async (dateType: string) => {
    status_type.value = [];
    let statusType: Model.waveStatus = await orderPickingApi.pickingsStatus(dateType);
    for (let i = 0; i < statusType.content.length; i++) {
      status_type?.value.push({
        value: statusType.content[i],
        label: statusType.content[i],
      });
    }
  };
</script>

<style lang="less">
  @import './style/index.less';

  .red {
    color: red;
  }

  .green {
    color: green;
  }
</style>
