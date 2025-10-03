import axios from 'axios';
import { AIConfig, AnalysisResult, Stock } from '../types';

const CURRENT_DATE = '2025-10-02'; // Updated to query date

// Engineered System Prompt (role-playing, clarity, CoT, structured output)
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

// Helper function to parse AI response and extract structured data
const parseAIResponse = (rawResponse: string): AnalysisResult => {
  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = rawResponse.match(/```json\s*([\s\S]*?)\s*```/) || rawResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonStr = jsonMatch[1] || jsonMatch[0];
      const parsed = JSON.parse(jsonStr);
      return {
        analysis: parsed.analysis || rawResponse,
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || []
      };
    }
  } catch (error) {
    console.warn('Failed to parse structured response, using raw text');
  }
  
  // Fallback: return raw response as analysis
  return {
    analysis: rawResponse,
    insights: [],
    recommendations: []
  };
};

const analyzePortfolio = async (stocks: Stock[], config: AIConfig): Promise<AnalysisResult> => {
  if (stocks.length === 0) {
    return { analysis: 'No stocks in portfolio. Add some to analyze!', error: '' };
  }

  const language = config.language || 'English';
  const systemPrompt = getSystemPrompt(language);
  const userPrompt = getUserPrompt(stocks, config.service, config.customPrompt);
  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  try {
    let response;
    switch (config.service) {
      case 'gemini':
        response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${config.apiKey}`,
          { contents: [{ parts: [{ text: fullPrompt }] }] }
        );
        return parseAIResponse(response.data.candidates[0].content.parts[0].text);

      case 'grok':
        response = await axios.post(
          'https://api.x.ai/v1/chat/completions',
          {
            model: 'grok-beta',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 1000,
            temperature: 0.7
          },
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        );
        return parseAIResponse(response.data.choices[0].message.content);

      case 'chatgpt':
        response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            max_tokens: 1000,
            temperature: 0.5
          },
          { headers: { Authorization: `Bearer ${config.apiKey}` } }
        );
        return parseAIResponse(response.data.choices[0].message.content);

      default:
        throw new Error('Unsupported AI service');
    }
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return { analysis: '', error: error.response?.data?.error?.message || 'Failed to analyze. Check API key/service.' };
  }
};

export { analyzePortfolio };
