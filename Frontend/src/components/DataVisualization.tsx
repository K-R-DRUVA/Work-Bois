import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { FileData, Threshold } from '../types';
import { Calendar, Thermometer, TrendingUp, ArrowRightLeft } from 'lucide-react';

interface DataVisualizationProps {
  data: FileData;
  thresholds: Threshold;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, thresholds }) => {
  const [activeView, setActiveView] = useState<'temperature' | 'strain' | 'combined'>('temperature');
  
  const getPlotConfig = () => {
    const baseConfig = {
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    };
    
    switch (activeView) {
      case 'temperature':
        return {
          data: [
            {
              x: data.timestamps,
              y: data.temperature,
              type: 'scatter',
              mode: 'lines',
              name: 'Temperature',
              line: { color: '#3B82F6', width: 2 },
              hovertemplate: '%{y:.1f}°C<br>%{x}<extra></extra>',
            },
            {
              x: [data.timestamps[0], data.timestamps[data.timestamps.length - 1]],
              y: [thresholds.temperature.max, thresholds.temperature.max],
              type: 'scatter',
              mode: 'lines',
              name: 'Max Threshold',
              line: { color: '#EF4444', width: 1, dash: 'dash' },
              hovertemplate: 'Max: %{y:.1f}°C<extra></extra>',
            },
            {
              x: [data.timestamps[0], data.timestamps[data.timestamps.length - 1]],
              y: [thresholds.temperature.min, thresholds.temperature.min],
              type: 'scatter',
              mode: 'lines',
              name: 'Min Threshold',
              line: { color: '#F59E0B', width: 1, dash: 'dash' },
              hovertemplate: 'Min: %{y:.1f}°C<extra></extra>',
            },
          ],
          layout: {
            title: 'Temperature Data',
            xaxis: { title: 'Time' },
            yaxis: { title: 'Temperature (°C)' },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 50, b: 80, l: 60, r: 40 },
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
          },
          config: baseConfig,
        };
      case 'strain':
        return {
          data: [
            {
              x: data.timestamps,
              y: data.strain,
              type: 'scatter',
              mode: 'lines',
              name: 'Strain',
              line: { color: '#10B981', width: 2 },
              hovertemplate: '%{y:.2f} µε<br>%{x}<extra></extra>',
            },
            {
              x: [data.timestamps[0], data.timestamps[data.timestamps.length - 1]],
              y: [thresholds.strain.max, thresholds.strain.max],
              type: 'scatter',
              mode: 'lines',
              name: 'Max Threshold',
              line: { color: '#EF4444', width: 1, dash: 'dash' },
              hovertemplate: 'Max: %{y:.2f} µε<extra></extra>',
            },
            {
              x: [data.timestamps[0], data.timestamps[data.timestamps.length - 1]],
              y: [thresholds.strain.min, thresholds.strain.min],
              type: 'scatter',
              mode: 'lines',
              name: 'Min Threshold',
              line: { color: '#F59E0B', width: 1, dash: 'dash' },
              hovertemplate: 'Min: %{y:.2f} µε<extra></extra>',
            },
          ],
          layout: {
            title: 'Strain Data',
            xaxis: { title: 'Time' },
            yaxis: { title: 'Strain (µε)' },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 50, b: 80, l: 60, r: 40 },
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
          },
          config: baseConfig,
        };
      case 'combined':
        return {
          data: [
            {
              x: data.timestamps,
              y: data.temperature,
              type: 'scatter',
              mode: 'lines',
              name: 'Temperature',
              line: { color: '#3B82F6', width: 2 },
              yaxis: 'y',
              hovertemplate: '%{y:.1f}°C<br>%{x}<extra></extra>',
            },
            {
              x: data.timestamps,
              y: data.strain,
              type: 'scatter',
              mode: 'lines',
              name: 'Strain',
              line: { color: '#10B981', width: 2 },
              yaxis: 'y2',
              hovertemplate: '%{y:.2f} µε<br>%{x}<extra></extra>',
            },
          ],
          layout: {
            title: 'Combined Data View',
            xaxis: { title: 'Time' },
            yaxis: { 
              title: 'Temperature (°C)', 
              titlefont: { color: '#3B82F6' },
              tickfont: { color: '#3B82F6' },
            },
            yaxis2: {
              title: 'Strain (µε)',
              titlefont: { color: '#10B981' },
              tickfont: { color: '#10B981' },
              overlaying: 'y',
              side: 'right',
            },
            legend: { orientation: 'h', y: -0.2 },
            margin: { t: 50, b: 80, l: 60, r: 60 },
            plot_bgcolor: 'transparent',
            paper_bgcolor: 'transparent',
          },
          config: baseConfig,
        };
      default:
        return { data: [], layout: {}, config: baseConfig };
    }
  };
  
  const plotConfig = getPlotConfig();
  
  const tabs = [
    { id: 'temperature', label: 'Temperature', icon: <Thermometer size={16} /> },
    { id: 'strain', label: 'Strain', icon: <TrendingUp size={16} /> },
    { id: 'combined', label: 'Combined', icon: <ArrowRightLeft size={16} /> },
  ];
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Data Visualization</h2>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Calendar size={16} className="mr-1" />
          <span>
            {new Date(data.timestamps[0]).toLocaleDateString()} - 
            {new Date(data.timestamps[data.timestamps.length - 1]).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md p-1 flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center justify-center flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              activeView === tab.id
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveView(tab.id as any)}
          >
            <span className="mr-1.5">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <Plot
          data={plotConfig.data}
          layout={{
            ...plotConfig.layout,
            autosize: true,
            height: 500,
            // Ensure dark mode compatibility
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
              color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
            },
            xaxis: {
              ...plotConfig.layout.xaxis,
              gridcolor: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
            yaxis: {
              ...plotConfig.layout.yaxis,
              gridcolor: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            },
            ...(plotConfig.layout.yaxis2 && {
              yaxis2: {
                ...plotConfig.layout.yaxis2,
                gridcolor: document.documentElement.classList.contains('dark') ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              }
            }),
          }}
          config={plotConfig.config}
          style={{ width: '100%' }}
          className="transition-opacity duration-300"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4">
        {[
          { label: 'Average Temp', value: `${(data.temperature.reduce((a, b) => a + b, 0) / data.temperature.length).toFixed(1)}°C` },
          { label: 'Max Temp', value: `${Math.max(...data.temperature).toFixed(1)}°C` },
          { label: 'Min Temp', value: `${Math.min(...data.temperature).toFixed(1)}°C` },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataVisualization;