'use client';

import { useAtom } from 'jotai';
import Link from 'next/link';
import { useEffect } from 'react';
import AISelector from './components/AISelector';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSkeleton from './components/LoadingSkeleton';
import PortfolioInput from './components/PortfolioInput';
import PortfolioList from './components/PortfolioList';
import { analyzePortfolioWithPuter } from './services/puterAIService';
import { isAnalyzingAtom, resultAtom, stocksAtom } from './store/atoms';
import { AIConfig, AnalysisResult, Stock } from './types';


const CurrencyRateBanner = () => <Link
  href="https://moneyrate.lol/"
  target="_blank"
  rel="noopener noreferrer"
  className="w-full max-w-2xl shadow-md hover:shadow-lg group flex flex-col items-center gap-2 my-2"
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
</Link>;
 

export default function Home() {
  const [stocks, setStocks] = useAtom(stocksAtom);
  const [result, setResult] = useAtom<AnalysisResult>(resultAtom);
  const [isAnalyzing, setIsAnalyzing] = useAtom(isAnalyzingAtom);

  useEffect(() => {
    // API key is now handled server-side only, no client-side initialization needed
    console.log('AImySTOCKS application initialized');
  }, []);

  const addStock = (stock: Omit<Stock, 'id'>) => {
    const newStock: Stock = { ...stock, id: Date.now().toString() };
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
      <CurrencyRateBanner />

      <header className="w-full max-w-2xl relative overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 rounded-xl mb-4 text-center shadow-2xl border border-gray-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]"></div>
          <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/20 rounded-full blur-lg"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              AImySTOCKS
            </h1>
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-lg text-gray-300 font-medium">AI-Powered Stock Portfolio Analyzer</p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Free AI Analysis • Real-time Data • Multi-language</span>
          </div>
        </div>
      </header>
      <main className="w-full max-w-2xl">


        <PortfolioInput onAddStock={addStock} />
        <PortfolioList stocks={stocks} onRemoveStock={removeStock} />
        <hr className="my-4" />
        <AISelector onAnalyze={handleAnalyze} />
        {isAnalyzing ? <LoadingSkeleton /> : <AnalysisDisplay result={result} />}
      </main>
    </div>
  );
}