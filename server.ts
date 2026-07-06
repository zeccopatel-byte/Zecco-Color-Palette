import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for generating palette using Gemini API
  app.post("/api/generate-palette", async (req, res) => {
    try {
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
                }
              },
              required: ["hex", "name", "reason"]
            },
          },
        },
      });

      const jsonStr = response.text;
      if (jsonStr) {
          const generatedColors = JSON.parse(jsonStr.trim());
          res.json({ colors: generatedColors });
      } else {
          res.status(500).json({ error: "No response text found" });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate palette" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
