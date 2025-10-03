import { atomWithStorage } from 'jotai/utils';
import { AnalysisResult, Stock } from '../types';

// Atom for stock list with localStorage persistence
export const stocksAtom = atomWithStorage<Stock[]>('aimystocks-stocks', []);

// Atom for additional context/custom prompt with localStorage persistence
export const customPromptAtom = atomWithStorage<string>('aimystocks-customprompt', '');

// Atom for Finnhub API key with localStorage persistence (optional for enhanced market data)
export const FINNHUB_API_KEYAtom = atomWithStorage<string>('aimystocks-finnhub', '');

// Atom for analysis language with localStorage persistence
export const languageAtom = atomWithStorage<string>('aimystocks-language', 'English');

export const resultAtom = atomWithStorage<AnalysisResult>('aimystocks-result', { analysis: '' });

// Atom for loading state (not persisted)
import { atom } from 'jotai';
export const isAnalyzingAtom = atom<boolean>(false);