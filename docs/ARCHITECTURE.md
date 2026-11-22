# AImySTOCKS Architecture Documentation

## 🏗️ Project Structure

```
aimystocks/
├── src/app/
│   ├── components/          # React components
│   │   ├── AISelector.tsx   # AI service & language selector
│   │   ├── AnalysisDisplay.tsx  # Results display with insights
│   │   ├── LoadingSkeleton.tsx  # Loading state skeleton
│   │   ├── PortfolioInput.tsx   # Stock entry form (collapsible)
│   │   ├── PortfolioList.tsx    # Stock list display
│   │   ├── StockDetail.tsx      # Yahoo Finance chart integration
│   │   └── svgs/                # Icon components
│   ├── services/            # Business logic
│   │   ├── aiService.ts     # AI API integration (deprecated)
│   │   └── puterAIService.ts # Puter.js AI integration
│   ├── store/               # State management
│   │   └── atoms.ts         # Jotai atoms with localStorage
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # Type definitions
│   ├── stock/[ticker]/      # Dynamic stock routes
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main page with currency banner
│   └── globals.css          # Global styles
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🧩 Component Architecture

### State Management (Jotai)
All state is managed through Jotai atoms with localStorage persistence:

- **`stocksAtom`** - Portfolio stock list
- **`customPromptAtom`** - Additional analysis context
- **`ALPHAVANTAGE_API_KEYAtom`** - Alpha Vantage API key (optional)
- **`languageAtom`** - Analysis output language
- **`resultAtom`** - Analysis results with insights & recommendations
- **`isAnalyzingAtom`** - Loading state for analysis

### Component Hierarchy

```
page.tsx (Main Container)
├── Currency Banner (External link to moneyrate.lol)
├── PortfolioInput (Collapsible Form)
├── PortfolioList (Stock Display)
│   └── StockDetail (Yahoo Finance Charts)
├── AISelector (AI Configuration)
│   ├── Language Selector (12 languages)
│   └── Custom Prompt Textarea (Optional context)
└── AnalysisDisplay (Results)
    ├── LoadingSkeleton (During analysis)
    ├── Main Analysis Card
    ├── Insights Section (Blue)
    └── Recommendations Section (Green)
```

## 🔄 Data Flow

### 1. Stock Management Flow
```
User Input → PortfolioInput → stocksAtom → localStorage
                                    ↓
                            PortfolioList Display
```

### 2. Analysis Flow
```
User Config → AISelector → handleAnalyze()
                              ↓
                    analyzePortfolioWithPuter(stocks, config)
                              ↓
                    Extract ticker symbols from portfolio
                              ↓
                    fetchMarketData(symbols) → Alpha Vantage API
                              ↓
                    Puter.js AI API Call (GPT-5 nano) + Market Data
                              ↓
                    parseAIResponse() → Structured JSON extraction
                              ↓
                    resultAtom → localStorage
                              ↓
                    AnalysisDisplay Render
```

### 3. Stock Chart Flow
```
Stock Click → StockDetail → fetchData()
                              ↓
                    Yahoo Finance API Call (Free, no key needed)
                              ↓
                    Chart Data → Recharts Visualization
                              ↓
                    Interactive Chart Display
```

## 🎨 Design System

### Typography
- **Body Font**: Inter (Google Fonts)
- **Heading Font**: Space Grotesk (Google Fonts)
- Modern, futuristic, minimalistic aesthetic

### Color Scheme
- **Primary**: Blue (#3B82F6) - Insights, primary actions
- **Success**: Green (#10B981) - Recommendations, buy actions
- **Danger**: Red (#EF4444) - Sell actions, errors
- **Neutral**: Gray scale for text and borders

### UI Patterns
- **Cards**: Rounded borders with subtle shadows
- **Buttons**: Hover states with smooth transitions
- **Forms**: Labeled inputs with validation
- **Icons**: SVG icons for visual clarity

## 🔌 API Integration

### AI Services

#### Puter.js AI (Primary)
```typescript
// No API key required!
window.puter.ai.chat(prompt) // Returns structured response
```

### Stock Data Services

#### Alpha Vantage API (Primary)
```typescript
GET https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={API_KEY}
// Requires API key authentication (ALPHAVANTAGE_API_KEY in .env)
// Returns real-time stock quotes with price, volume, and change data
// Rate limited to 5 calls per minute on free tier
// Supports stocks, forex, crypto, and economic indicators
```

#### Yahoo Finance API (Charts)
```typescript
GET https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?period1={start}&period2={end}&interval=1d
// Free API (no authentication required)
// Returns historical OHLCV data for stock charts
// Supports 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max periods
```

### Response Format
All AI services return structured JSON:
```json
{
  "analysis": "Full markdown analysis...",
  "insights": ["Insight 1", "Insight 2", "Insight 3"],
  "recommendations": ["Rec 1", "Rec 2", "Rec 3"]
}
```

## 🌐 Multi-Language Support

### Supported Languages
English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, Arabic, Russian, Hindi

### Implementation
- Language preference stored in `languageAtom`
- System prompt dynamically generated with language instruction
- AI responds entirely in selected language
- No translation service needed - native AI generation

## 💾 Data Persistence

### LocalStorage Keys
```
aimystocks-stocks          → Stock portfolio
aimystocks-customprompt    → Custom analysis context
aimystocks-alphavantage    → Alpha Vantage API key (optional)
aimystocks-language        → Selected language
aimystocks-result          → Analysis results
```

### Persistence Strategy
- Jotai `atomWithStorage` automatically syncs with localStorage
- Data persists across browser sessions
- No backend database required
- Client-side only architecture

## 🔒 Security Considerations

### API Keys
- ~~Stored in localStorage (client-side only)~~ (No longer needed for primary features)
- ~~Never sent to any backend server~~
- ~~Direct API calls from browser to AI services~~
- ~~Users responsible for their own API key security~~

### Current Security Model
- **Puter.js**: No API keys required - completely free
- **Yahoo Finance**: No authentication needed - public API
- **Alpha Vantage**: API key optional for enhanced market data
- **LocalStorage**: Only user data and preferences stored
- **No Tracking**: No analytics or user data collection

### Best Practices
- API keys stored in environment variables when used
- Clear sensitive data on component unmount (future enhancement)
- Validate inputs before API calls
- Handle API errors gracefully

## 🚀 Performance Optimizations

### Code Splitting
- Next.js automatic code splitting
- Dynamic imports for heavy components
- Route-based splitting for stock details

### State Management
- Jotai atoms are lightweight and performant
- Only re-render components that use changed atoms
- No prop drilling needed

### Loading States
- Interactive loading feedback during analysis
- Skeleton loading components for better UX
- Disabled buttons during async operations
- Spinner animations for visual feedback

### Caching
- LocalStorage acts as client-side cache
- Analysis results cached until next analysis
- User preferences cached
- Font optimization with Next.js font loader

## 🧪 Testing Strategy (Future)

### Recommended Tests
1. **Unit Tests**: Individual component logic
2. **Integration Tests**: API service calls
3. **E2E Tests**: Full user workflows
4. **Accessibility Tests**: WCAG compliance

### Tools Suggestion
- Jest + React Testing Library
- Playwright for E2E
- Axe for accessibility

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Collapsible forms to save space
- Touch-friendly button sizes
- Readable font sizes
- Stacked layouts on small screens

## 🔮 Future Enhancements

### Potential Features
1. **User Authentication**: Save portfolios to cloud
2. **Real-time Stock Data**: Live price updates with WebSocket
3. **Portfolio Comparison**: Compare multiple portfolios
4. **Export Reports**: PDF/CSV export functionality
5. **Dark Mode**: Theme toggle for better accessibility
6. **Notifications**: Price alerts and analysis updates
7. **Social Sharing**: Share analysis results and portfolios
8. **Historical Analysis**: Track analysis over time with charts
9. **Mobile App**: Native iOS/Android apps with offline support
10. **Advanced AI Features**: Sentiment analysis and news integration
