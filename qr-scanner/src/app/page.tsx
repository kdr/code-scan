'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { QRScannerRef } from '@/components/QRScanner';
import QRResults from '@/components/QRResults';

// Dynamically import the QRScanner component with { ssr: false } to disable server-side rendering
const QRScanner = dynamic(() => import('@/components/QRScanner'), { ssr: false });

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [areUrlResults, setAreUrlResults] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<QRScannerRef>(null);

  const handleScanSuccess = (decodedText: string, isUrl: boolean) => {
    setResults([decodedText]);
    setAreUrlResults([isUrl]);
    setError(null);
  };

  const handleScanFailure = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleClearResults = () => {
    setResults([]);
    setAreUrlResults([]);
    setError(null);
    
    // Reset the scanner component
    if (scannerRef.current) {
      scannerRef.current.reset();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <header className="py-6 w-full max-w-4xl flex flex-col items-center mb-6">
        <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
        <p className="text-gray-600 text-center max-w-md">
          Upload or drop a QR code image to scan
        </p>
      </header>

      <main className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col items-center w-full">
          <QRScanner 
            ref={scannerRef}
            onScanSuccess={handleScanSuccess} 
            onScanFailure={handleScanFailure}
          />

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <QRResults 
            results={results} 
            areUrlResults={areUrlResults}
            onClear={handleClearResults}
          />
        </div>
      </main>

      <footer className="w-full max-w-4xl text-center text-sm text-gray-500">
        
      </footer>
    </div>
  );
}
