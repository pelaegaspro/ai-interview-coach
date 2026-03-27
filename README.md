# AI Interview Coach

AI Interview Coach is a Windows desktop overlay app built with Electron, React, TailwindCSS, and Express. It captures microphone audio only when you explicitly start listening, transcribes live audio in short chunks, and generates structured coaching suggestions tailored to the selected interview mode and uploaded resume context.

## Features

- Real-time microphone capture with explicit start and stop controls
- 4-second audio chunking with backend transcription
- Structured coaching output:
  - Short answer
  - Bullet points
  - STAR suggestion
  - Keywords
  - Follow-up suggestion
  - Coaching tips
- Resume-aware prompting with PDF upload and in-memory context
- Interview modes for General, Data Analyst, Behavioral (HR), and SQL / Python Technical
- Transparent always-on-top overlay with adjustable opacity
- Optional click-through mode, disabled by default
- Global overlay hotkeys:
  - `Ctrl+Shift+A` show or hide overlay
  - `Ctrl+Shift+M` toggle click-through mode
- Local Express backend started inside the Electron app
- OpenAI or Groq provider support via environment configuration

## Folder Structure

```text
.
├── backend
│   ├── controllers
│   ├── middleware
│   ├── routes
│   ├── store
│   ├── app.js
│   └── server.js
├── electron
│   ├── main.js
│   └── preload.js
├── frontend
│   ├── index.html
│   └── src
│       ├── components
│       ├── hooks
│       ├── lib
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── services
│   ├── ai
│   ├── resume
│   └── stt
├── utils
├── .env.example
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.mjs
```

## Setup

1. Create an environment file from the example:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Add your API keys to `.env`.

   - Set `AI_PROVIDER=openai` to use OpenAI for both coaching and transcription.
   - Set `AI_PROVIDER=groq` to use Groq for both coaching and transcription.

3. Install dependencies:

   ```powershell
   npm install
   ```

4. Start the app in development:

   ```powershell
   npm run dev
   ```

The Electron overlay will launch after the Vite frontend starts. The Express backend is started automatically by Electron on `http://127.0.0.1:8787`.

## Run Commands

```powershell
npm install
npm run dev
```

Optional production packaging:

```powershell
npm run build
```

## API Endpoints

- `POST /transcribe`
  - Form field: `audio`
  - Returns transcribed text for an audio chunk
- `POST /ask`
  - JSON body: `{ "transcript": "text", "mode": "behavioral" }`
  - Returns structured coaching output
- `POST /resume/upload`
  - Form field: `resume`
  - Parses PDF text and stores it in memory for prompt context

## UX and Safety Notes

- The microphone is never active by default.
- The UI clearly shows whether the mic is live.
- Click-through mode must be enabled manually.
- Uploaded resumes are stored in memory only for the current app session.
- API keys are loaded from environment variables only.

## Development Notes

- Frontend: React + TailwindCSS via Vite
- Desktop shell: Electron with a frameless transparent always-on-top window
- Backend: Express running locally inside the Electron process
- Speech capture: `navigator.mediaDevices.getUserMedia` + `MediaRecorder`
- PDF parsing: `pdf-parse`
- Structured output validation: `zod`
