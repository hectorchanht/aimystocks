'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NasdaqStockData } from '../types';

interface Props {
  ticker: string;
  apiKey: string;
}

const StockDetail: React.FC<Props> = ({ ticker, apiKey }) => {
  const [data, setData] = useState<NasdaqStockData[]>([]);
  const [startDate, setStartDate] = useState('2024-10-02'); // Last year
  const [endDate, setEndDate] = useState('2025-10-02'); // Today
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!apiKey) {
      setError('Missing API key.');
      setLoading(false);
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, apiKey]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://data.nasdaq.com/api/v3/datatables/QUOTEMEDIA/PRICES?ticker=${ticker}&date.gte=${startDate}&date.lte=${endDate}&api_key=${apiKey}`
      );
      const rawData = response.data.datatable?.data || [];
      const chartData = rawData.map((row: unknown[]) => ({
        date: row[0] as string,
        open: parseFloat(row[1] as string),
        high: parseFloat(row[2] as string),
        low: parseFloat(row[3] as string),
        close: parseFloat(row[4] as string),
        volume: parseInt(row[5] as string, 10)
      })).reverse();
      setData(chartData);
    } catch (err: unknown) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}. Check key/dates.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading {ticker} chart...</div>;
  if (error) return <div className="p-4 text-red-700">{error}</div>;

  return (
    <div className="stock-detail p-4">
      <h2 className="text-2xl font-bold">{ticker} Stock Chart</h2>
      <div className="date-range flex gap-2 my-4 justify-center">
        <label className="flex flex-col">
          Start: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={endDate} className="p-2 border rounded" />
        </label>
        <label className="flex flex-col">
          End: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} min={startDate} className="p-2 border rounded" />
        </label>
        <button onClick={fetchData} className="p-2 bg-blue-500 text-white rounded self-end">Update</button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="close" stroke="#8884d8" name="Close" />
          <Line yAxisId="left" type="monotone" dataKey="open" stroke="#82ca9d" name="Open" />
          <Line yAxisId="left" type="monotone" dataKey="high" stroke="#ff7300" name="High" />
          <Line yAxisId="left" type="monotone" dataKey="low" stroke="#ff0000" name="Low" />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2">Data points: {data.length}</p>
    </div>
  );
};

export default StockDetail;