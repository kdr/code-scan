'use client';

import { useState } from 'react';

type QRResultsProps = {
  results: string[];
  areUrlResults: boolean[];
  onClear: () => void;
};

const QRResults = ({ results, areUrlResults, onClear }: QRResultsProps) => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(null), 2000);
      })
      .catch(() => {
        setCopySuccess('Failed to copy');
      });
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (results.length === 0) {
    return null;
  }

  const isSingleUrlResult = results.length === 1 && areUrlResults[0];

  return (
    <div className="mt-6 w-full">
      <h2 className="text-xl font-semibold mb-2">QR Code Results</h2>
      <textarea
        className="w-full min-h-[120px] p-4 border border-gray-300 rounded-lg bg-gray-50 mb-3"
        value={results.join('\n')}
        readOnly
      />
      
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCopy(results.join('\n'))}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          {copySuccess || 'Copy'}
        </button>
        
        {isSingleUrlResult && (
          <button
            onClick={() => handleOpenUrl(results[0])}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Open URL
          </button>
        )}
        
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded ml-auto"
        >
          Clear Results
        </button>
      </div>
    </div>
  );
};

export default QRResults; 