import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const routerModule: AppRouteModule = {
  path: '/log',
  name: 'Log',
  component: LAYOUT,
  redirect: '/log/robot-alarm',
  meta: {
    icon: 'carbon:cloud-logging',
    title: t('routes.log.log'),
    orderNo: 80,
  },
  children: [
    {
      path: 'job-log',
      name: 'LogJobLog',
      component: () => import('/@/views/demo/comp/log/jobLog/index.vue'),
      meta: {
        title: t('routes.log.jobLog'),
      },
    },
  ],
};

export default routerModule;
