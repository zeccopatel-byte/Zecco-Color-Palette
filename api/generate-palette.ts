import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { prompt } = req.body;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a color palette based on this theme/prompt: "${prompt}". Return exactly 5 colors. Provide a clean hex code for each, a creative name, and a short, 1-sentence reason why it fits the theme.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              hex: {
                type: Type.STRING,
                description: "The 6-character hex code starting with #",
              },
              name: {
                type: Type.STRING,
                description: "Creative name for the color",
              },
              reason: {
                type: Type.STRING,
                description: "Short, 1-sentence reason why the color fits the theme",
              },
            },
            required: ["hex", "name", "reason"],
          },
        },
      }
    });

    const jsonStr = response.text;
    if (jsonStr) {
      const data = JSON.parse(jsonStr.trim());
      return res.status(200).json({ colors: data });
    } else {
      return res.status(500).json({ error: "No response text found" });
    }
  } catch (error) {
    console.error("AI Generation Error:", error);
    return res.status(500).json({ error: 'Failed to generate palette' });
  }
}
