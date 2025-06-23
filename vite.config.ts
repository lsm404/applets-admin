/*
 * @Author: lishengmin shengminfang@foxmail.com
 * @Date: 2024-10-10 14:39:35
 * @LastEditors: lishengmin shengminfang@foxmail.com
 * @LastEditTime: 2025-06-23 15:38:43
 * @FilePath: /applet/applet-admin/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { UserConfig, ConfigEnv } from 'vite';
import { loadEnv } from 'vite';
import { resolve } from 'path';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { OUTPUT_DIR } from './build/constant';
import { createProxy } from './build/vite/proxy';
import pkg from './package.json';
import { format } from 'date-fns';
const { dependencies, devDependencies, name, version } = pkg;

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_PROXY } = viteEnv;
  console.log('VITE_PROXY::::::', createProxy(VITE_PROXY));
  const isBuild = command === 'build';
  return {
    base: VITE_PUBLIC_PATH,
    esbuild: {},
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@',
          replacement: pathResolve('src') + '/',
        },
      ],
      dedupe: ['vue'],
    },
    plugins: createVitePlugins(viteEnv, isBuild),
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
      __APP_INFO__: JSON.stringify(__APP_INFO__),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    server: {
      host: true,
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
      open: true,
    },
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
};
