import { useI18n } from '/@/hooks/web/useI18n';
import { BasicColumn, FormSchema } from '/@/components/Table';
import * as deviceApi from '/@/api/device';
import * as robotApi from '/@/api/robot';
import * as Model from '/@/model/device';
import dayjs from 'dayjs';

const { t } = useI18n();

export const columns: BasicColumn[] = [
  {
    title: t('common.id'),
    dataIndex: 'id',
  },
  {
    title: `${t('common.robot')} ${t('common.id')}`,
    dataIndex: 'robotId',
  },
  {
    title: t('job.productType'),
    dataIndex: 'productType',
  },
  {
    title: t('job.taskName'),
    dataIndex: 'taskName',
  },
  {
    title: t('job.state'),
    dataIndex: 'state',
  },
  {
    title: t('job.from'),
    dataIndex: 'fromDeviceName',
  },
  {
    title: t('job.to'),
    dataIndex: 'toDeviceName',
  },
  {
    title: t('job.createDate'),
    dataIndex: 'eventDt',
  },
  {
    title: t('job.allocDate'),
    dataIndex: 'allocDt',
  },
  {
    title: t('job.finishDate'),
    dataIndex: 'finishDt',
  },
];

const jobStateOption: LabelValueOptions = [
  {
    label: t('job.notAllocate'),
    value: '1020201',
  },
  {
    label: t('job.allocating'),
    value: '1020202',
  },
  {
    label: t('job.allocated'),
    value: '1020203',
  },
  {
    label: t('job.jobPocessing'),
    value: '1020204',
  },
  {
    label: t('job.jobFinished'),
    value: '1020205',
  },
  {
    label: t('job.jobCancle'),
    value: '1020206',
  },
];

const jobTypeOption: LabelValueOptions = [
  {
    label: t('job.AutoCreate'),
    value: '2040301 ',
  },
  {
    label: t('job.ManualCreate'),
    value: '2040302',
  },
  {
    label: t('job.externalcreate'),
    value: '2040303',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'startDt',
    label: t('job.startDate'),
    component: 'DatePicker',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: '',
    },
    itemProps: {
      labelCol: { xxl: 6, xl: 10 },
    },
    colProps: {
      xxl: 6,
      xl: 4,
      md: 8,
    },
  },
  {
    field: 'endDt',
    label: t('job.endDate'),
    component: 'DatePicker',
    defaultValue: dayjs().format('YYYY-MM-DD'),
    componentProps: {
      format: 'YYYY-MM-DD',
      placeholder: '',
    },
    itemProps: {
      labelCol: { xxl: 6, xl: 10 },
    },
    colProps: {
      xxl: 6,
      xl: 4,
      md: 8,
    },
  },
  {
    label: t('job.robotName'),
    field: 'rid',
    component: 'ApiSelect',
    componentProps: {
      api: robotApi.getRobotListArray,
      labelField: 'name',
      valueField: 'id',
    },
    itemProps: {
      labelCol: { xl: 6, md: 12 },
    },
    colProps: {
      xxl: 6,
      xl: 7,
      md: 8,
    },
  },
  {
    field: 'jTy',
    label: t('job.jobType'),
    component: 'Select',
    componentProps: {
      options: jobTypeOption,
    },
    itemProps: {
      labelCol: { xl: 5, md: 12 },
    },
    colProps: {
      xxl: 6,
      xl: 7,
      md: 8,
    },
  },
  {
    field: 'state',
    component: 'Select',
    label: t('job.state'),
    componentProps: {
      options: jobStateOption,
    },
    itemProps: {
      labelCol: { xl: 6, md: 12 },
    },
    colProps: {
      xxl: 6,
      xl: 7,
      md: 8,
    },
  },

  {
    label: t('job.from'),
    field: 'from',
    component: 'ApiSelect',
    componentProps: {
      api: deviceApi.getExternalDeviceArray,
      labelField: 'name',
      valueField: 'id',
    },
    itemProps: {
      labelCol: { xl: 6, sm: 12 },
    },
    colProps: {
      xxl: 6,
      xl: 7,
      md: 8,
    },
  },
  {
    label: t('job.to'),
    field: 'to',
    component: 'ApiSelect',
    componentProps: {
      api: deviceApi.getExternalDeviceArray,
      labelField: 'name',
      valueField: 'id',
      formModel: Model.DeviceInfo,
    },
    itemProps: {
      labelCol: { xl: 6, sm: 12 },
    },
    colProps: {
      xxl: 6,
      xl: 7,
      md: 8,
    },
  },
];
