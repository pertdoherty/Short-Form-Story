# Deploying to Vercel

To deploy this application to Vercel using a Git repository, you need to configure your environment variables so the app can authenticate with the Gemini API.

## Setting the Gemini API Key in Vercel

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to your [Vercel Dashboard](https://vercel.com) and click **Add New... > Project**.
3. Import your Git repository.
4. Before clicking "Deploy", locate the **Environment Variables** section in the configuration screen.
5. Add your Gemini API key:
   - **Name**: `API_KEY`
   - **Value**: `your_actual_gemini_api_key_here`
6. Click **Deploy**.

## ⚠️ Important Security Note for Production

This codebase is currently structured as a pure client-side application for demonstration and sandbox purposes. It uses `process.env.API_KEY` directly in the frontend code (`services/geminiService.ts`). 

**If you deploy this exactly as-is to a public static host, your API key will be exposed to anyone who inspects the browser's network tab or source code.**

To secure your API key in a real Vercel production environment, you should adapt the architecture:

1. **Create a Vercel Serverless Function:** Create an `api/` directory at the root of your project. Move the Gemini API logic (`GoogleGenAI` initialization and `generateContent` call) into a serverless function like `api/generate.ts`. Vercel securely injects environment variables into these backend functions without exposing them to the browser.
2. **Update the Frontend:** Change your React frontend (`App.tsx`) to make a standard `fetch('/api/generate', { method: 'POST', ... })` call to your new endpoint instead of calling the Gemini SDK directly.
3. **Use a Build Tool:** Raw browser ESM (as used in this sandbox's `index.html`) does not natively understand `process.env`. When moving to Vercel, you typically wrap the React code in a framework like **Vite** or **Next.js**, which handles the build process and serverless function routing automatically.