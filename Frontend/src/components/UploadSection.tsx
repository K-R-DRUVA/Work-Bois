import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2 } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (files: File[]) => void;
  isLoading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, isLoading }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    maxFiles: 1,
  });

  return (
    <div className="flex flex-col h-full justify-center">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        Upload Data Files
      </h2>
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' 
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-4">
            <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-2" />
            <p className="text-gray-600 dark:text-gray-300">Processing your data...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop a ZIP file here, or click to select
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Only .zip files containing CSV data are supported
            </p>
          </div>
        )}
      </div>
      
      {acceptedFiles.length > 0 && !isLoading && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selected file:</h3>
          <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 flex items-center">
            <File className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
              {acceptedFiles[0].name} ({(acceptedFiles[0].size / 1024).toFixed(1)} KB)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;