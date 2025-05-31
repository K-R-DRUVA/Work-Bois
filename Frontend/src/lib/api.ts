const API_BASE_URL = 'http://localhost:3000';

export interface UploadResponse {
  message: string;
  extractPath: string;
}

export interface AnalysisResponse {
  alerts: string[];
  plot_path: string;
  files_processed: number;
}

export const api = {
  /**
   * Upload a zip file to the server
   */
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('folderZip', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }
    
    return response.json();
  },
  
  /**
   * Analyze the uploaded data
   */
  analyzeData: async (folderPath: string): Promise<AnalysisResponse> => {
    const response = await fetch(`${API_BASE_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folderPath }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Analysis failed');
    }
    
    return response.json();
  },
};