
import { describe, it, expect } from 'vitest';
import { parseFile, isValidFileType } from '../utils/fileParser';

describe('PDF Parsing in Browser', () => {
  it('should validate PDF file types', () => {
    const pdfFile = new File(['fake pdf content'], 'resume.pdf', { type: 'application/pdf' });
    expect(isValidFileType(pdfFile)).toBe(true);
  });

  it('should handle PDF parsing errors gracefully', async () => {
    const invalidPdfFile = new File(['not a real pdf'], 'fake.pdf', { type: 'application/pdf' });
    
    await expect(parseFile(invalidPdfFile)).rejects.toThrow('Failed to parse PDF file');
  });

  it('should accept various PDF MIME types', () => {
    const pdfFile1 = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const pdfFile2 = new File(['content'], 'test.pdf', { type: 'application/x-pdf' });
    
    expect(isValidFileType(pdfFile1)).toBe(true);
    expect(isValidFileType(pdfFile2)).toBe(true);
  });
});
