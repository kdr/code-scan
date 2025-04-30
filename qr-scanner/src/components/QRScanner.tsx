'use client';

import { useRef, useState, useEffect, forwardRef, useImperativeHandle, useId } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

type QRScannerProps = {
  onScanSuccess: (decodedText: string, isUrl: boolean) => void;
  onScanFailure?: (error: string) => void;
  height?: number;
  width?: number;
};

export type QRScannerRef = {
  reset: () => void;
};

const QRScanner = forwardRef<QRScannerRef, QRScannerProps>(({
  onScanSuccess,
  onScanFailure,
}, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  // Use React's useId() hook to generate a stable ID across renders
  const uniqueId = useId();
  const scannerId = `qr-reader-${uniqueId.replace(/:/g, "")}`;

  useImperativeHandle(ref, () => ({
    reset: () => {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

  // Use useEffect with client-side only logic
  useEffect(() => {
    let tempElement: HTMLElement | null = null;
    
    // Create the hidden scanner element on the client side only
    if (typeof document !== 'undefined') {
      tempElement = document.getElementById(scannerId);
      if (!tempElement) {
        tempElement = document.createElement('div');
        tempElement.id = scannerId;
        tempElement.style.display = 'none';
        document.body.appendChild(tempElement);
      }
    }

    // Cleanup function
    return () => {
      // Clean up preview URLs when component unmounts
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Clean up the temporary element
      if (tempElement && typeof document !== 'undefined') {
        try {
          document.body.removeChild(tempElement);
        } catch (e) {
          console.error('Error removing scanner element:', e);
        }
      }
    };
  }, [scannerId, previewUrl]);

  const isValidUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Create preview URL for the uploaded file
    const objectUrl = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(objectUrl);
    
    processFile(file);
  };

  const processFile = async (file: File) => {
    try {
      // Make sure the scanner element exists before creating the scanner
      if (typeof document !== 'undefined') {
        let element = document.getElementById(scannerId);
        if (!element) {
          element = document.createElement('div');
          element.id = scannerId;
          element.style.display = 'none';
          document.body.appendChild(element);
        }
        
        // Create scanner on demand
        const scanner = new Html5Qrcode(scannerId);
        
        // Scan the file
        const decodedText = await scanner.scanFile(file, true);
        
        // Clean up the scanner
        scanner.clear();
        
        // Handle the result
        onScanSuccess(decodedText, isValidUrl(decodedText));
      }
    } catch (error) {
      if (onScanFailure) onScanFailure(String(error));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      
      // Create preview URL for the dropped file
      const objectUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(objectUrl);
      
      processFile(file);
    }
  };

  return (
    <div className="qr-scanner w-full">
      <div 
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } relative`}
        onClick={triggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          backgroundImage: previewUrl ? `url(${previewUrl})` : 'none',
          backgroundSize: previewUrl ? 'contain' : 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '200px'
        }}
      >
        {!previewUrl && (
          <div className="flex flex-col items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400 mb-3" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-700"><span className="font-semibold">Click to upload</span> or drag and drop</p>
            <p className="text-xs text-gray-500">QR code image files only</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
});

QRScanner.displayName = 'QRScanner';

export default QRScanner; 