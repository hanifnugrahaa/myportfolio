import { buildSystemPrompt, getLocalChatAnswer, type ChatMessage } from './chatKnowledge';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL_PRIMARY = import.meta.env.VITE_GEMINI_MODEL ?? 'gemini-2.0-flash';

const OPENAI_API_KEY = import.meta.env.VITE_AI_API_KEY;
const OPENAI_API_BASE = import.meta.env.VITE_AI_API_BASE ?? 'https://api.openai.com/v1';
const OPENAI_MODEL = import.meta.env.VITE_AI_MODEL ?? 'gpt-4o-mini';

/** Model cadangan jika primary overload (503) atau tidak tersedia */
const GEMINI_FALLBACK_MODELS = ['gemini-2.0-flash', 'gemini-3.5-flash'] as const;

const RETRY_DELAYS_MS = [800, 1600, 2400];

export type AiProvider = 'gemini' | 'openai' | null;

function uniqueModels(models: string[]): string[] {
  return [...new Set(models.filter(Boolean))];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 503 || status === 429 || status === 500;
}

export function getAiProvider(): AiProvider {
  if (GEMINI_API_KEY?.trim()) return 'gemini';
  if (OPENAI_API_KEY?.trim()) return 'openai';
  return null;
}

export function isAiChatConfigured(): boolean {
  return getAiProvider() !== null;
}

async function callGeminiModel(model: string, history: ChatMessage[]): Promise<string> {
  const recent = history.slice(-12);
  const contents = recent.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY!,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: buildSystemPrompt() }],
      },
      contents,
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 600,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    const error = new Error(`Gemini API ${response.status}: ${errText}`) as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  const data = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) {
    throw new Error('Empty Gemini response');
  }

  return reply;
}

async function sendGeminiMessage(history: ChatMessage[]): Promise<string> {
  const models = uniqueModels([GEMINI_MODEL_PRIMARY, ...GEMINI_FALLBACK_MODELS]);
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt < RETRY_DELAYS_MS.length; attempt++) {
      try {
        return await callGeminiModel(model, history);
      } catch (err) {
        lastError = err;
        const status = (err as Error & { status?: number }).status;
        if (status && isRetryableStatus(status) && attempt < RETRY_DELAYS_MS.length - 1) {
          await sleep(RETRY_DELAYS_MS[attempt]);
          continue;
        }
        break;
      }
    }
  }

  throw lastError ?? new Error('Gemini request failed');
}

async function sendOpenAiMessage(history: ChatMessage[]): Promise<string> {
  const recent = history.slice(-12);

  const response = await fetch(`${OPENAI_API_BASE.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'system', content: buildSystemPrompt() }, ...recent],
      max_tokens: 600,
      temperature: 0.65,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`OpenAI API ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new Error('Empty OpenAI response');
  }

  return reply;
}

function buildOfflineReply(history: ChatMessage[], reason?: 'overload' | 'generic'): string {
  const lastUser = [...history].reverse().find((m) => m.role === 'user');
  const local = getLocalChatAnswer(lastUser?.content ?? '');

  if (reason === 'overload') {
    return (
      local +
      '\n\n_(Gemini sedang sibuk — ini jawaban cepat dari data portfolio. Coba lagi beberapa menit ya.)_'
    );
  }

  return local + '\n\n_(Mode offline: API AI tidak tersedia saat ini.)_';
}

export async function sendChatMessage(history: ChatMessage[]): Promise<string> {
  const provider = getAiProvider();

  if (!provider) {
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    return getLocalChatAnswer(lastUser?.content ?? '');
  }

  try {
    if (provider === 'gemini') {
      return await sendGeminiMessage(history);
    }
    return await sendOpenAiMessage(history);
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    const isOverload = status === 503 || status === 429;
    if (import.meta.env.DEV) {
      console.warn('Chat API fallback:', err);
    }
    return buildOfflineReply(history, isOverload ? 'overload' : 'generic');
  }
}
