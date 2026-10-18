'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('asdiSettings',{getServer:()=>ipcRenderer.invoke('server:get'),saveServer:(url)=>ipcRenderer.invoke('server:save',url)});
