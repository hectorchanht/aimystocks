'use client';

import { useParams } from 'next/navigation';
import StockDetail from '../../components/StockDetail';

export default function StockPage() {
  const params = useParams();
  const ticker = params?.ticker as string || ''; // Get ticker from route parameter

  return <StockDetail ticker={ticker} />;
}