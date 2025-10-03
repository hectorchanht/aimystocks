'use client';

import React from 'react';
import Link from 'next/link';
import { Stock } from '../types';

interface Props {
  stocks: Stock[];
  onRemoveStock: (id: string) => void;
  nasdaqApiKey: string;
}

const PortfolioList: React.FC<Props> = ({ stocks, onRemoveStock, nasdaqApiKey }) => {
  return (
    <div className="portfolio-list my-4">
      <h2 className="text-xl font-bold">Your Portfolio</h2>
      <ul className="list-none p-0">
        {stocks.map((stock) => (
          <li key={stock.id} className="flex justify-between items-center p-2 border my-1 rounded">
            <Link href={`/stock/${stock.ticker}?key=${nasdaqApiKey}`} className="text-blue-600 hover:underline">
              <strong>{stock.ticker}</strong> - Qty: {stock.quantity} - Price: ${stock.price.toFixed(2)} ({stock.type}) - Date: {new Date(stock.date).toLocaleDateString()}
            </Link>
            <button onClick={() => onRemoveStock(stock.id)} className="p-1 bg-red-500 text-white rounded ml-2">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PortfolioList;