// ===================================================
// renderer.js - Frontend User Interface Logic
// ===================================================

// Friendly descriptions for the persona banner
const personaDescriptions = {
  normal: "You are a helpful AI assistant.",
  coding: "You are a friendly coding mentor. Explain things simply.",
  motivational: "You are an energetic motivational coach.",
  wrestling: "You are a fictional energetic wrestling champion. Speak confidently and motivate the user.",
  bollywood: "You are a fictional charismatic Bollywood-style character. Be friendly and entertaining."
};

// Friendly display titles for personas
const personaTitles = {
  normal: "Normal Assistant",
  coding: "Coding Mentor",
  motivational: "Motivational Coach",
  wrestling: "Wrestling Champion",
  bollywood: "Bollywood Superstar"
};

// Friendly display titles for models
const modelTitles = {
  "groq:llama-3.3-70b-versatile": "Llama 3.3 (Groq)",
  "groq:llama-3.1-8b-instant": "Llama 3.1 (Groq)",
  "groq:mixtral-8x7b-32768": "Mixtral (Groq)",
  "groq:gemma2-9b-it": "Gemma 2 (Groq)",
  openai: "OpenAI",
  gemini: "Gemini"
};

// 1. In-memory conversation history for this session
// Stores objects like: { role: "user" | "assistant", content: "..." }
let messages = [];

// 2. Grab DOM elements
const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const modelSelect = document.getElementById("model-select");
const personaSelect = document.getElementById("persona-select");
const personaBadge = document.getElementById("persona-badge");
const personaDesc = document.getElementById("persona-desc");
const newChatBtn = document.getElementById("new-chat-btn");
const emptyState = document.getElementById("empty-state");

/**
 * Updates the persona banner at the top when the user picks a new persona.
 */
function updatePersonaBanner() {
  const selectedPersona = personaSelect.value;
  personaBadge.textContent = personaTitles[selectedPersona] || "AI Assistant";
  personaDesc.textContent = personaDescriptions[selectedPersona] || "";
}

// Listen for dropdown changes to immediately update the banner
personaSelect.addEventListener("change", updatePersonaBanner);

/**
 * Appends a message bubble to the chat box.
 * 
 * @param {string} sender - "You", "AI (Persona)", or "Error"
 * @param {string} text - The message content
 * @param {"user" | "ai" | "error"} type - The message type for styling
 */
function appendMessage(sender, text, type = "user") {
  if (emptyState) {
    emptyState.style.display = "none";
  }

  const row = document.createElement("div");
  row.className = `message-row ${type}`;

  const senderLabel = document.createElement("div");
  senderLabel.className = "message-sender";
  senderLabel.textContent = sender;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  row.appendChild(senderLabel);
  row.appendChild(bubble);
  chatBox.appendChild(row);

  chatBox.scrollTop = chatBox.scrollHeight;
  return row;
}

/**
 * Displays a loading animation while the AI is generating a reply.
 */
function showLoading(senderName) {
  if (emptyState) {
    emptyState.style.display = "none";
  }

  const row = document.createElement("div");
  row.className = "message-row ai";
  row.id = "loading-row";

  const senderLabel = document.createElement("div");
  senderLabel.className = "message-sender";
  senderLabel.textContent = `${senderName} is thinking...`;

  const bubble = document.createElement("div");
  bubble.className = "message-bubble loading-dots";
  bubble.innerHTML = "<span></span><span></span><span></span>";

  row.appendChild(senderLabel);
  row.appendChild(bubble);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;

  return row;
}

/**
 * Removes the loading animation element.
 */
function removeLoading() {
  const loadingRow = document.getElementById("loading-row");
  if (loadingRow) {
    loadingRow.remove();
  }
}

/**
 * Handles sending a message when the user submits the form.
 */
async function handleSendMessage(event) {
  event.preventDefault();

  const text = userInput.value.trim();
  if (!text) return;

  const selectedModel = modelSelect.value;
  const selectedPersona = personaSelect.value;
  const personaName = personaTitles[selectedPersona] || "AI";
  const modelName = modelTitles[selectedModel] || "AI";

  // 1. Display user message
  appendMessage("You", text, "user");

  // 2. Add message to local conversation history array
  messages.push({ role: "user", content: text });

  // 3. Clear input field and temporarily disable controls
  userInput.value = "";
  userInput.disabled = true;
  sendBtn.disabled = true;

  // 4. Show loading indicator
  showLoading(`AI (${personaName})`);

  try {
    // 5. Send message and history to the Node.js backend
    const historyToSend = messages.slice(0, -1);

    const reply = await window.api.sendMessage({
      model: selectedModel,
      persona: selectedPersona,
      message: text,
      history: historyToSend
    });

    // 6. Remove loading indicator and show AI response
    removeLoading();
    appendMessage(`AI (${personaName} • ${modelName})`, reply, "ai");

    // 7. Add AI response to local conversation history
    messages.push({ role: "assistant", content: reply });

  } catch (error) {
    // 8. Handle any errors (like missing API keys)
    removeLoading();
    const errorMsg = error.message || "An unexpected error occurred.";
    appendMessage("⚠️ System Notice", errorMsg, "error");
  } finally {
    // 9. Re-enable input and refocus
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
}

/**
 * Clears the chat and restarts conversation history.
 */
function handleNewChat() {
  messages = [];

  chatBox.innerHTML = `
    <div class="empty-state" id="empty-state">
      <div class="empty-icon">💬</div>
      <h2>Welcome to AI Chat!</h2>
      <p>Pick an AI Model and Persona above, then type a message below to start chatting.</p>
    </div>
  `;

  userInput.value = "";
  userInput.focus();
}

// 3. Attach Event Listeners
chatForm.addEventListener("submit", handleSendMessage);
newChatBtn.addEventListener("click", handleNewChat);

// Initialize persona description banner on startup
updatePersonaBanner();
userInput.focus();
