
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
app.use(express.json({ limit: process.env.API_PAYLOAD_MAX_SIZE || '7mb' }));

const PORT = process.env.PORT || 5000;
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
if (!API_KEY) {
  console.error('Error: Environment variable GEMINI_API_KEY must be set.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

const buildPrompt = (params) => {
  const tone = params.tone?.trim() || 'neutral and engaging';
  return `Generate ${params.quantity} comic strip/short-form video stories.\nConcept: ${params.concept}\nTone: ${tone}`;
};

const systemInstruction = `You are an expert scriptwriter for fast-paced, 15-second vertical comic strips and animations (TikTok/Reels/Shorts).\nYour job is to generate highly visual, engaging story ideas based on the user's concept.\n\nFor each story, break it down into exactly 4 shots. Since this is for a 15-second vertical format, the pacing must be fast, starting with a hook, followed by tension, a climax/punchline, and a quick reaction/outro.\n\nEnsure the 'storyline' field strictly follows this format:\nSHOT 1\n[Description]\n\nSHOT 2\n[Description]\n\nSHOT 3\n[Description]\n\nSHOT 4\n[Description]`;

app.post('/api/generate', async (req, res) => {
  const { projectName, concept, tone, quantity } = req.body ?? {};

  if (!concept || !quantity) {
    return res.status(400).json({ error: 'concept and quantity are required.' });
  }

  try {
    const prompt = buildPrompt({ concept, tone, quantity });
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Title of the story' },
              description: { type: Type.STRING, description: 'Brief 1-sentence summary of the story' },
              storyline: { type: Type.STRING, description: 'The full storyline broken down into exactly 4 shots (SHOT 1, SHOT 2, etc.)' },
            },
            required: ['title', 'description', 'storyline'],
          },
        },
        temperature: 0.7,
      },
    });

    if (!response.text) {
      throw new Error('Empty response from model');
    }

    const stories = JSON.parse(response.text);
    return res.status(200).json(stories);
  } catch (error) {
    console.error('Generate error:', error);
    const message = error?.message || 'Unknown error';
    return res.status(500).json({ error: message });
  }
});

app.get('/', (_, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


