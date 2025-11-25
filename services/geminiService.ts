import { GoogleGenAI, Type } from "@google/genai";
import { Message, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDebateRound = async (
  topic: string,
  messages: Message[]
): Promise<AnalysisResult> => {
  
  const conversationHistory = messages
    .filter(m => m.role === 'PRO' || m.role === 'CON')
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const prompt = `
    You are an expert, impartial debate judge. 
    The topic is: "${topic}".
    
    Here is the transcript of the debate so far:
    ${conversationHistory}
    
    Analyze the arguments based on logic, evidence, and rhetorical skill.
    Provide a score for both sides (0-100), identify the current leader, and provide a short reasoning summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            winner: { type: Type.STRING, description: "Either 'PRO' or 'CON'" },
            reasoning: { type: Type.STRING, description: "A concise summary of why one side is winning." },
            proScore: { type: Type.NUMBER, description: "Score out of 100" },
            conScore: { type: Type.NUMBER, description: "Score out of 100" },
          },
          required: ["winner", "reasoning", "proScore", "conScore"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return {
      winner: 'TIE',
      reasoning: "Analysis temporarily unavailable due to network issues.",
      proScore: 50,
      conScore: 50
    };
  }
};