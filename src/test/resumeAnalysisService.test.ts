import { describe, it, expect, vi } from 'vitest';
import { analyzeResume } from '@/services/resumeAnalysisService';

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_OPENAI_API_KEY: undefined,
    VITE_ANTHROPIC_API_KEY: undefined,
  }
}));

describe('Resume Analysis Service', () => {
  it('should analyze resume with local heuristics when no API keys are provided', async () => {
    const testResume = `
John Doe
Software Engineer
Email: john@example.com
Phone: (555) 123-4567

EXPERIENCE
Senior Software Engineer at TechCorp (2020-2023)
- Developed 15+ web applications using React and Node.js
- Increased team productivity by 30% through process optimization
- Led a team of 5 developers on critical projects

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git
    `;

    const result = await analyzeResume({
      resumeText: testResume,
      jobDescription: 'Looking for a Senior Software Engineer with React and Node.js experience'
    });

    expect(result).toBeDefined();
    expect(result.result).toBeDefined();
    expect(result.result.overallScore).toBeGreaterThan(0);
    expect(result.result.overallScore).toBeLessThanOrEqual(100);
    expect(result.result.strengths).toBeInstanceOf(Array);
    expect(result.result.improvements).toBeInstanceOf(Array);
    expect(result.result.sections).toBeInstanceOf(Array);
    expect(result.result.sections.length).toBeGreaterThan(0);
  });

  it('should handle empty resume text', async () => {
    await expect(analyzeResume({
      resumeText: '',
    })).rejects.toThrow('Resume content is required');
  });

  it('should handle resume without job description', async () => {
    const testResume = `
Jane Smith
Product Manager
jane@example.com

Experience in product management and team leadership.
    `;

    const result = await analyzeResume({
      resumeText: testResume,
    });

    expect(result).toBeDefined();
    expect(result.result.keywordMatch).toBe(0); // No job description provided
    expect(result.result.missingKeywords).toEqual([]);
  });

  it('should return higher scores for well-formatted resumes', async () => {
    const wellFormattedResume = `
Alice Johnson
Senior Data Scientist
alice.johnson@email.com | (555) 987-6543 | LinkedIn: linkedin.com/in/alicejohnson

PROFESSIONAL SUMMARY
Experienced data scientist with 5+ years of expertise in machine learning, statistical analysis, and data visualization. Proven track record of delivering insights that drove $2M+ in revenue growth.

WORK EXPERIENCE
Senior Data Scientist | DataCorp Inc. | 2021-Present
• Developed machine learning models that improved prediction accuracy by 40%
• Led data science initiatives resulting in $2.5M cost savings annually
• Collaborated with cross-functional teams to implement data-driven solutions

Data Scientist | TechStart | 2019-2021
• Built predictive models using Python, R, and SQL
• Increased customer retention by 25% through data analysis
• Presented findings to C-level executives monthly

EDUCATION
Master of Science in Data Science | MIT | 2019
Bachelor of Science in Statistics | UC Berkeley | 2017

TECHNICAL SKILLS
Programming: Python, R, SQL, JavaScript
Machine Learning: Scikit-learn, TensorFlow, PyTorch
Data Visualization: Tableau, Power BI, Matplotlib
Cloud Platforms: AWS, Google Cloud, Azure
    `;

    const result = await analyzeResume({
      resumeText: wellFormattedResume,
    });

    expect(result.result.overallScore).toBeGreaterThan(70); // Should score well
    expect(result.result.strengths.length).toBeGreaterThan(2);
    expect(result.result.sections.length).toBeGreaterThan(3);
  });
});
