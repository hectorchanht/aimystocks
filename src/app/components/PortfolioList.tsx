'use client';

import Link from 'next/link';
import React from 'react';
import { Stock, StockType } from '../types';

interface Props {
  stocks: Stock[];
  onRemoveStock: (id: string) => void;
  nasdaqApiKey?: string; // Now optional since we don't need it
}

const PortfolioList: React.FC<Props> = ({ stocks, onRemoveStock, nasdaqApiKey }) => {
  return (
    <div className="portfolio-list my-4">
      <h2 className="text-xl font-bold">Your Portfolio</h2>
      <ul className="list-none p-0">
        {stocks.map((stock) => (
          <li key={stock.id} className="flex justify-between items-center p-2 border my-1 rounded">
            <span className="flex gap-2">

              <span className={stock.type === StockType.Buy ? "px-1 bg-green-500 text-white rounded" : "px-1 bg-red-500 text-white rounded"}>{stock.type.toUpperCase()}</span>

              <strong>{stock.ticker}</strong> - Qty: {stock.quantity} - Price: ${stock.price.toFixed(2)}

            </span>
            <button onClick={() => onRemoveStock(stock.id)} className="p-1 bg-red-500 text-white rounded ml-2">Remove</button>
          </li>
        ))}
        <li className='text-lg font-bold mt-2 text-end'>
          Total Valuation: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stocks.reduce((total, stock) => total + stock.price * stock.quantity, 0))}
        </li>
      </ul>
    </div>
  );
};

export default PortfolioList;