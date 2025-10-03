'use client';

import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="analysis-container space-y-6 my-6 animate-pulse">
      {/* Insights Skeleton */}
      <div className="insights p-6 rounded-lg border shadow-sm ">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="recommendations p-6 rounded-lg border shadow-sm ">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-300 rounded"></div>
          <div className="h-6 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-300 rounded"></div>
            <div className="flex-1 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Main Analysis Skeleton */}
      <div className="analysis p-6 rounded-lg border shadow-sm ">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          <div className="h-8 bg-gray-300 rounded w-48"></div>
        </div>
        <div className="space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-6 bg-gray-300 rounded w-2/3 mt-6"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-4/5"></div>
          <div className="h-6 bg-gray-300 rounded w-3/4 mt-6"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
