
import { describe, it, expect, vi } from 'vitest';
import { analyzeResume } from '../services/resumeAnalysisService';

// Mock the environment variables
const mockEnv = vi.hoisted(() => ({
  VITE_GEMINI_API_KEY: '',
  VITE_COHERE_API_KEY: '',
  VITE_HUGGINGFACE_API_KEY: '',
  VITE_OPENAI_API_KEY: '',
  VITE_ANTHROPIC_API_KEY: ''
}));

vi.mock('import.meta', () => ({
  env: mockEnv
}));

describe('Resume Analysis Service', () => {
  it('should fallback to local analysis when no API keys are provided', async () => {
    const request = {
      resumeText: 'John Doe\nSoftware Engineer\nEmail: john@example.com\nPhone: 123-456-7890\n\nExperience:\n- Developed web applications\n- Increased performance by 50%\n\nSkills:\n- JavaScript\n- React\n- Node.js\n\nEducation:\n- BS Computer Science'
    };

    const result = await analyzeResume(request);

    expect(result.result).toBeDefined();
    expect(result.result.score).toBeGreaterThan(0);
    expect(result.result.score).toBeLessThanOrEqual(100);
    expect(result.result.suggestions).toBeInstanceOf(Array);
    expect(result.result.keywords).toBeDefined();
  });

  it('should handle empty resume text', async () => {
    const request = {
      resumeText: ''
    };

    await expect(analyzeResume(request)).rejects.toThrow('Resume content is required');
  });

  it('should include keyword analysis when job description is provided', async () => {
    const request = {
      resumeText: 'John Doe\nSoftware Engineer\nJavaScript, React, Node.js experience',
      jobDescription: 'Looking for a JavaScript developer with React experience'
    };

    const result = await analyzeResume(request);

    expect(result.result.keywords).toBeDefined();
    expect(result.result.keywords.matched.length).toBeGreaterThanOrEqual(0);
    expect(result.result.keywords.missing.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle resume with minimal content', async () => {
    const request = {
      resumeText: 'John Doe'
    };

    const result = await analyzeResume(request);

    expect(result.result).toBeDefined();
    expect(result.result.score).toBeGreaterThanOrEqual(0);
    expect(result.result.suggestions.length).toBeGreaterThan(0);
  });

  it('should provide comprehensive feedback', async () => {
    const request = {
      resumeText: 'John Doe\nEmail: john@example.com\nExperience: Software Engineer\nEducation: BS CS\nSkills: JavaScript'
    };

    const result = await analyzeResume(request);

    expect(result.result.suggestions).toBeInstanceOf(Array);
    expect(result.result.keywords).toBeDefined();
    expect(result.result.technical_skills).toBeDefined();
    expect(result.result.soft_skills).toBeDefined();
  });
});
