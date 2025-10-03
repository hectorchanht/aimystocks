'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { AIConfig, AnalysisResult } from '../types';
import { ChatGPTIcon } from './svgs/chatgpt';
import { GeminiIcon } from './svgs/gemini';
import { GrokIcon } from './svgs/grok';
import { apiKeyAtom, customPromptAtom, aiServiceAtom, resultAtom, languageAtom } from '../store/atoms';

interface Props {
  onAnalyze: (config: AIConfig) => void;
}

const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese (Traditional)',
  'Chinese (Simplified)',
  'Japanese',
  'Korean',
  'Arabic',
  'Russian',
  'Hindi'
];

const AISelector: React.FC<Props> = ({ onAnalyze }) => {
  const [service, setService] = useAtom(aiServiceAtom);
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [customPrompt, setCustomPrompt] = useAtom(customPromptAtom);
  const [language, setLanguage] = useAtom(languageAtom);
  const [result, setResult] = useAtom<AnalysisResult>(resultAtom);

  const handleAnalyze = () => {
    if (!apiKey) return alert('Please enter your API key.');
    setResult({analysis: ''})
    onAnalyze({ service, apiKey, customPrompt, language });
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
              ? 'border-green-500 shadow-md'
              : 'border-gray-300  hover:border-green-400'
              }`}
          >
            <ChatGPTIcon />
            <span className="text-sm font-medium ">ChatGPT</span>
          </button>

          <button
            type="button"
            onClick={() => setService('gemini')}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${service === 'gemini'
              ? 'border-blue-500 shadow-md'
              : 'border-gray-300  hover:border-blue-400'
              }`}
          >
            <GeminiIcon />
            <span className="text-sm font-medium ">Gemini</span>
          </button>

          <button
            type="button"
            onClick={() => setService('grok')}
            className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg transition-all ${service === 'grok'
              ? 'border-gray-800 shadow-md'
              : 'border-gray-300  hover:border-gray-600'
              }`}
          >
            <GrokIcon />
            <span className="text-sm font-medium ">Grok</span>
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
        <label htmlFor="language" className="text-sm font-medium mb-2 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Analysis Language
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded bg-white"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
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