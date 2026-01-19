
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiRecommendations = async (mood: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Propose 3 types de produits alimentaires FRAIS et BRUTS (ex: fruits, légumes, céréales, eaux) parfaits pour quelqu'un qui se sent "${mood}". Donne juste les noms des produits séparés par des virgules, sans plats préparés.`,
      // Removed maxOutputTokens to follow guidelines: avoid setting it if not required, 
      // or must set thinkingBudget if it is set.
      config: {
        temperature: 0.7,
      },
    });
    return response.text?.split(',').map(s => s.trim()) || [];
  } catch (error) {
    console.error("Gemini recommendation error:", error);
    return ["Avocats", "Quinoa", "Eau Minérale"];
  }
};

export const getRecipesForCategory = async (category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Donne-moi 3 idées de recettes gourmandes et simples que je peux faire avec des produits de la catégorie "${category}". Pour chaque recette, donne un titre court et une description de 10 mots.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = sources
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({ title: chunk.web.title, uri: chunk.web.uri }));

    return { text, urls };
  } catch (error) {
    console.error("Gemini recipe error:", error);
    return { text: "Impossible de charger les recettes pour le moment.", urls: [] };
  }
};
