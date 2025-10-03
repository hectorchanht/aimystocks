'use client';

import { useAtom } from 'jotai';
import AISelector from './components/AISelector';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSkeleton from './components/LoadingSkeleton';
import PortfolioInput from './components/PortfolioInput';
import PortfolioList from './components/PortfolioList';
import { analyzePortfolioWithPuter } from './services/puterAIService';
import { AIConfig, AnalysisResult, Stock } from './types';
import { stocksAtom, nasdaqApiKeyAtom, resultAtom, isAnalyzingAtom } from './store/atoms';

export default function Home() {
  const [stocks, setStocks] = useAtom(stocksAtom);
  const [nasdaqApiKey, setNasdaqApiKey] = useAtom(nasdaqApiKeyAtom);
  const [result, setResult] = useAtom<AnalysisResult>(resultAtom);
  const [isAnalyzing, setIsAnalyzing] = useAtom(isAnalyzingAtom);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = { ...stock, id: Date.now().toString() };
    setStocks([...stocks, newStock]);
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  const handleAnalyze = async (config: AIConfig) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzePortfolioWithPuter(stocks, config);
      setResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      {/* Currency Rate Banner */}
      <a
        href="https://moneyrate.lol/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg mb-4 text-center hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg group"
      >
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Check Live Currency Rates</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        <p className="text-xs mt-1 opacity-90">Visit moneyrate.lol for real-time currency exchange rates</p>
      </a>

      <header className="w-full max-w-2xl bg-gray-800 text-white p-4 rounded mb-4 text-center">
        <h1 className="text-3xl font-bold">AImySTOCKS</h1>
        <p>AI-Powered Stock Portfolio Analyzer</p>
      </header>
      <main className="w-full max-w-2xl">
        <PortfolioInput onAddStock={addStock} />
        <PortfolioList stocks={stocks} onRemoveStock={removeStock} nasdaqApiKey={nasdaqApiKey} />
        <hr className="my-4" />
        <AISelector onAnalyze={handleAnalyze} />
        <input
          type="password"
          placeholder="Nasdaq API Key (for charts)"
          value={nasdaqApiKey}
          onChange={(e) => setNasdaqApiKey(e.target.value)}
          className="p-2 border rounded w-full mb-4"
        />
        {isAnalyzing ? <LoadingSkeleton /> : <AnalysisDisplay result={result} />}
      </main>
    </div>
  );
}