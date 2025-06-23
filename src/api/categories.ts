/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-01-01 00:00:00
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-23 16:27:09
 * @FilePath: /applet/applet-admin/src/api/categories.ts
 * @Description: 工具分类管理API接口
 */

import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取工具分类列表
 */
export function getCategoriesApi(params?: any) {
  // 检查是否是请求分类下拉选项
  if (params?.path === 'options') {
    return Alova.Get<InResult>('/categories/options', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      meta: {
        isReturnNativeResponse: true,
      },
    });
  }

  // 添加时间戳参数防止缓存
  const timestamp = new Date().getTime();
  const queryParams = params ? { ...params, _t: timestamp } : { _t: timestamp };

  // 标准列表查询
  return Alova.Get<InResult>('/categories', {
    params: queryParams,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 获取分类详情
 */
export function getCategoryDetailApi(id: number) {
  const timestamp = new Date().getTime();
  return Alova.Get<InResult>(`/categories/${id}`, {
    params: { _t: timestamp },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 添加分类
 */
export function addCategoryApi(params: any) {
  return Alova.Post<InResult>('/categories', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新分类
 */
export function updateCategoryApi(params: any) {
  return Alova.Put<InResult>(`/categories/${params.id}`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除分类
 */
export function deleteCategoryApi(id: number) {
  return Alova.Delete<InResult>(`/categories/${id}`, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新分类状态
 */
export function updateCategoryStatusApi(id: number, status: number) {
  return Alova.Patch<InResult>(
    `/categories/${id}/status`,
    { status },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
