# Implementation Guide for AI Coders

## 🎯 Quick Start for New Developers

This guide helps you understand and extend the AImySTOCKS codebase.

## 📋 Prerequisites

- Node.js 18+ installed
- Basic knowledge of React, TypeScript, Next.js
- Understanding of state management (Jotai)
- Familiarity with Tailwind CSS

## 🛠️ Development Setup

```bash
# Clone and install
git clone <repository-url>
cd aimystocks
npm install

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

## 🔑 Key Concepts

### 1. State Management with Jotai

**Creating a new atom:**
```typescript
// src/app/store/atoms.ts
import { atomWithStorage } from 'jotai/utils';

export const myNewAtom = atomWithStorage<string>('storage-key', 'default-value');
```

**Using an atom in a component:**
```typescript
import { useAtom } from 'jotai';
import { myNewAtom } from '../store/atoms';

const MyComponent = () => {
  const [value, setValue] = useAtom(myNewAtom);
  
  return (
    <input 
      value={value} 
      onChange={(e) => setValue(e.target.value)} 
    />
  );
};
```

### 2. Type Definitions

**All types are in `/src/app/types/index.ts`:**
```typescript
export interface Stock {
  id: string;
  ticker: string;
  quantity: number;
  price: number;
  date: string;
  type: StockType;
}

export interface AIConfig {
  service: 'gemini' | 'grok' | 'chatgpt';
  apiKey: string;
  customPrompt?: string;
  language?: string;
}

export interface AnalysisResult {
  analysis: string;
  insights?: string[];
  recommendations?: string[];
  error?: string;
}
```

### 3. AI Service Integration

**Location:** `/src/app/services/aiService.ts`

**Key Functions:**

```typescript
// Main analysis function
analyzePortfolio(stocks: Stock[], config: AIConfig): Promise<AnalysisResult>

// System prompt generator
getSystemPrompt(language: string): string

// User prompt generator
getUserPrompt(stocks: Stock[], service: string, customPrompt?: string): string

// Response parser
parseAIResponse(rawResponse: string): AnalysisResult
```

**Adding a new AI service:**

1. Update `AIConfig` type in `types/index.ts`:
```typescript
export interface AIConfig {
  service: 'gemini' | 'grok' | 'chatgpt' | 'claude'; // Add new service
  // ...
}
```

2. Add case in `analyzePortfolio` function:
```typescript
case 'claude':
  response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-3-sonnet-20240229',
      messages: [
        { role: 'user', content: fullPrompt }
      ],
      max_tokens: 1000
    },
    { headers: { 'x-api-key': config.apiKey } }
  );
  return parseAIResponse(response.data.content[0].text);
```

3. Add UI button in `AISelector.tsx`:
```typescript
<button
  type="button"
  onClick={() => setService('claude')}
  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${
    service === 'claude'
      ? 'border-purple-500 shadow-md'
      : 'border-gray-300 hover:border-purple-400'
  }`}
>
  <ClaudeIcon />
  <span className="text-sm font-medium">Claude</span>
</button>
```

## 🎨 Adding New Components

### Component Template

```typescript
'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { myAtom } from '../store/atoms';

interface Props {
  // Define props
}

const MyComponent: React.FC<Props> = ({ /* props */ }) => {
  const [state, setState] = useAtom(myAtom);

  const handleAction = () => {
    // Handle logic
  };

  return (
    <div className="my-component">
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Styling Guidelines

**Use Tailwind CSS classes:**
```typescript
// Good
<div className="p-4 rounded-lg border shadow-sm">

// Avoid inline styles
<div style={{ padding: '1rem' }}>
```

**Common patterns:**
```typescript
// Card
<div className="p-6 rounded-lg border shadow-sm">

// Button
<button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">

// Input
<input className="w-full p-2 border rounded" />

// Label
<label className="text-sm font-medium mb-2 block">
```

## 🔄 Common Tasks

### Task 1: Add a New Stock Field

1. **Update Type:**
```typescript
// src/app/types/index.ts
export interface Stock {
  // ... existing fields
  sector?: string; // NEW
}
```

2. **Update Input Form:**
```typescript
// src/app/components/PortfolioInput.tsx
const [sector, setSector] = useState('');

// Add input field
<input 
  value={sector} 
  onChange={(e) => setSector(e.target.value)} 
/>

// Update onAddStock call
onAddStock({ ticker, quantity, price, date, type, sector });
```

3. **Update Display:**
```typescript
// src/app/components/PortfolioList.tsx
<div>Sector: {stock.sector}</div>
```

### Task 2: Add a New Language

```typescript
// src/app/components/AISelector.tsx
const LANGUAGES = [
  // ... existing languages
  'Vietnamese', // NEW
  'Thai',       // NEW
import { useAtomValue } from 'jotai';

const MyDebugComponent = () => {
  const stocks = useAtomValue(stocksAtom);
  console.log('Stocks from atom:', stocks);
  return null;
};
```

### Task 3: Modify Analysis Prompt

The system prompt can be customized in `/src/app/services/puterAIService.ts`:

```typescript
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
```

**Key Changes:**
- ✅ **Real-time Data Requirement**: AI must fetch current stock prices and news
- ✅ **Current Market Focus**: Analysis based on today's market data, not historical prices
- ✅ **Enhanced Analysis Structure**: More detailed sections for current market context
- ✅ **Increased Word Limit**: 800 words to accommodate comprehensive current data analysis

### 3. Error Handling & API Issues

#### Alpha Vantage API Integration

The application now uses Alpha Vantage API for real-time market data:

```typescript
// Fetch market data from Alpha Vantage
const apiKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY || process.env.ALPHAVANTAGE_API_KEY;

const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;

const response = await fetch(url);
const data = await response.json();

// Transform to consistent format
if (data['Global Quote']) {
  const quote = data['Global Quote'];
  return {
    symbol: quote['01. symbol'],
    regularMarketPrice: parseFloat(quote['05. price']),
    regularMarketChange: parseFloat(quote['09. change']),
    regularMarketChangePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    // ... other fields
  };
}
```

**Important Notes:**
- ✅ **API Key Required**: Set `ALPHAVANTAGE_API_KEY` in `.env` file
- ✅ **Rate Limited**: 5 API calls per minute on free tier
- ✅ **Sequential Fetching**: Fetches one symbol at a time to respect rate limits
- ✅ **Error Handling**: Graceful fallback if API fails or reaches limits

**Getting an Alpha Vantage API Key:**
1. Visit [https://www.alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file as `ALPHAVANTAGE_API_KEY=your_key_here`

**API Response Format (New V2 Format):**
```json
{
  "success": true,
  "service": {
    "name": "ai-chat"
  },
  "result": {
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "{\"analysis\": \"...\", \"insights\": [...], \"recommendations\": [...]}",
      "refusal": null,
      "annotations": []
    },
    "logprobs": null,
    "finish_reason": "stop",
    "usage": [
      {
        "type": "prompt",
        "model": "gpt-4.1-nano",
        "amount": 679,
        "cost": 6790
      }
    ],
    "via_ai_chat_service": true
  },
  "metadata": {
    "service_used": "openai-completion"
  }
}
```

**API Response Format (Legacy V1 Format):**
```json
{
  "index": 0,
  "message": {
    "role": "assistant",
    "content": "{\"analysis\": \"...\", \"insights\": [...], \"recommendations\": [...]}",
    "refusal": null,
    "annotations": []
  },
  "logprobs": null,
  "finish_reason": "stop",
  "usage": [
    {
      "type": "prompt",
      "model": "gpt-4.1-nano",
      "amount": 679,
      "cost": 6790
    }
  ],
  "via_ai_chat_service": true
}
```

**Backward Compatibility:**
- ✅ **Dual Format Support**: Handles both V1 and V2 API response formats
- ✅ **Automatic Detection**: Identifies response format and parses accordingly
- ✅ **Graceful Fallbacks**: Falls back to raw content if JSON parsing fails
- ✅ **Error Handling**: Comprehensive error handling for both formats

#### General API Error Handling
```typescript
try {
  const result = await analyzePortfolio(stocks, config);
} catch (error) {
  console.error('Analysis failed:', error);
  // Check error.response for API errors
}
```

### 4. Adding Dependencies

```bash
# Install new package
npm install package-name

# Install dev dependency
npm install -D package-name

# Update package.json manually if needed
```

## 🎯 Best Practices

### 1. Component Organization
- One component per file
- Keep components small and focused
- Extract reusable logic into hooks
- Use TypeScript interfaces for props

### 2. State Management
- Use Jotai atoms for global state
- Use useState for local component state
- Persist important data with `atomWithStorage`
- Don't duplicate state

### 4. API Error Handling
- Always handle API errors
- Show user-friendly error messages
- Log errors for debugging
- Provide fallback UI
- Use `useErrorBoundary` to catch unexpected errors

{{ ... }}
- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Lazy load heavy components
- Optimize images and assets

### 5. Accessibility
- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen readers

## 🔍 Code Review Checklist

Before submitting changes:

- [ ] TypeScript types are correct
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] UI is responsive on mobile
- [ ] LocalStorage keys follow naming convention
- [ ] Code follows existing patterns
- [ ] Comments explain complex logic
- [ ] No hardcoded values (use constants)
- [ ] Tailwind classes are used (no inline styles)
- [ ] Component is exported properly

## 📚 Useful Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Jotai Docs](https://jotai.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### AI API Documentation
- [OpenAI API](https://platform.openai.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [xAI Grok API](https://docs.x.ai/)

## 🆘 Common Issues & Solutions

### Issue: "Cannot find module"
**Solution:** Run `npm install` to install dependencies

### Issue: LocalStorage not persisting
**Solution:** Check browser privacy settings, ensure `atomWithStorage` is used

### Issue: AI API returns error
**Solution:** Verify API key is correct, check API quota/limits

### Issue: TypeScript errors
**Solution:** Ensure all types are imported, check type definitions match usage

### Issue: Styles not applying
**Solution:** Check Tailwind class names, ensure globals.css is imported

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Deploy to Vercel (recommended)
vercel deploy
```

## 📞 Getting Help

1. Check existing documentation in `/docs`
2. Review similar components in codebase
3. Check browser console for errors
4. Review Git history for context
5. Ask team members or create an issue
