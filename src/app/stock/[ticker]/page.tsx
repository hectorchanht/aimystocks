'use client';

import { useSearchParams } from 'next/navigation';
import StockDetail from '../../components/StockDetail';

export default function StockPage() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get('ticker') || ''; // Fallback
  const apiKey = searchParams.get('key') || '';

  return <StockDetail ticker={ticker} apiKey={apiKey} />;
}