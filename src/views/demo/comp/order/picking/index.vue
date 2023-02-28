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
              v-model:value="state.searchWord"
              :value="state.searchWord"
              :disabled="!inputDisalbe"
              :placeholder="state.searchwardPlaceHolder"
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
    </BasicTable>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useGo } from '/@/hooks/web/usePage';
  import {
    Card,
    DatePicker,
    Button,
    Select,
    SelectProps,
    RadioGroup,
    Radio,
    Input,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';

  import * as dateUtil from '/@/utils/custom/dateUtil';
  import * as orderPickingApi from '/@/api/order-picking';
  import * as msg from '/@/utils/msg';
  import dayjs, { Dayjs } from 'dayjs';
  import * as Model from '/@/model/order/picking';
  import { cloneDeep } from 'lodash-es';
  import { Pageable } from '/@/model/common';
  import { PickingSearch } from '/@/api/model/order';

  // declare utils
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const go = useGo();
  const dateType = ref('EXPECTED_DATE');
  const defalut = ref(`${t('common.createdDate')} ${t('common.desc')}`);
  const desc = 'DESC';
  const asc = 'ASC';

  let startDt = ref<Dayjs>(dayjs());
  let endDt = ref<Dayjs>(dayjs());

  let inputDisalbe = ref<boolean>(false);
  let status_type = ref<SelectProps['options']>([]);
  let search_type = ref<SelectProps['options']>([
    { value: '1', label: t('order.waveNo') },
    { value: '2', label: t('order.doId') },
    { value: '3', label: t('order.workNo') },
  ]);

  const orderByOption = ref<SelectProps['options']>([
    {
      value: 'ID DESC',
      label: `${t('common.id')} ${t('common.desc')}`,
    },
    {
      value: 'ID ASC',
      label: `${t('common.id')} ${t('common.asc')}`,
    },
    {
      value: 'WaveNo DESC',
      label: `${t('order.waveNo')} ${t('common.desc')}`,
    },
    {
      value: 'WaveNo ASC',
      label: `${t('order.waveNo')} ${t('common.asc')}`,
    },
    {
      value: 'CreateDate DESC',
      label: `${t('common.createdDate')} ${t('common.desc')}`,
    },
    {
      value: 'CreateDate ASC',
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
      title: t('common.id'),
      dataIndex: 'code',
      width: '300px',
      customRender: ({ record }) => {
        return record.code ? record.code : '-';
      },
    },
    {
      title: t('order.waveNo'),
      dataIndex: 'waveNo',
      width: '250px',
      customRender: ({ record }) => {
        return record.waveNo ? record.waveNo : '-';
      },
    },
    {
      title: t('order.totalDos'),
      dataIndex: 'totalDos',
      customRender: ({ record }) => {
        return record.totalDos ? record.totalDos : '-';
      },
    },
    {
      title: t('common.works'),
      dataIndex: 'totalWorks',
      customRender: ({ record }) => {
        return record.totalWorks ? record.totalWorks : '-';
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      customRender: ({ record }) => {
        return record.status ? record.status : '-';
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
    title: `${t('order.wave')} ${t('routes.order.picking')} List`,
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
    params: new orderPickingApi.Params.PickingSearch(),
    paginationParams: new orderPickingApi.Params.PickingSearch(),
    data: [] as any,
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
    rowKey: 'id',
    rowClassName: (record: any) => {
      if (record.status == 'UNSUCCESS') {
        return 'text-red-500';
      } else if (record.status == 'WORKING') {
        return 'text-indigo-500';
      } else {
        return 'text-slate-900';
      }
    },
    dataSource: state.data,
    bordered: true,
    showIndexColumn: false,

    pagination: paginationProp,
    customRow: ({ id, code }) => {
      return {
        onClick: getInfo.bind(null, id, code),
      };
    },
  });

  async function getInfo(id) {
    await goDetailView(id.toString());
  }
  function goDetailView(id: string) {
    go(`${ui.path}/${id}`);
  }

  type Direction = 'ASC' | 'DESC';

  const handleChange = (value: string) => {
    if (value == 'ID DESC') {
      state.direction = 'DESC';
      state.sort = 'id';
    } else if (value == 'ID ASC') {
      state.direction = 'ASC';
      state.sort = 'id';
    } else if (value == 'WaveNo DESC') {
      state.direction = 'DESC';
      state.sort = 'waveNo';
    } else if (value == 'WaveNo ASC') {
      state.direction = 'ASC';
      state.sort = 'waveNo';
    } else if (value == 'CreateDate DESC') {
      state.direction = 'DESC';
      state.sort = 'createdDate';
    } else if (value == 'CreateDate ASC') {
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

  /* function inputChange(e) {
    console.log(e.target.value, 'input');
    if (e.target.value == '') {
      // input is cleared
      state.searchWord = '';
      console.log(e, '1111');
    }
  }*/

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

  function searchlog(newsearch: boolean) {
    ui.isLoading = true;
    if (newsearch == true) {
      state.pagination.current = 1;
    } else {
    }
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

    if (state.searchWord == '') {
      state.params.searchWord = undefined;
    } else {
      state.params.searchWord = state.searchWord;
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

  function searchMain(param: PickingSearch) {
    orderPickingApi
      .pickings(param)
      .then((result) => {
        state.data = [];
        state.data = cloneDeep(result.content);

        if (state.data.length > 0) {
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

        setTableData(state.data);
        ui.isLoading = false;
      })
      .catch((e) => {
        console.log(e);
        ui.isLoading = false;
      });
  }
  onMounted(async () => {
    console.log('route', ui.path);
    await setSelectProps(dateType.value);
    searchlog(true);
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
