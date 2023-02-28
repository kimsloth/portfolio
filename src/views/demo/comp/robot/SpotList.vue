<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="ui.title"
    :width="ui.width"
    :height="ui.height"
    @ok="okClick"
  >
    <div class="w-full h-full" style="height: 600px">
      <BasicTable @register="registerSelectedTable">
        <template #toolbar>
          <div tyle="display: block">
            <Input
              allowClear
              v-model:value="state.search"
              :placeholder="
                t('common.searchText') +
                ' ' +
                t('common.by') +
                ' ' +
                t('common.task') +
                t('common.name')
              "
              class="w-full"
          /></div>
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { computed, inject, onMounted, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Input } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import * as Model from '/@/model/robot';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import option from '/@/utils/option';
  import * as api from '/@/api/Group';

  const { t } = useI18n();

  const ui = reactive({
    title: `${t('common.add')} ${t('common.spot')}`,
    width: 1000,
    height: 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const receviceSpotRowKeyData = inject('receviceSpotRowKeyData', (data) => {});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const receviceSpotRowData = inject('receviceSpotRowData', (data) => {});

  const state = reactive({
    spotList: new Model.SpotList(),
    search: '',
    flag: false,
  });

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    state.spotList = await api.getSpotList({ size: 1000, sort: 'id', direction: 'ASC' });
    let list: number[] = data.map((val) => val.id) as number[];

    setSelectedRowKeys(list);
  });

  const listcom = computed(() => {
    let searchGroup = option.searchOptionsWtidhTargetName(
      'taskName',
      state.search,
      state.spotList.content,
    );
    return searchGroup;
  });

  const spotColumn: BasicColumn[] = [
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
      dataIndex: 'pointTypeCodeString',
    },
    {
      title: t('common.useyn'),
      dataIndex: 'userYnString',
      width: '10%',
    },
    {
      title: t('common.delete'),
      dataIndex: 'delete',
      ifShow: false,
    },
  ];

  const getSelectedList = () => {
    let ids: string[] = getSelectRowKeys();
    let result = listcom.value.filter((val) => {
      let find = ids.find((deviceId) => parseInt(deviceId) == val.id);
      if (find != undefined) return val;
    });
    return result;
  };

  const [registerSelectedTable, { setSelectedRowKeys, getSelectRowKeys, getSelectRows }] = useTable(
    {
      columns: spotColumn,
      rowKey: 'id',
      canResize: true,
      bordered: false,
      isCanResizeParent: true,
      clickToRowSelect: true,
      rowSelection: {
        type: 'checkbox',
      },
      showIndexColumn: false,
      pagination: false,
      useSearchForm: false,
      striped: false,
      dataSource: listcom,
    },
  );

  async function okClick() {
    let rowkey: any = null;
    let rowdata: any = null;
    rowkey = getSelectRowKeys();
    rowdata = getSelectRows();
    receviceSpotRowData(rowdata);
    receviceSpotRowKeyData(rowkey);
    closeModal();
  }

  defineExpose({
    getSelectedList,
  });

  onMounted(async () => {});
</script>
