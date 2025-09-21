import { GoogleGenAI, Type } from "@google/genai";
import { Urgency, Category, Department } from '../types';

// The API key is securely provided by the execution environment via import.meta.env
const API_KEY = import.meta.env.VITE_API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("VITE_API_KEY environment variable not set. AI features will fall back to mock data. Ensure it's in your .env file.");
}

interface ClassificationResult {
  urgency: Urgency;
  category: Category;
  department: Department;
}

export const classifyComplaint = async (complaintText: string): Promise<ClassificationResult | null> => {
  if (!ai) {
    // Fallback for when API key is not available
    console.log("AI classification skipped: API key not found.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    return {
      urgency: Urgency.Medium,
      category: Category.Other,
      department: Department.General,
    };
  }
  
  try {
    const prompt = `
      Analyze the following complaint and classify its urgency, category, and the appropriate department to handle it.
      Departments are: ${Object.values(Department).join(', ')}.
      - Public Works handles issues like potholes, roads, and infrastructure.
      - Utilities handles billing, water, and trash collection.
      - Parks and Recreation handles parks and public spaces.
      - Administration handles general inquiries or payment issues.
      - General is for anything else.
      
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
            department: {
              type: Type.STRING,
              description: 'The department best suited to handle the complaint.',
              enum: Object.values(Department),
            },
          },
          required: ["urgency", "category", "department"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    // Validate the parsed result against our enums
    if (Object.values(Urgency).includes(result.urgency) && Object.values(Category).includes(result.category) && Object.values(Department).includes(result.department)) {
      return result as ClassificationResult;
    } else {
      console.error("Gemini response did not match expected schema:", result);
      return { urgency: Urgency.Medium, category: Category.Other, department: Department.General };
    }

  } catch (error) {
    console.error("Error classifying complaint with Gemini API:", error);
    // Provide a fallback classification in case of an API error
    return {
      urgency: Urgency.Medium,
      category: Category.Other,
      department: Department.General,
    };
  }
};
