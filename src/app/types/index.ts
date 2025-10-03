export enum StockType {
  Buy = 'buy',
  Sell = 'sell',
}

export interface Stock {
  id: string;
  ticker: string;
  quantity: number;
  price: number;
  date: string; // ISO date string
  type: StockType;
}

export interface Portfolio {
  stocks: Stock[];
}

export interface AIConfig {
  service: 'gemini' | 'grok' | 'chatgpt';
  apiKey: string;
  customPrompt?: string; // New: for additional context
  language?: string; // New: for analysis language
}

export interface AnalysisResult {
  analysis: string;
  insights?: string[];
  recommendations?: string[];
  error?: string;
}

// Nasdaq types
export interface NasdaqStockData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface NasdaqResponse {
  data: NasdaqStockData[];
}