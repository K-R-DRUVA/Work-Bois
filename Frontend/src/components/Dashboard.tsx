import React, { useState } from 'react';
import UploadSection from './UploadSection';
import SettingsPanel from './SettingsPanel';
import { FileData, ThresholdRange } from '../types';
import { api } from '../lib/api';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [extractPath, setExtractPath] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<{
    temperature: ThresholdRange;
    strain: ThresholdRange;
  }>({
    temperature: { min: 20, max: 80 },
    strain: { min: 100, max: 900 },
  });

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Upload the ZIP file
      const uploadResponse = await api.uploadFile(files[0]);
      setExtractPath(uploadResponse.extractPath);

      // Step 2: Analyze the data
      const analysisResponse = await api.analyzeData(uploadResponse.extractPath);
      // Step 3: Set the file data - CORRECTED
      setFileData(analysisResponse);

      // Step 4: Set the plot URL
      if (analysisResponse.plot_path) {
        const plotPath = analysisResponse.plot_path.replace(/\\/g, '/'); // normalize slashes
        const relativePath = plotPath.split('uploads/')[1]; // trim to get relative path inside /uploads
        if (relativePath) {
          setPlotUrl(`http://localhost:3000/plots/${relativePath}`);
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error processing file:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateThresholds = (newThresholds: {
    temperature: ThresholdRange;
    strain: ThresholdRange;
  }) => {
    setThresholds(newThresholds);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Sensor Data Visualization Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <UploadSection onUpload={handleFileUpload} isLoading={loading} />
        </div>

        {fileData ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
              {plotUrl ? (
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Data Visualization
                  </h2>
                  <img
                    src={plotUrl}
                    alt="Data Visualization Plot"
                    className="max-w-full h-auto rounded-lg shadow-sm"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {fileData.files_processed} files processed
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 dark:text-gray-400">No plot available</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Alerts ({fileData.alerts.length})
              </h2>
              <div className="max-h-80 overflow-y-auto">
                {fileData.alerts.length > 0 ? (
                  <ul className="space-y-2">
                    {fileData.alerts.map((alert, index) => (
                      <li key={index} className="p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-800">
                        {alert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No alerts detected
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <SettingsPanel
                thresholds={thresholds}
                updateThresholds={updateThresholds}
              />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400 text-center">
              {loading
                ? 'Processing your data...'
                : 'Upload a ZIP file to visualize sensor data'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;