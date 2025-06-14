
interface AnalysisSuggestion {
  section: string;
  issue: string;
  improvement: string;
  priority: 'high' | 'medium' | 'low';
}

interface LinkedInConsistency {
  field: string;
  issue: string;
}

interface AnalysisResult {
  score: number;
  summary: string;
  ats_score: number;
  content_score: number;
  format_score: number;
  suggestions: AnalysisSuggestion[];
  keywords: {
    matched: string[];
    missing: string[];
    critical_missing: string[];
  };
  red_flags: string[];
  strengths: string[];
  buzzwords: string[];
  formats: string[];
  linkedin_consistency?: LinkedInConsistency[];
  technical_skills: string[];
  soft_skills: string[];
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  industry_alignment: number;
}

interface ResumeAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  userId?: string;
  linkedinSummary?: string;
}

// Enhanced AI analysis using Cohere and Gemini APIs
async function analyzeWithCohere(resumeText: string, jobDescription?: string): Promise<AnalysisResult> {
  const cohereApiKey = import.meta.env.VITE_COHERE_API_KEY;
  
  if (!cohereApiKey) {
    throw new Error('Cohere API key not configured');
  }

  const prompt = `You are a world-class resume analysis expert. Analyze this resume and provide a comprehensive evaluation in JSON format.

Resume Text:
${resumeText}

${jobDescription ? `Job Description for targeted analysis:
${jobDescription}` : ''}

Provide a detailed analysis in the following JSON structure:
{
  "score": 85,
  "summary": "Professional summary of the resume quality and fit",
  "ats_score": 88,
  "content_score": 82,
  "format_score": 90,
  "suggestions": [
    {
      "section": "Experience",
      "issue": "Specific issue identified",
      "improvement": "Detailed improvement suggestion",
      "priority": "high"
    }
  ],
  "keywords": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["missing1", "missing2"],
    "critical_missing": ["critical1"]
  },
  "red_flags": ["flag1", "flag2"],
  "strengths": ["strength1", "strength2"],
  "buzzwords": ["overused1", "overused2"],
  "formats": ["format suggestion"],
  "technical_skills": ["skill1", "skill2"],
  "soft_skills": ["communication", "leadership"],
  "experience_level": "mid",
  "industry_alignment": 85
}

Focus on:
1. ATS compatibility and keyword optimization
2. Quantified achievements and impact statements
3. Technical skills relevance and depth
4. Leadership and soft skills demonstration
5. Format and structure optimization
6. Industry-specific requirements
7. Experience progression and career growth
8. Contact information completeness
9. Education and certification relevance
10. Overall professional presentation

Be thorough and provide actionable, specific feedback.`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.3,
        stop_sequences: [],
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.generations[0].text;
    
    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not parse JSON from Cohere response');
    }
  } catch (error) {
    console.error('Cohere analysis error:', error);
    throw error;
  }
}

async function analyzeWithGemini(resumeText: string, jobDescription?: string): Promise<AnalysisResult> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!geminiApiKey) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `As a professional resume analysis expert with 15+ years of experience, provide a comprehensive analysis of this resume. Focus on ATS optimization, content quality, and career advancement potential.

Resume Content:
${resumeText}

${jobDescription ? `Target Job Description:
${jobDescription}` : ''}

Analyze and respond ONLY with valid JSON in this exact format:
{
  "score": 85,
  "summary": "Executive summary of resume quality and recommendations",
  "ats_score": 88,
  "content_score": 82,
  "format_score": 90,
  "suggestions": [
    {
      "section": "Professional Experience",
      "issue": "Lacks quantified achievements",
      "improvement": "Add specific metrics like 'Increased sales by 25%' or 'Managed team of 12'",
      "priority": "high"
    }
  ],
  "keywords": {
    "matched": ["project management", "leadership"],
    "missing": ["agile", "stakeholder management"],
    "critical_missing": ["budget management"]
  },
  "red_flags": ["No contact information", "Employment gaps"],
  "strengths": ["Strong technical background", "Leadership experience"],
  "buzzwords": ["synergy", "thought leader"],
  "formats": ["Use bullet points", "Add skills section"],
  "technical_skills": ["Python", "SQL", "AWS"],
  "soft_skills": ["communication", "problem-solving"],
  "experience_level": "mid",
  "industry_alignment": 85
}

Evaluation Criteria:
- ATS Compatibility (25%): Keywords, format, structure
- Content Quality (35%): Achievements, quantification, relevance
- Professional Presentation (25%): Format, length, organization
- Job Alignment (15%): Skill match, experience fit

Provide specific, actionable recommendations for improvement.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.2,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Could not parse JSON from Gemini response');
    }
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw error;
  }
}

// Enhanced local analysis fallback
function analyzeLocally(resumeText: string, jobDescription?: string): AnalysisResult {
  const text = resumeText.toLowerCase();
  
  // Enhanced keyword detection
  const technicalSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'sql', 'mongodb',
    'aws', 'azure', 'docker', 'kubernetes', 'git', 'agile', 'scrum', 'machine learning',
    'artificial intelligence', 'data science', 'cloud computing', 'devops', 'ci/cd'
  ].filter(skill => text.includes(skill));

  const softSkills = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'project management',
    'analytical', 'creative', 'adaptable', 'collaborative', 'strategic thinking'
  ].filter(skill => text.includes(skill.replace(' ', ' ')));

  // Comprehensive analysis factors
  const hasContact = /email|phone|linkedin|github/.test(text);
  const hasQuantifiedAchievements = /\d+%|\$\d+|increased|decreased|improved|reduced/.test(text);
  const hasActionVerbs = /achieved|developed|implemented|managed|led|created|optimized/.test(text);
  const hasTechnicalSkills = technicalSkills.length > 0;
  const hasEducation = /education|degree|university|college|certification/.test(text);
  
  // Scoring algorithm
  let score = 0;
  score += hasContact ? 20 : 0;
  score += hasQuantifiedAchievements ? 25 : 0;
  score += hasActionVerbs ? 20 : 0;
  score += hasTechnicalSkills ? 15 : 0;
  score += hasEducation ? 10 : 0;
  score += resumeText.length > 300 ? 10 : 0;

  // ATS score calculation
  const atsScore = calculateATSScore(resumeText, jobDescription);
  
  // Generate suggestions
  const suggestions: AnalysisSuggestion[] = [];
  
  if (!hasContact) {
    suggestions.push({
      section: 'Contact Information',
      issue: 'Missing professional contact details',
      improvement: 'Add professional email, phone number, and LinkedIn profile',
      priority: 'high'
    });
  }
  
  if (!hasQuantifiedAchievements) {
    suggestions.push({
      section: 'Professional Experience',
      issue: 'Lacks quantified achievements',
      improvement: 'Add specific metrics like "Increased sales by 25%" or "Managed team of 12"',
      priority: 'high'
    });
  }

  if (technicalSkills.length < 3) {
    suggestions.push({
      section: 'Technical Skills',
      issue: 'Limited technical skills listed',
      improvement: 'Expand technical skills section with relevant technologies and tools',
      priority: 'medium'
    });
  }

  // Keyword analysis for job description
  let keywordAnalysis = { matched: [], missing: [], critical_missing: [] };
  if (jobDescription) {
    keywordAnalysis = analyzeKeywords(resumeText, jobDescription);
  }

  return {
    score: Math.min(score, 100),
    summary: generateSummary(score, suggestions),
    ats_score: atsScore,
    content_score: calculateContentScore(resumeText),
    format_score: calculateFormatScore(resumeText),
    suggestions,
    keywords: keywordAnalysis,
    red_flags: identifyRedFlags(resumeText),
    strengths: identifyStrengths(resumeText),
    buzzwords: identifyBuzzwords(resumeText),
    formats: ['Use bullet points for achievements', 'Keep to 1-2 pages', 'Use professional fonts'],
    technical_skills: technicalSkills,
    soft_skills: softSkills,
    experience_level: determineExperienceLevel(resumeText),
    industry_alignment: jobDescription ? calculateIndustryAlignment(resumeText, jobDescription) : 0
  };
}

function calculateATSScore(resumeText: string, jobDescription?: string): number {
  let score = 80; // Base ATS score
  
  // Check for ATS-friendly format indicators
  if (resumeText.includes('•') || resumeText.includes('-')) score += 5;
  if (resumeText.length > 200 && resumeText.length < 4000) score += 10;
  if (/skills|experience|education|contact/.test(resumeText.toLowerCase())) score += 5;
  
  return Math.min(score, 100);
}

function calculateContentScore(resumeText: string): number {
  let score = 60; // Base content score
  
  const achievements = (resumeText.match(/\d+%|\$\d+|increased|improved|achieved/gi) || []).length;
  score += Math.min(achievements * 5, 25);
  
  const actionVerbs = (resumeText.match(/developed|implemented|managed|led|created|optimized/gi) || []).length;
  score += Math.min(actionVerbs * 3, 15);
  
  return Math.min(score, 100);
}

function calculateFormatScore(resumeText: string): number {
  let score = 70; // Base format score
  
  if (resumeText.includes('•') || resumeText.includes('-')) score += 10;
  if (resumeText.length > 500 && resumeText.length < 3000) score += 10;
  if (/^[A-Z][a-z]+ [A-Z][a-z]+/.test(resumeText)) score += 10; // Proper name format
  
  return Math.min(score, 100);
}

function analyzeKeywords(resumeText: string, jobDescription: string): {
  matched: string[];
  missing: string[];
  critical_missing: string[];
} {
  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescription.toLowerCase();
  
  // Extract keywords from job description
  const keywords = jobLower.match(/\b[a-z]{3,}\b/g) || [];
  const uniqueKeywords = [...new Set(keywords)];
  
  const matched = uniqueKeywords.filter(keyword => resumeLower.includes(keyword));
  const missing = uniqueKeywords.filter(keyword => !resumeLower.includes(keyword));
  
  // Identify critical missing keywords (requirements)
  const critical_missing = missing.filter(keyword => 
    jobLower.includes(`required ${keyword}`) || 
    jobLower.includes(`must have ${keyword}`) ||
    jobLower.includes(`essential ${keyword}`)
  );
  
  return {
    matched: matched.slice(0, 10),
    missing: missing.slice(0, 10),
    critical_missing: critical_missing.slice(0, 5)
  };
}

function identifyRedFlags(resumeText: string): string[] {
  const flags = [];
  
  if (!/@/.test(resumeText)) flags.push('No email address found');
  if (!/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText)) flags.push('No phone number found');
  if (resumeText.length < 200) flags.push('Resume content too brief');
  if (!/education|degree|university/i.test(resumeText)) flags.push('No education section found');
  
  return flags;
}

function identifyStrengths(resumeText: string): string[] {
  const strengths = [];
  
  if (/\d+%|\$\d+/.test(resumeText)) strengths.push('Contains quantified achievements');
  if (/managed|led|supervised/i.test(resumeText)) strengths.push('Demonstrates leadership experience');
  if (/project|initiative/i.test(resumeText)) strengths.push('Shows project management skills');
  if (/award|recognition|achievement/i.test(resumeText)) strengths.push('Notable achievements and recognition');
  
  return strengths;
}

function identifyBuzzwords(resumeText: string): string[] {
  const buzzwords = ['synergy', 'thought leader', 'guru', 'ninja', 'rockstar', 'best of breed', 'paradigm'];
  return buzzwords.filter(word => resumeText.toLowerCase().includes(word));
}

function determineExperienceLevel(resumeText: string): 'entry' | 'mid' | 'senior' | 'executive' {
  const text = resumeText.toLowerCase();
  
  if (/ceo|cto|vp|director|executive/i.test(text)) return 'executive';
  if (/senior|lead|principal|manager/i.test(text)) return 'senior';
  if (/intern|entry|junior|graduate/i.test(text)) return 'entry';
  return 'mid';
}

function calculateIndustryAlignment(resumeText: string, jobDescription: string): number {
  const resumeWords = resumeText.toLowerCase().split(/\s+/);
  const jobWords = jobDescription.toLowerCase().split(/\s+/);
  
  const commonWords = resumeWords.filter(word => jobWords.includes(word));
  return Math.min((commonWords.length / jobWords.length) * 100, 100);
}

function generateSummary(score: number, suggestions: AnalysisSuggestion[]): string {
  if (score >= 90) {
    return 'Excellent resume with strong professional presentation and comprehensive content. Minor optimizations could enhance ATS compatibility.';
  } else if (score >= 75) {
    return 'Good resume foundation with room for improvement. Focus on quantifying achievements and optimizing for ATS systems.';
  } else if (score >= 60) {
    return 'Resume needs significant improvements in content quality, format, and professional presentation to compete effectively.';
  } else {
    return 'Resume requires major restructuring and content enhancement. Consider professional resume writing assistance.';
  }
}

export async function analyzeResume(request: ResumeAnalysisRequest): Promise<{
  result: AnalysisResult;
  analysisId?: string;
}> {
  const { resumeText, jobDescription } = request;
  
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume content is required');
  }

  let result: AnalysisResult;

  try {
    // Try Gemini first (generally better quality)
    result = await analyzeWithGemini(resumeText, jobDescription);
    console.log('Resume analyzed using Gemini API');
  } catch (geminiError) {
    console.warn('Gemini analysis failed, trying Cohere:', geminiError);
    
    try {
      // Fallback to Cohere
      result = await analyzeWithCohere(resumeText, jobDescription);
      console.log('Resume analyzed using Cohere API');
    } catch (cohereError) {
      console.warn('Cohere analysis failed, using local analysis:', cohereError);
      
      // Fallback to enhanced local analysis
      result = analyzeLocally(resumeText, jobDescription);
      console.log('Resume analyzed using enhanced local analysis');
    }
  }

  return { result };
}
