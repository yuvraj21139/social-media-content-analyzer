import React, { useState } from 'react';
import DropZone from '../components/DropZone';
import Loader from '../components/Loader';
import { api, ExtractionResult } from '../lib/api';

const Home: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ExtractionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const extractionResults = await api.extractText(files);
      setResults(extractionResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during processing');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadAsText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Social Media Content Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Extract text from PDFs and images, get engagement suggestions
          </p>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <DropZone 
            onFilesSelected={handleFilesSelected}
            isProcessing={isProcessing}
          />
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="card mb-8">
            <Loader message="Extracting text and analyzing content..." size="lg" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="card mb-8 border-red-200 bg-red-50">
            <div className="flex items-center space-x-2 text-red-800">
              <span className="text-xl">⚠️</span>
              <p className="font-medium">Error: {error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Analysis Results
            </h2>
            
            {results.map((result, index) => (
              <div key={index} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {result.filename}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {result.type} • {result.stats.words} words • {result.stats.chars} characters
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(result.text)}
                      className="btn-secondary text-sm"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => downloadAsText(result.filename, result.text)}
                      className="btn-secondary text-sm"
                    >
                      Download
                    </button>
                  </div>
                </div>

                {/* Text Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Text:</h4>
                  <div className="bg-gray-50 rounded p-3 max-h-40 overflow-y-auto">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                      {result.text}
                    </pre>
                  </div>
                </div>

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Engagement Suggestions:</h4>
                    <ul className="space-y-1">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                          <span className="text-primary-600 mt-1">•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
