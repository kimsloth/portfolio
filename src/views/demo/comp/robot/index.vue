<template>
  <div class="h-full flex p-4">
    <div class="w-1/5 h-full pr-4 ly-mw-left">
      <BasicTable
        @register="registerRobotTable"
        :rowSelection="{
          type: 'radio',
          columnWidth: 0,
          onChange: onChangeRobot,
          selectedRowKeys: state.selectedRowKeys.robotList,
        }"
        :dataSource="state.robotList"
      >
        <template #tableTitle>
          {{ `${t('common.total')} ${state.total}`.toLowerCase() }}
        </template>
        <template #toolbar>
          <Input
            class="!leading-tight !w-140px"
            :placeholder="t('common.searchText')"
            v-model:value="state.search"
            @change="search(state.robotList, state.search)"
          />
          <Icon
            hidden
            icon="ant-design:plus-circle-outlined"
            class="cursor-pointer"
            style="color: #0960bd"
            @click="addRobot"
          />
        </template>
      </BasicTable>
    </div>
    <div class="w-4/5 h-full">
      <Row class="h-1/2 w-full" style="overflow: auto">
        <Card
          :title="t('common.info')"
          :headStyle="{ backgroundColor: '#fafafa' }"
          :bodyStyle="{ overflow: 'auto' }"
          :size="ui.card.size"
          :bordered="false"
          class="w-full mb-1"
        >
          <template #extra>
            <a-button
              hidden
              v-show="state.createMode"
              class="mr-4"
              type="primary"
              @click="cancel()"
            >
              {{ t('common.cancelText') }}
            </a-button>
            <a-button type="primary" @click="modify(state.selectedRowKeys.robotList.toString())"
              >{{ state.mode3 == 'modify' ? t('common.modify') : t('common.add') }}
            </a-button>
          </template>
          <div class="flex flex-row">
            <div class="ant-col-8">
              <BasicForm @register="robotIBasicInfoForm" class="!mt-2 !p-2" />
            </div>
            <div class="ant-col-8">
              <BasicForm @register="robotDetailInfoForm" class="!mt-2 !p-2" />
            </div>
            <div class="ant-col-8">
              <BasicForm @register="robotAutochargeInfoForm" class="!mt-2 !p-2">
                <template #autoChargeYn
                  ><Switch
                    :checked-children="`${t('common.on')}`"
                    :un-checked-children="`${t('common.off')}`"
                    v-model:checked="state.robotDetailData.autoChargeYn"
                    :checkedValue="1"
                    :unCheckedValue="0"
                  />
                </template>
              </BasicForm>
            </div>
          </div>
        </Card>
      </Row>
      <Row class="h-1/2 w-full pt-2" style="overflow: hidden">
        <Col span="12" class="pr-2">
          <Card
            :size="ui.card.size"
            :title="`${t('common.group')}`"
            :bordered="false"
            :headStyle="{
              'background-color': '#fafafa',
            }"
            class="w-full h-full"
          >
            <template #extra>
              <a-button @click="groupOpen(true, state.robotGroup)">{{ t('common.add') }}</a-button>
            </template>
            <BasicTable
              v-if="state.modifyMode == true"
              @register="GroupTable"
              :dataSource="state.robotGroup"
            />
            <div v-else class="justify-center items-center flex-grow"
              >{{ t('common.no_data') }}
            </div>
          </Card>
          <Grouplist
            @register="groupModal"
            :groupDetail="state.robotDetailData"
            @success="modalSuccess"
          />
        </Col>
        <Col span="12">
          <Card
            :size="ui.card.size"
            :title="`${t('common.spot')}`"
            :bordered="false"
            :headStyle="{
              'background-color': '#fafafa',
            }"
            class="w-full h-full"
          >
            <template #extra>
              <a-button @click="spotOpen(true, state.robotSpots)">{{ t('common.add') }}</a-button>
            </template>
            <BasicTable
              v-if="state.modifyMode == true"
              @register="SpotTable"
              :dataSource="state.robotSpots"
            />
            <div v-else class="justify-center items-center flex-grow"
              >{{ t('common.no_data') }}
            </div>
          </Card>
          <Spotlist
            @register="spotModal"
            :groupDetail="state.robotDetailData"
            @success="modalSuccess"
          />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, provide, reactive, ref } from 'vue';
  import Icon from '/@/components/Icon';
  import { Card, Input, Row, SelectProps, Switch, Col } from 'ant-design-vue';
  import { BasicColumn, BasicTable, FormSchema, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import * as robotApi from '/@/api/robot';
  import * as robotModel from '/@/model/robot';
  import { codes, getCodesByFind } from '/@/config/codes';
  import { useMessage } from '/@/hooks/web/useMessage';
  import Grouplist from './GroupList.vue';
  import Spotlist from './SpotList.vue';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';

  // declare utils
  const { t } = useI18n();
  const { notification } = useMessage();

  const [groupModal, { openModal: groupOpen }] = useModal();
  const [spotModal, { openModal: spotOpen }] = useModal();

  // declare reactive state
  const ui = reactive({
    card: { size: 'small' },
    description: { size: 'small' },
  });

  const state = reactive({
    selectedRowKeys: {
      robotList: [] as (string | number)[],
    },
    robotDetailData: {} as robotModel.RobotDetailInfo | null,
    robotSpots: [] as robotModel.RobotSpots[],
    robotGroup: [] as robotModel.RobotGroup[],
    robotList: [] as robotModel.RobotInfo[],
    robotDevice: {} as robotModel.RobotDevice,
    pagination: {
      pageSize: 1000,
    },
    total: 0,
    param: new robotApi.Params.RobotParam(),
    search: '',
    modifyGroup: true,
    mode: false,
    modifyMode: true,
    modify: true,
    // -----------------for desc--------------------
    robotTypeCode: 0,
    useYn: 1,
    spot: [] as number[],
    group: [] as number[],
    createMode: false,
    mode1: {
      view: 'view',
      modify: 'modify',
      create: 'create',
    },
    modifyRobotId: true,
    mode3: 'modify',
  });

  const SpotListColum: BasicColumn[] = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: t('common.task') + ' ' + t('common.id'),
      dataIndex: 'taskId',
      width: '10%',
    },
    {
      title: t('common.task') + ' ' + t('common.name'),
      dataIndex: 'taskName',
    },
    {
      title: t('common.action') + ' ' + t('common.id'),
      dataIndex: 'actionId',
    },
    {
      title: t('common.type'),
      dataIndex: 'pointTypeCode',
      customRender: ({ value }) => {
        if (value == 2040101) {
          value = t('code.job.spot.2040101');
        } else {
          value = t('code.job.spot.2040102');
        }
        return value;
      },
    },
    {
      title: t('common.useyn'),
      dataIndex: 'useYn',
      width: '10%',
      customRender: ({ value }) => {
        if (value == 1) {
          value = t('common.useY');
        } else {
          value = t('common.useN');
        }
        return value;
      },
    },
  ];

  const GroupListColum: BasicColumn[] = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      width: '50px',
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
  ];

  const columnsList: BasicColumn[] = [
    {
      title: `${t('common.id')}`,
      dataIndex: 'id',
      width: 90,
      fixed: 'left',
    },
    {
      title: `${t('common.name')}`,
      dataIndex: 'name',
      ellipsis: true,
    },
  ];

  const robotTypeCodeOption = ref<SelectProps['options']>([
    {
      value: codes.robot.type.datas[6].code,
      label: codes.robot.type.datas[6].name(),
    },
    {
      value: codes.robot.type.datas[0].code,
      label: codes.robot.type.datas[0].name(),
    },
    {
      value: codes.robot.type.datas[1].code,
      label: codes.robot.type.datas[1].name(),
    },
    {
      value: codes.robot.type.datas[2].code,
      label: codes.robot.type.datas[2].name(),
    },
    {
      value: codes.robot.type.datas[3].code,
      label: codes.robot.type.datas[3].name(),
    },
    {
      value: codes.robot.type.datas[4].code,
      label: codes.robot.type.datas[4].name(),
    },
    {
      value: codes.robot.type.datas[5].code,
      label: codes.robot.type.datas[5].name(),
    },
  ]);

  const schemasInfo: FormSchema[] = [
    {
      field: 'id',
      label: t('common.id'),
      component: 'Input',
      componentProps: {
        readonly: true,
      },
    },
    {
      field: 'name',
      label: t('common.name'),
      component: 'Input',
    },
    {
      field: 'typeCode',
      label: t('common.type'),
      component: 'Select',
      componentProps: {
        options: robotTypeCodeOption,
        disabled: true,
      },
    },
  ];

  const schemasDetail: FormSchema[] = [
    {
      field: 'ip',
      label: `${t('common.ip')}`,
      component: 'Input',
    },
    {
      field: 'loader',
      label: `${t('common.loader')}`,
      component: 'Input',
      componentProps: { readonly: true },
    },
    {
      field: 'width',
      label: `${t('common.width')}[m] `,
      component: 'InputNumber',
      componentProps: { readonly: true },
    },
    {
      field: 'height',
      label: `${t('common.height')}[m] `,
      component: 'InputNumber',
      componentProps: { readonly: true },
    },
  ];

  const schemasAutoCharge: FormSchema[] = [
    {
      field: 'autoChargeYn',
      label: t('common.autoChargeEnable'),
      component: 'Input',
      componentProps: {
        checkedValue: 1,
        unCheckedValue: 0,
      },
      slot: 'autoChargeYn',
    },
    {
      field: 'chargeOnBattery',
      label: `${t('common.chargeOnBattery')}[%] `,
      component: 'InputNumber',
    },
    {
      field: 'chargeOffBattery',
      label: `${t('common.chargeOffBattery')}[%] `,
      component: 'InputNumber',
    },
    {
      field: 'assignMinBattery',
      label: `${t('common.assignMinBattery')}[%] `,
      component: 'InputNumber',
    },
  ];

  const [
    robotIBasicInfoForm,
    { setFieldsValue: setBasicInfo, getFieldsValue: getinfo, updateSchema: updateInfo },
  ] = useForm({
    schemas: schemasInfo,
    layout: 'horizontal',
    labelCol: {
      span: 4,
    },
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  const [
    robotDetailInfoForm,
    { setFieldsValue: setDetailInfo, getFieldsValue: getDetailinfo, updateSchema: updateDetail },
  ] = useForm({
    schemas: schemasDetail,
    layout: 'horizontal',
    labelCol: {
      md: 12,
      xl: 8,
    },
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  const [
    robotAutochargeInfoForm,
    {
      setFieldsValue: setAutoChargeInfo,
      getFieldsValue: getAutochargeinfo,
      updateSchema: updateAutocharge,
    },
  ] = useForm({
    schemas: schemasAutoCharge,
    layout: 'horizontal',
    labelCol: {
      md: 20,
      xl: 12,
    },
    baseColProps: {
      span: 24,
    },
    showActionButtonGroup: false,
  });

  const [registerRobotTable, { updateTableDataRecord, setTableData }] = useTable({
    columns: columnsList,
    rowKey: 'id',
    tableLayout: 'auto',
    pagination: false,
    clickToRowSelect: true,
    striped: false,
    showIndexColumn: false,
  });

  const [SpotTable] = useTable({
    columns: SpotListColum,
    ellipsis: false,
    rowKey: 'id',
    pagination: false,
    bordered: false,
    striped: false,
    scroll: { y: 305 },
    showIndexColumn: false,
  });

  const [GroupTable] = useTable({
    columns: GroupListColum,
    ellipsis: false,
    rowKey: 'id',
    pagination: false,
    bordered: false,
    striped: false,
    scroll: { y: 305 },
    showIndexColumn: false,
  });

  function search(obj, value) {
    setTableData(obj.filter(({ id }) => id.toLowerCase().includes(value.toLowerCase())));
  }

  function modalSuccess() {
    // msg.successMsg(t('common.user') + t('common.save'));
  }

  async function onChangeRobot(selectedRowKeys: (string | number)[]) {
    if (selectedRowKeys.length == 1) {
      try {
        state.modifyRobotId = true;
        state.selectedRowKeys.robotList = selectedRowKeys;
        await getRobotInfoDetail(state.selectedRowKeys.robotList.toString());
      } catch (e) {
        state.modifyRobotId = false;
        state.mode3 = state.mode1.create;
        state.createMode = true;

        console.error('robot select', e);
      }
    }
  }

  function addRobot() {
    state.modifyRobotId = false;
    state.mode3 = state.mode1.create;
    state.createMode = true;

    state.robotDetailData!.id = '';
    state.robotDetailData!.ip = '';
    state.robotDetailData!.name = '';
    state.robotDetailData!.assignMinBattery = 0;
    state.robotDetailData!.autoChargeYn = 0;
    state.robotDetailData!.chargeOnBattery = 0;
    state.robotDetailData!.chargeOffBattery = 0;
  }

  function cancel() {
    state.mode3 = state.mode1.modify;
    state.modifyRobotId = true;
    state.createMode = false;

    onChangeRobot(state.selectedRowKeys.robotList);
  }

  async function modify(id: string) {
    if (state.mode3 == state.mode1.modify) {
      try {
        const robotinfo = getinfo();
        console.log(robotinfo, 'robotinfo');
        const dtailinfo = getDetailinfo();
        const autoChargeinfo = getAutochargeinfo();
        state.mode3 = state.mode1.modify;
        state.modifyRobotId = true;

        if (state.createMode == false) {
          await robotApi.modifyRobot(id, {
            name: robotinfo.name,
            ip: dtailinfo.ip,
            spots: state.spot,
            width: dtailinfo.width,
            height: dtailinfo.height,
            autoChargeYn: Number(state.robotDetailData?.autoChargeYn),
            chargeOnBattery: autoChargeinfo.chargeOnBattery,
            chargeOffBattery: autoChargeinfo.chargeOffBattery,
            assignMinBattery: autoChargeinfo.assignMinBattery,
            groups: state.group,
          });

          await updateInfo([
            {
              field: 'name',
              defaultValue: robotinfo.name,
            },
          ]);

          await updateDetail([
            {
              field: 'ip',
              defaultValue: dtailinfo.ip,
            },
          ]);

          await updateAutocharge([
            {
              field: 'autoChargeYn',
              defaultValue: autoChargeinfo.autoChargeYn,
            },
            {
              field: 'chargeOnBattery',
              defaultValue: autoChargeinfo.chargeOnBattery,
            },
            {
              field: 'chargeOffBattery',
              defaultValue: autoChargeinfo.chargeOffBattery,
            },
            {
              field: 'assignMinBattery',
              defaultValue: autoChargeinfo.assignMinBattery,
            },
          ]);

          updateTableDataRecord(id, { name: robotinfo.name });

          notification.success({
            message: t('message.success', { title: t('common.modify') }),
            duration: 2,
          });
        }
      } catch (e) {
        notification.error({
          message: t('message.error', { title: t('common.modify') }),
          duration: 3,
        });
        console.log(e);
      }
    } else {
      try {
        state.useYn = 1;

        await robotApi.createRobot({
          id: state.robotDetailData?.id as string,
          name: state.robotDetailData?.name,
          ip: state.robotDetailData?.ip,
          typeCode: state.robotTypeCode,
          autoChargeYn: state.robotDetailData?.autoChargeYn,
          chargeOnBattery: state.robotDetailData?.chargeOnBattery,
          chargeOffBattery: state.robotDetailData?.chargeOffBattery,
          assignMinBattery: state.robotDetailData?.assignMinBattery,
        });
        notification.success({
          message: t('common.success'),
          description: t('common.save'),
          duration: 3,
        });
        if (state?.robotList[0].id) {
          await onChangeRobot([state?.robotList[0].id.toString()]);
        }
      } catch (e) {
        state.createMode = true;
        console.log(e);
      }
    }
  }

  async function getRobotInfoDetail(id: string) {
    try {
      const data = await robotApi.getRobotDetail(id);
      state.robotDetailData = data as robotModel.RobotDetailInfo;
      state.robotSpots = state.robotDetailData.spots as any[];
      state.robotGroup = state.robotDetailData.groups as any[];
      state.group = [];
      state.spot = [];

      const robotType = getCodesByFind(
        codes.robot.type.datas,
        state.robotDetailData.typeCode as number,
      ) as {
        code: number;
        name: Function;
      };
      if (robotType === undefined) {
        state.robotTypeCode = 0;
      } else {
        state.robotTypeCode = robotType.name().toString();
      }

      for (let i = 0; i < data.groups.length; i++) {
        const groupId = data.groups[i].id as number;
        state.group.push(groupId);
      }

      for (let i = 0; i < data.spots.length; i++) {
        const spotId = data.spots[i].id as number;
        state.spot.push(spotId);
      }

      if (state.robotDetailData) {
        await setBasicInfo(state.robotDetailData);
        await setDetailInfo(state.robotDetailData);
        await setAutoChargeInfo(state.robotDetailData);
      }
    } catch (e) {
      console.error('robot list', e);
    }
  }

  const receviceSpotRowData = (data: any) => {
    state.robotSpots = data;
  };

  const receviceSpotKeyData = (data: any) => {
    state.spot = data;
  };

  provide('receviceSpotRowKeyData', receviceSpotKeyData);

  provide('receviceSpotRowData', receviceSpotRowData);

  const receviceGroupRowData = (data: any) => {
    state.robotGroup = data.sort(function (a, b) {
      return a.id - b.id;
    });
  };

  const receviceGroupRowKeyData = (data: any) => {
    state.group = data;
  };

  provide('receviceGroupRowKeyData', receviceGroupRowKeyData);

  provide('receviceGroupRowData', receviceGroupRowData);

  async function getRobotList() {
    try {
      state.param.size = state.pagination.pageSize;

      const data = await robotApi.getRobotList(state.param);
      console.log(data, '!!!!!');
      state.total = data.totalElements;

      if (data.content && data.content.length > 0) {
        state.robotList = data.content;
        state.selectedRowKeys.robotList.push(state.robotList[0].id as string);
      }
    } catch (e) {
      console.error('robot list', e);
    }
  }

  onMounted(async () => {
    state.param.use = 1;
    state.param.direction = 'ASC';
    await getRobotList();
    await getRobotInfoDetail(state.robotList[0].id as string);
  });
</script>

<style scoped></style>
