# Application Development — Laboratory & Practice Repository

> **Classroom Practice & Lab Activities**  
> A structured collection of laboratory exercises, coursework implementations, and practical assignments for the **Application Development** course. This repository is maintained and updated iteratively across lab sessions.

---

## Architecture & Progression Overview

The coursework follows a structured progression across application runtimes and architectural layers:

```
Low-Level Terminal / CLI  -->  Desktop Window Management  -->  Inter-Process Communication (IPC)  -->  Modern Component-Driven Desktop Apps
```

1. **Terminal & CLI Systems**: Node.js low-level stream handling, raw mode terminal I/O, ANSI control sequences, and child process lifecycle management.
2. **Desktop Foundations**: Electron multi-process architecture (Main process, Preload scripts, and Renderer process).
3. **Inter-Process Communication (IPC)**: Secure communication boundaries utilizing `contextBridge`, `ipcRenderer`, and `ipcMain` while enforcing context isolation.
4. **Service & API Integration**: REST-based multi-provider LLM integrations (Groq, OpenAI, Google Gemini) within desktop clients.
5. **Modern Frontend Integration**: Pairing React and Vite build tooling with Electron for high-performance desktop user interfaces.

---

## Repository Structure

```text
APPDEV/
├── CLI/                               # Command-line interface exercises and labs
│   ├── Activity-01/                   # Audio playback experiments and directory structure
│   ├── Activity-02/                   # Raw terminal I/O (raw_io.js) & ANSI escape codes
│   ├── Activity-03/                   # Interactive audio stream handling (lab_3.js)
│   ├── Activity-04/                   # Keystroke parsing & arrow navigation (cli_arrow.js)
│   └── cli_music_app/                 # Interactive CLI Music Player (VLC + Node.js)
│       ├── index.js                   # Terminal player implementation with progress bar
│       ├── architecture.md            # System architecture and process flow documentation
│       └── questinoaire.md            # Technical review and concept assessments
│
├── ELECTRON/                          # Introductory Electron desktop implementations
│   ├── main.js                        # Window lifecycle management and process setup
│   ├── index.html                     # Basic desktop markup
│   └── renderer.js                    # Basic renderer logic
│
├── ai-chat/                           # Multi-model desktop AI assistant
│   ├── main.js                        # Main process and IPC invocation handlers
│   ├── preload.js                     # Secure context bridge definition
│   ├── ai.js                          # LLM API clients (Groq, OpenAI, Gemini)
│   ├── renderer.js                    # Chat interface state and message rendering
│   ├── index.html & style.css         # Dark theme user interface
│   └── README.md                      # Module-specific documentation and setup guide
│
├── DESK-4-IPC-LAB/                    # Lab 4: IPC and Native Process Integration
│   ├── app/
│   │   ├── app.js                     # Electron main process controlling VLC via spawn
│   │   └── preload.cjs                # Secure IPC bridge for playback controls
│   ├── src/ & index.html              # React frontend application
│   └── vite.config.js                 # Vite bundler configuration
│
├── electron-app/                      # React + Vite desktop application
│   ├── rashmi.js                      # Electron main entry point
│   ├── preload.cjs                    # Context isolation and IPC channels
│   ├── src/                           # React components and state management
│   └── vite.config.js                 # Development server and HMR configuration
│
└── README.md                          # Global repository documentation (this file)
```

---

## Module Breakdown

### 1. Command-Line Interface Labs (`CLI/`)
- **Key Topics**: `process.stdin.setRawMode(true)`, non-blocking keypress detection, ANSI cursor control, process piping.
- **`cli_music_app`**:
  - Automatic filesystem indexing for local audio files (`./songs`).
  - Terminal-based playlist navigation using keyboard events (`Up`/`Down`, `Enter`, `Space`).
  - Real-time ASCII progress bar tracking duration and current position via VLC child process streams.

### 2. Electron Fundamentals (`ELECTRON/`)
- **Key Topics**: Electron application lifecycle (`app.whenReady()`, `window-all-closed`), `BrowserWindow` configuration, and DevTools integration.
- Demonstrates initial migration from pure command-line scripts to graphical desktop windows.

### 3. Desktop AI Assistant (`ai-chat/`)
- **Key Topics**: Multi-provider API consumption, system persona orchestration, secure credential storage via environment variables (`.env`).
- **Features**:
  - Model switching: OpenAI (GPT-4o-mini), Google Gemini (1.5 Flash), and Groq-hosted open weights (Llama 3.3, Gemma 2, Mixtral).
  - Persona system: Contextual instruction injection (Coding Mentor, Motivational Coach, Fictional Personas).
  - Isolated execution: Backend credential management preventing client-side token exposure.

### 4. Inter-Process Communication Lab (`DESK-4-IPC-LAB/`)
- **Key Topics**: Two-way asynchronous IPC, Electron security standards (`contextIsolation: true`, `nodeIntegration: false`), and child process orchestration.
- Bridges React UI interaction with operating system background tasks by dispatching IPC events handled through Node's `child_process.spawn`.

### 5. Modern Desktop Application (`electron-app/`)
- **Key Topics**: Toolchain integration combining Vite's Hot Module Replacement (HMR) with Electron, secure data persistence bridges (`load-chat`, `save-chat`), and prevention of cross-site scripting vulnerabilities.

---

## Setup & Execution Guide

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- VLC Media Player (required for audio-related labs; default macOS path: `/Applications/VLC.app`)
- Git

---

### Executing Specific Modules

#### Running the CLI Music Player
```bash
cd CLI/cli_music_app
# Ensure audio files (.mp3) are present in CLI/cli_music_app/songs/
node index.js
```

#### Running the AI Chat Application
```bash
cd ai-chat
npm install
# Configure API keys in .env (e.g., GROQ_API_KEY=your_key)
npm start
```

#### Running the IPC Lab (DESK-4-IPC-LAB)
```bash
cd DESK-4-IPC-LAB
npm install
npm run dev        # Starts Vite local server
# In a secondary terminal window:
node app/app.js    # Launches Electron window connected to the Vite server
```

#### Running the React + Electron Application
```bash
cd electron-app
npm install
npm run dev
```

---

## Security & Architectural Standards

- **Context Isolation**: Maintained as `contextIsolation: true` and `nodeIntegration: false` across Electron instances to mitigate remote code execution risks from untrusted renderer input.
- **API Boundary Hardening**: Preload scripts utilize `contextBridge.exposeInMainWorld` to expose only explicit, parameter-checked functions rather than granting direct Node runtime access to the DOM.
- **Process Lifecycle Safety**: Child processes (`spawn`) are tracked and cleaned up on application exit to avoid orphaned background processes.

---

## Laboratory Progress Record

| Module / Activity | Core Focus | Technology Stack | Status |
| :--- | :--- | :--- | :--- |
| **CLI 01 - 04** | Raw Terminal I/O, ANSI Sequences, Audio Spawning | Node.js Runtime | Completed |
| **CLI Music Player** | Interactive Terminal UI & VLC Control | Node.js Standard Library | Completed |
| **Electron Intro** | BrowserWindow Management & App Lifecycle | Electron, HTML/CSS/JS | Completed |
| **AI Chat App** | Multi-LLM Desktop Client with Personas | Electron, REST APIs, Groq/Gemini | Completed |
| **IPC Lab 4** | Two-Way IPC & Desktop Process Spawning | Electron, React, Vite, VLC | Completed |
| **React + Electron** | Modern Toolchain Integration & Secure Preload | React 19, Vite, Electron | In Progress |

---

## Academic Notice
*This repository contains academic laboratory work and practical implementations developed for class coursework. Updates are committed iteratively following laboratory sessions.*
