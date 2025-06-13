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
    
    switch (fileExtension) {
      case 'txt':
        return this.parseTextFile(file);
      case 'pdf':
        return this.parsePdfFile(file);
      case 'doc':
      case 'docx':
        return this.parseWordFile(file);
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
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
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
        return 'Unknown File Type';
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
   * Parse PDF file using pdf-parse
   */
  private static async parsePdfFile(file: File): Promise<string> {
    try {
      // Dynamic import to reduce bundle size
      const pdfParse = (await import('pdf-parse')).default;
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const pdfData = await pdfParse(buffer);
      
      if (pdfData.text && pdfData.text.trim()) {
        return pdfData.text.trim();
      } else {
        throw new Error('PDF file appears to be empty or contains no extractable text');
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Failed to extract text from PDF. The file may be corrupted, password-protected, or contain only images.');
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
      } else {
        // For DOC files, we'll show a helpful message
        throw new Error('DOC files are not fully supported. Please save your document as DOCX or PDF format for best results.');
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
