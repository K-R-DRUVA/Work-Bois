import React, { useState } from 'react';
import { Threshold } from '../types';
import { Save, Thermometer, Waves, RefreshCw } from 'lucide-react';

interface SettingsPanelProps {
  thresholds: Threshold;
  updateThresholds: (newThresholds: Threshold) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ thresholds, updateThresholds }) => {
  const [tempSettings, setTempSettings] = useState({
    temperatureMin: thresholds.temperature.min,
    temperatureMax: thresholds.temperature.max,
    strainMin: thresholds.strain.min,
    strainMax: thresholds.strain.max,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempSettings(prev => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds({
      temperature: {
        min: tempSettings.temperatureMin,
        max: tempSettings.temperatureMax,
      },
      strain: {
        min: tempSettings.strainMin,
        max: tempSettings.strainMax,
      },
    });
  };
  
  const handleReset = () => {
    setTempSettings({
      temperatureMin: thresholds.temperature.min,
      temperatureMax: thresholds.temperature.max,
      strainMin: thresholds.strain.min,
      strainMax: thresholds.strain.max,
    });
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center mb-2">
              <Thermometer size={16} className="text-primary-500 mr-1.5" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Temperature Thresholds</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="temperatureMin" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Minimum (°C)
                </label>
                <input
                  type="number"
                  id="temperatureMin"
                  name="temperatureMin"
                  value={tempSettings.temperatureMin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600"
                  step="0.1"
                />
              </div>
              <div>
                <label htmlFor="temperatureMax" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Maximum (°C)
                </label>
                <input
                  type="number"
                  id="temperatureMax"
                  name="temperatureMax"
                  value={tempSettings.temperatureMax}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600"
                  step="0.1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-2">
              <Waves size={16} className="text-secondary-500 mr-1.5" />
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Strain Thresholds</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="strainMin" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Minimum (µε)
                </label>
                <input
                  type="number"
                  id="strainMin"
                  name="strainMin"
                  value={tempSettings.strainMin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600"
                  step="1"
                />
              </div>
              <div>
                <label htmlFor="strainMax" className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Maximum (µε)
                </label>
                <input
                  type="number"
                  id="strainMax"
                  name="strainMax"
                  value={tempSettings.strainMax}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-600 dark:focus:border-primary-600"
                  step="1"
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Save size={16} className="mr-1.5" />
              Apply Changes
            </button>
            
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <RefreshCw size={16} className="mr-1.5" />
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsPanel;