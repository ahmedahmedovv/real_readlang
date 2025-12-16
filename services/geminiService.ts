
import { PracticeSentence, FeedbackResponse, ChatSession } from "../types";

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generates a dummy practice sentence.
 */
export const generatePracticeSentence = async (
  knownLang: string, 
  learningLang: string, 
  targetWord?: string
): Promise<PracticeSentence> => {
  await delay(500);
  const word = targetWord || "example";
  return {
    original: `To jest przykładowe zdanie dla słowa "${word}".`,
    translation: `This is a sample sentence for the word "${word}".`,
    context: `This context highlights the usage of ${word} in everyday conversation.`
  };
};

/**
 * Returns a dummy grade.
 */
export const checkAnswer = async (
  original: string,
  userAnswer: string,
  learningLang: string
): Promise<FeedbackResponse> => {
  await delay(500);
  return { 
    isCorrect: true, 
    explanation: "Good job! (This is a dummy response, so you are always right).",
    betterTranslation: "Alternative translation would go here."
  };
};

/**
 * Starts a dummy chat session.
 */
export const startChatSession = (knownLang: string, learningLang: string): ChatSession => {
  return {
    sendMessage: async ({ message }: { message: string }) => {
      await delay(800);
      
      const responses = [
        "That's interesting! Tell me more.",
        "I am a dummy bot, but I think you're doing great.",
        `You said: "${message}". How does that make you feel?`,
        "In this language, we often say things differently.",
        "Could you repeat that?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return { text: randomResponse };
    }
  };
};

/**
 * Returns dummy text analysis.
 */
export const analyzeText = async (text: string, knownLang: string): Promise<string> => {
  await delay(1000);
  return `### Dummy Analysis\n\nThis text appears to be about **${text.substring(0, 20)}...**\n\n*Key Vocabulary:*\n1. **Word A** - Translation A\n2. **Word B** - Translation B\n3. **Word C** - Translation C\n\n(This is hardcoded data for demonstration purposes).`;
};
