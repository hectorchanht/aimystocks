import axios from 'axios';
import { AIConfig, AnalysisResult, Stock } from '../types';

const CURRENT_DATE = '2025-10-02'; // Updated to query date

// Engineered System Prompt (role-playing, clarity, CoT, structured output)
const SYSTEM_PROMPT = `You are a senior financial analyst with 20+ years in portfolio management and AI-driven insights. Analyze portfolios objectively using data as of ${CURRENT_DATE}. Follow this chain-of-thought: 1) Summarize holdings and calculate metrics (e.g., total value, avg gain/loss per stock). 2) Identify trends (e.g., sector performance, volatility). 3) Assess risks (e.g., diversification, market exposure). 4) Provide actionable recommendations (e.g., buy/sell/hold with rationale). Output in concise Markdown with sections: ## Summary, ## Trends, ## Performance Metrics, ## Risks, ## Recommendations. Limit to 500 words. Be specific, data-driven, and professional.`;

// User Prompt (specificity, integrates custom context)
const getUserPrompt = (stocks: Stock[], service: string, customPrompt: string = '') => {
  const portfolioSummary = JSON.stringify(stocks, null, 2);
  let basePrompt = `Analyze this stock portfolio: ${portfolioSummary}.`;
  if (customPrompt) {
    basePrompt += `\nAdditional user context/instructions: ${customPrompt}`;
  }
  switch (service) {
    case 'grok':
      return `${basePrompt} Provide witty yet insightful analysis.`;
    case 'gemini':
      return `${basePrompt} Focus on multimodal patterns if applicable.`;
    case 'chatgpt':
    default:
      return `${basePrompt} Deliver expert, balanced insights.`;
  }
};

const analyzePortfolio = async (stocks: Stock[], config: AIConfig): Promise<AnalysisResult> => {
  if (stocks.length === 0) {
    return { analysis: 'No stocks in portfolio. Add some to analyze!', error: '' };
  }

  const userPrompt = getUserPrompt(stocks, config.service, config.customPrompt);
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

  try {
    let response;
    switch (config.service) {
      case 'gemini':
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.apiKey}`,
          { contents: [{ parts: [{ text: fullPrompt }] }] }
        );
        return { analysis: response.data.candidates[0].content.parts[0].text };

      case 'grok':
        response = await axios.post(
          'https://api.x.ai/v1/chat/completions',
          {
            model: 'grok-beta',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 800,
            temperature: 0.7
          },
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        );
        return { analysis: response.data.choices[0].message.content };

      case 'chatgpt':
        response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 800,
            temperature: 0.5
          },
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        );
        return { analysis: response.data.choices[0].message.content };

      default:
        throw new Error('Unsupported AI service');
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return { analysis: '', error: error.response?.data?.error?.message || 'Failed to analyze. Check API key/service.' };
  }
};

export { analyzePortfolio };