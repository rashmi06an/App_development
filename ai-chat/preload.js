// ===================================================
// preload.js - Safe Bridge between UI and Node.js
// ===================================================

const { contextBridge, ipcRenderer } = require("electron");

// We expose a safe "api" object to the browser window (window.api).
// This allows the frontend (renderer.js) to ask Node.js (main.js) to call the AI.
contextBridge.exposeInMainWorld("api", {
  /**
   * Send a chat message to the main process.
   * @param {Object} data - { model, persona, message, history }
   * @returns {Promise<string>} AI response
   */
  sendMessage: (data) => ipcRenderer.invoke("chat:send-message", data)
});
