import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const robot: AppRouteModule = {
  path: '/robot',
  name: 'Robot',
  component: LAYOUT,
  redirect: '/robot/list',
  meta: {
    orderNo: 30,
    icon: 'fluent-mdl2:list',
    title: t('routes.demo.comp.robot'),
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'list',
      name: 'RobotList',
      component: () => import('/@/views/demo/comp/robot/index.vue'),
      meta: {
        title: t('routes.demo.comp.robot'),
      },
    },
  ],
};

export default robot;
