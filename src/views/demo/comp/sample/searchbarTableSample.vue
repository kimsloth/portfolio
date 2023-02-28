<!--
<template>
  <BasicTable @register="registerTable" ref="tableRef">
    <template #action="{ record, columns }">
      <TableAction :actions="createActions(record, columns)" />
    </template>
  </BasicTable>
</template>
<script lang="ts" setup>
  import {
    BasicTable,
    TableAction,
    useTable,
    EditRecordRow,
    ActionItem,
    BasicColumn,
    TableActionType,
    FormSchema,
  } from '/@/components/Table';
  import { ref } from 'vue';
  import * as robotErrorApi from '/@/api/error';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import dayjs from 'dayjs';
  import * as robotApi from '@/api/robot';

  const tableRef = ref<Nullable<TableActionType>>(null);
  const { createMessage: msg } = useMessage();
  const currentEditKeyRef = ref('');

  const { t } = useI18n();

  const columns: BasicColumn[] = [
    {
      title: t('robotErrorlog.tartget'),
      dataIndex: 'targetName',
    },
    {
      title: t('robotErrorlog.code'),
      dataIndex: 'code',
    },
    {
      title: t('robotErrorlog.name'),
      dataIndex: 'name',
    },
    {
      title: t('robotErrorlog.level'),
      dataIndex: 'level',
    },
    {
      title: t('robotErrorlog.taskName'),
      dataIndex: 'taskName',
    },
    {
      title: t('robotErrorlog.jobDtlName'),
      dataIndex: 'jobDtlName',
    },
    {
      title: t('job.createDate'),
      dataIndex: 'createDt',
    },
    {
      title: t('robotErrorlog.remark'),
      dataIndex: 'remark',
      defaultHidden: true,
    },
  ];

  const schemas: FormSchema[] = [
    {
      field: 'startDt',
      label: t('robotErrorlog.startDate'),
      component: 'DatePicker',
      defaultValue: dayjs().format('YYYY-01-12 00:00:00'),
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '',
        showTime: { format: 'HH:mm:ss' },
      },
      colProps: { xl: 6, xxl: 4 },
    },
    {
      field: 'endDt',
      label: t('robotErrorlog.endDate'),
      component: 'DatePicker',
      defaultValue: dayjs().format('YYYY-MM-DD 23:59:59'),
      componentProps: {
        format: 'YYYY-MM-DD HH:mm:ss',
        placeholder: '',
        showTime: { format: 'HH:mm:ss' },
      },
      colProps: { xl: 6, xxl: 4 },
    },
    {
      field: '',
      component: 'RadioButtonGroup',
      label: '   ',
      colProps: {
        span: 16,
      },
      componentProps: ({ formActionType }) => {
        return {
          onChange: (e: any) => {
            console.log(e);
            const { setFieldsValue } = formActionType;
            if (e == 'today') {
              setFieldsValue({
                startDt: dayjs().format('YYYY-MM-DD 00:00:00').toString(),
                endDt: dayjs().format('YYYY-MM-DD 23:59:59').toString(),
              });
            } else if (e == 'yesterday') {
              setFieldsValue({
                startDt: dayjs().add(-1, 'day').format('YYYY-MM-DD 00:00:00').toString(),
                endDt: dayjs().add(-1, 'day').format('YYYY-MM-DD 23:59:59').toString(),
              });
            } else if (e == '7day') {
              setFieldsValue({
                startDt: dayjs().add(-7, 'day').format('YYYY-MM-DD 00:00:00').toString(),
                endDt: dayjs().format('YYYY-MM-DD 23:59:59').toString(),
              });
            }
          },
          options: [
            {
              label: '7Day',
              value: '7day',
            },
            {
              label: 'YesterDay',
              value: 'yesterday',
            },
            {
              label: 'Today',
              value: 'today',
            },
          ],
        };
      },
    },
    {
      label: t('robotErrorlog.errorCode'),
      field: 'code',
      component: 'Input',
      componentProps: {
        valueField: 'code',
      },
      colProps: {
        span: 4,
      },
    },
    {
      label: t('robotErrorlog.robotId'),
      field: 'robotId',
      component: 'ApiSelect',
      componentProps: {
        api: robotApi.getRobotListArray,
        labelField: 'name',
        valueField: 'id',
      },
      colProps: {
        span: 4,
      },
    },
  ];

  const [registerTable, { updateTableDataRecord }] = useTable({
    title: 'ErrorLog',
    rowKey: 'id',
    api: robotErrorApi.getRobotErrorLogList,
    columns,
    formConfig: {
      showResetButton: false,
      schemas: schemas,
      autoSubmitOnEnter: true,
    },
    actionColumn: {
      width: 100,
      title: 'Check',
      dataIndex: 'isChecked',
      fixed: false,
      slots: { customRender: 'action' },
    },
    striped: true,
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: false,
    bordered: false,
  });

  function createActions(record: EditRecordRow, column: BasicColumn): ActionItem[] {
    return [
      {
        label: record.isChecked,
        type: 'default',
        disabled: currentEditKeyRef.value ? currentEditKeyRef.value !== record.key : false,
        onClick: handleSave.bind(null, record, column),
      },
    ];
  }

  function handleSave(record: EditRecordRow) {
    try {
      if (record.isChecked == 'Not Check') {
        robotErrorApi.modifyRobotErrorLog(record.id);
        record.isChecked = 'Checked';
        updateTableDataRecord('id', record);
      } else {
        updateTableDataRecord('id', record);
      }
    } catch (error) {
      msg.error({ content: 'Save Error', key: 'saving' });
    }
  }
</script>
-->
