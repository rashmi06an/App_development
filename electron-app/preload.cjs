const {contextBridge,ipcRenderer} = require('electron');
contextBridge.exposeInMainWorld('myAPI',{
    loadChat: ()=>{
        ipcRenderer.invoke('load-chat')

    },
    saveChat: (chatHistory)=>{
        ipcRenderer.invoke('save-chat');
    }
});


//CROSSIDE ATTACKING 