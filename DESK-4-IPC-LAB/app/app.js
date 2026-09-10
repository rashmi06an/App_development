import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let musicProcess = null;

function createWindow() {
    const window = new BrowserWindow({
        height: 600,
        width: 600,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    window.loadURL("http://localhost:5173");
    window.webContents.openDevTools();
}

function startMusic() {
    if (musicProcess) {
        return;
    }

    const randomNumber = Math.floor(Math.random() * 3);

    const songs = [
        "first.mp3",
        "second.mp3",
        "third.mp3"
    ];

    const songPath = path.join(
        __dirname,
        "..",
        "songs",
        songs[randomNumber]
    );

    console.log("Starting:", songPath);

    musicProcess = spawn("/Applications/VLC.app/Contents/MacOS/VLC", [
        songPath,
        "--intf",
        "dummy",
        "--extraintf",
        "rc"
    ]);

    musicProcess.on("error", (error) => {
        console.log("VLC ERROR:", error);
        musicProcess = null;
    });

    musicProcess.stderr.on("data", (data) => {
        console.log("VLC:", data.toString());
    });

    musicProcess.on("close", (code) => {
        console.log("VLC closed:", code);
        musicProcess = null;
    });
}

function playMusic() {
    if (!musicProcess) {
        console.log("No music process");
        return;
    }

    musicProcess.stdin.write("play\n");
}

function pauseMusic() {
    if (!musicProcess) {
        console.log("No music process");
        return;
    }

    musicProcess.stdin.write("pause\n");
}

ipcMain.on("play-music", () => {
    playMusic();
});

ipcMain.on("pause-music", () => {
    pauseMusic();
});

app.whenReady().then(() => {
    createWindow();
    startMusic();
});