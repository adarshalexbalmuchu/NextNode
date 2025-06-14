
import { describe, it, expect } from 'vitest';
import { parseFile, isValidFileType, isValidFileSize } from '../utils/fileParser';

describe('FileParser', () => {
  it('should validate file types correctly', () => {
    const validFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const invalidFile = new File(['test'], 'test.exe', { type: 'application/octet-stream' });
    
    expect(isValidFileType(validFile)).toBe(true);
    expect(isValidFileType(invalidFile)).toBe(false);
  });

  it('should validate file sizes correctly', () => {
    const smallFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const largeFile = new File([new ArrayBuffer(12 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
    
    expect(isValidFileSize(smallFile)).toBe(true);
    expect(isValidFileSize(largeFile)).toBe(false);
  });

  it('should parse text files correctly', async () => {
    const file = new File(['Hello world'], 'test.txt', { type: 'text/plain' });
    const result = await parseFile(file);
    
    expect(result).toBe('Hello world');
  });

  it('should throw error for unsupported file types', async () => {
    const file = new File(['test'], 'test.exe', { type: 'application/octet-stream' });
    
    await expect(parseFile(file)).rejects.toThrow('Unsupported file type: exe');
  });
});
