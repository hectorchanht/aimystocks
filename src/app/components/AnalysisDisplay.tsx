'use client';

import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  if (result.error) {
    return <div className="analysis error p-4 bg-red-100 rounded my-4 text-red-700">Error: {result.error}</div>;
  }

  return (
    <div className="analysis p-4 bg-gray-100 rounded my-4 text-left">
      <h2 className="text-xl font-bold text-black text-center">AI Analysis Report</h2>
      <div dangerouslySetInnerHTML={{ __html: result.analysis.replace(/\n/g, '<br>') }} />
    </div>
  );
};

export default AnalysisDisplay;