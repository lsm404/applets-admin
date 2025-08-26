import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { ConstructOutline } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/tools',
    name: 'Tools',
    redirect: '/tools/list',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: renderIcon(ConstructOutline),
      sort: 1,
    },
    children: [
      {
        path: 'list',
        name: 'tools_list',
        meta: {
          title: '商品列表',
        },
        component: () => import('@/views/tools/list.vue'),
      },
    ],
  },
];

export default routes;
