const { contextBridge, ipcRenderer } = require('electron');

const ChannelsMap = {
  SAVE_DATA: 'SAVE_DATA',
  GET_DATA: 'GET_DATA'
}

contextBridge.exposeInMainWorld('ipc', {
  saveData: async (data) => {
    return await ipcRenderer.invoke(ChannelsMap.SAVE_DATA, data);
  },
  getData: async query => {
    return await ipcRenderer.invoke(ChannelsMap.GET_DATA,  query );
  },
});

