import { describe, it, expect } from 'vitest';
import { FileParser } from '../utils/fileParser';

describe('FileParser', () => {
  describe('isSupportedFileType', () => {
    it('should support PDF files', () => {
      const file = new File([''], 'resume.pdf', { type: 'application/pdf' });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should support DOCX files', () => {
      const file = new File([''], 'resume.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should support DOC files', () => {
      const file = new File([''], 'resume.doc', { type: 'application/msword' });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should support alternative DOC MIME type', () => {
      const file = new File([''], 'resume.doc', { type: 'application/vnd.ms-word' });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should support TXT files', () => {
      const file = new File([''], 'resume.txt', { type: 'text/plain' });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should support files with missing MIME type based on extension', () => {
      const file = new File([''], 'resume.pdf', { type: '' });
      expect(FileParser.isSupportedFileType(file)).toBe(true);
    });

    it('should reject unsupported file types', () => {
      const file = new File([''], 'image.jpg', { type: 'image/jpeg' });
      expect(FileParser.isSupportedFileType(file)).toBe(false);
    });
  });

  describe('getFileTypeDescription', () => {
    it('should return correct description for PDF', () => {
      const file = new File([''], 'resume.pdf', { type: 'application/pdf' });
      expect(FileParser.getFileTypeDescription(file)).toBe('PDF Document');
    });

    it('should return correct description for DOCX', () => {
      const file = new File([''], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      expect(FileParser.getFileTypeDescription(file)).toBe('Word Document (DOCX)');
    });

    it('should return correct description for DOC', () => {
      const file = new File([''], 'resume.doc', { type: 'application/msword' });
      expect(FileParser.getFileTypeDescription(file)).toBe('Word Document (DOC)');
    });

    it('should return correct description for TXT', () => {
      const file = new File([''], 'resume.txt', { type: 'text/plain' });
      expect(FileParser.getFileTypeDescription(file)).toBe('Text File');
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under 10MB', () => {
      const file = new File(['x'.repeat(1024 * 1024)], 'resume.pdf', { type: 'application/pdf' }); // 1MB
      expect(FileParser.validateFileSize(file)).toBe(true);
    });

    it('should reject files over 10MB', () => {
      const file = new File(['x'.repeat(11 * 1024 * 1024)], 'resume.pdf', { type: 'application/pdf' }); // 11MB
      expect(FileParser.validateFileSize(file)).toBe(false);
    });
  });

  describe('getFileSizeString', () => {
    it('should format bytes correctly', () => {
      expect(FileParser.getFileSizeString(1024)).toBe('1 KB');
      expect(FileParser.getFileSizeString(1024 * 1024)).toBe('1 MB');
      expect(FileParser.getFileSizeString(1024 * 1024 * 1024)).toBe('1 GB');
    });
  });

  describe('cleanExtractedText', () => {
    it('should clean up excessive whitespace', () => {
      const dirtyText = 'Hello    world\n\n\n\nThis is    a test\n\n\n';
      const cleanText = FileParser.cleanExtractedText(dirtyText);
      expect(cleanText).toBe('Hello world This is a test');
    });

    it('should trim whitespace', () => {
      const dirtyText = '   Hello world   ';
      const cleanText = FileParser.cleanExtractedText(dirtyText);
      expect(cleanText).toBe('Hello world');
    });
  });
});
