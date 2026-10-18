'use strict';
const {app,BrowserWindow,nativeImage,Notification,shell,session,dialog} = require('electron');
const path=require('path');
const BASE='http://100.69.232.118:8080/asdi_ticketing/';
const CHAT=new URL('chatroom.php',BASE).toString();
const LOGIN=new URL('login.php',BASE).toString();
const NOTIFY=new URL('chat_notifications.php',BASE).toString();
const ORIGIN=new URL(BASE).origin;
let win, unread=0, baseline=null, polling=false, interval=null, signedIn=false;
const iconPath=path.join(__dirname,'assets','asdi.png');
const overlay=nativeImage.createFromDataURL('data:image/svg+xml;base64,'+Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#f3131b" stroke="white" stroke-width="2"/><circle cx="16" cy="16" r="5" fill="white"/></svg>').toString('base64'));
function refreshBadge(){if(!win||win.isDestroyed())return;win.setOverlayIcon(unread>0?overlay:null,unread>0?`${unread} unread chat notifications`:'');win.setTitle(unread?`(${unread}) ASDI Messenger`:'ASDI Messenger');win.setThumbarButtons([]);}
function resetUnread(){unread=0;refreshBadge();}
function notifyNew(count){unread=Math.min(999,unread+count);refreshBadge();shell.beep();if(Notification.isSupported()){const n=new Notification({title:'ASDI Messenger',body:count===1?'New chat message received':`${count} new chat messages`,silent:true,icon:iconPath});n.on('click',()=>{win.show();win.focus();});n.show();}}
function validLocation(url){try{const u=new URL(url);return u.origin===ORIGIN&&u.pathname.startsWith(new URL(BASE).pathname);}catch{return false;}}
async function poll(){if(polling||!win||win.isDestroyed())return;polling=true;try{
  const result=await win.webContents.executeJavaScript(`(async()=>{const r=await fetch(${JSON.stringify(NOTIFY)},{credentials:'same-origin',cache:'no-store'});if(!r.ok||!r.headers.get('content-type')?.includes('application/json'))return null;return await r.json()})()`,true);
  if(!result||result.error){signedIn=false;baseline=null;return;}
  signedIn=true;const current={team:Number(result.team)||0,groups:{}};
  for(const g of result.groups||[])current.groups[String(g.id)]=Number(g.last_id)||0;
  if(baseline){let count=0;if(current.team>baseline.team)count++;for(const [id,last] of Object.entries(current.groups))if(last>(baseline.groups[id]||0))count++;
    if(count>0&&!win.isFocused())notifyNew(count);
  }
  baseline=current;
}catch(e){/* Server may be offline or login may be pending. */}finally{polling=false;}}
function create(){win=new BrowserWindow({width:1080,height:770,minWidth:380,minHeight:480,title:'ASDI Messenger',icon:iconPath,autoHideMenuBar:true,backgroundColor:'#111827',webPreferences:{preload:path.join(__dirname,'preload.js'),nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true}});
  win.webContents.setWindowOpenHandler(({url})=>{if(validLocation(url)){win.loadURL(CHAT);return {action:'deny'};}shell.openExternal(url).catch(()=>{});return {action:'deny'};});
  win.webContents.on('will-navigate',(event,url)=>{if(!validLocation(url)){event.preventDefault();}});
  win.webContents.on('did-navigate',(_e,url)=>{if(url.includes('/login.php')){baseline=null;signedIn=false;}else if(url.includes('/index.php')&&signedIn){win.loadURL(CHAT);}});
  win.webContents.on('did-finish-load',async()=>{const url=win.webContents.getURL();if(url.includes('/index.php'))win.loadURL(CHAT);});
  win.on('focus',resetUnread);
  win.on('closed',()=>{win=null;clearInterval(interval);});
  win.loadURL(CHAT).catch(()=>{dialog.showMessageBox({type:'error',title:'ASDI Messenger',message:'Unable to connect to ASDI Ticketing. Check the server and your network/VPN connection.'});});
  interval=setInterval(poll,5000);setTimeout(poll,2000);
}
app.whenReady().then(()=>{session.defaultSession.setPermissionRequestHandler((_wc,permission,callback)=>{callback(['media','mediaTypes','notifications'].includes(permission));});create();});
app.on('window-all-closed',()=>{app.quit();});
