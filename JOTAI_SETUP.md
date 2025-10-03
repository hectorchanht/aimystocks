# Jotai LocalStorage Setup

## Overview
This document describes the Jotai state management implementation with localStorage persistence for AImySTOCKS.

## Installed Dependencies
- `jotai` - State management library with localStorage support

## Atoms Created
Located in `/src/app/store/atoms.ts`:

### 1. **stocksAtom**
- **Type**: `Stock[]`
- **LocalStorage Key**: `aimystocks-stocks`
- **Purpose**: Persists the user's stock portfolio list
- **Default**: `[]`

### 2. **apiKeyAtom**
- **Type**: `string`
- **LocalStorage Key**: `aimystocks-apikey`
- **Purpose**: Persists the AI service API key
- **Default**: `''`

### 3. **customPromptAtom**
- **Type**: `string`
- **LocalStorage Key**: `aimystocks-customprompt`
- **Purpose**: Persists additional context/custom prompt for AI analysis
- **Default**: `''`

### 4. **nasdaqApiKeyAtom**
- **Type**: `string`
- **LocalStorage Key**: `aimystocks-nasdaqapikey`
- **Purpose**: Persists the Nasdaq API key for charts
- **Default**: `''`

### 5. **aiServiceAtom**
- **Type**: `'gemini' | 'grok' | 'chatgpt'`
- **LocalStorage Key**: `aimystocks-aiservice`
- **Purpose**: Persists the selected AI service
- **Default**: `'chatgpt'`

## Components Updated

### `/src/app/page.tsx`
- Replaced `useState` with `useAtom` for stocks and nasdaqApiKey
- Now uses `stocksAtom` and `nasdaqApiKeyAtom`

### `/src/app/components/AISelector.tsx`
- Replaced `useState` with `useAtom` for service, apiKey, and customPrompt
- Now uses `aiServiceAtom`, `apiKeyAtom`, and `customPromptAtom`

## Benefits
1. **Persistence**: All user data persists across browser sessions
2. **No Data Loss**: Users won't lose their portfolio or settings on page refresh
3. **Better UX**: Seamless experience with saved preferences
4. **Type Safety**: Full TypeScript support with Jotai

## Usage
All atoms are automatically synced with localStorage. No manual save/load logic needed.
