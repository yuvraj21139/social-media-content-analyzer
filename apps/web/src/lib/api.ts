const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface ExtractionResult {
  filename: string;
  type: 'pdf' | 'image';
  text: string;
  stats: {
    chars: number;
    words: number;
  };
  suggestions: string[];
}

export interface ApiError {
  message: string;
  status: number;
  traceId?: string;
}

export const api = {
  async extractText(files: File[]): Promise<ExtractionResult[]> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const response = await fetch(`${API_BASE_URL}/api/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  async healthCheck(): Promise<{ ok: boolean }> {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }
};
