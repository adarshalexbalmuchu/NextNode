import { describe, it, expect } from 'vitest';
import { FileParser } from '../utils/fileParser';

describe('PDF Parsing Browser Compatibility', () => {
  it('should handle PDF parsing errors gracefully', async () => {
    // Create a mock invalid PDF file
    const invalidPdfContent = new Uint8Array([1, 2, 3, 4, 5]); // Invalid PDF data
    const file = new File([invalidPdfContent], 'invalid.pdf', { type: 'application/pdf' });

    await expect(FileParser.parseFile(file)).rejects.toThrow();
  });

  it('should validate PDF file type correctly', () => {
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    expect(FileParser.isSupportedFileType(file)).toBe(true);
  });

  it('should handle empty PDF files', async () => {
    const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });
    
    await expect(FileParser.parseFile(emptyFile)).rejects.toThrow('File is empty or invalid');
  });

  it('should validate file size for PDFs', () => {
    const normalPdf = new File(['x'.repeat(1000)], 'normal.pdf', { type: 'application/pdf' });
    expect(FileParser.validateFileSize(normalPdf)).toBe(true);

    const hugePdf = new File(['x'.repeat(11 * 1024 * 1024)], 'huge.pdf', { type: 'application/pdf' });
    expect(FileParser.validateFileSize(hugePdf)).toBe(false);
  });
});
