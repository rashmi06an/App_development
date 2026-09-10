import {app,BrowserWindow,ipcMain} from 'electron';

function createwindow(){
    const win=new BrowserWindow({
        width:800,
        height:600,
        webPreferences:{
            preload:path.join(__dirname,'preload.cjs')
        }
    })
}
