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
              :placeholder="t('common.searchText') + ' ' + t('common.by') + ' ' + t('common.name')"
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
  import * as Model from '/@/model/group';
  import { BasicColumn, BasicTable, useTable } from '/@/components/Table';
  import option from '/@/utils/option';
  import * as api from '/@/api/group';

  const { t } = useI18n();

  const ui = reactive({
    title: `${t('common.add')} ${t('common.group')}`,
    width: 1000,
    height: 1000,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const receviceGroupRowKeyData = inject('receviceGroupRowKeyData', (data) => {});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars,no-unused-vars
  const receviceGroupRowData = inject('receviceGroupRowData', (data) => {});

  const state = reactive({
    groupList: new Model.GroupList(),
    search: '',
    flag: false,
  });

  const [registerModal, { closeModal }] = useModalInner(async (data) => {
    state.groupList = await api.getGroupList({ size: 1000, sort: 'id', direction: 'ASC' });
    console.log(state.groupList, '???????');
    let list: number[] = data.map((val) => val.id) as number[];

    setSelectedRowKeys(list);
  });

  const listcom = computed(() => {
    let searchGroup = option.searchOptionsWtidhTargetName(
      'name',
      state.search,
      state.groupList.content,
    );
    return searchGroup;
  });

  const groupColumn: BasicColumn[] = [
    {
      title: t('common.id'),
      dataIndex: 'id',
      width: '10%',
    },
    {
      title: t('common.name'),
      dataIndex: 'name',
    },
    {
      title: t('common.remark'),
      dataIndex: 'remark',
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
      columns: groupColumn,
      bordered: false,
      rowKey: 'id',
      canResize: true,
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
    receviceGroupRowData(rowdata);
    receviceGroupRowKeyData(rowkey);
    closeModal();
  }

  defineExpose({
    getSelectedList,
  });

  onMounted(async () => {});
</script>
