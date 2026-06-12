import { GoogleGenAI, Type } from '@google/genai';
import { StoryIdea, GenerationParams } from '../types';

export const generateStories = async (params: GenerationParams): Promise<StoryIdea[]> => {
    // Initialize the client. API_KEY must be in the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

    const prompt = `Generate ${params.quantity} comic strip/short-form video stories.
Concept: ${params.concept}
Tone: ${params.tone}`;

    const systemInstruction = `You are an expert scriptwriter for fast-paced, 15-second vertical comic strips and animations (TikTok/Reels/Shorts). 
Your job is to generate highly visual, engaging story ideas based on the user's concept.

For each story, break it down into exactly 4 shots. Since this is for a 15-second vertical format, the pacing must be fast, starting with a hook, followed by tension, a climax/punchline, and a quick reaction/outro.

Ensure the 'storyline' field strictly follows this format:
SHOT 1
[Description]

SHOT 2
[Description]

SHOT 3
[Description]

SHOT 4
[Description]`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'Title of the story',
                            },
                            description: {
                                type: Type.STRING,
                                description: 'Brief 1-sentence summary of the story',
                            },
                            storyline: {
                                type: Type.STRING,
                                description: 'The full storyline broken down into exactly 4 shots (SHOT 1, SHOT 2, etc.)',
                            },
                        },
                        required: ['title', 'description', 'storyline'],
                    },
                },
                temperature: 0.7, // Slightly creative but structured
            },
        });

        if (!response.text) {
            throw new Error("Empty response from model");
        }

        const stories: StoryIdea[] = JSON.parse(response.text);
        return stories;
    } catch (error) {
        console.error("Error generating stories:", error);
        throw error;
    }
};