import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: 'A simple flat vector illustration of a friendly elderly woman smiling, wearing a yellow cardigan and blue shirt, with a background of abstract blue and yellow shapes, clean lines, minimal, friendly, in the style of corporate memphis or flat design.',
    });
    
    if (!fs.existsSync('public')) {
      fs.mkdirSync('public');
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        fs.writeFileSync('public/hero-image.png', Buffer.from(base64EncodeString, 'base64'));
        console.log('Image saved to public/hero-image.png');
      }
    }
  } catch (error) {
    console.error('Error generating image:', error);
  }
}

generate();
