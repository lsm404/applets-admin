/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-01-01 00:00:00
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-23 16:24:29
 * @FilePath: /applet/applet-admin/src/api/tools.ts
 * @Description: 工具管理API接口
 */

import { Alova } from '@/utils/http/alova/index';

/**
 * @description: 获取工具列表
 */
export function getToolsApi(params?: any) {
  return Alova.Get<InResult>('/tools', {
    params,
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 获取工具详情
 */
export function getToolDetailApi(id: number) {
  return Alova.Get<InResult>(`/tools/${id}`, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 添加工具
 */
export function addToolApi(params: any) {
  return Alova.Post<InResult>('/tools', params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 更新工具
 */
export function updateToolApi(params: any) {
  return Alova.Put<InResult>(`/tools/${params.id}`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除工具
 */
export function deleteToolApi(id: number) {
  return Alova.Delete<InResult>(`/tools/${id}`, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 批量删除工具
 */
export function batchDeleteToolApi(ids: number[]) {
  return Alova.Post<InResult>(
    '/tools/batch-delete',
    { ids },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}

/**
 * @description: 切换工具状态
 */
export function toggleToolStatusApi(id: number, status: number) {
  return Alova.Patch<InResult>(
    `/tools/${id}/status`,
    { status },
    {
      meta: {
        isReturnNativeResponse: true,
      },
    }
  );
}
