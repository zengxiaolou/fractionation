import path, { join } from 'node:path';
import url from 'node:url';
import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { MAIN_PAGE_DIRECTION } from '@/pages/main/const';
import { stateManager } from '@/components/singletons';
import { registerIpcHandler } from '@/pages/main/ipc-handlers';

let win = stateManager.getMainWindow();

const init = () => {
  registerIpcHandler();
};

init();

function create() {
  win = new BrowserWindow({
    width: 1320,
    height: 900,
    resizable: false,
    backgroundColor: '#F6F8FA',
    webPreferences: {
      javascript: true,
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(
        MAIN_PAGE_DIRECTION,
        isDev ? '../../../renderer/public/preload.js' : '../../../renderer/build/preload.js'
      ),
      devTools: isDev,
    },
    icon: path.join(MAIN_PAGE_DIRECTION, '../../../../../assets/icon.ico'),
  });
  if (isDev) {
    win
      .loadURL('http://localhost:3062')
      .then(() => console.log('create success'))
      .catch((error: any) => {
        console.error(error);
      });
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(MAIN_PAGE_DIRECTION, '../../../renderer/build/index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/',
      })
    );
  }
  win.webContents.openDevTools();
  stateManager.setMainWindow(win);
  win.on('closed', () => {
    stateManager.setMainWindow();
  });
  const a = join(app.getPath('userData'), 'fraction.db');
  console.log(a);
  return win;
}

export { create };
