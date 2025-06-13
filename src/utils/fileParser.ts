// File parser utility for Resume Analyzer
// Supports TXT, PDF, DOC, and DOCX files

/**
 * Parse different file types and extract text content
 */
export class FileParser {
  
  /**
   * Parse uploaded file and extract text content
   */
  static async parseFile(file: File): Promise<string> {
    const fileExtension = this.getFileExtension(file.name);
    
    // Validate file exists and has content
    if (!file || file.size === 0) {
      throw new Error('File is empty or invalid');
    }
    
    switch (fileExtension) {
      case 'txt':
        return this.parseTextFile(file);
      case 'pdf':
        return this.parsePdfFile(file);
      case 'doc':
      case 'docx':
        return this.parseWordFile(file);
      default:
        throw new Error(`Unsupported file type: .${fileExtension}. Please use PDF, Word (.doc/.docx), or Text (.txt) files.`);
    }
  }

  /**
   * Get file extension from filename
   */
  private static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file type is supported
   */
  static isSupportedFileType(file: File): boolean {
    const supportedTypes = [
      'text/plain',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Additional MIME types for better compatibility
      'application/vnd.ms-word',
      'application/doc',
      'application/x-doc',
      'application/x-msword',
      '',  // Some browsers don't set MIME type correctly
    ];
    
    const supportedExtensions = ['txt', 'pdf', 'doc', 'docx'];
    const extension = this.getFileExtension(file.name);
    
    return supportedTypes.includes(file.type) || supportedExtensions.includes(extension);
  }

  /**
   * Get human-readable file type description
   */
  static getFileTypeDescription(file: File): string {
    const extension = this.getFileExtension(file.name);
    switch (extension) {
      case 'txt':
        return 'Text File';
      case 'pdf':
        return 'PDF Document';
      case 'doc':
        return 'Word Document (DOC)';
      case 'docx':
        return 'Word Document (DOCX)';
      default:
        return 'Document';
    }
  }

  /**
   * Parse plain text file
   */
  private static parseTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && content.trim()) {
          resolve(content);
        } else {
          reject(new Error('Text file is empty or could not be read'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read text file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Parse PDF file using pdfjs-dist for proper text extraction
   */
  private static async parsePdfFile(file: File): Promise<string> {
    try {
      // Dynamic import for better bundle management
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source for PDF.js
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        try {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          // Combine all text items into a string
          const pageText = textContent.items
            .filter((item: { str?: string }) => item.str) // Filter out empty strings
            .map((item: { str: string }) => item.str)
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n';
          }
        } catch (pageError) {
          console.warn(`Error extracting text from page ${pageNum}:`, pageError);
          // Continue with other pages
        }
      }
      
      // Clean up the extracted text
      fullText = this.cleanExtractedText(fullText);
      
      if (fullText && fullText.trim()) {
        return fullText;
      } else {
        throw new Error('PDF file appears to contain no extractable text. This might be a scanned document that requires OCR, or the text may be embedded as images.');
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('Invalid PDF')) {
          throw new Error('Invalid PDF file. Please ensure the file is not corrupted.');
        } else if (error.message.includes('encrypted') || error.message.includes('password')) {
          throw new Error('Password-protected PDFs are not supported. Please remove the password and try again.');
        } else if (error.message.includes('XRef')) {
          throw new Error('PDF file structure is corrupted or unsupported. Please try re-saving the PDF.');
        } else if (error.message.includes('no extractable text')) {
          throw error; // Re-throw our custom message
        } else {
          throw new Error('Failed to extract text from PDF. The file may be corrupted, password-protected, or contain only images. For best results, please convert to Word (.docx) or Text (.txt) format.');
        }
      } else {
        throw new Error('Failed to process PDF file. Please try converting to Word (.docx) or Text (.txt) format for better results.');
      }
    }
  }

  /**
   * Parse Word document (DOC/DOCX) using mammoth
   */
  private static async parseWordFile(file: File): Promise<string> {
    try {
      const extension = this.getFileExtension(file.name);
      
      if (extension === 'docx') {
        // Use mammoth for DOCX files
        const mammoth = (await import('mammoth')).default;
        const arrayBuffer = await file.arrayBuffer();
        
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (result.value && result.value.trim()) {
          return result.value.trim();
        } else {
          throw new Error('DOCX file appears to be empty');
        }
      } else if (extension === 'doc') {
        // For legacy DOC files, we'll try to parse them as well
        // Note: This is a basic implementation and may not work for all DOC files
        try {
          const mammoth = (await import('mammoth')).default;
          const arrayBuffer = await file.arrayBuffer();
          
          // Try to parse as if it's a DOCX (some DOC files might work)
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          if (result.value && result.value.trim()) {
            return result.value.trim();
          } else {
            throw new Error('Could not extract text from DOC file');
          }
        } catch {
          // If mammoth fails, provide helpful guidance
          throw new Error('Legacy DOC format detected. For best results, please save your document as DOCX or PDF format. Some older DOC files may not be fully supported.');
        }
      } else {
        throw new Error('Unsupported Word document format');
      }
    } catch (error) {
      console.error('Word document parsing error:', error);
      
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Failed to extract text from Word document. Please try saving as DOCX or PDF format.');
      }
    }
  }

  /**
   * Validate file size (max 10MB)
   */
  static validateFileSize(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return file.size <= maxSize;
  }

  /**
   * Get file size in human-readable format
   */
  static getFileSizeString(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Clean extracted text for better analysis
   */
  static cleanExtractedText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove excessive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Trim whitespace
      .trim();
  }
}
