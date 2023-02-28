import { useI18n } from '/@/hooks/web/useI18n';
import { BasicColumn, FormSchema } from '/@/components/Table';

const { t } = useI18n();

export const basicColumns: BasicColumn[] = [
  {
    title: t('common.id'),
    dataIndex: 'id',
  },
  {
    title: t('common.name'),
    dataIndex: 'name',
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    label: t('common.id'),
    component: 'Input',
    colProps: { xl: 6, xxl: 4 },
    componentProps: {
      placeholder: 'input id',
    },
  },
  {
    field: 'name',
    label: t('common.name'),
    component: 'Input',
    colProps: { xl: 6, xxl: 4 },
    componentProps: {
      placeholder: 'input name',
    },
  },
];
