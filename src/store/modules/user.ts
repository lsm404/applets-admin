import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  username: string;
  email: string;
};

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response: any = await login(params);
      const { data, code, msg } = response;
      if (code === ResultEnum.SUCCESS && data) {
        const ex = 7 * 24 * 60 * 60;
        // 从API响应的data中获取token和管理员信息
        const { token, admin } = data;
        storage.set(ACCESS_TOKEN, token, ex);
        storage.set(CURRENT_USER, admin, ex);
        storage.set(IS_SCREENLOCKED, false);
        this.setToken(token);
        this.setUserInfo({
          username: admin.username,
          email: admin.email || '',
        });
        // 设置权限
        if (admin.permissions && admin.permissions.length) {
          this.setPermissions(admin.permissions);
        }
      }
      return { code, message: msg };
    },

    // 获取管理员信息
    async getInfo() {
      const response: any = await getUserInfoApi();
      const { data, code } = response;
      if (code === ResultEnum.SUCCESS && data) {
        if (data.permissions && data.permissions.length) {
          const permissionsList = data.permissions;
          this.setPermissions(permissionsList);
          this.setUserInfo({
            username: data.username,
            email: data.email || '',
          });
        } else {
          throw new Error('getInfo: permissionsList must be a non-null array !');
        }
        this.setAvatar(data.avatar || '');
        return data;
      } else {
        throw new Error('获取管理员信息失败');
      }
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '' });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
