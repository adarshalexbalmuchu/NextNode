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
    expect(result.result.overallScore).toBeGreaterThan(0);
    expect(result.result.overallScore).toBeLessThanOrEqual(100);
    expect(result.result.strengths).toBeInstanceOf(Array);
    expect(result.result.improvements).toBeInstanceOf(Array);
    expect(result.result.suggestions).toBeInstanceOf(Array);
    expect(result.result.sections).toBeInstanceOf(Array);
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
    
    expect(result.result.keywordMatch).toBeGreaterThanOrEqual(0);
    expect(result.result.keywordMatch).toBeLessThanOrEqual(100);
  });

  it('should handle resume with minimal content', async () => {
    const request = {
      resumeText: 'John Doe'
    };

    const result = await analyzeResume(request);
    
    expect(result.result).toBeDefined();
    expect(result.result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.result.improvements.length).toBeGreaterThan(0);
  });

  it('should provide section-wise feedback', async () => {
    const request = {
      resumeText: 'John Doe\nEmail: john@example.com\nExperience: Software Engineer\nEducation: BS CS\nSkills: JavaScript'
    };

    const result = await analyzeResume(request);
    
    expect(result.result.sections).toBeInstanceOf(Array);
    expect(result.result.sections.length).toBeGreaterThan(0);
    
    result.result.sections.forEach(section => {
      expect(section).toHaveProperty('name');
      expect(section).toHaveProperty('score');
      expect(section).toHaveProperty('feedback');
      expect(typeof section.score).toBe('number');
      expect(section.score).toBeGreaterThanOrEqual(0);
      expect(section.score).toBeLessThanOrEqual(100);
    });
  });
});
