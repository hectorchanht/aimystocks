'use client';

import React, { useState } from 'react';
import { Stock, StockType } from '../types';

interface Props {
  onAddStock: (stock: Omit<Stock, 'id'>) => void;
}

const PortfolioInput: React.FC<Props> = ({ onAddStock }) => {
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<StockType>(StockType.Buy);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker || quantity <= 0 || price <= 0) return;
    onAddStock({ ticker: ticker.toUpperCase(), quantity, price, date, type });
    setTicker('');
    setQuantity(0);
    setPrice(0);
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="my-4 max-w-md mx-auto">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        <span>{isExpanded ? 'Hide' : 'Add New Stock'}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="portfolio-input flex flex-col gap-4 mt-4 p-4 border rounded-lg shadow-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="ticker" className="text-sm font-medium">Ticker Symbol</label>
        <input 
          id="ticker"
          type="text" 
          placeholder="e.g., AAPL" 
          value={ticker} 
          onChange={(e) => setTicker(e.target.value)} 
          required 
          className="p-2 border rounded" 
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="quantity" className="text-sm font-medium">Quantity</label>
        <input 
          id="quantity"
          type="number" 
          placeholder="Number of shares" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
          required 
          min="1" 
          className="p-2 border rounded" 
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="price" className="text-sm font-medium">Price per Share</label>
        <input 
          id="price"
          type="number" 
          placeholder="Price in USD" 
          value={price} 
          onChange={(e) => setPrice(Number(e.target.value))} 
          required 
          min="0" 
          step="0.01" 
          className="p-2 border rounded" 
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label htmlFor="date" className="text-sm font-medium">Transaction Date</label>
        <input 
          id="date"
          type="date" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          className="p-2 border rounded" 
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Transaction Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType(StockType.Buy)}
            className={`flex-1 p-2 border rounded transition-colors ${
              type === StockType.Buy
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-green-500'
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setType(StockType.Sell)}
            className={`flex-1 p-2 border rounded transition-colors ${
              type === StockType.Sell
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-red-500'
            }`}
          >
            Sell
          </button>
        </div>
      </div>
      
      <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
        Add Stock
      </button>
    </form>
      )}
    </div>
  );
};

export default PortfolioInput;