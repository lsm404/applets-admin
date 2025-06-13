/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-10-10 14:39:35
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-13 09:44:15
 * @FilePath: /applet/applet-admin/src/api/system/user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取管理员信息
 */
export function getUserInfo() {
  return Alova.Get<InResult>('/api/admin/profile', {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 管理员登录
 */
export function login(params) {
  return Alova.Post<InResult>('/api/admin/login', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return Alova.Post(`/user/u${uid}/changepw`, { params });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return Alova.Post('/login/logout', {
    params,
  });
}
