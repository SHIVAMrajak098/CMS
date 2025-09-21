import { GoogleGenAI, Type } from "@google/genai";
import { Urgency, Category } from '../types';

// FIX: Adhere to guideline to use process.env.API_KEY for the Gemini API key.
// The API key is securely provided by the execution environment.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  // FIX: Update warning message to reflect the change to process.env.API_KEY.
  console.warn("API_KEY environment variable not set. AI features will fall back to mock data.");
}

interface ClassificationResult {
  urgency: Urgency;
  category: Category;
}

export const classifyComplaint = async (complaintText: string): Promise<ClassificationResult | null> => {
  if (!ai) {
    // Fallback for when API key is not available
    console.log("AI classification skipped: API key not found.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      urgency: Urgency.Medium,
      category: Category.Other,
    };
  }
  
  try {
    const prompt = `
      Analyze the following complaint and classify its urgency and category.
      Complaint: "${complaintText}"
      
      Provide the output in JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgency: {
              type: Type.STRING,
              description: 'The urgency of the complaint.',
              enum: Object.values(Urgency),
            },
            category: {
              type: Type.STRING,
              description: 'The category of the complaint.',
              enum: Object.values(Category),
            },
          },
          required: ["urgency", "category"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the parsed result against our enums
    if (Object.values(Urgency).includes(result.urgency) && Object.values(Category).includes(result.category)) {
      return result as ClassificationResult;
    } else {
      console.error("Gemini response did not match expected schema:", result);
      return { urgency: Urgency.Medium, category: Category.Other };
    }

  } catch (error) {
    console.error("Error classifying complaint with Gemini API:", error);
    // Provide a fallback classification in case of an API error
    return {
      urgency: Urgency.Medium,
      category: Category.Other,
    };
  }
};