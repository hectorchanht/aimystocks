'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { AIConfig } from '../types';
import { ChatGPTIcon } from './svgs/chatgpt';
import { GeminiIcon } from './svgs/gemini';
import { GrokIcon } from './svgs/grok';
import { apiKeyAtom, customPromptAtom, aiServiceAtom } from '../store/atoms';

interface Props {
  onAnalyze: (config: AIConfig) => void;
}

const AISelector: React.FC<Props> = ({ onAnalyze }) => {
  const [service, setService] = useAtom(aiServiceAtom);
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [customPrompt, setCustomPrompt] = useAtom(customPromptAtom);

  const handleAnalyze = () => {
    if (!apiKey) return alert('Please enter your API key.');
    onAnalyze({ service, apiKey, customPrompt });
  };

  return (
    <div className="ai-selector my-4 flex flex-col items-center max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Analysis</h2>

      <div className="w-full mb-4">
        <label className="text-sm font-medium mb-2 block">Select AI Service</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setService('chatgpt')}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${service === 'chatgpt'
              ? 'border-green-500 bg-green-50 shadow-md'
              : 'border-gray-300 bg-white hover:border-green-400'
              }`}
          >
            <ChatGPTIcon />
            <span className="text-sm font-medium text-black">ChatGPT</span>
          </button>

          <button
            type="button"
            onClick={() => setService('gemini')}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${service === 'gemini'
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-300 bg-white hover:border-blue-400'
              }`}
          >
            <GeminiIcon />
            <span className="text-sm font-medium text-black">Gemini</span>
          </button>

          <button
            type="button"
            onClick={() => setService('grok')}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${service === 'grok'
              ? 'border-gray-800 bg-gray-100 shadow-md'
              : 'border-gray-300 bg-white hover:border-gray-600'
              }`}
          >
            <GrokIcon />
            <span className="text-sm font-medium text-black">Grok</span>
          </button>
        </div>
      </div>

      <div className="w-full mb-4">
        <label htmlFor="apiKey" className="text-sm font-medium mb-2 block">API Key</label>
        <input
          id="apiKey"
          type="password"
          placeholder="Enter your API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="w-full mb-4">
        <label htmlFor="customPrompt" className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
        <textarea
          id="customPrompt"
          placeholder="e.g., 'Focus on long-term growth' or 'Analyze risk factors'"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          className="w-full p-2 border rounded h-24 resize-none"
        />
      </div>

      <button
        onClick={handleAnalyze}
        className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
      >
        Analyze Portfolio
      </button>
    </div>
  );
};

export default AISelector;