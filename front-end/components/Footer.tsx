'use client'

import { useState } from 'react';

export default function Footer() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch('https://studylore.onrender.com/generate-pdf', {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('content-disposition')?.split('filename=')[1] || 'study_summary.pdf';
      
      // Trigger download
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <footer className="mt-8 py-6 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 StudyLore. All rights reserved.
        </p>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm
            ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        >
          {isDownloading ? 'Downloading...' : 'Download Summary'}
        </button>
      </div>
    </footer>
  );
}

