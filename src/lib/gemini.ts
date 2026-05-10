/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const summarizeText = async (text: string) => {
  if (!text) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Summarize the following study material into a concise, well-structured format with bullet points for key concepts. Use Markdown.\n\nMaterial:\n${text}`,
      config: {
        systemInstruction: "You are an expert academic tutor. Provide clear, concise summaries that highlight critical information for students.",
      }
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Summarization error:", error);
    return "Error occurred during summarization.";
  }
};

export const generateQuizFromText = async (text: string, title: string) => {
  if (!text) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a comprehensive study quiz based on this material. 
      The quiz should consist of 5 questions with a mix of types:
      1. Multiple Choice (type: "multiple_choice"): Standard 4-option questions for factual recall.
      2. Analytical (type: "analytical"): Higher-order questions that require deeper understanding like "Compare and contrast", "Explain the significance", or "What are the implications". These do not have fixed options.

      For "multiple_choice":
      - Include "text", "options" (array of 4), "correctAnswer" (integer index 0-3), and "explanation".
      
      For "analytical":
      - Include "text", "correctAnswer" (a detailed model answer or key points to look for), and "explanation" (why this is an important analytical point).

      Material: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["multiple_choice", "analytical"] },
                  text: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["type", "text", "correctAnswer"]
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz generation error:", error);
    return null;
  }
};

export const generateFlashcardsFromText = async (text: string) => {
  if (!text) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 8 study flashcards based on this material. Each flashcard should have a "front" (question/concept) and a "back" (answer/definition). Focus on key terms, dates, and core concepts.
      
      Material: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING }
                },
                required: ["front", "back"]
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text || "{}";
    const data = JSON.parse(jsonStr);
    return data.flashcards || [];
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return [];
  }
};

export const suggestResourcesForTopic = async (text: string) => {
  if (!text) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 3 high-quality external learning resources (YouTube videos, educational articles, or books) based on this study material. 
      For each resource, provide a realistic title, a search-friendly URL or source name, the type (video, article, book), and a brief description why it helps.
      
      Material: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resources: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["video", "article", "book"] },
                  description: { type: Type.STRING }
                },
                required: ["title", "url", "type", "description"]
              }
            }
          }
        }
      }
    });

    const jsonStr = response.text || "{}";
    const data = JSON.parse(jsonStr);
    return data.resources || [];
  } catch (error) {
    console.error("Resource suggestion error:", error);
    return [];
  }
};
