# Obsidian Librarian - Flowstate

A light mode mobile chat interface for intelligent note capture and Obsidian vault organization.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
PYTHON_PATH=python
WHISPER_MODEL=base
```

Get your Gemini API key from [Google AI Studio](https://ai.google.dev/).

### 3. Install Python dependencies for faster-whisper

```bash
npm run python:install
```

This installs the Python requirements used by the local Whisper backend (`faster-whisper`, `ctranslate2`, and `numpy`).

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

✨ **Light Mode Design** - Clean, Apple Notes-inspired interface

🧠 **Obsidian Librarian** - AI-powered message processing with:
- Multi-step intent detection
- Automatic YAML frontmatter generation
- Smart path suggestions (e.g., `Reference/Coding/React/`)
- Intelligent tag generation
- Beginner-friendly summaries

📋 **Result Display** - See the JSON output to verify categorization

## How It Works

1. User types a message or task
2. Message is sent to Google Gemini API with enhanced Obsidian Librarian prompt
3. AI returns structured JSON with:
   - Category (To-Do or Reference)
   - Suggested file path
   - YAML frontmatter
   - Markdown content
4. Results are displayed in the UI for verification
5. Pat's backend (Backend 2) handles saving to Obsidian vault

## Project Structure

```
src/
├── app/
│   ├── api/route.ts          # API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── ChatInterface.tsx      # Main chat UI
│   ├── ChatInterface.module.css
│   ├── ChatMessage.tsx        # Individual message
│   ├── ChatMessage.module.css
│   ├── ResultDisplay.tsx      # JSON result display
│   └── ResultDisplay.module.css
└── lib/
    ├── openAI.ts             # Gemini API integration (file name kept for compatibility)
    └── obsidianPrompt.ts     # Enhanced Librarian prompt
```

## AI Prompt Highlights

### Multi-Intent Detection
Recognizes when tasks have contextual information:
```
"Remind me to check gas prices because they are ₱65.40"
→ Task with Finance context included in markdown
```

### Smart Pathing
```
"React tutorial" → Reference/Coding/React/
"Buy groceries" → Tasks/Shopping/
"Doctor appointment" → Tasks/Health/
```

### Automatic YAML Frontmatter
```yaml
---
date_created: 2026-05-05T15:30:00Z
source: Mobile-Chat
tags: [#grocery, #shopping, #budget]
---
```

## Backend Integration

Your role: **Backend 1 - AI & Prompt Engineering** ✅
- Enhanced Obsidian Librarian prompt
- Multi-step intent detection
- Metadata extraction
- Smart pathing logic
- Beginner-friendly summaries

Pat's role: **Backend 2 - File System & Obsidian**
- Save JSON to Obsidian vault
- Create markdown files
- Organize folder structure
- Handle file conflicts

## Next Steps

1. Test the chat UI with sample messages
2. Verify JSON output is correct
3. Adjust prompt if needed
4. Hand off to Pat for file saving logic
