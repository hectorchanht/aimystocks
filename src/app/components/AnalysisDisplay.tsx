'use client';

import React from 'react';
import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

// Helper function to convert markdown to HTML with better styling
const formatMarkdown = (text: string): string => {
  let html = text;

  // if (!html || !html.hasOwnProperty('replace')) {
  //   return '';
  // }

  // Headers (##, ###)
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-6 mb-3  flex items-center gap-2"><span class="w-1 h-6 bg-blue-500 rounded"></span>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4  pb-2 border-b-2 border-blue-500">$1</h2>');

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold ">$1</strong>');

  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic ">$1</em>');

  // Lists (bullet points)
  html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 mb-2 flex items-start gap-2"><span class=" mt-1">•</span><span class="flex-1">$1</span></li>');

  // Wrap consecutive list items in ul
  html = html.replace(/(<li class="ml-4.*?<\/li>\n?)+/g, (match) => `<ul class="space-y-1">${match}</ul>`);

  // Line breaks
  html = html.replace(/\n\n/g, '<br class="my-2" />');
  html = html.replace(/\n/g, '<br />');

  // Numbers at start of line (metrics)
  html = html.replace(/^(\d+\.?\d*%?|\$\d+\.?\d*[KMB]?)/gim, '<span class="font-bold">$1</span>');

  return html;
};

const AnalysisDisplay: React.FC<Props> = ({ result }) => {
  if (result.error) {
    return <div className="analysis error p-4 bg-red-100 rounded my-4 text-red-700">Error: {result.error}</div>;
  }

  if (!result.analysis) {
    return null;
  }
console.log('result', result);
  return (
    <div className="analysis-container space-y-6 my-6">
      {/* Insights Section */}
      {result.insights && result.insights.length > 0 && (
        <div className="insights p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Key Insights
          </h3>
          <ul className="space-y-3">
            {result.insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <span className="flex-1">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations Section */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="recommendations p-6 rounded-lg border shadow-sm">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommendations
          </h3>
          <ul className="space-y-3">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="flex-shrink-0 w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="flex-1">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Analysis */}
      <div className="analysis p-6 rounded-lg border shadow-sm text-white">
        <div className="flex items-center justify-center gap-3 mb-6">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-2xl font-bold text-white">AI Analysis Report</h2>
        </div>
        <div
          className="analysis-content leading-relaxed text-white"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(result.analysis) }}
        />
      </div>
    </div>
  );
};

export default AnalysisDisplay;