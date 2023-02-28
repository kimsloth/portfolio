<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-button @click="exelDown">{{ t(`common.excel`) }} </a-button>
    </template>
  </BasicTable>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { excelDownload } from '/@/utils/Excel';
  import { BasicTable, useTable } from '/@/components/Table';
  import { columns, searchFormSchema } from './jobLogData';
  import * as JobLogApi from '/@/api/jobLog';

  const { t } = useI18n();

  const [registerTable, { getForm }] = useTable({
    //title: `${t('common.job')} ${t('common.log')}`,
    rowKey: 'id',
    api: JobLogApi.getJobLogList,
    columns,
    pagination: { showQuickJumper: false },
    formConfig: {
      alwaysShowLines: 3,
      labelWidth: '100px',
      showAdvancedButton: false,
      showResetButton: false,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
      actionColOptions: {
        flex: 'auto',
        span: 'auto',
      },
    },
    ellipsis: false,
    showIndexColumn: false,
    useSearchForm: true,
    showTableSetting: false,
    bordered: false,
  });

  async function exelDown() {
    const params = getForm().getFieldsValue();
    const blobData = await JobLogApi.exelJobLogDownload(params);
    excelDownload(blobData, params?.startDt, params?.endDt, 'JOBLOG ');
  }
</script>
