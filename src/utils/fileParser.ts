
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

// Locally declare types (since not exported by pdfjs-dist)
type TextItem = { str: string };

const parseFile = async (file: File): Promise<ParsedContent> => {
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

      // Extract text just from page items with 'str' property
      const pageText = textContent.items
        .filter((item): item is TextItem => typeof (item as any).str === 'string')
        .map(item => (item as TextItem).str)
        .join(' ');

      fullText += pageText + '\n';
    }

    // Get document metadata
    const metadata = await pdf.getMetadata();
    const info = metadata?.info || {};

    return {
      text: fullText.trim(),
      metadata: {
        title: typeof info['Title'] === 'string' ? info['Title'] : file.name,
        author: typeof info['Author'] === 'string' ? info['Author'] : undefined,
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
const isValidFileType = (file: File): boolean => {
  const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};

// Utility function to check file size (max 10MB)
const isValidFileSize = (file: File, maxSizeMB: number = 10): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

// Clean extracted text (for use in ResumeAnalyzer)
const cleanExtractedText = (text: string) =>
  text.replace(/\s+/g, ' ').trim();

const getFileTypeDescription = (file: File): string => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'PDF Document';
    case 'docx':
      return 'Word Document (DOCX)';
    case 'doc':
      return 'Word Document (DOC)';
    case 'txt':
      return 'Text File';
    default:
      return 'File';
  }
};

const getFileSizeString = (bytes: number) => {
  if (bytes >= 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024 * 1024))} GB`;
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / (1024 * 1024))} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} bytes`;
};

// FileParser object for backward compatibility with all tests and usages
export const FileParser = {
  parseFile,
  isSupportedFileType: isValidFileType,
  validateFileSize: isValidFileSize,
  cleanExtractedText,
  getFileTypeDescription,
  getFileSizeString,
};

export {
  parseFile,
  isValidFileType,
  isValidFileSize,
  cleanExtractedText,
  getFileTypeDescription,
  getFileSizeString,
};
