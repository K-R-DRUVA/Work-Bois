import { FileData } from '../types';

export function generateMockData(): FileData {
  const now = new Date();
  const timestamps: string[] = [];
  const temperature: number[] = [];
  const strain: number[] = [];
  
  // Generate 100 data points at 1-hour intervals
  for (let i = 0; i < 100; i++) {
    // Go back in time, newest data first in array
    const timestamp = new Date(now.getTime() - (99 - i) * 60 * 60 * 1000);
    timestamps.push(timestamp.toISOString());
    
    // Generate temperature data (between 10 and 50 degrees C)
    // With some daily fluctuations
    const dayProgress = (timestamp.getHours() % 24) / 24; // 0 to 1 for time of day
    const baseTemp = 25 + 10 * Math.sin(dayProgress * 2 * Math.PI); // Daily cycle
    const randomFactor = Math.random() * 4 - 2; // Random fluctuation
    temperature.push(baseTemp + randomFactor);
    
    // Generate strain data (between 0 and 1000 µε)
    // With some correlation to temperature but also its own pattern
    const baseStrain = 500 + 200 * Math.sin(i / 10); // Slower cycle
    const tempEffect = (baseTemp - 25) * 5; // Temperature correlation
    const randomStrainFactor = Math.random() * 50 - 25;
    strain.push(Math.max(0, baseStrain + tempEffect + randomStrainFactor));
  }
  
  return {
    timestamps,
    temperature,
    strain,
    platform: 'platform1',
    deviceId: 'DEVICE_123456',
    metadata: {
      location: 'Building A, Floor 3',
      sensor_type: 'TS-2000',
      calibration_date: '2025-01-15',
    },
  };
}