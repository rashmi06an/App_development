// ===================================================
// ai.js - AI Logic for Groq, OpenAI, and Gemini
// ===================================================

// Personas define the personality and style of the AI.
// The AI will follow these instructions whenever it replies.
const personas = {
  normal: "You are a helpful AI assistant.",
  coding: "You are a friendly coding mentor. Explain things simply.",
  motivational: "You are an energetic motivational coach.",
  wrestling: "You are a fictional energetic wrestling champion. Speak confidently and motivate the user.",
  bollywood: "You are a fictional charismatic Bollywood-style character. Be friendly and entertaining."
};

/**
 * Sends a message to Groq API.
 * Groq uses the exact same format as OpenAI, but is ultra-fast and free to use!
 * With just ONE Groq API key, you can access multiple models:
 * - llama-3.3-70b-versatile
 * - llama-3.1-8b-instant
 * - mixtral-8x7b-32768
 * - gemma2-9b-it
 * 
 * @param {string} model - The Groq model name.
 * @param {string} message - The latest message from the user.
 * @param {string} personaKey - The chosen persona (e.g. 'normal', 'coding').
 * @param {Array} history - Previous messages in the conversation.
 * @returns {Promise<string>} - The AI's response text.
 */
async function askGroq(model, message, personaKey, history = []) {
  // 1. Check if the Groq API key is set in .env
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_key_here" || apiKey.trim() === "") {
    throw new Error("Groq API key is missing! Please open your .env file and add your GROQ_API_KEY.");
  }

  // 2. Pick the instruction matching the chosen persona
  const personaInstruction = personas[personaKey] || personas.normal;

  // 3. Format previous messages for Groq
  const formattedHistory = history.map(item => ({
    role: item.role === "assistant" ? "assistant" : "user",
    content: item.content
  }));

  // 4. Build the full messages array (System persona + History + User message)
  const fullMessages = [
    { role: "system", content: personaInstruction },
    ...formattedHistory,
    { role: "user", content: message }
  ];

  // 5. Use model llama-3.1-8b-instant
  let chosenModel = "llama-3.1-8b-instant";
  if (model && model !== "llama-3.3-70b-versatile") {
    chosenModel = model;
  }

  // 6. Send the HTTP request to Groq API
  let response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: chosenModel,
      messages: fullMessages
    })
  });

  // 7. Handle response or fallback if the model is not hosted on current Groq account tier
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || "";

    // If Groq returns that the model doesn't exist or isn't accessible, fallback to active Groq model
    if (response.status === 404 || errorMessage.includes("does not exist") || errorMessage.includes("access")) {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: fullMessages
        })
      });
    }

    // If it still fails (e.g. invalid key or rate limit), throw a clean error
    if (!response.ok) {
      const finalError = await response.json().catch(() => ({}));
      throw new Error(finalError.error?.message || `Groq request failed with status ${response.status}`);
    }
  }

  // 8. Parse the JSON result and return the reply
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Received an empty response from Groq.");
  }

  return reply;
}

/**
 * Sends a message to OpenAI's API.
 */
async function askOpenAI(message, personaKey, history = []) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === "your_openai_key_here" || apiKey.trim() === "") {
    throw new Error("OpenAI API key is missing! Please open your .env file and add your OPENAI_API_KEY.");
  }

  const personaInstruction = personas[personaKey] || personas.normal;

  const formattedHistory = history.map(item => ({
    role: item.role === "assistant" ? "assistant" : "user",
    content: item.content
  }));

  const fullMessages = [
    { role: "system", content: personaInstruction },
    ...formattedHistory,
    { role: "user", content: message }
  ];

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: fullMessages
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `OpenAI request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Received an empty response from OpenAI.");
  }

  return reply;
}

/**
 * Sends a message to Google Gemini's API.
 */
async function askGemini(message, personaKey, history = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_gemini_key_here" || apiKey.trim() === "") {
    throw new Error("Gemini API key is missing! Please open your .env file and add your GEMINI_API_KEY.");
  }

  const personaInstruction = personas[personaKey] || personas.normal;

  const formattedContents = history.map(item => ({
    role: item.role === "assistant" ? "model" : "user",
    parts: [{ text: item.content }]
  }));

  formattedContents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: personaInstruction }]
      },
      contents: formattedContents
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || `Gemini request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error("Received an empty response from Gemini.");
  }

  return reply;
}

// Export the functions and personas so main.js can use them
module.exports = {
  personas,
  askGroq,
  askOpenAI,
  askGemini
};
