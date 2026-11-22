# Puter.js + Alpha Vantage Integration

## 🎉 Free AI Analysis with Real-Time Market Data!

AImySTOCKS now uses **Puter.js** for AI-powered portfolio analysis combined with **Alpha Vantage** for real-time market data - all without requiring API keys for the core functionality!

## What is Puter.js?

[Puter.js](https://puter.com) is a JavaScript library that provides free access to AI models (GPT-5 nano) without requiring API keys, backend servers, or configuration. It's perfect for client-side applications that need AI capabilities.

## Benefits

✅ **No AI API Keys** - Users don't need OpenAI, Google, or xAI accounts for analysis
✅ **Free AI Analysis** - Powered by Puter's free tier
✅ **Real-Time Market Data** - Alpha Vantage provides current stock prices and metrics
✅ **No Backend** - Everything runs in the browser
✅ **Easy Integration** - Just one script tag for Puter.js
✅ **Professional Data** - Alpha Vantage is a dedicated financial data provider  

## Implementation Details

### 1. Installation

Added Puter.js script to the app layout:

```typescript
// src/app/layout.tsx
<head>
  <script src="https://js.puter.com/v2/" async></script>
</head>
```

### 2. Market Data Integration

Integrated Alpha Vantage API for real-time market data:

```typescript
// src/app/services/puterAIService.ts
const apiKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY || process.env.ALPHAVANTAGE_API_KEY;

const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

const response = await fetch(url);
const data = await response.json();

// Transform to consistent format for AI analysis
```

### 3. Updated Components

**AISelector.tsx:**
- Removed API key input field
- Added "No API Key Required!" badge
- Simplified user experience

**page.tsx:**
- Integrated Alpha Vantage market data fetching
- Enhanced prompts with real-time market context
- Updated analysis flow to include current market data

### 4. Type Definitions

Added comprehensive type definitions for Puter AI API:

```typescript
interface PuterAIResponse {
  index: number;
  message: PuterAIMessage;
  logprobs: unknown | null;
  finish_reason: string;
  usage: PuterAIUsage[];
  via_ai_chat_service: boolean;
}

interface PuterAIMessage {
  role: string;
  content: string;
  refusal: string | null;
  annotations: unknown[];
}
```

### 5. Response Parsing

Updated to handle both legacy and new structured response formats:

```typescript
const parseAIResponse = (response: PuterAIResponse | PuterAIResponseV2): AnalysisResult => {
  try {
    // Handle new API format (V2)
    if ('success' in response && response.success) {
      const content = response.result?.message?.content;

      if (!content) {
        throw new Error('No content in V2 response');
      }

      // Parse JSON content
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

      // Parse JSON content
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

    // Fallback to raw content
    const rawContent = response.result?.message?.content || response.message?.content || '';
    return {
      analysis: rawContent,
      insights: [],
      recommendations: []
    };
  }
};
```

**Response Format Evolution:**
- **Legacy V1**: Direct response with message content
- **New V2**: Wrapped in success/service/result structure with metadata

## How It Works

1. **User adds stocks** to their portfolio
2. **User clicks "Analyze Portfolio"** (no API key needed!)
3. **Alpha Vantage API** fetches real-time market data for all symbols
4. **Puter.js loads** (if not already loaded)
5. **AI analysis request** sent to Puter's GPT-5 nano with market data
6. **Structured response** parsed and displayed

## Features Retained

All existing features still work:

- ✅ Multi-language support (12 languages)
- ✅ Custom prompts for additional context
- ✅ Structured output (analysis, insights, recommendations)
- ✅ Beautiful markdown rendering
- ✅ LocalStorage persistence

## Migration from Old System

### Before (with multiple API keys):
```typescript
const handleAnalyze = async (config: AIConfig) => {
  if (!config.apiKey) return alert('Please enter API key');
  const analysis = await analyzePortfolio(stocks, config);
  setResult(analysis);
};
```

### After (with Puter.js + Alpha Vantage):
```typescript
const handleAnalyze = async (config: AIConfig) => {
  // No API key check needed for AI analysis!
  // Alpha Vantage API key is optional for enhanced market data
  const analysis = await analyzePortfolioWithPuter(stocks, config);
  setResult(analysis);
};
```

## User Experience

### Old Flow:
1. Select AI service (ChatGPT/Gemini/Grok)
2. Enter API key ❌
3. Configure language and prompts
4. Analyze

### New Flow:
1. ~~Select AI service~~ (uses Puter's GPT-5 nano)
2. ~~Enter API key~~ ✅ **Not needed for AI analysis!**
3. **Optional**: Add Alpha Vantage API key for enhanced market data
4. Configure language and prompts
5. Analyze with real-time market data

## Technical Notes

### Async Loading
Puter.js loads asynchronously. The `waitForPuter()` function ensures it's ready. Alpha Vantage API calls are made sequentially to respect rate limits:

```typescript
// Wait for Puter.js
await waitForPuter();

// Fetch market data with rate limiting
for (const symbol of symbols) {
  const marketData = await fetchMarketData(symbol);
  // 15-second delay between requests (5 calls/minute limit)
  await new Promise(resolve => setTimeout(resolve, 15000));
}
```

### Error Handling
Enhanced error handling for both Puter.js and Alpha Vantage APIs:

```typescript
try {
  // Wait for Puter.js and fetch market data
  await waitForPuter();
  const marketData = await fetchMarketData(symbols);

  // Send to AI with market data context
  const response = await window.puter.ai.chat(fullPrompt);
  return parseAIResponse(response); // Handles both V1 and V2 formats
} catch (error: unknown) {
  const errorMessage = error instanceof Error
    ? error.message
    : 'Failed to analyze with Puter AI.';
  return { analysis: '', error: errorMessage };
}
```

## Limitations

- **Model Choice**: Currently uses GPT-5 nano (can't switch to Gemini/Grok)
- **Rate Limits**: Subject to Puter's free tier limits and Alpha Vantage's 5 calls/minute
- **Internet Required**: Needs connection to both Puter's servers and Alpha Vantage API
- **API Key Optional**: Alpha Vantage API key enhances market data but works without it

## Future Enhancements

Potential improvements:

1. **Enhanced Market Data**: Use Alpha Vantage premium features for more detailed analysis
2. **Multiple Data Sources**: Combine Alpha Vantage with other financial data providers
3. **Caching Strategy**: Cache market data to reduce API calls and improve performance
4. **Real-time Updates**: WebSocket connections for live market data streaming

## Resources

- [Puter.js Documentation](https://docs.puter.com/)
- [Puter.js Examples](https://docs.puter.com/examples/)
- [Puter.js Playground](https://docs.puter.com/playground/)
- [Puter GitHub](https://github.com/HeyPuter/puter)
- [Alpha Vantage Documentation](https://www.alphavantage.co/documentation/)
- [Alpha Vantage API Key](https://www.alphavantage.co/support/#api-key)

## Troubleshooting

### Puter not loading?
- Check internet connection
- Verify script tag in layout.tsx
- Check browser console for errors

### Analysis not working?
- Wait a few seconds for Puter to load
- Check if `window.puter` is defined in console
- Verify portfolio has stocks added
- Check Alpha Vantage API key if market data fails to load

### Market data not loading?
- Verify Alpha Vantage API key is set in `.env` file
- Check rate limits (5 calls per minute for free tier)
- Monitor browser console for API errors
- Consider network connectivity issues

### Slow responses?
- Normal for first request (Puter initialization)
- Alpha Vantage rate limiting may cause delays
- Subsequent requests should be faster
- Check network tab for API call status

---

**Migration Complete!** 🎉

Users can now analyze their portfolios without any API keys or configuration. Just add stocks and click analyze!
