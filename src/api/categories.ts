/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-01-01 00:00:00
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 10:28:11
 * @FilePath: /applet/applet-admin/src/api/categories.ts
 * @Description: 工具分类管理API接口
 */

const API_BASE = '/api';

/**
 * @description: 获取工具分类列表
 */
export async function getCategoriesApi(params?: any) {
  // 检查是否是请求分类下拉选项
  if (params?.path === 'options') {
    const response = await fetch(`${API_BASE}/api/categories/options`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return await response.json();
  }

  // 添加时间戳参数防止缓存
  const timestamp = new Date().getTime();
  const queryParams = params ? { ...params, _t: timestamp } : { _t: timestamp };
  const queryString = new URLSearchParams(queryParams).toString();
  
  // 标准列表查询
  const url = `${API_BASE}/api/categories${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
  return await response.json();
}

/**
 * @description: 获取分类详情
 */
export async function getCategoryDetailApi(id: number) {
  const timestamp = new Date().getTime();
  const response = await fetch(`${API_BASE}/api/categories/${id}?_t=${timestamp}`, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
  return await response.json();
}

/**
 * @description: 添加分类
 */
export async function addCategoryApi(params: any) {
  const response = await fetch(`${API_BASE}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}

/**
 * @description: 更新分类
 */
export async function updateCategoryApi(params: any) {
  const response = await fetch(`${API_BASE}/api/categories/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  return await response.json();
}

/**
 * @description: 删除分类
 */
export async function deleteCategoryApi(id: number) {
  const response = await fetch(`${API_BASE}/api/categories/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
}

/**
 * @description: 更新分类状态
 */
export async function updateCategoryStatusApi(id: number, status: number) {
  const response = await fetch(`${API_BASE}/api/categories/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  return await response.json();
} 