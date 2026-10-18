'use strict';
const {app,BrowserWindow,nativeImage,Notification,shell,session,dialog,Menu,ipcMain} = require('electron');
const fs=require('fs');
const path=require('path');
const DEFAULT_SERVER='http://100.69.232.118:8080/asdi_ticketing/';
let win,settingsWin,unread=0,baseline=null,polling=false,interval=null;
const iconPath=path.join(__dirname,'assets','asdi.png');
const overlay=nativeImage.createFromDataURL('data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#f3131b" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="white"/></svg>').toString('base64'));
function settingsPath(){return path.join(app.getPath('userData'),'server-settings.json');}
function normalizeServer(raw){const value=String(raw||'').trim();const u=new URL(value);if(!['http:','https:'].includes(u.protocol)||u.username||u.password||!u.hostname||u.search||u.hash)throw Error('Enter a valid HTTP or HTTPS server address without credentials or query parameters.');if(!u.pathname.endsWith('/'))u.pathname+='/';return u.toString();}
function getServer(){try{return normalizeServer(JSON.parse(fs.readFileSync(settingsPath(),'utf8')).server);}catch{return DEFAULT_SERVER;}}
function urlFor(page){return new URL(page,getServer()).toString();}
function validLocation(url){try{const u=new URL(url),base=new URL(getServer());return u.origin===base.origin&&u.pathname.startsWith(base.pathname);}catch{return false;}}
function refreshBadge(){if(!win||win.isDestroyed())return;win.setOverlayIcon(unread>0?overlay:null,unread>0?`${unread} new chat updates`:'');win.setTitle(unread?`(${unread}) ASDI_Ticketing`:'ASDI_Ticketing');}
function resetUnread(){unread=0;refreshBadge();}
function notifyNew(count){unread=Math.min(999,unread+count);refreshBadge();shell.beep();if(Notification.isSupported()){const n=new Notification({title:'ASDI_Ticketing',body:count===1?'New chat message received':`${count} new chat updates`,silent:true,icon:iconPath});n.on('click',()=>{win.show();win.focus();});n.show();}}
async function poll(){if(polling||!win||win.isDestroyed())return;const currentUrl=win.webContents.getURL();if(!validLocation(currentUrl)||currentUrl.includes('/login.php'))return;polling=true;try{const result=await win.webContents.executeJavaScript(`(async()=>{const r=await fetch(${JSON.stringify('CHAT_NOTIFY_URL_PLACEHOLDER')},{credentials:'same-origin',cache:'no-store'});if(!r.ok||!r.headers.get('content-type')?.includes('application/json'))return null;return r.json()})()`.replace('CHAT_NOTIFY_URL_PLACEHOLDER',urlFor('chat_notifications.php')),true);if(!result||result.error){baseline=null;return;}const current={team:Number(result.team)||0,groups:{}};for(const g of result.groups||[])current.groups[String(g.id)]=Number(g.last_id)||0;if(baseline){let count=0;if(current.team>baseline.team)count++;for(const [id,last] of Object.entries(current.groups))if(last>(baseline.groups[id]||0))count++;if(count>0&&!win.isFocused())notifyNew(count);}baseline=current;}catch{}finally{polling=false;}}
function openSettings(){if(settingsWin&&!settingsWin.isDestroyed()){settingsWin.focus();return;}settingsWin=new BrowserWindow({width:520,height:360,resizable:false,parent:win,modal:false,title:'ASDI_Ticketing — Server Settings',icon:iconPath,autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'settings-preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});settingsWin.loadFile(path.join(__dirname,'settings.html'));settingsWin.on('closed',()=>settingsWin=null);}
ipcMain.handle('server:get',(event)=>{if(!settingsWin||event.sender!==settingsWin.webContents)throw Error('Unauthorized');return getServer();});
ipcMain.handle('server:save',(event,raw)=>{if(!settingsWin||event.sender!==settingsWin.webContents)throw Error('Unauthorized');const server=normalizeServer(raw);fs.mkdirSync(path.dirname(settingsPath()),{recursive:true});fs.writeFileSync(settingsPath(),JSON.stringify({server},null,2),{mode:0o600});baseline=null;resetUnread();win.loadURL(urlFor('chatroom.php'));settingsWin.close();return true;});
function create(){win=new BrowserWindow({width:1080,height:770,minWidth:380,minHeight:480,title:'ASDI_Ticketing',icon:iconPath,autoHideMenuBar:false,backgroundColor:'#111827',webPreferences:{preload:path.join(__dirname,'preload.js'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
Menu.setApplicationMenu(Menu.buildFromTemplate([{label:'Application',submenu:[{label:'Server Settings...',accelerator:'CmdOrCtrl+,',click:openSettings},{label:'Open Chatroom',accelerator:'CmdOrCtrl+R',click:()=>win.loadURL(urlFor('chatroom.php'))},{type:'separator'},{role:'quit'}]}]));
win.webContents.setWindowOpenHandler(({url})=>{if(validLocation(url)){win.loadURL(urlFor('chatroom.php'));return {action:'deny'};}if(/^https?:\/\//i.test(url))shell.openExternal(url).catch(()=>{});return {action:'deny'};});
win.webContents.on('will-navigate',(event,url)=>{if(!validLocation(url)){event.preventDefault();}});
win.webContents.on('did-navigate',(_e,url)=>{if(url.includes('/login.php'))baseline=null;});
win.webContents.on('did-finish-load',()=>{const url=win.webContents.getURL();if(validLocation(url)&&/\/(index|dashboard)\.php(?:\?|$)/.test(url))win.loadURL(urlFor('chatroom.php'));});
win.on('focus',resetUnread);win.on('closed',()=>{win=null;clearInterval(interval);});
win.loadURL(urlFor('chatroom.php')).catch(()=>{dialog.showMessageBox({type:'error',title:'ASDI_Ticketing',message:'Cannot connect to the configured server. Open Application → Server Settings to update its address.'});});
interval=setInterval(poll,5000);setTimeout(poll,2000);
}
app.whenReady().then(()=>{session.defaultSession.setPermissionRequestHandler((_wc,permission,callback)=>callback(['media','mediaTypes','notifications'].includes(permission)));create();});
app.on('window-all-closed',()=>app.quit());
