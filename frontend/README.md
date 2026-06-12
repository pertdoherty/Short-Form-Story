# Deploying to Vercel

This frontend project is built with Vite and is designed to be deployed from the `frontend/` folder.

## Vercel setup

1. Push your code to GitHub and make sure the repo includes the `frontend/` and `backend/` folders.
2. In Vercel, click **Add New... > Project** and import your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: `Vite`
5. Add this environment variable:
   - **Name**: `VITE_BACKEND_URL`
   - **Value**: the URL of your Railway backend (for example `https://<your-backend>.up.railway.app`)

## Environment variables

- The frontend now calls your backend at `VITE_BACKEND_URL`.
- The backend is responsible for calling Gemini with your personal API key.
- This is much safer than embedding the key directly in the browser.

## Railway backend setup

1. Deploy the `backend/` folder to Railway as a Node.js service.
2. In Railway, configure these environment variables:
   - `GEMINI_API_KEY` = your personal Gemini API key
   - `GEMINI_MODEL` = `gemini-2.5-flash` (or your chosen Gemini model)
   - `ALLOWED_ORIGIN` = the Vercel frontend origin, or `*` for testing
3. Deploy the backend on Railway.
4. Copy the Railway backend URL and set it as `VITE_BACKEND_URL` in Vercel.

## What to deploy

- `frontend/` on Vercel
- `backend/` on Railway

## Summary

- Deploy `frontend/` to Vercel.
- Deploy `backend/` to Railway.
- Set `VITE_BACKEND_URL` in Vercel to the Railway backend URL.
- Set `GEMINI_API_KEY` in Railway to your personal Gemini API key.
- Do not commit `backend/.env.local`; it is ignored by `.gitignore`.
