import { AIConfig, AnalysisResult, Stock } from '../types';

const CURRENT_DATE = '2025-10-02';

// Puter AI API Response types
// Example response structure:
// {
//   "index": 0,
//   "message": {
//     "role": "assistant",
//     "content": "{\"analysis\": \"...\", \"insights\": [...], \"recommendations\": [...]}",
//     "refusal": null,
//     "annotations": []
//   },
//   "logprobs": null,
//   "finish_reason": "stop",
//   "usage": [{"type": "prompt", "model": "gpt-4.1-nano", "amount": 359, "cost": 3590}, ...],
//   "via_ai_chat_service": true
// }
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

// Declare puter global type
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (message: string) => Promise<PuterAIResponse>;
      };
    };
  }
}

// System prompt generator
const getSystemPrompt = (language: string = 'English') => `You are a senior financial analyst with 20+ years in portfolio management and AI-driven insights. Analyze portfolios objectively using data as of ${CURRENT_DATE}. 

Follow this chain-of-thought: 
1) Summarize holdings and calculate metrics (e.g., total value, avg gain/loss per stock)
2) Identify trends (e.g., sector performance, volatility)
3) Assess risks (e.g., diversification, market exposure)
4) Provide actionable recommendations (e.g., buy/sell/hold with rationale)

IMPORTANT: Provide your entire response in ${language}.

Output in this EXACT JSON format:
{
  "analysis": "Full detailed analysis in markdown format with sections: ## Summary, ## Trends, ## Performance Metrics, ## Risks (in ${language})",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"] (in ${language}),
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"] (in ${language})
}

Be specific, data-driven, and professional. Limit analysis to 500 words.`;

// User prompt generator
const getUserPrompt = (stocks: Stock[], customPrompt: string = '') => {
  const portfolioSummary = JSON.stringify(stocks, null, 2);
  let basePrompt = `Analyze this stock portfolio: ${portfolioSummary}.`;
  if (customPrompt) {
    basePrompt += `\nAdditional user context/instructions: ${customPrompt}`;
  }
  return basePrompt;
};

// Helper function to parse AI response from Puter API
const parseAIResponse = (response: PuterAIResponse): AnalysisResult => {
  try {
    // Extract content from the response structure
    const content = response?.message?.content;

    if (!content) {
      throw new Error('No content in response');
    }

    // Try to parse the content as JSON
    const parsed = JSON.parse(content);
    
    return {
      analysis: parsed.analysis || content,
      insights: parsed.insights || [],
      recommendations: parsed.recommendations || []
    };
  } catch (error) {
    console.warn('Failed to parse structured response:', error);

    // Fallback: try to use raw content
    const rawContent = response?.message?.content || '';
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

    const language = config.language || 'English';
    const systemPrompt = getSystemPrompt(language);
    const userPrompt = getUserPrompt(stocks, config.customPrompt);
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
