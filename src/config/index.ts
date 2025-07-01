/**
 * 前端统一配置管理
 * 解决配置分散、环境判断混乱的问题
 */

// 环境判断
const getEnvironment = (): 'development' | 'production' => {
  if (
    import.meta.env.MODE === 'development' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  ) {
    return 'development';
  }
  return 'production';
};

// 基础配置
interface Config {
  api: {
    baseURL: string;
    timeout: number;
  };
  upload: {
    url: string;
    maxSize: number;
    allowedTypes: string[];
  };
  app: {
    title: string;
    version: string;
  };
}

// 环境配置
const configs: Record<'development' | 'production', Config> = {
  development: {
    api: {
      baseURL: 'https://www.jialeya.xyz/api',
      timeout: 15000,
    },
    upload: {
      url: 'https://www.jialeya.xyz/api/upload/image',
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    },
    app: {
      title: '工具管理系统 - 开发环境',
      version: '1.0.0-dev',
    },
  },

  production: {
    api: {
      baseURL: 'https://www.jialeya.xyz/api',
      timeout: 15000,
    },
    upload: {
      url: 'https://www.jialeya.xyz/api/upload/image',
      maxSize: 5 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    },
    app: {
      title: '工具管理系统',
      version: '1.0.0',
    },
  },
};

// 当前环境
const currentEnv = getEnvironment();
const config = configs[currentEnv];

// 工具方法
export const utils = {
  // 获取完整API URL
  getApiUrl: (path: string): string => {
    return `${config.api.baseURL}${path}`;
  },

  // 获取上传URL
  getUploadUrl: (): string => {
    return config.upload.url;
  },

  // 获取图片访问地址
  getImageUrl: (imagePath: string): string => {
    if (!imagePath) return '';

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // 根据环境生成正确的图片URL
    const baseUrl =
      currentEnv === 'development'
        ? 'http://127.0.0.1:8088' // 开发环境本地
        : 'https://www.jialeya.xyz'; // 生产环境线上

    return `${baseUrl}/uploads/images/${imagePath}`;
  },

  // 环境判断
  isDev: (): boolean => currentEnv === 'development',
  isProd: (): boolean => currentEnv === 'production',

  // 格式化文件大小
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },
};

// 导出配置
export default {
  ...config,
  environment: currentEnv,
  utils,
};

// 类型导出
export type { Config };
