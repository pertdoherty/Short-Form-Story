# Short Form Story Generator

This repository contains a Vite React frontend and a Node.js backend.
The frontend is designed to deploy on Vercel, and the backend is designed to deploy on Railway.

## Architecture

* `frontend/` — Vite React app that calls the backend for story generation.
* `backend/` — Express server that proxies requests to Gemini using your personal API key.

## Local development

### Backend

1. Copy `backend/env.sample` to `backend/.env`.
2. Set your local env values, especially `GEMINI_API_KEY`.
3. In `backend/`, install dependencies and run:

```bash
npm install
npm run dev
```

### Frontend

1. In `frontend/`, install dependencies:

```bash
npm install
```

2. Start the frontend locally with the backend URL:

```bash
VITE_BACKEND_URL=http://localhost:5000 npm run dev
```

## Railway backend setup

1. In Railway, create a new project and connect this repository.
2. Deploy the `backend/` folder as a Node.js service.
3. Configure these environment variables in Railway:
   * `GEMINI_API_KEY` = your Gemini API key
   * `GEMINI_MODEL` = `gemini-2.5-flash`
   * `ALLOWED_ORIGIN` = your Vercel frontend origin (for example `https://short-form-story-frontend.vercel.app`) or `*` for testing
4. Deploy the backend service and copy the Railway public URL.

## Vercel frontend setup

1. In Vercel, create a new project from the same GitHub repo.
2. Set the **Root Directory** to `frontend`.
3. Configure build settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`
   * Framework Preset: `Vite`
4. Add this environment variable in Vercel:
   * `VITE_BACKEND_URL` = the Railway backend URL

## Environment variables

### Backend (Railway)

* `GEMINI_API_KEY`
* `GEMINI_MODEL`
* `ALLOWED_ORIGIN`
* `PORT` (Railway sets this automatically)

### Frontend (Vercel)

* `VITE_BACKEND_URL`

## Notes

* Do not commit `backend/.env.local`.
* The backend `start` script now uses the runtime environment provided by Railway.
* The frontend calls the backend via `VITE_BACKEND_URL`, keeping the Gemini key secret.

## Installation and Running the App

To install dependencies and run your Google Cloud Vertex AI Studio App locally, execute the following command:

```bash
npm install && npm run dev
