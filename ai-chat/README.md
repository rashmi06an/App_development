# AI Chat Desktop Application 🤖

A very simple, beginner-friendly desktop application built with **Electron**, **HTML**, **CSS**, **JavaScript**, and **Node.js**.

---

## 🌟 Features

- 🖥️ **Desktop Window Interface**: Runs as a standalone desktop app using Electron.
- 🔀 **Multiple LLMs**: Switch seamlessly between **OpenAI (GPT-4o-mini)** and **Google Gemini (1.5 Flash)**.
- 🎭 **Multiple AI Personas**:
  - **Normal Assistant** (Helpful & polite)
  - **Coding Mentor** (Explains code simply)
  - **Motivational Coach** (Energetic & encouraging)
  - **Wrestling Champion** (Fictional energetic powerhouse)
  - **Bollywood Superstar** (Fictional charismatic entertainer)
- 💬 **Conversation History**: Retains context across messages during your chat session.
- 🔄 **New Chat Button**: Clears the conversation to start fresh at any time.
- 🔒 **Secure API Key Handling**: Keys are stored safely in `.env` and handled in Node.js backend.
- ⚠️ **Helpful Error Handling**: Displays clear messages if API keys are missing or invalid.

---

## 📁 File Structure & Purpose

```text
ai-chat/
│
├── package.json   # Defines project details, start scripts, and dependencies (electron, dotenv)
├── main.js        # Electron main process (creates the desktop window & talks to the AI)
├── preload.js     # Secure bridge connecting the frontend HTML to the Node.js backend
├── index.html     # The visual structure (title, dropdowns, chat area, input box)
├── style.css      # Styling and design (modern dark theme, chat bubbles, buttons)
├── renderer.js    # Frontend JavaScript (handles button clicks, chat messages, UI updates)
├── ai.js          # AI logic (askOpenAI, askGemini, and persona prompt definitions)
├── .env           # Stores your secret API keys (never exposed in frontend)
└── .gitignore     # Tells Git to ignore node_modules and .env
```

---

## 🚀 Getting Started

### 1. Install Dependencies
Open your terminal, navigate to the `ai-chat` folder, and run:
```bash
npm install
```

### 2. Add Your API Key
Open the `.env` file in your favorite text editor:
```env
GROQ_API_KEY=your_actual_groq_key_here
```
> **Why Groq?** With just **ONE free Groq API key**, you get access to multiple top models:
> - **Llama 3.3 70B** (Meta)
> - **Llama 3.1 8B Instant**
> - **Mixtral 8x7B** (Mistral)
> - **Gemma 2 9B** (Google)
> 
> Get your free Groq API key in seconds at: [console.groq.com/keys](https://console.groq.com/keys).
>
> *(OpenAI and Gemini keys are also supported in .env if you wish to use them).*

### 3. Run the App
Launch the desktop application with:
```bash
npm start
```

---

## 💡 How It Works

### 1. Multiple LLMs
- When you pick **OpenAI**, `main.js` calls `askOpenAI()` in [ai.js](file:///Users/rashmianand/Desktop/APPDEV/ai-chat/ai.js), sending your message to `https://api.openai.com/v1/chat/completions`.
- When you pick **Gemini**, `main.js` calls `askGemini()` in [ai.js](file:///Users/rashmianand/Desktop/APPDEV/ai-chat/ai.js), sending your message to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`.
- The frontend doesn't need to know how the APIs work—it just asks the backend!

### 2. Personas
- Personas are defined in `ai.js` as system instructions.
- Whenever a message is sent, the selected persona instruction is prepended (as the `system` prompt in OpenAI and `systemInstruction` in Gemini).
- For example:
  - **Coding Mentor + OpenAI** will reply in a mentor tone using GPT.
  - **Coding Mentor + Gemini** will reply in the same mentor tone using Gemini.
  - **Wrestling Champion + Gemini** will reply in an energetic wrestling style using Gemini!
