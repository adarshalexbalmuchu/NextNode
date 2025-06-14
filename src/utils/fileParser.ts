
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export interface ParsedContent {
  text: string;
  metadata?: {
    title?: string;
    author?: string;
    pages?: number;
    wordCount?: number;
  };
}

export const parseFile = async (file: File): Promise<ParsedContent> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'pdf':
      return await parsePDF(file);
    case 'doc':
    case 'docx':
      return await parseDOCX(file);
    case 'txt':
      return await parseTXT(file);
    default:
      throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

const parsePDF = async (file: File): Promise<ParsedContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const numPages = pdf.numPages;

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text from page
      const pageText = textContent.items
        .filter((item): item is pdfjsLib.TextItem => 'str' in item)
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
    }

    // Get document metadata
    const metadata = await pdf.getMetadata();
    
    return {
      text: fullText.trim(),
      metadata: {
        title: metadata.info?.Title || file.name,
        author: metadata.info?.Author,
        pages: numPages,
        wordCount: fullText.trim().split(/\s+/).length,
      },
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
};

const parseDOCX = async (file: File): Promise<ParsedContent> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return {
      text: result.value,
      metadata: {
        title: file.name,
        wordCount: result.value.trim().split(/\s+/).length,
      },
    };
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
};

const parseTXT = async (file: File): Promise<ParsedContent> => {
  try {
    const text = await file.text();
    
    return {
      text,
      metadata: {
        title: file.name,
        wordCount: text.trim().split(/\s+/).length,
      },
    };
  } catch (error) {
    console.error('Error parsing TXT:', error);
    throw new Error('Failed to parse TXT file');
  }
};

// Utility function to validate file type
export const isValidFileType = (file: File): boolean => {
  const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};

// Utility function to check file size (max 10MB)
export const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
