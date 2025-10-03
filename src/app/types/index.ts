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
  service: 'puter' | 'gemini' | 'grok' | 'chatgpt';
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

// Alpha Vantage API types for real-time market data
interface AlphaVantageQuote {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

interface AlphaVantageResponse {
  'Global Quote'?: {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
  Note?: string;
  Information?: string;
}