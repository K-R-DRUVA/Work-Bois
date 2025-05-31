import React, { useMemo } from 'react';
import { AlertCircle, ThermometerSnowflake, Thermometer, Waves, CheckCircle } from 'lucide-react';

// Mock types for demonstration
interface FileData {
  temperature: number[];
  strain: number[];
  timestamps: string[];
}

interface Threshold {
  temperature: { min: number; max: number };
  strain: { min: number; max: number };
}

interface Alert {
  id: string;
  timestamp: string;
  type: 'temperature' | 'strain';
  severity: 'high' | 'low';
  value: number;
  threshold: number;
  message: string;
}

interface AlertsPanelProps {
  data: FileData | null;
  thresholds: Threshold;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ data, thresholds }) => {
  const alerts = useMemo(() => {
    if (!data) return [];
    
    const result: Alert[] = [];
    
    // Check temperature thresholds
    data.temperature.forEach((temp, index) => {
      const timestamp = data.timestamps[index];
      if (temp > thresholds.temperature.max) {
        result.push({
          id: `temp-high-${index}`,
          timestamp,
          type: 'temperature',
          severity: 'high',
          value: temp,
          threshold: thresholds.temperature.max,
          message: `Temperature above threshold: ${temp.toFixed(1)}°C`,
        });
      } else if (temp < thresholds.temperature.min) {
        result.push({
          id: `temp-low-${index}`,
          timestamp,
          type: 'temperature',
          severity: 'low',
          value: temp,
          threshold: thresholds.temperature.min,
          message: `Temperature below threshold: ${temp.toFixed(1)}°C`,
        });
      }
    });
    
    // Check strain thresholds
    data.strain.forEach((strain, index) => {
      const timestamp = data.timestamps[index];
      if (strain > thresholds.strain.max) {
        result.push({
          id: `strain-high-${index}`,
          timestamp,
          type: 'strain',
          severity: 'high',
          value: strain,
          threshold: thresholds.strain.max,
          message: `Strain above threshold: ${strain.toFixed(2)} µε`,
        });
      } else if (strain < thresholds.strain.min) {
        result.push({
          id: `strain-low-${index}`,
          timestamp,
          type: 'strain',
          severity: 'low',
          value: strain,
          threshold: thresholds.strain.min,
          message: `Strain below threshold: ${strain.toFixed(2)} µε`,
        });
      }
    });
    
    // Sort by timestamp, most recent first
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data, thresholds]);
  
  const getAlertIcon = (alert: Alert) => {
    if (alert.type === 'temperature') {
      return alert.severity === 'high' 
        ? <Thermometer className="h-4 w-4 text-red-500" /> 
        : <ThermometerSnowflake className="h-4 w-4 text-blue-500" />;
    } else {
      return <Waves className="h-4 w-4 text-purple-500" />;
    }
  };
  
  const getSeverityColor = (severity: string) => {
    return severity === 'high' 
      ? 'bg-red-600' 
      : 'bg-blue-600';
  };
  
  return (
    <div className="h-full">
      {!data ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">Upload data to see alerts</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-6 bg-green-100 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-green-800 dark:text-green-200 font-medium text-sm">All systems normal</p>
          <p className="text-green-600 dark:text-green-300 text-xs">No alerts detected</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
        }}>
          {alerts.slice(0, 5).map((alert) => (
            <div 
              key={alert.id}
              className="flex items-start p-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`w-1 h-full ${getSeverityColor(alert.severity)} rounded-full mr-3 flex-shrink-0`}></div>
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {getAlertIcon(alert)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                    {alert.severity} Alert
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {alert.type === 'temperature' ? 'TEMP' : 'STRAIN'} {alert.severity === 'high' ? 'HIGH' : 'LOW'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {alert.value.toFixed(alert.type === 'temperature' ? 1 : 2)} {alert.type === 'temperature' ? '°C' : 'µε'} 
                  (limit: {alert.threshold})
                </p>
              </div>
            </div>
          ))}
          {alerts.length > 5 && (
            <div className="text-center py-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                +{alerts.length - 5} more alerts
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Demo component with sample data to match your dashboard
const AlertsPanelDemo = () => {
  const sampleData = {
    temperature: [25.5, 32.1, 28.3, 15.2, 45.7],
    strain: [150, 220, 180, 95, 350],
    timestamps: [
      new Date(Date.now() - 5000).toISOString(),
      new Date(Date.now() - 10000).toISOString(),
      new Date(Date.now() - 15000).toISOString(),
      new Date(Date.now() - 20000).toISOString(),
      new Date(Date.now() - 25000).toISOString(),
    ]
  };

  const sampleThresholds = {
    temperature: { min: 20, max: 40 },
    strain: { min: 100, max: 300 }
  };

  return (
    <div className="w-full max-w-sm bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium">Alerts (1)</h3>
      </div>
      <AlertsPanel data={sampleData} thresholds={sampleThresholds} />
    </div>
  );
};

export default AlertsPanelDemo;