// ===================================================
// main.js - Electron Main Process (Node.js backend)
// ===================================================

// 1. Load environment variables from the .env file
require("dotenv").config();

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { askGroq, askOpenAI, askGemini } = require("./ai");

/**
 * Creates the main desktop application window.
 */
function createWindow() {
  const win = new BrowserWindow({
    width: 650,
    height: 750,
    minWidth: 480,
    minHeight: 550,
    title: "AI Chat Desktop Application",
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the user interface
  win.loadFile("index.html");
}

// 2. Listen for messages sent from the frontend UI (renderer.js)
ipcMain.handle("chat:send-message", async (event, data) => {
  const { model, persona, message, history } = data;

  // If the model is a Groq model (e.g. groq:llama-3.3-70b-versatile)
  if (model.startsWith("groq:")) {
    const groqModelName = model.replace("groq:", "");
    return await askGroq(groqModelName, message, persona, history);
  } else if (model === "openai") {
    return await askOpenAI(message, persona, history);
  } else if (model === "gemini") {
    return await askGemini(message, persona, history);
  } else {
    // Default fallback to Groq Llama 3.1
    return await askGroq("llama-3.1-8b-instant", message, persona, history);
  }
});

// 3. Application Lifecycle Events
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
