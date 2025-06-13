// import { supabase } from '@/integrations/supabase/client'; // TODO: Uncomment after migration

export interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  userId?: string;
}

export interface AnalysisResult {
  overallScore: number;
  atsScore: number;
  contentScore: number;
  formatScore: number;
  keywordMatch: number;
  strengths: string[];
  improvements: string[];
  missingKeywords: string[];
  suggestions: string[];
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

export interface StoredAnalysis {
  id: string;
  user_id: string;
  resume_text: string;
  job_description?: string;
  analysis_result: AnalysisResult;
  created_at: string;
  updated_at: string;
}

// Configuration for external resume analysis APIs
const RESUME_ANALYSIS_CONFIG = {
  // Option 1: Use OpenAI API for analysis
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // Cost-effective model for resume analysis
  },
  // Option 2: Use Anthropic Claude API
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307', // Fast and affordable
  },
  // Option 3: Use dedicated resume analysis service (if available)
  dedicated: {
    endpoint: import.meta.env.VITE_RESUME_API_ENDPOINT || 'https://api.resumeanalyzer.com/analyze',
  }
};

/**
 * Analyze resume using OpenAI API
 */
async function analyzeWithOpenAI(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `
You are an expert resume reviewer and career counselor. Analyze the following resume and provide a comprehensive evaluation.

${request.jobDescription ? `Job Description for comparison:\n${request.jobDescription}\n\n` : ''}

Resume to analyze:
${request.resumeText}

Please provide a detailed analysis in the following JSON format:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100),
  "contentScore": number (0-100),
  "formatScore": number (0-100),
  "keywordMatch": number (0-100, only if job description provided),
  "strengths": ["strength1", "strength2", ...],
  "improvements": ["improvement1", "improvement2", ...],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "sections": [
    {
      "name": "section name",
      "score": number (0-100),
      "feedback": "specific feedback"
    }
  ]
}

Focus on:
- ATS compatibility (formatting, keywords, structure)
- Content quality (achievements, quantified results, relevance)
- Professional formatting and readability
- Industry-specific keywords and skills
- Overall presentation and impact
${request.jobDescription ? '- Alignment with the provided job description' : ''}

Provide constructive, actionable feedback.`;

  try {
    const response = await fetch(RESUME_ANALYSIS_CONFIG.openai.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: RESUME_ANALYSIS_CONFIG.openai.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume reviewer. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No analysis content received from OpenAI');
    }

    // Parse the JSON response
    const analysisResult = JSON.parse(content) as AnalysisResult;
    
    // Validate the result structure
    if (typeof analysisResult.overallScore !== 'number' || !Array.isArray(analysisResult.strengths)) {
      throw new Error('Invalid analysis result format from OpenAI');
    }

    return analysisResult;
  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error('Failed to analyze resume with OpenAI API');
  }
}

/**
 * Analyze resume using Anthropic Claude API
 */
async function analyzeWithClaude(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const prompt = `You are an expert resume reviewer and career counselor. Analyze the following resume and provide a comprehensive evaluation.

${request.jobDescription ? `Job Description for comparison:\n${request.jobDescription}\n\n` : ''}

Resume to analyze:
${request.resumeText}

Please provide a detailed analysis in JSON format with these exact fields:
- overallScore: number (0-100)
- atsScore: number (0-100) 
- contentScore: number (0-100)
- formatScore: number (0-100)
- keywordMatch: number (0-100, only if job description provided)
- strengths: array of strings
- improvements: array of strings
- missingKeywords: array of strings
- suggestions: array of strings
- sections: array of objects with name, score, and feedback

Focus on ATS compatibility, content quality, formatting, and alignment with job requirements if provided.`;

  try {
    const response = await fetch(RESUME_ANALYSIS_CONFIG.anthropic.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: RESUME_ANALYSIS_CONFIG.anthropic.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;
    
    if (!content) {
      throw new Error('No analysis content received from Anthropic');
    }

    // Extract JSON from the response (Claude might wrap it in text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Anthropic response');
    }

    const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
    
    // Validate the result structure
    if (typeof analysisResult.overallScore !== 'number' || !Array.isArray(analysisResult.strengths)) {
      throw new Error('Invalid analysis result format from Anthropic');
    }

    return analysisResult;
  } catch (error) {
    console.error('Anthropic analysis error:', error);
    throw new Error('Failed to analyze resume with Anthropic API');
  }
}

/**
 * Fallback analysis using local heuristics
 */
function generateLocalAnalysis(request: ResumeAnalysisRequest): AnalysisResult {
  const { resumeText, jobDescription } = request;
  const text = resumeText.toLowerCase();
  
  // Basic heuristic scoring
  const hasContact = /email|phone|linkedin/.test(text);
  const hasExperience = /experience|work|job|position|role/.test(text);
  const hasEducation = /education|degree|university|college/.test(text);
  const hasSkills = /skills|technologies|programming|software/.test(text);
  const hasAchievements = /\d+%|\$\d+|increased|improved|reduced|developed/.test(text);
  
  // Word count and structure analysis
  const wordCount = resumeText.split(/\s+/).length;
  const hasGoodLength = wordCount >= 200 && wordCount <= 1000;
  
  // Basic keyword matching if job description provided
  let keywordMatch = 0;
  if (jobDescription) {
    const jobKeywords = jobDescription.toLowerCase().split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 20); // Top 20 keywords
    
    const matches = jobKeywords.filter(keyword => text.includes(keyword)).length;
    keywordMatch = Math.round((matches / jobKeywords.length) * 100);
  }

  // Calculate scores based on heuristics
  const contentScore = (
    (hasContact ? 20 : 0) +
    (hasExperience ? 25 : 0) +
    (hasEducation ? 15 : 0) +
    (hasSkills ? 20 : 0) +
    (hasAchievements ? 20 : 0)
  );

  const formatScore = (
    (hasGoodLength ? 50 : 30) +
    (resumeText.includes('\n\n') ? 25 : 15) + // Has paragraphs
    (resumeText.includes('•') || resumeText.includes('-') ? 25 : 10) // Has bullet points
  );

  const atsScore = Math.min(100, (
    (!/[^\u0080-\uFFFF]/.test(resumeText) ? 30 : 10) + // Basic ASCII characters
    (!/<[^>]*>/.test(resumeText) ? 30 : 0) + // No HTML
    (hasGoodLength ? 20 : 10) +
    (hasSkills ? 20 : 10)
  ));

  const overallScore = Math.round((contentScore + formatScore + atsScore) / 3);

  return {
    overallScore,
    atsScore,
    contentScore,
    formatScore,
    keywordMatch,
    strengths: [
      ...(hasContact ? ['Clear contact information'] : []),
      ...(hasExperience ? ['Relevant work experience'] : []),
      ...(hasAchievements ? ['Quantified achievements'] : []),
      ...(hasSkills ? ['Technical skills listed'] : []),
    ],
    improvements: [
      ...(!hasContact ? ['Add complete contact information'] : []),
      ...(!hasExperience ? ['Include work experience details'] : []),
      ...(!hasAchievements ? ['Add quantified achievements'] : []),
      ...(!hasGoodLength ? ['Optimize resume length'] : []),
    ],
    missingKeywords: jobDescription ? [
      'Industry-specific terms',
      'Technical skills',
      'Soft skills',
      'Certifications'
    ] : [],
    suggestions: [
      'Use action verbs to start bullet points',
      'Include measurable results and metrics',
      'Tailor content to the job description',
      'Ensure consistent formatting throughout',
    ],
    sections: [
      { name: 'Header & Contact', score: hasContact ? 90 : 60, feedback: hasContact ? 'Good contact info' : 'Add complete contact details' },
      { name: 'Work Experience', score: hasExperience ? 85 : 50, feedback: hasExperience ? 'Experience section present' : 'Add work experience' },
      { name: 'Skills', score: hasSkills ? 80 : 40, feedback: hasSkills ? 'Skills section included' : 'Add relevant skills' },
      { name: 'Education', score: hasEducation ? 85 : 70, feedback: hasEducation ? 'Education section present' : 'Consider adding education' },
    ]
  };
}

/**
 * Store analysis result in Supabase
 * TODO: Enable after running the resume_analyses migration
 */
async function storeAnalysisResult(
  _userId: string, 
  _request: ResumeAnalysisRequest, 
  _result: AnalysisResult
): Promise<string> {
  try {
    // TODO: Uncomment after running migration 20250613_resume_analyses.sql
    // const { data, error } = await supabase
    //   .from('resume_analyses')
    //   .insert({
    //     user_id: userId,
    //     resume_text: request.resumeText,
    //     job_description: request.jobDescription || null,
    //     analysis_result: result,
    //   })
    //   .select('id')
    //   .single();

    // if (error) {
    //   console.error('Failed to store analysis result:', error);
    //   throw new Error('Failed to save analysis result');
    // }

    // return data.id;
    
    // Temporary: Return a mock ID until migration is run
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  } catch (error) {
    console.error('Error storing analysis:', error);
    throw new Error('Failed to save analysis result');
  }
}

/**
 * Get user's previous analyses
 * TODO: Enable after running the resume_analyses migration
 */
export async function getUserAnalyses(_userId: string): Promise<StoredAnalysis[]> {
  try {
    // TODO: Uncomment after running migration 20250613_resume_analyses.sql
    // const { data, error } = await supabase
    //   .from('resume_analyses')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });

    // if (error) {
    //   console.error('Failed to fetch user analyses:', error);
    //   throw new Error('Failed to fetch analysis history');
    // }

    // return data || [];
    
    // Temporary: Return empty array until migration is run
    return [];
  } catch (error) {
    console.error('Error fetching analyses:', error);
    throw new Error('Failed to fetch analysis history');
  }
}

/**
 * Main function to analyze resume
 */
export async function analyzeResume(request: ResumeAnalysisRequest): Promise<{
  result: AnalysisResult;
  analysisId?: string;
}> {
  if (!request.resumeText?.trim()) {
    throw new Error('Resume content is required');
  }

  let result: AnalysisResult;
  let analysisId: string | undefined;

  try {
    // Try primary analysis method (OpenAI)
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      result = await analyzeWithOpenAI(request);
    }
    // Fallback to Anthropic
    else if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      result = await analyzeWithClaude(request);
    }
    // Final fallback to local analysis
    else {
      result = generateLocalAnalysis(request);
    }

    // Store result if user is authenticated
    if (request.userId) {
      try {
        analysisId = await storeAnalysisResult(request.userId, request, result);
      } catch (storageError) {
        console.warn('Failed to store analysis result:', storageError);
        // Don't fail the entire operation if storage fails
      }
    }

    return { result, analysisId };
  } catch (error) {
    console.error('Resume analysis failed:', error);
    
    // If all API methods fail, use local analysis as final fallback
    result = generateLocalAnalysis(request);
    
    return { result };
  }
}

/**
 * Get analysis by ID
 * TODO: Enable after running the resume_analyses migration
 */
export async function getAnalysisById(_analysisId: string): Promise<StoredAnalysis | null> {
  try {
    // TODO: Uncomment after running migration 20250613_resume_analyses.sql
    // const { data, error } = await supabase
    //   .from('resume_analyses')
    //   .select('*')
    //   .eq('id', analysisId)
    //   .single();

    // if (error) {
    //   console.error('Failed to fetch analysis:', error);
    //   return null;
    // }

    // return data;
    
    // Temporary: Return null until migration is run
    return null;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
}
