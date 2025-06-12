/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-10-10 14:39:35
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-11 15:33:46
 * @FilePath: /applet/applet-admin/src/router/constant.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const RedirectName = 'Redirect';

export const ErrorPage = () => import('@/views/exception/404.vue');

export const Layout = () => import('@/layout/index.vue');

export const ParentLayout = () => import('@/layout/parentLayout.vue');
