# Deploying to Vercel

This frontend project is built with Vite and is designed to be deployed from the `frontend/` folder.

## Vercel setup

1. Push your code to GitHub and make sure the repo includes the `frontend/` folder.
2. In Vercel, click **Add New... > Project** and import your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: `Vite`
5. Add this environment variable:
   - **Name**: `API_KEY`
   - **Value**: your Gemini API key

## Environment variables

- The frontend uses `process.env.API_KEY` in `frontend/services/geminiService.ts`.
- This app now calls Gemini directly from the browser using your personal API key.
- This means the API key is required at build time in Vercel, and it will be embedded in the frontend bundle.
- For a safer production deployment, move API calls to a backend endpoint or serverless function.

## Does the backend need to be on Git?

- No, this frontend-only deployment does not require the `backend/` folder.
- If you want to use just your personal Gemini API key, you can deploy the frontend alone.
- Remove any old proxy configuration and do not rely on the company Vertex setup.

## Summary

- Deploy the `frontend/` folder to Vercel with root set to `frontend`.
- Build command: `npm run build`
- Output directory: `dist`
- Set `API_KEY` in Vercel to your personal Gemini API key.
- Do not commit `backend/.env.local`; it is ignored by `.gitignore`.
