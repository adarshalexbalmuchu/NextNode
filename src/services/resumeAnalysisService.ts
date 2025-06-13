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
  // Option 1: Use OpenAI API for analysis (PAID)
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini', // Cost-effective model for resume analysis
  },
  // Option 2: Use Anthropic Claude API (PAID)
  anthropic: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-haiku-20240307', // Fast and affordable
  },
  // Option 3: Use Hugging Face Inference API (FREE TIER)
  huggingface: {
    endpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
    textGenEndpoint: 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
    // Alternative models for different tasks
    models: {
      textGeneration: 'microsoft/DialoGPT-medium',
      questionAnswering: 'deepset/roberta-base-squad2',
      summarization: 'facebook/bart-large-cnn'
    }
  },
  // Option 4: Use Cohere API (FREE TIER - 5M tokens/month)
  cohere: {
    endpoint: 'https://api.cohere.ai/v1/generate',
    model: 'command-light', // Free tier model
  },
  // Option 5: Use Google Gemini API (FREE TIER)
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    model: 'gemini-pro'
  },
  // Option 6: Use dedicated resume analysis service (if available)
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
 * Analyze resume using Hugging Face Inference API (FREE TIER)
 */
async function analyzeWithHuggingFace(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Hugging Face API key not configured');
  }

  const prompt = `Analyze this resume and provide feedback in JSON format:

Resume: ${request.resumeText.substring(0, 1000)}

${request.jobDescription ? `Job Description: ${request.jobDescription.substring(0, 500)}` : ''}

Please respond with JSON containing scores (0-100) for overall, ats, content, format${request.jobDescription ? ', and keyword match' : ''}.`;

  try {
    // Use the text generation model for analysis
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.3,
          return_full_text: false
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Hugging Face might return an array or object
    const result = Array.isArray(data) ? data[0] : data;
    const generatedText = result.generated_text || result.text || '';
    
    // Try to extract JSON or fall back to heuristic analysis
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedResult = JSON.parse(jsonMatch[0]);
        return {
          overallScore: parsedResult.overall || 75,
          atsScore: parsedResult.ats || 70,
          contentScore: parsedResult.content || 75,
          formatScore: parsedResult.format || 70,
          keywordMatch: parsedResult.keywordMatch || (request.jobDescription ? 60 : 0),
          strengths: parsedResult.strengths || ['Professional layout', 'Clear structure'],
          improvements: parsedResult.improvements || ['Add more quantified achievements', 'Include relevant keywords'],
          missingKeywords: parsedResult.missingKeywords || [],
          suggestions: parsedResult.suggestions || ['Use action verbs', 'Quantify achievements'],
          sections: parsedResult.sections || [
            { name: 'Overall', score: 75, feedback: 'Good foundation, needs refinement' }
          ]
        };
      }
    } catch {
      // Fall back to enhanced local analysis with AI hints
    }
    
    // Enhanced local analysis with AI insights
    return generateEnhancedLocalAnalysis(request, generatedText);
    
  } catch (error) {
    console.error('Hugging Face analysis error:', error);
    throw new Error('Failed to analyze resume with Hugging Face API');
  }
}

/**
 * Analyze resume using Cohere API (FREE TIER - 5M tokens/month)
 */
async function analyzeWithCohere(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Cohere API key not configured');
  }

  const prompt = `You are a STRICT resume reviewer and hiring manager. Provide honest, critical feedback. Most resumes have significant flaws - don't be generous with scores unless truly deserved.

STRICT SCORING SCALE:
- 90-100: Exceptional (rare) - Outstanding resumes with perfect job match
- 80-89: Very good - Minor issues only
- 70-79: Good - Several improvement areas
- 60-69: Average - Multiple significant problems
- 50-59: Below average - Major issues affecting job prospects
- 30-49: Poor - Fundamental problems, needs major work
- 0-29: Very poor - Critical flaws, complete overhaul needed

EVALUATION REQUIREMENTS:
✓ Contact info: Professional email + phone (missing = major penalty)
✓ Quantified achievements: Specific numbers/results (none = major penalty)  
✓ Job matching: Must align with job requirements (poor match = low score)
✓ Experience: Clear progression with companies/dates
✓ ATS format: Simple, keyword-rich, no fancy formatting
✓ Length: 1-2 pages (too short/long = penalty)

${request.jobDescription ? `JOB REQUIREMENTS TO MATCH AGAINST:
${request.jobDescription}

CRITICAL: Score keywordMatch harshly - if resume doesn't clearly show the EXACT skills and experience needed for this specific role, give low scores.` : ''}

RESUME TO EVALUATE:
${request.resumeText}

Be brutally honest. Identify specific problems. Don't inflate scores.

Return JSON:
{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "formatScore": <number 0-100>,
  ${request.jobDescription ? '"keywordMatch": <number 0-100>,' : ''}
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["CRITICAL: specific problem 1", "specific problem 2"],
  "missingKeywords": ["missing requirement 1", "missing requirement 2"],
  "suggestions": ["actionable fix 1", "actionable fix 2"],
  "sections": [{"name": "section", "score": <0-100>, "feedback": "honest assessment"}]
}`;

  try {
    const response = await fetch(RESUME_ANALYSIS_CONFIG.cohere.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: RESUME_ANALYSIS_CONFIG.cohere.model,
        prompt: prompt,
        max_tokens: 1500,
        temperature: 0.3,
        stop_sequences: ['--'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.generations?.[0]?.text || '';
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
        
        // Validate and ensure all required fields exist
        return {
          overallScore: analysisResult.overallScore || 75,
          atsScore: analysisResult.atsScore || 70,
          contentScore: analysisResult.contentScore || 75,
          formatScore: analysisResult.formatScore || 70,
          keywordMatch: analysisResult.keywordMatch || (request.jobDescription ? 60 : 0),
          strengths: analysisResult.strengths || ['Professional appearance'],
          improvements: analysisResult.improvements || ['Add more specific achievements'],
          missingKeywords: analysisResult.missingKeywords || [],
          suggestions: analysisResult.suggestions || ['Use strong action verbs'],
          sections: analysisResult.sections || [
            { name: 'Overall', score: 75, feedback: 'Good structure with room for improvement' }
          ]
        };
      }
    } catch {
      console.warn('Could not parse Cohere JSON response, using enhanced local analysis');
    }
    
    // Fall back to enhanced analysis
    return generateEnhancedLocalAnalysis(request, generatedText);
    
  } catch (error) {
    console.error('Cohere analysis error:', error);
    throw new Error('Failed to analyze resume with Cohere API');
  }
}

/**
 * Analyze resume using Google Gemini API (FREE TIER)
 */
async function analyzeWithGemini(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not configured');
  }

  const prompt = `You are a CRITICAL resume reviewer and experienced hiring manager. Your job is to provide honest, tough feedback that will genuinely help job seekers improve their resumes. Be strict in your scoring - most resumes have significant issues that need addressing.

IMPORTANT SCORING GUIDELINES:
- 90-100: Exceptional resumes (rare) - Perfect formatting, strong achievements, excellent job match
- 80-89: Very good resumes - Minor improvements needed
- 70-79: Good resumes - Several areas need work  
- 60-69: Average resumes - Multiple significant issues
- 50-59: Below average - Major problems that hurt job prospects
- 30-49: Poor resumes - Fundamental issues, unlikely to get interviews
- 0-29: Very poor - Critical problems, needs complete overhaul

CRITICAL EVALUATION CRITERIA:
1. CONTACT INFO: Must have professional email + phone. Missing either = major penalty
2. QUANTIFIED ACHIEVEMENTS: Look for specific numbers, percentages, dollar amounts. No numbers = major penalty
3. JOB MATCHING: If job description provided, resume MUST closely match requirements. Poor match = low score
4. WORK EXPERIENCE: Must show clear career progression with company names and dates
5. ATS COMPATIBILITY: Simple formatting, no graphics/tables, proper keywords
6. LENGTH: 1-2 pages optimal. Too short (<300 words) or too long (>1000 words) = penalty

${request.jobDescription ? `JOB DESCRIPTION FOR COMPARISON:
${request.jobDescription}

CRITICAL: Compare the resume against this specific job. Score keyword matching harshly - if the resume doesn't clearly demonstrate the required skills and experience for THIS specific role, give a low keywordMatch score.` : ''}

RESUME TO ANALYZE:
${request.resumeText}

Provide brutally honest analysis as JSON. Be specific about what's wrong and what's missing. Don't be generous with scores unless the resume truly deserves it.

JSON format:
{
  "overallScore": number (0-100),
  "atsScore": number (0-100), 
  "contentScore": number (0-100),
  "formatScore": number (0-100),
  ${request.jobDescription ? '"keywordMatch": number (0-100),' : ''}
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["CRITICAL: specific issue 1", "specific issue 2"],
  "missingKeywords": ["missing keyword 1", "missing keyword 2"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
  "sections": [{"name": "section", "score": number, "feedback": "specific feedback"}]
}`;

  try {
    const response = await fetch(`${RESUME_ANALYSIS_CONFIG.gemini.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = JSON.parse(jsonMatch[0]) as AnalysisResult;
        
        // Validate the result structure
        if (typeof analysisResult.overallScore === 'number' && Array.isArray(analysisResult.strengths)) {
          return analysisResult;
        }
      }
    } catch {
      console.warn('Could not parse Gemini JSON response, using enhanced local analysis');
    }
    
    // Fall back to enhanced analysis
    return generateEnhancedLocalAnalysis(request, generatedText);
    
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error('Failed to analyze resume with Gemini API');
  }
}

/**
 * Enhanced local analysis that incorporates AI insights when available
 */
function generateEnhancedLocalAnalysis(request: ResumeAnalysisRequest, aiText?: string): AnalysisResult {
  const localResult = generateLocalAnalysis(request);
  
  // If we have AI text, try to extract insights
  if (aiText) {
    const aiLower = aiText.toLowerCase();
    
    // Look for positive keywords in AI response
    const positiveKeywords = ['good', 'strong', 'excellent', 'well', 'clear', 'professional'];
    const negativeKeywords = ['weak', 'missing', 'poor', 'lack', 'improve', 'needs'];
    
    const positiveCount = positiveKeywords.filter(word => aiLower.includes(word)).length;
    const negativeCount = negativeKeywords.filter(word => aiLower.includes(word)).length;
    
    // Adjust scores based on AI sentiment
    const aiBoost = Math.max(-10, Math.min(10, (positiveCount - negativeCount) * 5));
    
    return {
      ...localResult,
      overallScore: Math.max(0, Math.min(100, localResult.overallScore + aiBoost)),
      contentScore: Math.max(0, Math.min(100, localResult.contentScore + aiBoost)),
      suggestions: [
        ...localResult.suggestions,
        'Consider AI-powered optimization',
        'Review industry-specific terminology'
      ]
    };
  }
  
  return localResult;
}

/**
 * Fallback analysis using sophisticated local heuristics
 */
function generateLocalAnalysis(request: ResumeAnalysisRequest): AnalysisResult {
  const { resumeText, jobDescription } = request;
  const text = resumeText.toLowerCase();
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
  
  // === CRITICAL CONTENT ANALYSIS ===
  
  // Contact Information (Critical - 0 points without)
  const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(resumeText);
  const hasPhone = /(\+\d{1,3}[- ]?)?\d{10}|(\(\d{3}\))\s*\d{3}[- ]?\d{4}/.test(resumeText);
  const contactScore = hasEmail && hasPhone ? 20 : hasEmail || hasPhone ? 10 : 0;
  
  // Professional Experience (Most Critical)
  const experienceKeywords = ['experience', 'employment', 'work history', 'professional', 'career'];
  const hasExperienceSection = experienceKeywords.some(keyword => text.includes(keyword));
  const companyIndicators = /\b(inc\.|llc|corp\.|company|ltd\.|limited|group|tech|systems|solutions)\b/gi;
  const hasCompanyNames = (resumeText.match(companyIndicators) || []).length >= 1;
  const datePatterns = /\b(20\d{2}|19\d{2})\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+20\d{2}\b/gi;
  const hasDates = (resumeText.match(datePatterns) || []).length >= 2;
  const hasJobTitles = /\b(manager|director|engineer|analyst|developer|specialist|coordinator|assistant|lead|senior|junior)\b/gi.test(text);
  
  const experienceScore = (
    (hasExperienceSection ? 10 : 0) +
    (hasCompanyNames ? 15 : 0) +
    (hasDates ? 10 : 0) +
    (hasJobTitles ? 15 : 0)
  );
  
  // Quantified Achievements (Very Important)
  const achievementPatterns = [
    /\d+%/g, // percentages
    /\$[\d,]+/g, // money
    /\b\d+\s+(million|thousand|k|m)\b/gi, // large numbers
    /\b(increased|decreased|improved|reduced|grew|saved|generated|managed|led)\s+.*?\d+/gi,
    /\b\d+\s+(people|employees|team|projects|clients|customers)/gi
  ];
  const achievementCount = achievementPatterns.reduce((count, pattern) => 
    count + (resumeText.match(pattern) || []).length, 0);
  const achievementScore = Math.min(20, achievementCount * 5);
  
  // Skills Section
  const techSkills = /\b(javascript|python|java|react|node|sql|aws|azure|docker|kubernetes|git|agile|scrum)\b/gi;
  const skillsSection = /\b(skills|technologies|technical|programming|languages)\b/i.test(text);
  const techSkillCount = (resumeText.match(techSkills) || []).length;
  const skillsScore = (skillsSection ? 10 : 0) + Math.min(10, techSkillCount * 2);
  
  // Education
  const educationKeywords = /\b(education|degree|university|college|bachelor|master|phd|certification)\b/i;
  const hasEducation = educationKeywords.test(text);
  const educationScore = hasEducation ? 10 : 5;
  
  // === JOB DESCRIPTION MATCHING ===
  let keywordMatch = 0;
  let jobMatchScore = 0;
  let missingKeywords: string[] = [];
  
  if (jobDescription) {
    const jobText = jobDescription.toLowerCase();
    
    // Extract key requirements from job description
    const requirementKeywords = [
      // Technical skills
      ...((jobText.match(/\b(javascript|python|java|react|node|sql|aws|azure|docker|kubernetes|git|agile|scrum|html|css|typescript|angular|vue|spring|mongodb|postgresql|mysql|redis|elasticsearch|kafka|jenkins|terraform|ansible|linux|windows|mac|ios|android|swift|kotlin|flutter|dart|golang|rust|scala|php|ruby|rails|django|flask|express|fastapi)\b/gi) || [])),
      // Soft skills  
      ...((jobText.match(/\b(leadership|communication|teamwork|problem.solving|analytical|creative|adaptable|organized|detail.oriented|time.management|project.management|collaboration|presentation|negotiation|customer.service)\b/gi) || [])),
      // Experience levels
      ...((jobText.match(/\b(\d+\+?\s*years?|senior|junior|mid.level|lead|principal|architect|manager|director)\b/gi) || [])),
      // Industries/domains
      ...((jobText.match(/\b(fintech|healthcare|e.commerce|saas|startup|enterprise|automotive|aerospace|gaming|social.media|mobile|web|cloud|ai|machine.learning|data.science|cybersecurity|blockchain)\b/gi) || []))
    ];
    
    const uniqueRequirements = [...new Set(requirementKeywords.map(k => k.toLowerCase()))];
    const resumeMatches = uniqueRequirements.filter(req => text.includes(req.toLowerCase()));
    
    keywordMatch = uniqueRequirements.length > 0 ? Math.round((resumeMatches.length / uniqueRequirements.length) * 100) : 0;
    jobMatchScore = Math.round(keywordMatch * 0.3); // Up to 30 points for job matching
    
    missingKeywords = uniqueRequirements.filter(req => !text.includes(req.toLowerCase())).slice(0, 10);
  }
  
  // === CRITICAL SCORING SYSTEM ===
  const contentScore = Math.min(100, contactScore + experienceScore + achievementScore + skillsScore + educationScore + jobMatchScore);
  
  // Format Analysis (More Critical)
  const wordCount = resumeText.split(/\s+/).length;
  const isOptimalLength = wordCount >= 300 && wordCount <= 800;
  const hasBulletPoints = /[•\-*]\s/.test(resumeText);
  const hasProperSections = lines.filter(line => /^[A-Z\s]+$/.test(line.trim())).length >= 3;
  const hasConsistentFormatting = !/\t/.test(resumeText) && !/ {3,}/.test(resumeText);
  
  const formatScore = Math.min(100, 
    (isOptimalLength ? 30 : wordCount < 200 ? 10 : wordCount > 1200 ? 15 : 20) +
    (hasBulletPoints ? 25 : 10) +
    (hasProperSections ? 25 : 10) +
    (hasConsistentFormatting ? 20 : 15)
  );
  
  // ATS Compatibility (Stricter)
  const hasSpecialChars = /[^\w\s\-.@()+/,]/.test(resumeText);
  const hasComplexFormatting = /<[^>]*>|{|}|\[|\]/.test(resumeText);
  const isAsciiCompatible = /^[\u0020-\u007F]*$/.test(resumeText);
  
  const atsScore = Math.min(100,
    (isAsciiCompatible ? 30 : 15) +
    (!hasSpecialChars ? 25 : 10) +
    (!hasComplexFormatting ? 25 : 10) +
    (hasEmail && hasPhone ? 20 : 10)
  );
  
  // === OVERALL SCORE (Much More Critical) ===
  const rawOverallScore = Math.round((contentScore * 0.5) + (formatScore * 0.25) + (atsScore * 0.25));
  
  // Apply critical penalties
  let overallScore = rawOverallScore;
  if (!hasEmail) {
    overallScore = Math.min(overallScore, 40); // No email = max 40
  }
  if (!hasExperienceSection && !hasCompanyNames) {
    overallScore = Math.min(overallScore, 35); // No experience = max 35
  }
  if (achievementCount === 0) {
    overallScore = Math.min(overallScore, 60); // No achievements = max 60
  }
  if (wordCount < 150) {
    overallScore = Math.min(overallScore, 30); // Too short = max 30
  }
  if (jobDescription && keywordMatch < 20) {
    overallScore = Math.min(overallScore, 45); // Poor job match = max 45
  }
  
  // === DETAILED FEEDBACK ===
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  if (hasEmail && hasPhone) {
    strengths.push('Complete contact information provided');
  }
  if (achievementCount >= 3) {
    strengths.push(`${achievementCount} quantified achievements found`);
  }
  if (hasExperienceSection && hasCompanyNames) {
    strengths.push('Clear work experience with company names');
  }
  if (hasBulletPoints) {
    strengths.push('Good use of bullet points for readability');
  }
  if (keywordMatch > 50) {
    strengths.push(`Strong keyword match (${keywordMatch}%) with job requirements`);
  }
  if (isOptimalLength) {
    strengths.push('Optimal resume length for ATS systems');
  }
  
  if (!hasEmail) {
    improvements.push('CRITICAL: Add professional email address');
  }
  if (!hasPhone) {
    improvements.push('Add phone number');
  }
  if (achievementCount === 0) {
    improvements.push('CRITICAL: Add quantified achievements with numbers/percentages');
  }
  if (!hasExperienceSection) {
    improvements.push('CRITICAL: Add professional experience section');
  }
  if (!hasCompanyNames) {
    improvements.push('Include company names in work history');
  }
  if (wordCount < 200) {
    improvements.push('Resume is too short - add more detail');
  }
  if (wordCount > 1000) {
    improvements.push('Resume is too long - consider condensing');
  }
  if (jobDescription && keywordMatch < 30) {
    improvements.push(`CRITICAL: Only ${keywordMatch}% keyword match - tailor to job description`);
  }
  if (!hasBulletPoints) {
    improvements.push('Use bullet points to improve readability');
  }
  
  const suggestions = [
    'Start each bullet point with strong action verbs',
    'Include specific metrics and results in your achievements',
    'Ensure consistent formatting throughout the document',
    'Use industry-specific keywords from the job posting',
    'Keep resume to 1-2 pages maximum',
    'Proofread for grammar and spelling errors'
  ];

  return {
    overallScore: Math.max(0, Math.min(100, overallScore)),
    atsScore: Math.max(0, Math.min(100, atsScore)),
    contentScore: Math.max(0, Math.min(100, contentScore)),
    formatScore: Math.max(0, Math.min(100, formatScore)),
    keywordMatch,
    strengths,
    improvements,
    missingKeywords,
    suggestions,
    sections: [
      { 
        name: 'Contact Information', 
        score: Math.min(100, contactScore * 5), 
        feedback: hasEmail && hasPhone ? 'Complete contact info' : 'Missing email or phone' 
      },
      { 
        name: 'Professional Experience', 
        score: Math.min(100, experienceScore * 2), 
        feedback: experienceScore > 30 ? 'Good experience section' : 'Needs more detailed experience' 
      },
      { 
        name: 'Achievements & Impact', 
        score: Math.min(100, achievementScore * 5), 
        feedback: achievementCount > 0 ? `${achievementCount} quantified achievements` : 'Add quantified achievements' 
      },
      { 
        name: 'Skills & Keywords', 
        score: Math.min(100, (skillsScore + jobMatchScore) * 3), 
        feedback: keywordMatch > 30 ? 'Good keyword alignment' : 'Improve keyword matching' 
      },
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
    // Smart API selection to maximize daily credits
    // Strategy: Use both Gemini and Cohere for best coverage
    
    // Option 1: Google Gemini (1,500/day) - Try first for best quality
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      try {
        result = await analyzeWithGemini(request);
      } catch (geminiError) {
        console.warn('⚠️ Gemini API failed (might be rate limited), trying Cohere...', geminiError);
        
        // Option 2: Cohere (5M tokens/month) - Fallback with high volume limit
        if (import.meta.env.VITE_COHERE_API_KEY) {
          try {
            result = await analyzeWithCohere(request);
          } catch (cohereError) {
            console.warn('⚠️ Cohere API also failed, trying remaining options...', cohereError);
            throw cohereError; // Continue to next fallback
          }
        } else {
          throw geminiError; // No Cohere key, continue to next fallback
        }
      }
    }
    // If no Gemini key, start with Cohere
    else if (import.meta.env.VITE_COHERE_API_KEY) {
      try {
        result = await analyzeWithCohere(request);
      } catch (cohereError) {
        console.warn('⚠️ Cohere API failed, trying other options...', cohereError);
        throw cohereError; // Continue to next fallback
      }
    }
    // Option 3: Hugging Face (if configured)
    else if (import.meta.env.VITE_HUGGINGFACE_API_KEY) {
      try {
        result = await analyzeWithHuggingFace(request);
      } catch (hfError) {
        console.warn('⚠️ Hugging Face API failed, trying paid options...', hfError);
        throw hfError; // Continue to next fallback
      }
    }
    // Option 4: OpenAI (PAID - if configured)
    else if (import.meta.env.VITE_OPENAI_API_KEY) {
      try {
        result = await analyzeWithOpenAI(request);
      } catch (openaiError) {
        console.warn('⚠️ OpenAI API failed, trying final option...', openaiError);
        throw openaiError; // Continue to next fallback
      }
    }
    // Option 5: Anthropic (PAID - if configured)
    else if (import.meta.env.VITE_ANTHROPIC_API_KEY) {
      try {
        result = await analyzeWithClaude(request);
      } catch (claudeError) {
        console.warn('⚠️ All APIs failed, using enhanced local analysis...', claudeError);
        throw claudeError; // Use local analysis
      }
    }
    // Final fallback to enhanced local analysis
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
    console.error('🚨 All API methods failed, using enhanced local analysis as final backup:', error);
    
    // If all API methods fail, use enhanced local analysis as final fallback
    result = generateEnhancedLocalAnalysis(request);
    
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
