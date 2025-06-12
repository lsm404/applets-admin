/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2025-06-12 14:44:26
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-12 15:03:08
 * @FilePath: /applet/applet-admin/src/config/api.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 统一图片服务配置 - 所有环境都使用线上图片服务器
const UNIFIED_IMAGE_SERVER = 'http://120.46.28.146:8088';

const config = {
  // 开发环境 - 统一使用线上服务器存储图片
  development: {
    baseURL: 'http://127.0.0.1:8088', // 本地API服务
    uploadURL: `${UNIFIED_IMAGE_SERVER}/api/upload/image`, // 统一使用线上图片服务
  },

  // 生产环境
  production: {
    baseURL: UNIFIED_IMAGE_SERVER,
    uploadURL: `${UNIFIED_IMAGE_SERVER}/api/upload/image`,
  },
};

// 根据环境变量或当前域名自动判断环境
const getEnvironment = () => {
  // 如果是开发环境
  if (
    process.env.NODE_ENV === 'development' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  ) {
    return 'development';
  }
  return 'production';
};

const currentEnv = getEnvironment();
const currentConfig = config[currentEnv];

export default {
  ...currentConfig,

  // 获取完整的API URL
  getApiUrl: (path) => {
    return `${currentConfig.baseURL}${path}`;
  },

  // 获取上传接口URL - 统一使用线上服务器
  getUploadUrl: () => {
    return `${UNIFIED_IMAGE_SERVER}/api/upload/image`;
  },

  // 获取图片访问地址 - 统一使用线上服务器
  getImageUrl: (imagePath) => {
    if (!imagePath) return '';

    // 如果已经是完整URL，直接返回
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // 如果是相对路径，拼接线上服务器地址
    return `${UNIFIED_IMAGE_SERVER}/uploads/images/${imagePath}`;
  },

  // 统一图片服务器地址
  imageServer: UNIFIED_IMAGE_SERVER,

  // 当前环境
  environment: currentEnv,
};
