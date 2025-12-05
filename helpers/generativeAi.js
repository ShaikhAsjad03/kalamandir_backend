require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Set GEMINI_API_KEY in .env");
}
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite-preview",
      contents: [
        { text: prompt }
      ],
      temperature: 0.7,
      maxOutputTokens: 256,
    });
    return response.candidates?.[0]?.content || "";
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = { generateContent };
