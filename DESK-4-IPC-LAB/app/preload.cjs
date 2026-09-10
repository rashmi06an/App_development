const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("music", {
    play: () => ipcRenderer.send("play-music"),
    pause: () => ipcRenderer.send("pause-music"),
});