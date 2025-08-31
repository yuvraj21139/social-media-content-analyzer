import pdfParse from 'pdf-parse';

export interface PDFExtractionResult {
  text: string;
  success: boolean;
  error?: string;
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractionResult> {
  try {
    const data = await pdfParse(buffer);
    
    if (!data.text || data.text.trim().length === 0) {
      return {
        text: '',
        success: false,
        error: 'No text content found in PDF'
      };
    }
    
    return {
      text: data.text,
      success: true
    };
  } catch (error) {
    console.error('PDF extraction failed:', error);
    
    // Fallback to pdfjs-dist if pdf-parse fails
    try {
      return await extractWithPDFJS(buffer);
    } catch (fallbackError) {
      return {
        text: '',
        success: false,
        error: `PDF extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

async function extractWithPDFJS(buffer: Buffer): Promise<PDFExtractionResult> {
  try {
    // Dynamic import to avoid loading pdfjs-dist if not needed
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set worker path - use the correct import path
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) {
      return {
        text: '',
        success: false,
        error: 'No text content found in PDF (pdfjs fallback)'
      };
    }
    
    return {
      text: fullText,
      success: true
    };
  } catch (error) {
    throw new Error(`PDF.js fallback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
