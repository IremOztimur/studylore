'use client'

import { useState } from 'react';

export default function Footer() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      const response = await fetch('http://localhost:8000/generate-pdf', {
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
    <footer className="mt-8 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © 2025 StudyLore. All rights reserved.
        </p>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
            ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDownloading ? 'Downloading...' : 'Download Summary'}
        </button>
      </div>
    </footer>
  );
}

