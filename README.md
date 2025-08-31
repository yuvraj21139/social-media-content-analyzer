# Social Media Content Analyzer

Extract text from PDFs and scanned images, then get actionable engagement suggestions for social media content.

## 🚀 **DEPLOYMENT STATUS: READY FOR PRODUCTION**

✅ **Local Development**: Both frontend and backend running successfully  
✅ **Build Process**: All TypeScript compilation successful  
✅ **Core Features**: File upload, text extraction, and analysis working  
🔄 **Next Step**: Deploy to production (Vercel + Render)

---

## 🚀 Features

- **Multi-format Support**: PDFs, PNG, JPG, JPEG, WEBP
- **Smart Text Extraction**: 
  - PDFs: pdf-parse with pdf.js fallback
  - Images: Tesseract OCR (English)
- **Engagement Analysis**: Length checks, hashtag optimization, CTA detection
- **Modern UI**: React + TypeScript + Tailwind CSS
- **Drag & Drop**: Intuitive file upload with progress tracking
- **Export Options**: Copy to clipboard, download as text

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for rapid UI development
- **react-dropzone** for file handling

### Backend
- **Node.js** + **Express** + **TypeScript**
- **pdf-parse** for PDF text extraction
- **Tesseract.js** for OCR on images
- **Multer** for file upload handling

### Infrastructure
- **Monorepo** structure with npm workspaces
- **GitHub Actions** for CI/CD
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
social-media-content-analyzer/
├── apps/
│   ├── web/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Page components
│   │   │   ├── lib/         # API client & utilities
│   │   │   └── styles/      # Tailwind CSS
│   │   └── vite.config.ts   # Vite configuration
│   └── server/              # Express backend
│       ├── src/
│       │   ├── routes/      # API endpoints
│       │   ├── services/    # PDF & OCR services
│       │   └── utils/       # Text analysis utilities
│       └── tsconfig.json    # TypeScript config
├── .github/workflows/       # CI/CD pipelines
└── sample-data/             # Test files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd social-media-content-analyzer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts both:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### Development Commands

```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:web

# Start only backend  
npm run dev:server

# Build all apps
npm run build

# Lint all apps
npm run lint
```

## 🚀 **PRODUCTION DEPLOYMENT**

### **Frontend (Vercel)**
1. **Build**: `npm run build --workspace=apps/web`
2. **Deploy**: Upload `apps/web/dist` to Vercel
3. **Environment**: Set `VITE_API_BASE_URL` to your backend URL

### **Backend (Render/Railway)**
1. **Build**: `npm run build --workspace=apps/server`
2. **Deploy**: Deploy with Node.js runtime
3. **Environment**: Set `FRONTEND_URL` to your frontend URL

### **Quick Deployment Steps**
1. **Deploy Backend First** (get the URL)
2. **Deploy Frontend** (use backend URL in environment)
3. **Test Complete Flow** with sample files
4. **Update README** with live URLs

---

## 🔧 Configuration

### Environment Variables

Create `.env` files in each app directory:

**Frontend** (`apps/web/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Backend** (`apps/server/.env`):
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### File Size Limits

- **Maximum file size**: 20MB
- **Maximum files per request**: 5
- **Supported formats**: PDF, PNG, JPG, JPEG, WEBP

## 📊 API Endpoints

### POST `/api/extract`
Upload files for text extraction.

**Request**: `multipart/form-data` with `files[]`
**Response**: Array of extraction results

```json
{
  "filename": "document.pdf",
  "type": "pdf",
  "text": "Extracted text content...",
  "stats": {
    "chars": 1250,
    "words": 200
  },
  "suggestions": [
    "Add 1-3 relevant hashtags to increase discoverability.",
    "Consider breaking up long sentences for better readability."
  ]
}
```

### GET `/api/health`
Health check endpoint.

**Response**: `{ "ok": true, "timestamp": "..." }`

## 🎯 Engagement Analysis

The system provides actionable suggestions based on:

- **Content Length**: Optimal ranges for different platforms
- **Hashtag Usage**: Platform-specific recommendations
- **Call-to-Action**: Detection of engagement prompts
- **Readability**: Sentence length and complexity analysis
- **Formatting**: Line breaks, capitalization warnings

## 🧪 Testing

### Sample Files
Include test files in `sample-data/`:
- Sample PDF with text
- Sample image with readable text
- Edge cases (very long text, special characters)

### Manual Testing
1. Upload different file types
2. Test error handling (invalid files, large files)
3. Verify text extraction quality
4. Check engagement suggestions accuracy

## 🔍 Troubleshooting

### Common Issues

**PDF extraction fails**
- Check if pdf-parse can handle the file
- Fallback to pdf.js should work for most cases

**OCR quality poor**
- Ensure image has sufficient resolution
- Check if text is clearly readable
- Consider image preprocessing

**CORS errors**
- Verify `FRONTEND_URL` environment variable
- Check CORS configuration in server

**Memory issues**
- Reduce `MAX_OLD_SPACE_SIZE` for Tesseract
- Implement file streaming for large uploads

## 📈 Performance Considerations

- **Cold starts**: Tesseract loads on-demand
- **Memory usage**: Files processed in memory (max 20MB)
- **Concurrent processing**: Up to 5 files simultaneously
- **Caching**: Consider Redis for repeated extractions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- [pdf-parse](https://github.com/mozilla/pdf.js) for PDF text extraction
- [Tesseract.js](https://github.com/naptha/tesseract.js) for OCR capabilities
- [react-dropzone](https://github.com/react-dropzone/react-dropzone) for file handling
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
