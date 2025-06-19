import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { FolderOutlined } from '@vicons/antd';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/category',
    name: 'Category',
    redirect: '/category/list',
    component: Layout,
    meta: {
      title: '分类管理',
      icon: renderIcon(FolderOutlined),
      sort: 2, // 设置排序，决定在菜单中的位置
    },
    children: [
      {
        path: 'list',
        name: 'category-list',
        meta: {
          title: '分类列表',
        },
        component: () => import('@/views/category/category.vue'), // 更新为正确的组件路径
      },
    ],
  },
];

export default routes; 