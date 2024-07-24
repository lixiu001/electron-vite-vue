import { app,screen, BrowserWindow, shell, ipcMain, Notification, Tray } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'

// 是用于在 ES 模块中实现 CommonJS 模块 特性的方法。
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '../..')
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public'): RENDERER_DIST
// Windows 7 上禁用 GPU 加速
// if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()
// Windows 10 及更高版本上为通知设置应用名称
// if (process.platform === 'win32') app.setAppUserModelId(app.getName())

// 确保应用是单实例
// if (!app.requestSingleInstanceLock()) {
//   app.quit()
//   process.exit(0)
// }

let win: BrowserWindow | null = null
let floatingRobotWindow: BrowserWindow | null = null; // 无边框且背景透明的窗口
let tray: Tray | null = null  // 在外面创建tray变量，防止被自动删除，导致图标自动消失
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')
const robotHtml = path.join(RENDERER_DIST, 'robot.html')


if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

async function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  win = new BrowserWindow({
    width: 500, 
    height: 600, 
    // x: width - 500, 
    // y: height - 400, 
    title: 'Main window',
    // frame: false, // 无边框
    transparent: true, // 背景透明
    // alwaysOnTop: true, // 窗口始终置顶
    // resizable: false, // 不允许改变窗口大小
    webPreferences: {
      preload,
      contextIsolation: true,
    },
  })
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }
}

function createTray() {
  tray = new Tray(path.join(RENDERER_DIST, 'logo.png')); // 设置托盘图标
  tray.setToolTip('数字人');
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
}


app.whenReady().then(() => {
  createWindow();
  // createFloatingRobotWindow();
  // createTray();
  app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
      allWindows[0].focus()
    } else {
      createWindow()
    }
  })
})

ipcMain.on('login-success', (event, arg) => {
  console.log('login-success',event,arg);
  // 登录成功的逻辑处理
  // / 例如，显示主窗口或创建托盘图标等
  // win.show();
});

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})


// 如果多个实例
app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// New window example arg: new windows url
// ipcMain.handle('open-win', (_, arg) => {
//   const childWindow = new BrowserWindow({
//     webPreferences: {
//       preload,
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   })

//   if (VITE_DEV_SERVER_URL) {
//     childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
//   } else {
//     childWindow.loadFile(indexHtml, { hash: arg })
//   }
// })

// app.on('activate', () => {
//   const allWindows = BrowserWindow.getAllWindows()
//   if (allWindows.length) {
//     allWindows[0].focus()
//   } else {
//     createWindow()
//   }
// })
