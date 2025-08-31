import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload';
import { extractTextFromPDF } from '../services/pdf';
import { extractTextFromImage } from '../services/ocr';
import { analyzeText, generateEngagementSuggestions, cleanText, preserveFormatting } from '../utils/text';

export const extractRouter = Router();

interface ExtractionRequest extends Request {
  files?: Express.Multer.File[];
}

extractRouter.post('/extract', upload.array('files', 5), async (req: Request, res: Response) => {
  try {
    const files = (req as ExtractionRequest).files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        message: 'No files provided',
        status: 400
      });
    }
    
    const results = [];
    
    for (const file of files) {
      try {
        let extractedText = '';
        let fileType: 'pdf' | 'image' = 'image';
        
        // Determine file type and extract text
        if (file.mimetype === 'application/pdf') {
          fileType = 'pdf';
          const pdfResult = await extractTextFromPDF(file.buffer);
          
          if (!pdfResult.success) {
            throw new Error(pdfResult.error || 'PDF extraction failed');
          }
          
          extractedText = pdfResult.text;
        } else if (file.mimetype.startsWith('image/')) {
          fileType = 'image';
          const ocrResult = await extractTextFromImage(file.buffer, file.mimetype);
          
          if (!ocrResult.success) {
            throw new Error(ocrResult.error || 'OCR extraction failed');
          }
          
          extractedText = ocrResult.text;
        } else {
          throw new Error('Unsupported file type');
        }
        
        // Clean and preserve formatting
        const cleanedText = cleanText(extractedText);
        const formattedText = preserveFormatting(cleanedText);
        
        // Analyze text and generate suggestions
        const stats = analyzeText(formattedText);
        const engagement = generateEngagementSuggestions(formattedText, stats);
        
        // Combine suggestions and warnings
        const allSuggestions = [...engagement.suggestions, ...engagement.warnings];
        
        results.push({
          filename: file.originalname,
          type: fileType,
          text: formattedText,
          stats: {
            chars: stats.chars,
            words: stats.words
          },
          suggestions: allSuggestions
        });
        
      } catch (fileError) {
        console.error(`Error processing file ${file.originalname}:`, fileError);
        
        results.push({
          filename: file.originalname,
          type: 'unknown',
          text: '',
          stats: {
            chars: 0,
            words: 0
          },
          suggestions: [`Error: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`]
        });
      }
    }
    
    res.json(results);
    
  } catch (error) {
    console.error('Extraction route error:', error);
    
    res.status(500).json({
      message: 'Failed to process files',
      status: 500,
      traceId: req.headers['x-request-id'] || 'unknown'
    });
  }
});
