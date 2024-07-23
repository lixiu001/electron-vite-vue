import fs from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // 删除 dist-electron 目录
  fs.rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve' // 开发模式
  const isBuild = command === 'build' // 构建模式
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(), // 添加 Vue 插件支持
      electron({ // 配置 Electron 插件
        main: { // Electron 主进程的配置
          entry: 'electron/main/index.ts', // 主进程的入口文件
          onstart({ startup }) { // 当Electron 应用启动时执行的回调
            console.log('startup',startup);
            if (process.env.VSCODE_DEBUG) {
              console.log('[startup] Electron App')
            } else {
              startup()
            }
          },
          vite: { // Vite 的构建配置，例如是否压缩代码、输出目录等
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        preload: { // Electron 预加载脚本的配置，与主进程类似，但主要用于渲染器进程之前的设置
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        renderer: {}, //为渲染器进程配置插件
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src')
      }
    },
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
    clearScreen: false, // 表示在每次重新加载时不清除控制台。
  }
})
