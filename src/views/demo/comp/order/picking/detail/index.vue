<template>
  <PageWrapper
    contentFullHeight
    fixedHeight
    :contentBackground="ui.pageWrapper.bg"
    @back="ui.pageWrapper.goBack()"
  >
    <template #title>{{ ui.title }} / {{ state.detail.code }}</template>
    <!--    <template #headerContent>{{ ui.pageWrapper.headerContent }}</template>-->
    <template #extra> </template>
    <Card :size="ui.card.size" class="!p-4">
      <Description
        class="h-1/5"
        :size="ui.description.size"
        :bordered="false"
        :column="4"
        :data="state.detail"
        :schema="descSchemaDetailInfo"
      />
    </Card>
    <Row :gutter="[16, 16]">
      <Col :span="10">
        <BasicTable @register="registerTable" class="pl-4">
          <template #toolbar>
            <span>
              {{ t('common.orderBy') }}
            </span>
            <Select
              v-model:value="value1"
              class="w-180px"
              :autofocus="true"
              :options="options1"
              @change="handleChange"
            />
          </template>
        </BasicTable>
      </Col>
      <Col :span="1">
        <div class="flex justify-center">
          <Icon :style="{ color: 'gray' }" class="text-5xl pt-60">
            <template #component><DoubleRightOutlined /></template>
          </Icon>
        </div>
      </Col>
      <Col :span="13">
        <Card class="!my-2">
          <Card
            class="!mb-4"
            :bodyStyle="{
              display: 'flex',
              'flex-grow': 1,
              height: '200px',
              justifyContent: 'center',
              alignItems: 'center',
            }"
          >
            <Description
              v-if="state.deliveryOrderDetail.works"
              :size="ui.description.size"
              :bordered="false"
              :column="2"
              :data="state.deliveryOrderDetail"
              :schema="schemaDoInfo"
            /><div class="text-lg" v-else>{{ t('order.defalutMessage') }}</div>
          </Card>

          <BasicTable @register="workTable" class="">
            <Empty>
              <Button type="primary">Create Now</Button>
            </Empty>
            <template #bodyCell="{ column, value, record }">
              <template v-if="column.dataIndex === 'status' && value === 'UNSUCCESS'">
                <Tooltip v-if="`${record.msgSecond}`" :title="`${record.msgFirst} `">
                  {{ value }}
                </Tooltip>
                <Tooltip v-else :title="`${record.msgFirst} (${record.msgSecond})`">
                  {{ value }}
                </Tooltip>
              </template>
            </template>
          </BasicTable>
        </Card>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Row, Col, Select, Card, SelectProps, Tooltip, Empty } from 'ant-design-vue';
  import Icon, { DoubleRightOutlined } from '@ant-design/icons-vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { Description, DescItem } from '/@/components/Description';
  import * as orderPickingApi from '/@/api/order-picking';
  import * as ModelDetail from '/@/model/order/pickingDetail';
  import * as Model from '/@/model/order/picking';

  // declare utils
  const route = useRoute();
  const router = useRouter();
  const { t } = useI18n();
  const value1 = ref(`${t('order.doId')} ${t('common.desc')}`);
  let errorMessage = ref<string>('');
  let status_type = ref<SelectProps['options']>([]);
  // const go = useGo();

  const options1 = ref<SelectProps['options']>([
    {
      value: 'doID DESC',
      label: `${t('order.doId')} ${t('common.desc')}`,
    },
    {
      value: 'doID ASC',
      label: `${t('order.doId')} ${t('common.asc')}`,
    },
    {
      value: 'startedDate DESC',
      label: `${t('common.startedDate')} ${t('common.desc')}`,
    },
    {
      value: 'startedDate ASC',
      label: `${t('common.startedDate')} ${t('common.asc')}`,
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

  const descSchemaDetailInfo: DescItem[] = [
    {
      labelMinWidth: 90,
      field: 'waveNo',
      label: t('order.waveNo'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'totalDos',
      label: t('order.totalDos'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'expectedDate',
      label: t('order.expectedDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'startedDate',
      label: t('common.startedDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'status',
      label: t('common.status'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'totalWorks',
      label: t('order.totalWorks'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'createdDate',
      label: t('common.createdDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 90,
      field: 'finishedDate',
      label: t('common.finishedDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
  ];

  const schemaDoInfo: DescItem[] = [
    {
      labelMinWidth: 100,
      field: 'doId',
      label: t('order.doId'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'status',
      label: t('common.status'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'totalWork',
      label: t('order.totalWorks'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'AMRString',
      label: t('order.workingAmr'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'totalBoxQty',
      label: t('order.totalBoxQty'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'toteBoxeString',
      label: t('order.toteBoxes'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'totalQty',
      label: t('order.totalQty'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'itemVarieties',
      label: t('order.varietyOfItems'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'startedDate',
      label: t('common.startedDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
    {
      labelMinWidth: 100,
      field: 'finishedDate',
      label: t('common.finishedDate'),
      render: (curVal) => {
        if (curVal === undefined) {
          curVal = '-';
        } else {
        }
        return `${curVal}`;
      },
    },
  ];

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
      title: t('order.doId'),
      dataIndex: 'doId',
      width: 100,
      customRender: ({ record }) => {
        return record.doId ? record.doId : '-';
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 100,
      customRender: ({ record }) => {
        return record.status ? record.status : '-';
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

  const worksColumns: BasicColumn[] = [
    {
      title: t('common.idx'),
      dataIndex: 'id',
      width: '50px',
      customRender: ({ record }) => {
        return record.id ? record.id : '-';
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
      customRender: ({ record }) => {
        return record.itemCode ? record.itemCode : '-';
      },
    },
    {
      title: t('common.itemName'),
      dataIndex: 'itemName',
      customRender: ({ record }) => {
        return record.itemName ? record.itemName : '-';
      },
    },
    {
      title: t('order.qty'),
      dataIndex: 'qtyunit',
      width: '70px',
      customRender: ({ record }) => {
        return record.qtyunit ? record.qtyunit : '-';
      },
    },
    {
      title: t('common.cell'),
      dataIndex: 'source',
      width: '80px',
      customRender: ({ record }) => {
        return record.source ? record.source : '-';
      },
    },
    {
      title: t('common.shipperId'),
      dataIndex: 'shipperId',
      width: '80px',
      customRender: ({ record }) => {
        return record.shipperId ? record.shipperId : '-';
      },
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: '80px',
      customRender: ({ record }) => {
        return record.status ? record.status : '-';
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

  const formSchema: FormSchema[] = [
    {
      field: 'status',
      component: 'Select',
      label: t('common.status'),
      colProps: {
        xxl: 6,
      },
      itemProps: {
        labelAlign: 'left',
      },
      componentProps: () => {
        return {
          onChange: (e: any) => {
            state.params.status = e;
          },
          options: status_type.value,
          placeholder: t('common.status'),
        };
      },
    },
    {
      field: 'searchType',
      component: 'Select',
      label: t('common.searchWord'),
      labelWidth: '110px',
      colProps: {
        xxl: 8,
      },
      componentProps: () => {
        return {
          onChange: (e: any) => {
            if (e == '1') {
              state.params.searchType = 1;
            } else {
              state.params.searchType = 2;
            }
          },
          options: [
            {
              label: t('order.doId'),
              value: 1,
            },
            {
              label: t('order.workNo'),
              value: 2,
            },
          ],
          placeholder: t('common.searchType'),
        };
      },
      itemProps: {
        labelAlign: 'right',
      },
    },
    {
      field: 'searchWord',
      component: 'Input',
      dynamicDisabled: ({ values, model }) => {
        if (model.searchType == undefined || model.searchType == '') {
          model.searchWord = '';
          state.params.searchWord = undefined;
        }

        return values.searchType ? false : true;
      },
      componentProps: () => {
        return {
          onChange: (e: any) => {
            state.params.searchWord = e.target.value;
          },
          placeholder: t('common.searchWord'),
        };
      },
      labelWidth: '5px',
      label: ' ',
      colProps: {
        xxl: 6,
      },
    },
  ];

  // declare ui state
  const ui = reactive({
    title: `${t('order.wave')} ${t('routes.order.pickingDetail')}`,
    path: `${route.path}`,
    pageWrapper: {
      bg: false,
      extra: '',
      headerContent: '',
      goBack: () => router.go(-1),
    },
    description: { size: 'small' },
    card: { size: 'small' },
    table: {
      selectedRowKeys: [] as (string | number)[],
    },
  });

  // declare data state
  const state = reactive({
    id: route.params.id,
    code: route.params.code,
    params: new orderPickingApi.Params.deliveryOrdersSearch(),
    works: [] as any,
    deliveryOrderDetail: {} as ModelDetail.DoDetailWork,
    data: [] as any,
    detail: {} as ModelDetail.PickingDetail,
  });
  ui.pageWrapper.headerContent = `detail id : ${state.id}`;

  const [registerTable, { reload }] = useTable({
    columns: basicColumns,
    rowKey: 'id',
    bordered: true,
    api: pickingDetailApi,
    useSearchForm: true,
    showIndexColumn: false,
    rowClassName: (record: any) => {
      if (record.status == 'WORKING') {
        return 'text-indigo-500';
      } else if (record.status == 'UNSUCCESS') {
        return 'text-red-500';
      } else {
        return 'text-slate-900';
      }
    },
    formConfig: {
      actionColOptions: {
        span: 'auto',
        flex: 'auto',
      },
      schemas: formSchema,
      autoSubmitOnEnter: true,
      showResetButton: false,
      // alwaysShowLines: 2,
      showAdvancedButton: false,
    },
    pagination: { showQuickJumper: false },
    customRow: ({ id }) => {
      return {
        onClick: getInfo.bind(null, id),
      };
    },
    onChange,
  });

  async function onChange() {
    state.params.page = arguments[0] ? arguments[0].current : 1;
    state.params.size = arguments[0] ? arguments[0].pageSize : 20;
  }

  function getInfo(id) {
    onSelectChange(id.toString());
  }

  const [workTable, { setTableData }] = useTable({
    columns: worksColumns,
    rowKey: 'id',
    bordered: true,
    dataSource: state.works,
    inset: true,
    locale: { emptyText: errorMessage },
    rowClassName: (record: any) => {
      if (record.status == 'WORKING') {
        return 'text-blue-500';
      } else if (record.status == 'UNSUCCESS') {
        return 'text-red-500';
      } else {
        return 'text-slate-900';
      }
    },
    showIndexColumn: false,
    pagination: { showQuickJumper: false },
    formConfig: {
      schemas: formSchema,
      autoSubmitOnEnter: true,
      showResetButton: false,
      alwaysShowLines: 2,
      showAdvancedButton: false,
    },
  });

  async function pickingDetailApi(): Promise<any> {
    await onChange();
    if (state.params.searchWord === undefined) {
      state.params.searchType = undefined;
    }

    return orderPickingApi.getDeliveryOrderList(state.id, {
      page: state.params.page,
      size: state.params.size,
      status: state.params.status,
      direction: state.params.direction,
      searchType: state.params.searchType,
      searchWord: state.params.searchWord,
      sort: state.params.sort,
    });
  }

  async function onSelectChange(selectedRowKeys: (string | number)[]) {
    if (selectedRowKeys.length > 0) {
      try {
        let rValuetotebox = '';
        let rValueRobot = '';
        ui.table.selectedRowKeys = selectedRowKeys;
        const data = await orderPickingApi.getDoDetailWork(ui.table.selectedRowKeys);

        state.deliveryOrderDetail = data;

        if (state.deliveryOrderDetail.workingAMR) {
          for (let h = 0; h < state.deliveryOrderDetail.workingAMR.length; h++) {
            if (state.deliveryOrderDetail.workingAMR.length > 1) {
              if (Number(h) == 0) {
                rValuetotebox += state.deliveryOrderDetail.workingAMR[0] + ', ';
              } else {
                if (h == state.deliveryOrderDetail.workingAMR.length - 1) {
                  rValuetotebox += state.deliveryOrderDetail.workingAMR[h];
                } else {
                  rValuetotebox += state.deliveryOrderDetail.workingAMR[h] + ', ';
                }
              }
            } else {
              rValuetotebox += state.deliveryOrderDetail.workingAMR[0];
            }
            state.deliveryOrderDetail.AMRString = rValuetotebox;
          }
        } else {
          state.deliveryOrderDetail.AMRString = '-';
        }

        if (state.deliveryOrderDetail.toteBoxes) {
          for (let h = 0; h < state.deliveryOrderDetail.toteBoxes.length; h++) {
            if (state.deliveryOrderDetail.toteBoxes.length > 1) {
              if (Number(h) == 0) {
                rValueRobot += state.deliveryOrderDetail.toteBoxes[0] + ', ';
              } else {
                if (h == state.deliveryOrderDetail.toteBoxes.length - 1) {
                  rValueRobot += state.deliveryOrderDetail.toteBoxes[h];
                } else {
                  rValueRobot += state.deliveryOrderDetail.toteBoxes[h] + ', ';
                }
              }
            } else {
              rValueRobot += state.deliveryOrderDetail.toteBoxes[0];
            }

            state.deliveryOrderDetail.toteBoxeString = rValueRobot;
          }
        } else {
          state.deliveryOrderDetail.AMRString = '-';
        }

        state.works = data.works;

        state.works[0].qtyunit = state.works[0].orderQty + state.works[0].unit;

        for (let f = 0; f < state.works.length; f++) {
          state.works[f].qtyunit =
            state.works[f].confirmQty +
            '/' +
            state.works[f].orderQty +
            '(' +
            state.works[f].unit +
            ')';
        }

        setTableData(state.works);
      } catch (e) {
        errorMessage.value = t('message.cannotFindData');
        console.error('Do select', e);
      }
    }
  }

  const handleChange = (value: string) => {
    if (value == 'doID DESC') {
      state.params.direction = 'DESC';
      state.params.sort = 'doId';
      reload();
    } else if (value == 'doID ASC') {
      state.params.direction = 'ASC';
      state.params.sort = 'doId';
      reload();
    } else if (value == 'startedDate DESC') {
      state.params.direction = 'DESC';
      state.params.sort = 'startedDate';
      reload();
    } else if (value == 'startedDate ASC') {
      state.params.direction = 'ASC';
      state.params.sort = 'startedDate';
      reload();
    } else if (value == 'FinishedDate DESC') {
      state.params.direction = 'DESC';
      state.params.sort = 'finishedDate';
      reload();
    } else if (value == 'FinishedDate ASC') {
      state.params.direction = 'ASC';
      state.params.sort = 'finishedDate';
      reload();
    }
  };

  onMounted(async () => {
    await setWaveDetail();
    await setSelectProps();
  });

  async function setWaveDetail() {
    const data = await orderPickingApi.pickingsDetail(state.id);
    state.detail = data as ModelDetail.PickingDetail;
  }

  const setSelectProps = async () => {
    status_type.value = [];
    let statusType: Model.waveStatus = await orderPickingApi.doStatus();
    for (let i = 0; i < statusType.content.length; i++) {
      if (status_type.value) {
        status_type?.value.push({
          value: statusType.content[i],
          label: statusType.content[i],
        });
      }
    }
  };
</script>

<style>
  .red {
    color: red;
  }

  .blue {
    color: #207ab7;
  }

  .black {
    color: black;
  }
</style>
