# Language Selector Feature

## Overview
Added multi-language support for AI analysis results. Users can now select their preferred language for the analysis output.

## Changes Made

### 1. Type Updates (`/src/app/types/index.ts`)
```typescript
export interface AIConfig {
  service: 'gemini' | 'grok' | 'chatgpt';
  apiKey: string;
  customPrompt?: string;
  language?: string; // NEW: Language for analysis output
}
```

### 2. Store Updates (`/src/app/store/atoms.ts`)
- Added `languageAtom` with localStorage persistence
- Default language: `'English'`
- LocalStorage key: `'aimystocks-language'`

### 3. UI Updates (`/src/app/components/AISelector.tsx`)

**New Language Selector:**
- Dropdown with 12 supported languages:
  - English, Spanish, French, German, Italian, Portuguese
  - Chinese, Japanese, Korean, Arabic, Russian, Hindi
- Globe icon for visual clarity
- Positioned between API Key and Additional Context fields
- Persists selection to localStorage

**Visual Design:**
- Clean dropdown with language icon
- Consistent styling with other form fields
- Full-width responsive layout

### 4. AI Service Updates (`/src/app/services/aiService.ts`)

**Updated System Prompt:**
- Changed from constant to function: `getSystemPrompt(language)`
- Dynamically injects selected language into prompt
- Instructs AI to respond entirely in the chosen language
- JSON structure labels also indicate the target language

**Example Prompt Injection:**
```
IMPORTANT: Provide your entire response in Spanish.

Output in this EXACT JSON format:
{
  "analysis": "Full detailed analysis... (in Spanish)",
  "insights": ["Key insight 1", ...] (in Spanish),
  "recommendations": ["Recommendation 1", ...] (in Spanish)
}
```

**Updated analyzePortfolio Function:**
- Extracts language from config (defaults to 'English')
- Generates system prompt with selected language
- Passes language-aware prompt to all AI services (Gemini, Grok, ChatGPT)

## Supported Languages

1. **English** (default)
2. **Spanish** (Español)
3. **French** (Français)
4. **German** (Deutsch)
5. **Italian** (Italiano)
6. **Portuguese** (Português)
7. **Chinese** (中文)
8. **Japanese** (日本語)
9. **Korean** (한국어)
10. **Arabic** (العربية)
11. **Russian** (Русский)
12. **Hindi** (हिन्दी)

## User Flow

1. User selects AI service (ChatGPT/Gemini/Grok)
2. User enters API key
3. **User selects preferred language** ← NEW
4. User optionally adds custom context
5. User clicks "Analyze Portfolio"
6. AI returns analysis in selected language

## Benefits

1. **Global Accessibility** - Users can read analysis in their native language
2. **Better Understanding** - Complex financial terms in familiar language
3. **Persistent Preference** - Language choice saved across sessions
4. **Seamless Integration** - Works with all AI services
5. **Clear UI** - Visual language icon and intuitive dropdown

## Technical Details

- Language preference stored in localStorage via Jotai
- AI models receive explicit language instructions
- All three sections (analysis, insights, recommendations) in selected language
- Fallback to English if language not specified
- No additional API calls or translation services needed
