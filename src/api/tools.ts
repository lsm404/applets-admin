/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-01-01 00:00:00
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 10:28:11
 * @FilePath: /applet/applet-admin/src/api/tools.ts
 * @Description: 工具管理API接口
 */

const API_BASE = '/api';

/**
 * @description: 获取工具列表
 */
export async function getToolsApi(params?: any) {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE}/api/tools${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url);
  return await response.json();
}

/**
 * @description: 获取工具详情
 */
export async function getToolDetailApi(id: number) {
  const response = await fetch(`${API_BASE}/api/tools/${id}`);
  return await response.json();
}

/**
 * @description: 添加工具
 */
export async function addToolApi(params: any) {
  const response = await fetch(`${API_BASE}/api/tools`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}

/**
 * @description: 更新工具
 */
export async function updateToolApi(params: any) {
  const response = await fetch(`${API_BASE}/api/tools/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}

/**
 * @description: 删除工具
 */
export async function deleteToolApi(id: number) {
  const response = await fetch(`${API_BASE}/api/tools/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}

/**
 * @description: 批量删除工具
 */
export async function batchDeleteToolApi(ids: number[]) {
  const response = await fetch(`${API_BASE}/api/tools/batch-delete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  return await response.json();
}

/**
 * @description: 切换工具状态
 */
export async function toggleToolStatusApi(id: number, status: number) {
  const response = await fetch(`${API_BASE}/api/tools/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return await response.json();
}
