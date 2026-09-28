/**
 * EduAI – API Configuration
 * ──────────────────────────────────────────────────────────────
 * Leave API_KEY empty to use the built-in Demo AI Engine.
 * The demo mode works completely offline with no API needed.
 *
 * To use a real AI backend, fill in the values below.
 * Supported providers: OpenAI, Google Gemini, Anthropic, etc.
 *
 * Example for Google Gemini:
 *   API_KEY      = 'AIzaSy...'
 *   API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
 *   API_PROVIDER = 'gemini'
 *
 * Example for OpenAI:
 *   API_KEY      = 'sk-...'
 *   API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'
 *   API_PROVIDER = 'openai'
 * ──────────────────────────────────────────────────────────────
 */

export const API_KEY      = '';          // ← Paste your API key here
export const API_ENDPOINT = '';          // ← Paste your API endpoint here
export const API_PROVIDER = 'demo';      // 'demo' | 'gemini' | 'openai'
export const DEMO_MODE    = !API_KEY;    // Auto-detected

export const AI_CONFIG = {
  maxTokens:   1024,
  temperature: 0.7,
  systemPrompt: `You are EduAI, a friendly and expert AI tutor for students.
You explain concepts clearly, use simple language, provide examples, and
encourage students. Keep responses concise but thorough. Use bullet points
and formatting when helpful. Always be supportive and positive.`
};
