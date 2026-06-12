# Deploying to Vercel

This frontend project is built with Vite and is designed to be deployed from the `frontend/` folder.

## Vercel setup

1. Push your code to GitHub and make sure the repo includes both `frontend/` and `backend/` if you want the full project history.
2. In Vercel, click **Add New... > Project** and import your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Configure the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: `Vite`
5. Add any environment variables needed for your app.

## Environment variables

- Add `API_KEY` in Vercel to match the client-side Gemini API key.
- The frontend uses `process.env.API_KEY` in `frontend/services/geminiService.ts`.
- This is functional but is not secure for production. A safer architecture is to move API calls to a backend endpoint.

## New Vercel proxy support

- This repo now includes a Vercel serverless proxy at `frontend/api/api-proxy.ts`.
- Deployed frontend requests to Vertex AI can be forwarded through `/api-proxy` instead of relying on a local backend.

## Does the backend need to be on Git?

Yes, keep `backend/` in Git if you want the complete project and later want to deploy the backend as well.

### Backend on Vercel?

- A frontend-only Vercel deployment does not require the `backend/` folder to run.
- But the current app is structured to use a backend proxy for Vertex AI calls, so if you want the app to work end-to-end, you need backend support somewhere.

### Recommended approach

Option 1: Frontend-only deploy
- Deploy just `frontend/` to Vercel.
- This is ideal for static frontend hosting.
- Do not expect `/api-proxy` or `/ws-proxy` to work unless you also host a backend.

Option 2: Full app support
- Keep `backend/` in Git.
- Deploy the backend separately on a Node-capable host, or convert it into Vercel Serverless Functions under `api/`.
- Update the frontend to call the deployed backend endpoint instead of local `localhost:5000`.

## Important note for this repo

The current `frontend/vite.config.ts` uses development proxies:
- `/api-proxy` → `http://localhost:5000`
- `/ws-proxy` → `ws://localhost:5000`

That proxy is only for local development. In Vercel production, there is no local backend unless you deploy it too.

## Summary

- If you want to deploy the frontend to Vercel, set root to `frontend`, build with `npm run build`, and output `dist`.
- Keep `backend/` in Git if you want the full project and backend deployment path.
- Do not commit `backend/.env.local`; it is ignored by `.gitignore`.
