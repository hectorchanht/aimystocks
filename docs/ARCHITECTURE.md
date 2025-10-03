# AImySTOCKS Architecture Documentation

## 🏗️ Project Structure

```
aimystocks/
├── src/app/
│   ├── components/          # React components
│   │   ├── AISelector.tsx   # AI service & language selector
│   │   ├── AnalysisDisplay.tsx  # Results display with insights
│   │   ├── PortfolioInput.tsx   # Stock entry form (collapsible)
│   │   ├── PortfolioList.tsx    # Stock list display
│   │   ├── StockDetail.tsx      # Individual stock details
│   │   └── svgs/                # Icon components
│   ├── services/            # Business logic
│   │   └── aiService.ts     # AI API integration
│   ├── store/               # State management
│   │   └── atoms.ts         # Jotai atoms with localStorage
│   ├── types/               # TypeScript interfaces
│   │   └── index.ts         # Type definitions
│   ├── stock/[ticker]/      # Dynamic stock routes
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🧩 Component Architecture

### State Management (Jotai)
All state is managed through Jotai atoms with localStorage persistence:

- **`stocksAtom`** - Portfolio stock list
- **`apiKeyAtom`** - AI service API key
- **`customPromptAtom`** - Additional analysis context
- **`languageAtom`** - Analysis output language
- **`aiServiceAtom`** - Selected AI service (ChatGPT/Gemini/Grok)
- **`nasdaqApiKeyAtom`** - Nasdaq API key for charts
- **`resultAtom`** - Analysis results with insights & recommendations

### Component Hierarchy

```
page.tsx (Main Container)
├── PortfolioInput (Collapsible Form)
├── PortfolioList (Stock Display)
│   └── StockDetail (Individual Stock)
├── AISelector (AI Configuration)
│   ├── Service Buttons (ChatGPT/Gemini/Grok)
│   ├── API Key Input
│   ├── Language Selector
│   └── Custom Prompt Textarea
└── AnalysisDisplay (Results)
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
                    analyzePortfolio(stocks, config)
                              ↓
                    AI Service API Call
                              ↓
                    parseAIResponse() → JSON extraction
                              ↓
                    resultAtom → localStorage
                              ↓
                    AnalysisDisplay Render
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

#### 1. OpenAI ChatGPT
```typescript
POST https://api.openai.com/v1/chat/completions
Model: gpt-4o-mini
Headers: Authorization: Bearer {apiKey}
```

#### 2. Google Gemini
```typescript
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
Query: ?key={apiKey}
```

#### 3. xAI Grok
```typescript
POST https://api.x.ai/v1/chat/completions
Model: grok-beta
Headers: Authorization: Bearer {apiKey}
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
aimystocks-apikey          → AI API key
aimystocks-customprompt    → Custom analysis context
aimystocks-language        → Selected language
aimystocks-aiservice       → Selected AI service
aimystocks-nasdaqapikey    → Nasdaq API key
aimystocks-result          → Analysis results
```

### Persistence Strategy
- Jotai `atomWithStorage` automatically syncs with localStorage
- Data persists across browser sessions
- No backend database required
- Client-side only architecture

## 🔒 Security Considerations

### API Keys
- Stored in localStorage (client-side only)
- Never sent to any backend server
- Direct API calls from browser to AI services
- Users responsible for their own API key security

### Best Practices
- Use password input type for API keys
- Clear sensitive data on logout (future feature)
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

### Caching
- LocalStorage acts as client-side cache
- Analysis results cached until next analysis
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
2. **Real-time Stock Data**: Live price updates
3. **Portfolio Comparison**: Compare multiple portfolios
4. **Export Reports**: PDF/CSV export
5. **Dark Mode**: Theme toggle
6. **Notifications**: Price alerts
7. **Social Sharing**: Share analysis results
8. **Historical Analysis**: Track analysis over time
