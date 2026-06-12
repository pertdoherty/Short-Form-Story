import { StoryIdea, GenerationParams } from '../types';

export const generateStories = async (params: GenerationParams): Promise<StoryIdea[]> => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
  const response = await fetch(`${backendUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error || response.statusText || 'Unknown error';
    throw new Error(message);
  }

  const stories: StoryIdea[] = await response.json();
  return stories;
};