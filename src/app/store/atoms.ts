import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Stock, AnalysisResult } from '../types';

// Atom for stock list with localStorage persistence
export const stocksAtom = atomWithStorage<Stock[]>('aimystocks-stocks', []);

// Atom for API key with localStorage persistence
export const apiKeyAtom = atomWithStorage<string>('aimystocks-apikey', '');

// Atom for additional context/custom prompt with localStorage persistence
export const customPromptAtom = atomWithStorage<string>('aimystocks-customprompt', '');

// Atom for Nasdaq API key with localStorage persistence
export const nasdaqApiKeyAtom = atomWithStorage<string>('aimystocks-nasdaqapikey', '');

// Atom for selected AI service with localStorage persistence
export const aiServiceAtom = atomWithStorage<'gemini' | 'grok' | 'chatgpt'>('aimystocks-aiservice', 'chatgpt');

export const resultAtom = atomWithStorage<AnalysisResult>('aimystocks-result', { analysis: '' });