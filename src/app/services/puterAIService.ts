import axios from 'axios';
import { AIConfig, AnalysisResult, Stock } from '../types';

// Current date for prompt
const CURRENT_DATE = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

interface MarketData {
  symbol: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface PuterAIUsage {
  type: string;
  model: string;
  amount: number;
  cost: number;
}

interface PuterAIMessage {
  role: string;
  content: string;
  refusal: string | null;
  annotations: unknown[];
}

interface PuterAIResponse {
  index: number;
  message: PuterAIMessage;
  logprobs: unknown | null;
  finish_reason: string;
  usage: PuterAIUsage[];
  via_ai_chat_service: boolean;
}

// Enhanced Puter AI Response Types for new API format
interface PuterAIResponseV2 {
  success: boolean;
  service: {
    name: string;
  };
  result: {
    index: number;
    message: PuterAIMessage;
    logprobs: unknown | null;
    finish_reason: string;
    usage: PuterAIUsage[];
    via_ai_chat_service: boolean;
  };
  metadata: {
    service_used: string;
  };
}

// Declare puter global type
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (message: string) => Promise<PuterAIResponse | PuterAIResponseV2>;
      };
    };
  }
}

// System prompt generator
const getSystemPrompt = (language: string = 'English') => `You are a senior financial analyst with 20+ years in portfolio management and AI-driven insights. Before analyzing any portfolio, you MUST fetch and incorporate the LATEST real-time data.

**CRITICAL DATA FETCHING REQUIREMENTS:**
1. Access current stock prices for ALL tickers in the portfolio
2. Retrieve recent news and market data (last 30 days)
3. Check current market trends and sector performance
4. Get latest financial metrics and analyst ratings
5. Incorporate recent earnings reports and company announcements

**Analysis Date:** Use CURRENT market data as of ${CURRENT_DATE}, not historical portfolio purchase prices.

Follow this chain-of-thought:
1) **Data Collection**: Fetch real-time prices, news, and market data for all stocks
2) **Portfolio Valuation**: Calculate current total value using LATEST prices (not purchase prices)
3) **Performance Analysis**: Compare current values vs purchase prices for gain/loss calculations
4) **Market Context**: Analyze recent news, trends, and sector performance
5) **Risk Assessment**: Evaluate based on current market conditions and recent developments
6) **Recommendations**: Provide actionable advice based on CURRENT market data

IMPORTANT: Provide your entire response in ${language}.

**REQUIRED DATA POINTS TO INCLUDE:**
- Current stock prices (not purchase prices)
- Recent percentage changes (1D, 7D, 30D)
- Market capitalization and volume data
- Recent news sentiment and key events
- Sector performance and market trends
- Analyst ratings and price targets

Output in this EXACT JSON format:
{
  "analysis": "Full detailed analysis in markdown format with sections: ## Current Market Summary, ## Portfolio Valuation, ## Performance Analysis, ## Market Trends, ## Risk Assessment, ## Recommendations (in ${language})",
  "insights": ["Key insight 1 with current data", "Key insight 2 with market context", "Key insight 3 with recent developments"] (in ${language}),
  "recommendations": ["Actionable recommendation 1 based on current data", "Recommendation 2 considering market trends", "Recommendation 3 with risk assessment"] (in ${language})
}

Be specific, data-driven, and professional. Use CURRENT market data throughout analysis. Limit analysis to 800 words.`;

// User prompt generator
const getUserPrompt = (stocks: Stock[], marketData: MarketData[], customPrompt: string = '') => {
  const portfolioSummary = JSON.stringify(stocks, null, 2);

  // Format market data for the prompt
  const marketDataStr = marketData.length > 0
    ? `\n\nLATEST MARKET DATA (as of ${new Date().toLocaleString()}):\n${JSON.stringify(marketData, null, 2)}`
    : '';

  let basePrompt = `Portfolio Holdings for Analysis (Purchase Data - Use CURRENT Market Prices):
${portfolioSummary}${marketDataStr}

IMPORTANT: You MUST use the LATEST market data provided above for all analysis:
- Use CURRENT stock prices (not the purchase prices shown above)
- Incorporate recent market changes and trends
- Base all calculations on real-time data
- Consider current market conditions for recommendations

Focus on CURRENT market conditions and recent developments, not historical purchase data.`;
  if (customPrompt) {
    basePrompt += `\nAdditional user context/instructions: ${customPrompt}`;
  }
  return basePrompt;
};

// Function to fetch latest market data from Finnhub
const fetchMarketData = async (symbols: string[]): Promise<MarketData[]> => {
  try {
    // Note: API key is handled server-side via Next.js API routes
    // No client-side API key needed for market data fetching

    // Finnhub allows 60 calls per minute for free tier, so we'll fetch sequentially
    const marketData: MarketData[] = [];

    for (const symbol of symbols) {
      try {
        // Use Next.js API route proxy for latest price data
        const url = `/api/finnhub/quote?symbol=${symbol}`;
        const response = await axios.get(url);

        if (response.data.c) { // Check if current price exists
          marketData.push({
            symbol,
            currentPrice: response.data.c,
            change: response.data.d,
            changePercent: response.data.dp,
            high: response.data.h,
            low: response.data.l,
            open: response.data.o,
            previousClose: response.data.pc,
            timestamp: Date.now(),
          });
        }

        // Small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Failed to fetch data for ${symbol}:`, error);
      }
    }

    return marketData;
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
};

// Enhanced Puter AI Response Types for new API format
interface PuterAIResponseV2 {
  success: boolean;
  service: {
    name: string;
  };
  result: {
    index: number;
    message: PuterAIMessage;
    logprobs: unknown | null;
    finish_reason: string;
    usage: PuterAIUsage[];
    via_ai_chat_service: boolean;
  };
  metadata: {
    service_used: string;
  };
}

// Helper function to parse AI response from Puter API (supports both old and new formats)
const parseAIResponse = (response: PuterAIResponse | PuterAIResponseV2): AnalysisResult => {
  try {
    // Handle new API format (V2)
    if ('success' in response && response.success) {
      const content = response.result?.message?.content;

      if (!content) {
        throw new Error('No content in V2 response');
      }

      // Try to parse the content as JSON
      const parsed = JSON.parse(content);

      return {
        analysis: parsed.analysis || content,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || []
      };
    }

    // Handle legacy format (V1)
    if ('message' in response) {
      const content = response.message?.content;

      if (!content) {
        throw new Error('No content in legacy response');
      }

      // Try to parse the content as JSON
      const parsed = JSON.parse(content);

      return {
        analysis: parsed.analysis || content,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || []
      };
    }

    throw new Error('Unknown response format');
  } catch (error) {
    console.warn('Failed to parse structured response:', error);

    // Fallback: try to use raw content from either format
    let rawContent = '';
    if ('success' in response && response.success) {
      rawContent = response.result?.message?.content || '';
    } else if ('message' in response) {
      rawContent = response.message?.content || '';
    }

    return {
      analysis: rawContent,
      insights: [],
      recommendations: []
    };
  }
};

// Wait for puter to be available
const waitForPuter = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.puter) {
      resolve();
    } else {
      const checkPuter = setInterval(() => {
        if (typeof window !== 'undefined' && window.puter) {
          clearInterval(checkPuter);
          resolve();
        }
      }, 100);
    }
  });
};

const analyzePortfolioWithPuter = async (stocks: Stock[], config: AIConfig): Promise<AnalysisResult> => {
  if (stocks.length === 0) {
    return { analysis: 'No stocks in portfolio. Add some to analyze!', error: '' };
  }

  try {
    // Wait for Puter.js to load
    await waitForPuter();

    // Extract ticker symbols from portfolio
    const symbols = stocks.map(stock => stock.ticker);

    // Fetch latest market data for all symbols
    const marketData = await fetchMarketData(symbols);

    const language = config.language || 'English';
    const systemPrompt = getSystemPrompt(language);
    const userPrompt = getUserPrompt(stocks, marketData, config.customPrompt);
    const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

    // Use Puter AI (no API key needed!)
    const response = await window.puter.ai.chat(fullPrompt);

    return parseAIResponse(response);
  } catch (error: unknown) {
    console.error('Puter AI Analysis Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze with Puter AI.';
    return { analysis: '', error: errorMessage };
  }
};

export { analyzePortfolioWithPuter };
