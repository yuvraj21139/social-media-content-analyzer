import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, isProcessing }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
    }
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    disabled: isProcessing
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${isDragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="space-y-4">
        <div className="text-6xl text-gray-400">
          📄
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop files here' : 'Upload PDF or Image'}
          </h3>
          
          <p className="text-sm text-gray-500">
            Drag and drop files here, or click to select
          </p>
          
          <p className="text-xs text-gray-400">
            Supports PDF, PNG, JPG, JPEG, WEBP (max 20MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
