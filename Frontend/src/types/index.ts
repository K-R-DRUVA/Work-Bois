export interface DataPoint {
  timestamp: string;
  temperature: number;
  strain: number;
}

export interface FileData {
  alerts: string[];
  plot_path: string;
  files_processed: number;
}

export interface ThresholdRange {
  min: number;
  max: number;
}

export interface Threshold {
  temperature: ThresholdRange;
  strain: ThresholdRange;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: 'temperature' | 'strain';
  severity: 'high' | 'low';
  value: number;
  threshold: number;
  message: string;
}