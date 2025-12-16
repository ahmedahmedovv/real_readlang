import { PracticeSentence, FeedbackResponse, ChatSession } from "../types";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "mistral-small-latest";

const getApiKey = () => localStorage.getItem("mistral_api_key");

const callMistral = async (messages: any[], jsonMode = false) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const response = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages: messages,
      response_format: jsonMode ? { type: "json_object" } : undefined,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Mistral API Error:", errorText);
    throw new Error(`Mistral API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

/**
 * Generates a practice sentence using Mistral.
 */
export const generatePracticeSentence = async (
  knownLang: string, 
  learningLang: string, 
  targetWord?: string
): Promise<PracticeSentence> => {
  
  const systemPrompt = `You are a language teacher. Return ONLY a JSON object.
  Generate a simple sentence in ${learningLang} using the word "${targetWord}".
  Provide a translation in ${knownLang} and a brief context note.
  Format: { "original": "...", "translation": "...", "context": "..." }`;

  try {
    const result = await callMistral([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Generate sentence for word: ${targetWord}` }
    ], true);
    
    return JSON.parse(result) as PracticeSentence;
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
       return {
         original: targetWord || "Example Word",
         translation: "Example Translation",
         context: "API Key missing. Please add Mistral Key in settings to generate real sentences."
       };
    }
    console.error("Mistral generation failed:", error);
    return {
      original: targetWord ? `... ${targetWord} ...` : "Hello",
      translation: targetWord ? `... ${targetWord} ...` : "Hello",
      context: "AI Service Unavailable"
    };
  }
};

/**
 * Grades the answer using Mistral.
 */
export const checkAnswer = async (
  original: string,
  userAnswer: string,
  learningLang: string
): Promise<FeedbackResponse> => {
  const systemPrompt = `You are a strict language grader. Return ONLY a JSON object.
  Compare the user's answer to the target sentence in ${learningLang}.
  Format: { "isCorrect": boolean, "explanation": "string", "betterTranslation": "string (optional)" }`;

  try {
    const result = await callMistral([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Target: ${original}\nUser Answer: ${userAnswer}` }
    ], true);

    return JSON.parse(result) as FeedbackResponse;
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      return { isCorrect: false, explanation: "Please set your Mistral API Key to enable AI grading." };
    }
    return { isCorrect: false, explanation: "AI Error" };
  }
};

/**
 * Starts a chat session with Mistral.
 * Note: Since Mistral API is stateless, we wrap a simple closure to maintain history for the session.
 */
export const startChatSession = (knownLang: string, learningLang: string): ChatSession => {
  const history: any[] = [
    { 
      role: "system", 
      content: `You are a friendly language tutor. The user speaks ${knownLang} and is learning ${learningLang}. Converse primarily in ${learningLang}. Keep responses concise (1-3 sentences).` 
    }
  ];

  return {
    sendMessage: async ({ message }: { message: string }) => {
      try {
        history.push({ role: "user", content: message });
        
        // We send the full history to maintain context
        const responseText = await callMistral(history, false);
        
        history.push({ role: "assistant", content: responseText });
        return { text: responseText };
      } catch (e: any) {
        if (e.message === "API_KEY_MISSING") {
          return { text: "I cannot chat without an API Key. Please configure it in the settings." };
        }
        console.error(e);
        return { text: "Connection error with Mistral." };
      }
    }
  };
};

/**
 * Analyzes text for the Library view using Mistral.
 */
export const analyzeText = async (text: string, knownLang: string): Promise<string> => {
  const prompt = `Analyze this text for a ${knownLang} speaker: "${text}". Provide a short summary and 3 key vocab words with translations. Format as Markdown.`;

  try {
    const result = await callMistral([
      { role: "user", content: prompt }
    ], false);
    return result || "No analysis available.";
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
      return "AI Analysis requires a Mistral API Key. Please add it in the user menu.";
    }
    return "Analysis failed.";
  }
};