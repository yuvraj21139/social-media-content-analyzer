import Tesseract from 'tesseract.js';

export interface OCRExtractionResult {
  text: string;
  success: boolean;
  error?: string;
  confidence?: number;
}

export async function extractTextFromImage(buffer: Buffer, mimeType: string): Promise<OCRExtractionResult> {
  try {
    // Convert buffer to base64 for Tesseract
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    
    const result = await Tesseract.recognize(dataUrl, 'eng', {
      logger: m => {
        // Only log errors to avoid console spam
        if (m.status === 'error') {
          console.error('Tesseract error:', m);
        }
      }
    });
    
    if (!result.data.text || result.data.text.trim().length === 0) {
      return {
        text: '',
        success: false,
        error: 'No text content found in image'
      };
    }
    
    return {
      text: result.data.text,
      success: true,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('OCR extraction failed:', error);
    
    return {
      text: '',
      success: false,
      error: `OCR extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function isImageReadable(buffer: Buffer, mimeType: string): Promise<boolean> {
  try {
    // Quick check if image might contain readable text
    // This is a simple heuristic - you could make this more sophisticated
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Image}`;
    
    // Try a quick OCR with minimal processing
    const result = await Tesseract.recognize(dataUrl, 'eng', {
      logger: () => {} // Disable logging for quick check
    });
    
    return result.data.text.trim().length > 0 && result.data.confidence > 30;
  } catch (error) {
    return false;
  }
}
