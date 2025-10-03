'use client';

import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { FINNHUB_API_KEYAtom } from '../store/atoms';

interface Props {
  ticker: string;
}

interface ChartDataPoint {
  date: string;
  open: number | null;
  high: number | null;
  low: number | null;
  close: number | null;
  volume: number | null;
}

const StockDetail: React.FC<Props> = ({ ticker }) => {
  const [apiKey] = useAtom(FINNHUB_API_KEYAtom);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker]); // Removed apiKey dependency since it's server-side now

  // Handle back navigation safely
  const handleBackNavigation = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.history.pushState(null, '', '/');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get(
        `/api/finnhub/candles?symbol=${ticker}&resolution=D&from=${Math.floor(new Date(startDate).getTime() / 1000)}&to=${Math.floor(new Date(endDate).getTime() / 1000)}`
      );

      const finnhubData = response.data;

      if (!finnhubData.c || finnhubData.c.length === 0) {
        throw new Error('No data available for this ticker');
      }

      const timestamps = finnhubData.t;
      const openPrices = finnhubData.o;
      const highPrices = finnhubData.h;
      const lowPrices = finnhubData.l;
      const closePrices = finnhubData.c;
      const volumes = finnhubData.v;

      const chartData = timestamps.map((timestamp: number, index: number) => ({
        date: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: openPrices[index] || null,
        high: highPrices[index] || null,
        low: lowPrices[index] || null,
        close: closePrices[index] || null,
        volume: volumes[index] || null,
      })).filter((item: ChartDataPoint) => item.close !== null);

      if (chartData.length === 0) {
        throw new Error('No data available for the selected date range');
      }

      setData(chartData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error: ${errorMessage}. Please check ticker symbol.`);
    } finally {
      setLoading(false);
    }
  };

  if (!apiKey) {
    return (
      <div className="stock-detail p-4">
        <h2 className="text-2xl font-bold">{ticker} Stock Chart</h2>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            ⚠️ Chart data unavailable. Please check your internet connection or try again later.
          </p>
        </div>
      </div>
    );
  }
  if (loading) return <div className="p-4">Loading {ticker} chart...</div>;
  if (error) return <div className="p-4 text-red-700">{error}</div>;

  return (
    <div className="stock-detail p-4">
      <div className="relative">
        <button
          onClick={handleBackNavigation}
          className="btn-back"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center">
          {ticker} Stock Chart
        </h2>
      </div>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          📊 Powered by Finnhub • Showing {data.length} data points from {startDate} to {endDate}
        </p>
      </div>
      <div className="date-range flex gap-2 my-4 justify-center flex-wrap">
        <label className="flex flex-col">
          Start:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate}
            className="p-2 border rounded"
          />
        </label>
        <label className="flex flex-col">
          End:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={new Date().toISOString().split('T')[0]}
            className="p-2 border rounded"
          />
        </label>
        <button onClick={fetchData} className="btn-primary self-end">
          Update Chart
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: number, name: string) => [
              name === 'volume' ? `${value.toLocaleString()}` : `$${value.toFixed(2)}`,
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" strokeWidth={2} name="Close" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="open" stroke="#82ca9d" strokeWidth={1} name="Open" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="high" stroke="#ff7300" strokeWidth={1} name="High" dot={false} />
          <Line yAxisId="left" type="monotone" dataKey="low" stroke="#ff0000" strokeWidth={1} name="Low" dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {/* <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Tips:</strong> Use the date range picker to focus on specific periods. Zoom in on the chart for detailed analysis.
        </p>
      </div> */}
    </div>
  );
};

export default StockDetail;