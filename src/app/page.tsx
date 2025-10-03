'use client';

import { useAtom } from 'jotai';
import AISelector from './components/AISelector';
import AnalysisDisplay from './components/AnalysisDisplay';
import PortfolioInput from './components/PortfolioInput';
import PortfolioList from './components/PortfolioList';
import { analyzePortfolio } from './services/aiService';
import { AIConfig, AnalysisResult, Stock } from './types';
import { stocksAtom, nasdaqApiKeyAtom, resultAtom } from './store/atoms';

export default function Home() {
  const [stocks, setStocks] = useAtom(stocksAtom);
  const [nasdaqApiKey, setNasdaqApiKey] = useAtom(nasdaqApiKeyAtom);
  const [result, setResult] = useAtom<AnalysisResult>(resultAtom);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = { ...stock, id: Date.now().toString() };
    setStocks([...stocks, newStock]);
  };

  const removeStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  const handleAnalyze = async (config: AIConfig) => {
    const analysis = await analyzePortfolio(stocks, config);
    setResult(analysis);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
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
        <AnalysisDisplay result={result} />
      </main>
    </div>
  );
}