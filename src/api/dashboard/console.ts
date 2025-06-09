import { Alova } from '@/utils/http/alova/index';
export interface TypeVisits {
  dayVisits: number;
  rise: number;
  decline: number;
  amount: number;
}
export interface TypeSaleroom {
  weekSaleroom: number;
  amount: number;
  degree: number;
}

export interface TypeOrderLarge {
  weekLarge: number;
  rise: number;
  decline: number;
  amount: number;
}

export interface TypeConsole {
  visits: TypeVisits;
  //销售额
  saleroom: TypeSaleroom;
  //订单量
  orderLarge: TypeOrderLarge;
  //成交额度
  volume: TypeOrderLarge;
}

export interface TypeList {
  id: Number,
  page: String,
  option: any
}

//获取主控台信息
export function getConsoleInfo() {
  return Alova.Get<TypeConsole>('/dashboard/console');
}

//获取主控台信息
export function getList() {
  return Alova.Get<TypeList>('/page/catalogueList').send(true);
}

/**
 * @description: 用户修改密码
 */
export function editCatalogue(params) {
  return Alova.Post(`/page/editCatalogue`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 用户修改密码
 */
export function addCatalogue(params) {
  return Alova.Post(`/page/addCatalogue`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}

/**
 * @description: 删除
 */
export function deleteCatalogue(params) {
  return Alova.Post(`/page/deleteCatalogue`, params, {
    meta: {
      isReturnNativeResponse: true,
    },
  });
}
