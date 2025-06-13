// import { supabase } from '@/integrations/supabase/client'; // TODO: Uncomment after migration

export interface ResumeAnalysisRequest {
  resumeText: string;
  jobTitle?: string;
  industry?: string;
  jobDescription?: string;
  linkedinSummary?: string;
  userId?: string;
}

export interface AnalysisSuggestion {
  section: string;
  issue: string;
  improvement: string;
}

export interface LinkedInConsistency {
  field: string;
  issue: string;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  ats_score: number;
  suggestions: AnalysisSuggestion[];
  keywords: {
    matched: string[];
    missing: string[];
  };
  red_flags: string[];
  buzzwords: string[];
  formats: string[];
  linkedin_consistency?: LinkedInConsistency[];
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

// Configuration for resume analysis APIs - Gemini & Cohere Focus
const RESUME_ANALYSIS_CONFIG = {
  // Primary: Use Cohere API (FREE TIER - 5M tokens/month)
  cohere: {
    endpoint: 'https://api.cohere.ai/v1/generate',
    model: 'command-light', // Free tier model
  },
  // Secondary: Use Google Gemini API (FREE TIER)
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    model: 'gemini-1.5-flash-latest'
  }
};

/**
 * Analyze resume using Google Gemini API with professional resume review standards
 */
async function analyzeWithGemini(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google Gemini API key not configured');
  }

  const prompt = `You are a professional AI resume reviewer trained in ATS systems, career coaching, and HR standards across industries.

Your job is to analyze resumes and provide **targeted, role-specific feedback** that helps candidates improve their resumes for a specific job and industry.

INPUTS:
Resume Text: ${request.resumeText}
${request.jobTitle ? `Target Job Title: ${request.jobTitle}` : ''}
${request.industry ? `Target Industry: ${request.industry}` : ''}
${request.jobDescription ? `Job Description: ${request.jobDescription}` : ''}
${request.linkedinSummary ? `LinkedIn Summary: ${request.linkedinSummary}` : ''}

KEY OBJECTIVES:

1. **ATS Simulation & Scoring**
   - Evaluate how well the resume would pass a modern ATS.
   - Look at formatting, header structure, parse-ability, and keyword density.
   - Output a score out of 100.

2. **Personalized Feedback**
   - Write a brief summary (2–3 sentences) on the resume's overall quality, personalization, and fit for the target role.
   - For each section (Work Experience, Skills, Projects, etc.), provide actionable, example-driven suggestions.
   - Prioritize missing impact metrics, vague statements, poor phrasing, or lack of role-fit language.

3. **Keyword Matching**
   - Extract key skills, tools, and concepts from the job description.
   - Match them to the resume.
   - Output: matched_keywords and missing_keywords.

4. **Red Flags**
   - Identify issues such as: No career summary, No metrics/achievements, Too many generic buzzwords, Missing key sections

5. **Buzzword Detection**
   - List overused or vague words (e.g., "hardworking", "team player", "motivated") and suggest better alternatives.

6. **Resume Format Suggestion**
   - Based on experience level and industry, suggest the best format: classic, modern, or hybrid.

7. **LinkedIn Consistency**
   - If LinkedIn summary is given, flag any mismatches between resume and LinkedIn profile (e.g., job titles, years, keywords).

Return ONLY a clean, structured JSON response:

{
  "score": number (0-100),
  "summary": "2-3 sentence summary of resume quality and fit",
  "ats_score": number (0-100),
  "suggestions": [
    {
      "section": "Section Name",
      "issue": "Specific issue identified",
      "improvement": "Actionable improvement suggestion"
    }
  ],
  "keywords": {
    "matched": ["matched keyword 1", "matched keyword 2"],
    "missing": ["missing keyword 1", "missing keyword 2"]
  },
  "red_flags": ["red flag 1", "red flag 2"],
  "buzzwords": ["buzzword 1", "buzzword 2"],
  "formats": ["suggested format"],
  "linkedin_consistency": [
    {
      "field": "Field Name",
      "issue": "Specific mismatch description"
    }
  ]
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
        if (typeof analysisResult.score === 'number' && typeof analysisResult.ats_score === 'number') {
          return analysisResult;
        }
      }
    } catch (parseError) {
      console.warn('Could not parse Gemini JSON response:', parseError);
    }
    
    // Fall back to enhanced analysis
    const fallbackResult = generateEnhancedLocalAnalysis(request, generatedText);
    console.warn('Gemini fallback result score:', fallbackResult.score);
    return fallbackResult;
    
  } catch (error) {
    console.error('Gemini analysis error:', error);
    throw new Error('Failed to analyze resume with Gemini API');
  }
}

/**
 * Analyze resume using Cohere API with professional resume review standards
 */
async function analyzeWithCohere(request: ResumeAnalysisRequest): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_COHERE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Cohere API key not configured');
  }

  const prompt = `You are a professional AI resume reviewer trained in ATS systems, career coaching, and HR standards across industries.

Your job is to analyze resumes and provide targeted, role-specific feedback that helps candidates improve their resumes for a specific job and industry.

INPUTS:
Resume Text: ${request.resumeText}
${request.jobTitle ? `Target Job Title: ${request.jobTitle}` : ''}
${request.industry ? `Target Industry: ${request.industry}` : ''}
${request.jobDescription ? `Job Description: ${request.jobDescription}` : ''}
${request.linkedinSummary ? `LinkedIn Summary: ${request.linkedinSummary}` : ''}

KEY OBJECTIVES:

1. ATS Simulation & Scoring - Evaluate how well the resume would pass a modern ATS. Look at formatting, header structure, parse-ability, and keyword density. Output a score out of 100.

2. Personalized Feedback - Write a brief summary (2–3 sentences) on the resume's overall quality, personalization, and fit for the target role. For each section, provide actionable, example-driven suggestions.

3. Keyword Matching - Extract key skills, tools, and concepts from the job description. Match them to the resume. Output matched_keywords and missing_keywords.

4. Red Flags - Identify issues such as: No career summary, No metrics/achievements, Too many generic buzzwords, Missing key sections.

5. Buzzword Detection - List overused or vague words (e.g., "hardworking", "team player", "motivated") and suggest better alternatives.

6. Resume Format Suggestion - Based on experience level and industry, suggest the best format: classic, modern, or hybrid.

7. LinkedIn Consistency - If LinkedIn summary is given, flag any mismatches between resume and LinkedIn profile.

Return ONLY a clean, structured JSON response in this exact format:

{
  "score": 86,
  "summary": "Your resume has a strong structure and showcases relevant projects, but lacks measurable impact in your work experience. Keywords related to analytics are missing.",
  "ats_score": 78,
  "suggestions": [
    {
      "section": "Work Experience",
      "issue": "No quantified results",
      "improvement": "Add specific metrics like 'Increased user retention by 20%'"
    },
    {
      "section": "Skills",
      "issue": "Missing role-specific tools",
      "improvement": "Add 'SQL, Tableau' to align with the data analyst role"
    }
  ],
  "keywords": {
    "matched": ["Data Analysis", "Excel", "Marketing Campaigns"],
    "missing": ["SQL", "A/B Testing", "Looker"]
  },
  "red_flags": ["No summary section", "Generic language"],
  "buzzwords": ["Team player", "Dynamic", "Hardworking"],
  "formats": ["Modern"],
  "linkedin_consistency": [
    {
      "field": "Job Titles",
      "issue": "Mismatch between resume and LinkedIn job title at Company X"
    }
  ]
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
        
        // Validate the result structure
        if (typeof analysisResult.score === 'number' && typeof analysisResult.ats_score === 'number') {
          return analysisResult;
        }
      }
    } catch (parseError) {
      console.warn('Could not parse Cohere JSON response:', parseError);
    }
    
    // Fall back to enhanced analysis
    const fallbackResult = generateEnhancedLocalAnalysis(request, generatedText);
    console.warn('Cohere fallback result score:', fallbackResult.score);
    return fallbackResult;
    
  } catch (error) {
    console.error('Cohere analysis error:', error);
    throw new Error('Failed to analyze resume with Cohere API');
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
      score: Math.max(0, Math.min(100, localResult.score + aiBoost)),
      summary: localResult.summary,
      ats_score: Math.max(0, Math.min(100, localResult.ats_score + aiBoost)),
      suggestions: [
        ...localResult.suggestions,
        { section: 'AI Enhancement', issue: 'Consider AI-powered optimization', improvement: 'Review industry-specific terminology' }
      ],
      keywords: localResult.keywords,
      red_flags: localResult.red_flags,
      buzzwords: localResult.buzzwords,
      formats: localResult.formats,
      linkedin_consistency: localResult.linkedin_consistency
    };
  }
  
  return localResult;
}

/**
 * Enhanced analysis using advanced NLP-inspired techniques and sophisticated heuristics
 */
function generateLocalAnalysis(request: ResumeAnalysisRequest): AnalysisResult {
  const { resumeText, jobDescription, jobTitle, industry } = request;
  const text = resumeText.toLowerCase();
  const lines = resumeText.split('\n').filter(line => line.trim().length > 0);
  
  // ===== SECTION 1: ADVANCED CONTACT & FORMATTING ANALYSIS =====
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
  const phoneRegex = /(\+?1?[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/;
  const linkedinRegex = /(linkedin\.com\/in\/|linkedin\.com\/pub\/)/i;
  const githubRegex = /(github\.com\/|github\.io)/i;
  
  const hasEmail = emailRegex.test(resumeText);
  const hasPhone = phoneRegex.test(resumeText);
  const hasLinkedIn = linkedinRegex.test(resumeText);
  const hasGitHub = githubRegex.test(resumeText);
  // Note: Portfolio analysis could be added as future enhancement
  
  // Enhanced formatting analysis
  const bulletPointCount = (resumeText.match(/[•\-*]/g) || []).length;
  const sectionCount = ['experience', 'education', 'skills'].filter(section => 
    text.includes(section) || text.includes(section.replace('experience', 'work'))
  ).length;
  const averageLineLength = lines.reduce((sum, line) => sum + line.length, 0) / lines.length;
  const hasConsistentFormatting = bulletPointCount > 5 && averageLineLength > 20 && averageLineLength < 120;
  
  // ===== SECTION 2: ADVANCED EXPERIENCE & IMPACT ANALYSIS =====
  
  // ===== SECTION 2: ADVANCED EXPERIENCE & IMPACT ANALYSIS =====
  
  // Advanced experience indicators with context awareness
  const experiencePatterns = {
    leadership: /\b(led|managed|supervised|directed|coordinated|mentored|guided|oversaw)\s+(\w+\s+){0,3}(team|group|department|project|initiative)/gi,
    achievement: /\b(achieved|accomplished|delivered|exceeded|generated|increased|improved|reduced|saved|optimized|streamlined)\s+[^.]*?(\d+[%$,.]?\w*|\$\d+|\d+\+?|\d+x|x\d+)/gi,
    technical: /\b(developed|built|created|designed|implemented|engineered|architected|programmed|coded)\s+[^.]*?(system|application|platform|solution|framework|algorithm|database|api|interface)/gi,
    innovation: /\b(pioneered|launched|introduced|established|founded|initiated|spearheaded|revolutionized)/gi,
    collaboration: /\b(collaborated|partnered|worked\s+with|cross-functional|stakeholder|client|vendor|team)/gi
  };
  
  const experienceScores = Object.entries(experiencePatterns).reduce((scores, [category, pattern]) => {
    const matches = resumeText.match(pattern) || [];
    scores[category] = Math.min(matches.length * 5, 20); // Cap each category at 20 points
    return scores;
  }, {} as Record<string, number>);
  
  // Quantified achievements analysis with context
  const quantifiedRegex = /\b(\d+[%$,.]?\w*|\$\d+|\d+\+?|\d+x|x\d+|[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?[kmb]?)\b/gi;
  const quantifiedMatches = resumeText.match(quantifiedRegex) || [];
  
  // Strong action verbs with impact context
  const impactVerbs = {
    high: ['achieved', 'accelerated', 'accomplished', 'delivered', 'exceeded', 'generated', 'transformed'],
    medium: ['increased', 'improved', 'reduced', 'saved', 'optimized', 'streamlined', 'enhanced'],
    low: ['developed', 'created', 'built', 'designed', 'implemented', 'launched', 'established'],
    leadership: ['led', 'managed', 'supervised', 'directed', 'coordinated', 'mentored', 'guided']
  };
  
  const verbScores = Object.entries(impactVerbs).reduce((scores, [level, verbs]) => {
    const count = verbs.reduce((sum, verb) => {
      return sum + (text.match(new RegExp(`\\b${verb}`, 'gi')) || []).length;
    }, 0);
    scores[level] = count;
    return scores;
  }, {} as Record<string, number>);
  
  // Context-aware impact statement analysis
  const impactStatements = quantifiedMatches.filter(match => {
    const context = resumeText.toLowerCase();
    const index = context.indexOf(match.toLowerCase());
    const surrounding = context.slice(Math.max(0, index - 100), index + 100);
    
    // Check if quantified achievement has action verb nearby
    const hasActionVerb = Object.values(impactVerbs).flat().some(verb => 
      surrounding.includes(verb)
    );
    
    // Check if it's in a meaningful context (not just a date or address)
    const meaningfulContext = ['revenue', 'sales', 'performance', 'efficiency', 'productivity', 
      'users', 'customers', 'team', 'budget', 'cost', 'time', 'quality'].some(keyword =>
      surrounding.includes(keyword)
    );
    
    return hasActionVerb && meaningfulContext;
  });
  
  // Career progression analysis
  const datePatterns = resumeText.match(/\b(20\d{2}|19\d{2})\b/g) || [];
  const jobTitleKeywords = ['manager', 'director', 'lead', 'senior', 'principal', 'chief', 'head', 'vp', 'president'];
  const hasCareerProgression = jobTitleKeywords.some(title => text.includes(title));
  const experienceYears = datePatterns.length >= 2 ? 
    Math.max(...datePatterns.map(d => parseInt(d))) - Math.min(...datePatterns.map(d => parseInt(d))) : 0;
  
  // ===== SECTION 3: ADVANCED SKILLS & COMPETENCY ANALYSIS =====
  
  // Comprehensive skill categories with modern tech stack
  const skillCategories = {
    technical: {
      frontEnd: ['react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt', 'typescript', 'javascript', 'html', 'css', 'sass', 'tailwind'],
      backEnd: ['node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'rails', 'asp.net', 'fastapi', 'nestjs'],
      programming: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'scala'],
      database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'cassandra', 'sqlite', 'oracle'],
      cloud: ['aws', 'azure', 'gcp', 'digital ocean', 'heroku', 'vercel', 'netlify', 'cloudflare'],
      devOps: ['docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'gitlab ci', 'github actions', 'ci/cd'],
      dataScience: ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'keras', 'matplotlib', 'seaborn', 'tableau', 'power bi'],
      mobile: ['react native', 'flutter', 'ionic', 'xamarin', 'swift', 'kotlin', 'cordova'],
      tools: ['git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'slack', 'trello', 'figma', 'adobe', 'postman']
    },
    soft: {
      leadership: ['leadership', 'management', 'team lead', 'supervision', 'mentoring', 'coaching', 'delegation'],
      communication: ['communication', 'presentation', 'public speaking', 'writing', 'documentation', 'stakeholder management'],
      analytical: ['analytical', 'problem solving', 'critical thinking', 'research', 'data analysis', 'strategic thinking'],
      project: ['project management', 'agile', 'scrum', 'kanban', 'waterfall', 'pmp', 'coordination', 'planning'],
      interpersonal: ['collaboration', 'teamwork', 'conflict resolution', 'negotiation', 'customer service', 'relationship building']
    },
    industry: {
      finance: ['trading', 'risk management', 'compliance', 'fintech', 'blockchain', 'cryptocurrency', 'financial modeling'],
      healthcare: ['healthcare', 'medical', 'hipaa', 'clinical', 'pharmaceutical', 'biotech', 'health informatics'],
      education: ['teaching', 'curriculum', 'e-learning', 'educational technology', 'assessment', 'pedagogy'],
      retail: ['e-commerce', 'inventory management', 'supply chain', 'customer experience', 'merchandising', 'pos'],
      manufacturing: ['lean', 'six sigma', 'quality assurance', 'supply chain', 'operations', 'process improvement']
    }
  };
  
  // Advanced skill detection with context awareness
  const detectedSkills = {
    technical: {} as Record<string, { skills: string[], context: string[] }>,
    soft: {} as Record<string, { skills: string[], context: string[] }>,
    industry: {} as Record<string, { skills: string[], context: string[] }>
  };
  
  // Analyze skills with context
  Object.entries(skillCategories).forEach(([mainCategory, subCategories]) => {
    Object.entries(subCategories).forEach(([subCategory, skills]) => {
      const foundSkills: string[] = [];
      const contexts: string[] = [];
      
      skills.forEach(skill => {
        const skillRegex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = resumeText.match(skillRegex);
        
        if (matches) {
          foundSkills.push(skill);
          
          // Extract context around skill mentions
          const skillIndex = text.indexOf(skill.toLowerCase());
          if (skillIndex !== -1) {
            const context = resumeText.slice(Math.max(0, skillIndex - 50), skillIndex + 50);
            contexts.push(context.trim());
          }
        }
      });
      
      if (foundSkills.length > 0) {
        detectedSkills[mainCategory as keyof typeof detectedSkills][subCategory] = {
          skills: foundSkills,
          context: contexts
        };
      }
    });
  });
  
  // Calculate skill proficiency indicators
  const skillProficiencyIndicators = {
    expert: ['expert', 'advanced', 'proficient', 'mastery', 'specialist', 'architect', 'lead'],
    intermediate: ['intermediate', 'experienced', 'familiar', 'working knowledge', 'competent'],
    beginner: ['beginner', 'basic', 'learning', 'exposure', 'introductory']
  };
  
  const skillProficiency = Object.entries(skillProficiencyIndicators).reduce((levels, [level, indicators]) => {
    levels[level] = indicators.filter(indicator => text.includes(indicator)).length;
    return levels;
  }, {} as Record<string, number>);
  
  // ===== SECTION 4: ADVANCED JOB MATCHING & KEYWORD ANALYSIS =====
  const jobMatchAnalysis = {
    matched: [] as string[],
    missing: [] as string[],
    score: 0,
    criticalMissing: [] as string[],
    contextualMatches: [] as { keyword: string, context: string }[],
    semanticMatches: [] as string[]
  };
  
  if (jobDescription) {
    const jobText = jobDescription.toLowerCase();
    
    // Enhanced requirement extraction with context
    const requirements = {
      technical: extractAdvancedTechnicalRequirements(jobText),
      experience: extractAdvancedExperienceRequirements(jobText),
      education: extractAdvancedEducationRequirements(jobText),
      soft: extractAdvancedSoftSkillRequirements(jobText),
      industry: extractIndustrySpecificRequirements(jobText, industry)
    };
    
    const allRequirements = [
      ...requirements.technical,
      ...requirements.experience,
      ...requirements.education,
      ...requirements.soft,
      ...requirements.industry
    ];
    
    // Advanced keyword matching with context analysis
    allRequirements.forEach(req => {
      const reqLower = req.toLowerCase();
      const resumeIndex = text.indexOf(reqLower);
      
      if (resumeIndex !== -1) {
        jobMatchAnalysis.matched.push(req);
        
        // Extract context around matched keyword
        const context = resumeText.slice(Math.max(0, resumeIndex - 75), resumeIndex + 75);
        jobMatchAnalysis.contextualMatches.push({ keyword: req, context: context.trim() });
      } else {
        // Check for semantic matches (synonyms/related terms)
        const semanticMatch = findSemanticMatch(reqLower, text);
        if (semanticMatch) {
          jobMatchAnalysis.semanticMatches.push(semanticMatch);
          jobMatchAnalysis.matched.push(req);
        } else {
          jobMatchAnalysis.missing.push(req);
        }
      }
    });
    
    // Enhanced critical requirement analysis
    const criticalIndicators = ['required', 'must have', 'essential', 'mandatory', 'minimum', 'years of experience'];
    jobMatchAnalysis.criticalMissing = jobMatchAnalysis.missing.filter(missing => {
      return criticalIndicators.some(indicator => {
        const jobDescriptionSentences = jobDescription.split(/[.!?]/);
        return jobDescriptionSentences.some(sentence => 
          sentence.toLowerCase().includes(indicator) && 
          sentence.toLowerCase().includes(missing.toLowerCase())
        );
      });
    });
    
    // Calculate weighted match score
    const totalRequirements = allRequirements.length;
    const matchedRequirements = jobMatchAnalysis.matched.length;
    const semanticBonus = jobMatchAnalysis.semanticMatches.length * 0.5;
    const criticalPenalty = jobMatchAnalysis.criticalMissing.length * 5;
    
    jobMatchAnalysis.score = totalRequirements > 0 ? 
      Math.max(0, Math.round(((matchedRequirements + semanticBonus) / totalRequirements) * 100 - criticalPenalty)) : 0;
  }
  
  // ===== SECTION 5: COMPREHENSIVE RED FLAGS & QUALITY ANALYSIS =====
  const redFlags: string[] = [];
  const qualityMetrics = {
    contactScore: 0,
    contentScore: 0,
    formatScore: 0,
    keywordScore: 0,
    impactScore: 0
  };
  
  // Contact and professional presence analysis
  qualityMetrics.contactScore = (hasEmail ? 25 : 0) + (hasPhone ? 15 : 0) + (hasLinkedIn ? 10 : 0);
  
  if (!hasEmail) {
    redFlags.push('Missing professional email address - critical for all applications');
  }
  if (!hasPhone) {
    redFlags.push('Missing phone number - recruiters need multiple contact methods');
  }
  
  // Industry-specific contact requirements
  const isTechRole = jobTitle?.toLowerCase().includes('engineer') || 
                    jobTitle?.toLowerCase().includes('developer') || 
                    industry?.toLowerCase().includes('tech');
  
  if (isTechRole) {
    if (!hasLinkedIn) {
      redFlags.push('Missing LinkedIn profile - essential for tech professional networking');
    }
    if (!hasGitHub) {
      redFlags.push('Missing GitHub profile - tech recruiters expect to see code samples');
    }
    qualityMetrics.contactScore += hasGitHub ? 10 : 0;
  }
  
  // Advanced content analysis
  const totalTechnicalSkills = Object.values(detectedSkills.technical).reduce((sum, category) => 
    sum + category.skills.length, 0);
  const totalSoftSkills = Object.values(detectedSkills.soft).reduce((sum, category) => 
    sum + category.skills.length, 0);
  const totalIndustrySkills = Object.values(detectedSkills.industry).reduce((sum, category) => 
    sum + category.skills.length, 0);
  
  qualityMetrics.contentScore = Math.min(
    (totalTechnicalSkills * 2) + (totalSoftSkills * 1.5) + (totalIndustrySkills * 3), 50
  );
  
  // Impact and achievement analysis
  qualityMetrics.impactScore = Math.min(impactStatements.length * 8, 40);
  
  if (impactStatements.length === 0) {
    redFlags.push('No quantified achievements - add specific metrics and results');
  } else if (impactStatements.length < 3) {
    redFlags.push('Limited quantified achievements - add more specific metrics');
  }
  
  if (verbScores.high + verbScores.medium < 5) {
    redFlags.push('Weak action verbs - use stronger impact-focused language');
  }
  
  // Skills and competency analysis
  if (totalTechnicalSkills === 0 && isTechRole) {
    redFlags.push('No technical skills listed for technical role - critical deficiency');
  } else if (totalTechnicalSkills < 5 && isTechRole) {
    redFlags.push('Limited technical skills for tech role - expand skills section');
  }
  
  if (totalSoftSkills === 0) {
    redFlags.push('No soft skills mentioned - add leadership and communication abilities');
  }
  
  // Experience and career progression analysis
  if (experienceYears === 0 && !text.includes('intern') && !text.includes('graduate') && !text.includes('entry')) {
    redFlags.push('No clear work history timeline - add dates and progression');
  }
  
  if (experienceYears > 3 && !hasCareerProgression) {
    redFlags.push('No evidence of career progression - highlight promotions and growth');
  }
  
  // Format and presentation analysis
  const wordCount = resumeText.split(/\s+/).length;
  qualityMetrics.formatScore = hasConsistentFormatting ? 20 : 0;
  qualityMetrics.formatScore += sectionCount >= 3 ? 10 : 0;
  qualityMetrics.formatScore += (wordCount >= 300 && wordCount <= 800) ? 10 : 0;
  
  if (wordCount < 250) {
    redFlags.push('Resume too short - lacks sufficient detail and examples');
  } else if (wordCount > 1200) {
    redFlags.push('Resume too long - may lose recruiter attention, consider trimming');
  }
  
  if (bulletPointCount < 5) {
    redFlags.push('Poor formatting - add bullet points for better readability');
  }
  
  if (sectionCount < 3) {
    redFlags.push('Missing standard sections - include Experience, Education, and Skills');
  }
  
  // Job matching analysis
  qualityMetrics.keywordScore = jobDescription ? Math.min(jobMatchAnalysis.score * 0.4, 40) : 20;
  
  if (jobMatchAnalysis.criticalMissing.length > 0) {
    redFlags.push(`Missing critical requirements: ${jobMatchAnalysis.criticalMissing.slice(0, 3).join(', ')}`);
  }
  
  if (jobDescription && jobMatchAnalysis.score < 40) {
    redFlags.push('Poor keyword alignment with job description - optimize for ATS systems');
  }
  
  // Advanced buzzword and cliché detection
  const advancedBuzzwords = detectAdvancedBuzzwords(resumeText);
  if (advancedBuzzwords.length > 5) {
    redFlags.push(`Overuse of buzzwords: ${advancedBuzzwords.slice(0, 3).join(', ')} - use specific examples instead`);
  }
  
  // ===== SECTION 6: ADVANCED ATS COMPATIBILITY ANALYSIS =====
  const atsFactors = {
    // Format compatibility
    simpleFormatting: !/<[^>]*>|{|}|\[|\]/.test(resumeText),
    standardSections: sectionCount >= 3,
    noImages: !/(image|photo|picture|graphic|icon)/.test(text),
    standardFonts: true, // Assume true for text analysis
    
    // Content structure
    keywordOptimization: jobMatchAnalysis.score > 50,
    contactInfo: hasEmail && hasPhone,
    consistentFormatting: bulletPointCount > 3,
    clearHeaders: /\b(experience|education|skills|summary|objective|projects)\b/gi.test(resumeText),
    
    // Readability factors
    appropriateLength: wordCount >= 300 && wordCount <= 800,
    bulletPoints: bulletPointCount >= 5,
    quantifiedResults: impactStatements.length >= 2,
    actionVerbs: (verbScores.high + verbScores.medium) >= 5
  };
  
  const atsScore = Math.round(
    Object.values(atsFactors).reduce((sum, factor) => sum + (factor ? 1 : 0), 0) / 
    Object.values(atsFactors).length * 100
  );
  
  // ===== SECTION 7: INTELLIGENT SUGGESTIONS WITH PRIORITIZATION =====
  const suggestions: AnalysisSuggestion[] = [];
  
  // Critical issues first (affects employability)
  if (!hasEmail) {
    suggestions.push({
      section: 'Contact Information',
      issue: 'Missing email address',
      improvement: 'Add a professional email (firstname.lastname@domain.com format). This is essential for all job applications.'
    });
  }
  
  if (impactStatements.length === 0) {
    suggestions.push({
      section: 'Work Experience',
      issue: 'No quantified achievements',
      improvement: 'Add specific metrics to each role: "Increased sales by 25%", "Reduced processing time by 40%", "Managed budget of $500K"'
    });
  }
  
  // High priority suggestions
  if (isTechRole && !hasGitHub) {
    suggestions.push({
      section: 'Online Presence',
      issue: 'Missing GitHub profile for tech role',
      improvement: 'Add GitHub URL with 3-5 well-documented projects. Tech recruiters expect to see code samples.'
    });
  }
  
  if (jobMatchAnalysis.score < 60 && jobDescription) {
    suggestions.push({
      section: 'Keywords & Skills',
      issue: `Only ${jobMatchAnalysis.score}% match with job requirements`,
      improvement: `Incorporate these key terms: ${jobMatchAnalysis.missing.slice(0, 5).join(', ')}. Use exact phrases from the job posting.`
    });
  }
  
  if (verbScores.high < 3) {
    suggestions.push({
      section: 'Work Experience',
      issue: 'Weak impact language',
      improvement: 'Start bullet points with strong action verbs: "Achieved", "Accelerated", "Delivered", "Transformed", "Generated"'
    });
  }
  
  // Medium priority suggestions
  if (totalTechnicalSkills < 8 && isTechRole) {
    suggestions.push({
      section: 'Technical Skills',
      issue: 'Limited technical skills for tech role',
      improvement: 'Expand skills section with specific technologies, frameworks, and tools. Include proficiency levels if relevant.'
    });
  }
  
  if (wordCount < 350) {
    suggestions.push({
      section: 'Content Length',
      issue: 'Resume too brief',
      improvement: 'Expand experience descriptions with more specific examples of responsibilities, challenges overcome, and technologies used.'
    });
  }
  
  if (bulletPointCount < 8) {
    suggestions.push({
      section: 'Format & Readability',
      issue: 'Insufficient bullet points',
      improvement: 'Use bullet points for all experience items. Aim for 3-5 bullets per role, focusing on achievements over duties.'
    });
  }
  
  // Lower priority but valuable suggestions
  if (!hasLinkedIn) {
    suggestions.push({
      section: 'Professional Networking',
      issue: 'Missing LinkedIn profile',
      improvement: 'Add LinkedIn profile URL. Ensure your LinkedIn matches your resume content and includes a professional photo.'
    });
  }
  
  if (skillProficiency.expert === 0 && experienceYears > 2) {
    suggestions.push({
      section: 'Skills Presentation',
      issue: 'No expertise levels indicated',
      improvement: 'Indicate proficiency levels (Expert, Advanced, Intermediate) for key skills, especially those matching the job requirements.'
    });
  }
  
  // Industry-specific suggestions
  if (industry?.toLowerCase().includes('finance') && !text.includes('risk') && !text.includes('compliance')) {
    suggestions.push({
      section: 'Industry Keywords',
      issue: 'Missing finance industry terminology',
      improvement: 'Include relevant financial terms: risk management, compliance, regulatory, financial modeling, as applicable to your experience.'
    });
  }
  
  // ===== SECTION 8: SOPHISTICATED SCORING ALGORITHM =====
  const componentScores = {
    contact: qualityMetrics.contactScore,
    experience: Math.min(Object.values(experienceScores).reduce((sum, score) => sum + score, 0), 25),
    achievements: qualityMetrics.impactScore,
    skills: qualityMetrics.contentScore,
    jobMatch: qualityMetrics.keywordScore,
    format: qualityMetrics.formatScore
  };
  
  let overallScore = Object.values(componentScores).reduce((sum, score) => sum + score, 0);
  
  // Apply intelligent penalties and bonuses
  const penalties = {
    criticalMissing: jobMatchAnalysis.criticalMissing.length * 8,
    noQuantifiedResults: impactStatements.length === 0 ? 15 : 0,
    noEmail: !hasEmail ? 20 : 0,
    poorFormat: !hasConsistentFormatting ? 10 : 0,
    tooManyBuzzwords: advancedBuzzwords.length > 8 ? 8 : 0
  };
  
  const bonuses = {
    strongImpact: impactStatements.length >= 5 ? 10 : 0,
    careerProgression: hasCareerProgression ? 8 : 0,
    industryAlignment: totalIndustrySkills > 3 ? 5 : 0,
    semanticMatches: jobMatchAnalysis.semanticMatches.length * 2
  };
  
  const totalPenalties = Object.values(penalties).reduce((sum, penalty) => sum + penalty, 0);
  const totalBonuses = Object.values(bonuses).reduce((sum, bonus) => sum + bonus, 0);
  
  overallScore = Math.max(0, Math.min(100, overallScore - totalPenalties + totalBonuses));
  
  // ===== SECTION 9: INTELLIGENT SUMMARY GENERATION =====
  const strengthAreas = [];
  const improvementAreas = [];
  
  // Analyze strengths
  if (componentScores.contact >= 35) {
    strengthAreas.push('strong professional contact information');
  }
  if (componentScores.achievements >= 25) {
    strengthAreas.push('well-quantified achievements');
  }
  if (componentScores.skills >= 30) {
    strengthAreas.push('comprehensive skill portfolio');
  }
  if (componentScores.jobMatch >= 25 && jobDescription) {
    strengthAreas.push('excellent job requirement alignment');
  }
  if (totalBonuses > 15) {
    strengthAreas.push('clear career progression');
  }
  
  // Analyze improvement areas
  if (componentScores.contact < 25) {
    improvementAreas.push('contact information completeness');
  }
  if (componentScores.achievements < 15) {
    improvementAreas.push('quantified results and impact metrics');
  }
  if (componentScores.skills < 20) {
    improvementAreas.push('skills presentation and depth');
  }
  if (componentScores.jobMatch < 20 && jobDescription) {
    improvementAreas.push('keyword optimization for ATS');
  }
  if (componentScores.format < 15) {
    improvementAreas.push('format consistency and readability');
  }
  
  // Generate contextual summary
  const summary = `${overallScore >= 80 ? 'Excellent' : overallScore >= 60 ? 'Strong' : overallScore >= 40 ? 'Developing' : 'Foundational'} resume with ${
    strengthAreas.length > 0 ? strengthAreas.slice(0, 2).join(' and ') : 'basic professional elements'
  }. ${impactStatements.length > 0 ? 
    `Features ${impactStatements.length} quantified achievement${impactStatements.length > 1 ? 's' : ''} demonstrating measurable impact. ` : 
    'Would benefit from adding specific metrics and measurable results. '
  }${jobDescription ? 
    jobMatchAnalysis.score > 70 ? 'Excellent alignment with target role requirements.' :
    jobMatchAnalysis.score > 50 ? 'Good job requirement match with room for keyword optimization.' :
    'Significant keyword optimization needed for better ATS performance.' :
    'Well-structured for general applications.'
  }${improvementAreas.length > 0 ? 
    ` Priority improvements: ${improvementAreas.slice(0, 2).join(' and ')}.` : 
    ' Strong across all key areas.'
  }`;
  
  return {
    score: Math.round(overallScore),
    summary,
    ats_score: atsScore,
    suggestions: suggestions.slice(0, 10), // Top 10 most important suggestions
    keywords: {
      matched: jobMatchAnalysis.matched,
      missing: jobMatchAnalysis.missing.slice(0, 12) // Top 12 missing keywords
    },
    red_flags: redFlags.slice(0, 8), // Top 8 red flags
    buzzwords: advancedBuzzwords.slice(0, 8),
    formats: suggestOptimalFormat(detectedSkills, experienceYears, industry),
    linkedin_consistency: analyzeLinkedInConsistency(resumeText, request.linkedinSummary)
  };
}

function detectAdvancedBuzzwords(resumeText: string): string[] {
  const buzzwordCategories = {
    overused: ['dynamic', 'synergistic', 'innovative', 'results-driven', 'detail-oriented', 'self-motivated'],
    cliches: ['team player', 'hard-working', 'motivated', 'passionate', 'go-getter', 'people person'],
    vague: ['excellent', 'great', 'good', 'nice', 'awesome', 'amazing', 'fantastic'],
    corporate: ['think outside the box', 'paradigm shift', 'game changer', 'rockstar', 'ninja', 'guru'],
    redundant: ['very unique', 'completely finished', 'totally complete', 'absolutely perfect']
  };
  
  const text = resumeText.toLowerCase();
  const foundBuzzwords: string[] = [];
  
  Object.values(buzzwordCategories).flat().forEach(buzzword => {
    if (text.includes(buzzword.toLowerCase())) {
      foundBuzzwords.push(buzzword);
    }
  });
  
  return [...new Set(foundBuzzwords)];
}

// Enhanced helper functions for advanced analysis
function extractAdvancedTechnicalRequirements(jobText: string): string[] {
  const technicalPatterns = [
    // Programming languages and frameworks
    /\b(javascript|typescript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|scala|r|matlab)\b/gi,
    /\b(react|angular|vue|svelte|next\.?js|nuxt|express|django|flask|spring|laravel|rails)\b/gi,
    // Databases and storage
    /\b(sql|mysql|postgresql|mongodb|redis|elasticsearch|dynamodb|cassandra|sqlite|oracle)\b/gi,
    // Cloud and DevOps
    /\b(aws|azure|gcp|docker|kubernetes|terraform|ansible|jenkins|ci\/cd|github\s+actions)\b/gi,
    // Tools and platforms
    /\b(git|github|gitlab|bitbucket|jira|confluence|figma|adobe|postman|slack)\b/gi,
    // Data science and AI
    /\b(pandas|numpy|scikit-learn|tensorflow|pytorch|keras|tableau|power\s*bi|looker)\b/gi
  ];
  
  const matches = technicalPatterns.flatMap(pattern => 
    Array.from(jobText.matchAll(pattern), m => m[0].toLowerCase())
  );
  
  return [...new Set(matches)].filter(match => match.length > 1);
}

function extractAdvancedExperienceRequirements(jobText: string): string[] {
  const expPatterns = [
    /(\d+\+?\s*(?:to\s+\d+\+?\s*)?years?\s*(?:of\s*)?(?:experience|exp)(?:\s+in|\s+with|\s+working)?)/gi,
    /\b(senior|junior|mid-level|lead|principal|staff|manager|director|architect|head\s+of)\b/gi,
    /(minimum\s+of\s+\d+\s+years|at\s+least\s+\d+\s+years|\d+\+\s+years)/gi
  ];
  
  const matches = expPatterns.flatMap(pattern => 
    Array.from(jobText.matchAll(pattern), m => m[0].toLowerCase().trim())
  );
  
  return [...new Set(matches)];
}

function extractAdvancedEducationRequirements(jobText: string): string[] {
  const eduPatterns = [
    /\b(bachelor'?s?|master'?s?|phd|doctorate|degree|certification|diploma|mba)\b/gi,
    /\b(computer\s+science|software\s+engineering|electrical\s+engineering|business|mathematics|statistics|data\s+science)\b/gi,
    /(college\s+degree|university\s+degree|advanced\s+degree|graduate\s+degree)/gi
  ];
  
  const matches = eduPatterns.flatMap(pattern => 
    Array.from(jobText.matchAll(pattern), m => m[0].toLowerCase().trim())
  );
  
  return [...new Set(matches)];
}

function extractAdvancedSoftSkillRequirements(jobText: string): string[] {
  const softSkillPatterns = [
    /\b(leadership|management|team\s+lead|mentoring|coaching|supervision)\b/gi,
    /\b(communication|presentation|public\s+speaking|writing|documentation)\b/gi,
    /\b(problem[\s-]solving|analytical|critical\s+thinking|research|strategic\s+thinking)\b/gi,
    /\b(project\s+management|agile|scrum|kanban|waterfall|collaboration|teamwork)\b/gi,
    /\b(customer\s+service|stakeholder\s+management|conflict\s+resolution|negotiation)\b/gi
  ];
  
  const matches = softSkillPatterns.flatMap(pattern => 
    Array.from(jobText.matchAll(pattern), m => m[0].toLowerCase().trim())
  );
  
  return [...new Set(matches)];
}

function extractIndustrySpecificRequirements(jobText: string, industry?: string): string[] {
  const industryPatterns: Record<string, RegExp[]> = {
    finance: [
      /\b(trading|risk\s+management|compliance|fintech|blockchain|cryptocurrency|financial\s+modeling)\b/gi,
      /\b(bloomberg|reuters|quickfix|market\s+data|derivatives|portfolio\s+management)\b/gi
    ],
    healthcare: [
      /\b(healthcare|medical|hipaa|clinical|pharmaceutical|biotech|health\s+informatics)\b/gi,
      /\b(ehr|emr|fhir|hl7|medical\s+coding|clinical\s+trials|regulatory\s+compliance)\b/gi
    ],
    tech: [
      /\b(microservices|api|rest|graphql|websockets|real-time|scalability|performance)\b/gi,
      /\b(machine\s+learning|artificial\s+intelligence|data\s+engineering|devops|sre)\b/gi
    ]
  };
  
  const relevantPatterns = industry ? (industryPatterns[industry.toLowerCase()] || []) : [];
  const matches = relevantPatterns.flatMap(pattern => 
    Array.from(jobText.matchAll(pattern), m => m[0].toLowerCase().trim())
  );
  
  return [...new Set(matches)];
}

function findSemanticMatch(requirement: string, resumeText: string): string | null {
  const semanticMappings: Record<string, string[]> = {
    'javascript': ['js', 'node.js', 'nodejs', 'react', 'angular', 'vue'],
    'python': ['django', 'flask', 'pandas', 'numpy', 'tensorflow'],
    'database': ['sql', 'mysql', 'postgresql', 'mongodb', 'data management'],
    'leadership': ['management', 'team lead', 'supervision', 'mentoring', 'guided team'],
    'communication': ['presentation', 'stakeholder management', 'client interaction', 'documentation'],
    'project management': ['agile', 'scrum', 'kanban', 'project coordination', 'delivery management']
  };
  
  for (const [key, synonyms] of Object.entries(semanticMappings)) {
    if (requirement.includes(key)) {
      const foundSynonym = synonyms.find(synonym => resumeText.includes(synonym));
      if (foundSynonym) {
        return foundSynonym;
      }
    }
  }
  
  return null;
}

function suggestOptimalFormat(skills: Record<string, Record<string, { skills: string[], context: string[] }>>, experienceYears: number, industry?: string): string[] {
  const formats = [];
  
  if (experienceYears > 10) {
    formats.push('executive');
  } else if (experienceYears > 5) {
    formats.push('professional');
  } else if (experienceYears > 2) {
    formats.push('modern');
  } else {
    formats.push('entry-level');
  }
  
  if (industry?.toLowerCase().includes('tech') || industry?.toLowerCase().includes('creative')) {
    formats.push('creative');
  } else {
    formats.push('traditional');
  }
  
  return formats;
}

function analyzeLinkedInConsistency(resumeText: string, linkedinSummary?: string): LinkedInConsistency[] {
  if (!linkedinSummary) {
    return [];
  }
  
  const consistency: LinkedInConsistency[] = [];
  const resumeText_lower = resumeText.toLowerCase();
  const linkedinText_lower = linkedinSummary.toLowerCase();
  
  // Check for major discrepancies
  const resumeSkills = extractSkillsFromText(resumeText_lower);
  const linkedinSkills = extractSkillsFromText(linkedinText_lower);
  
  const missingInLinkedIn = resumeSkills.filter(skill => !linkedinSkills.includes(skill));
  const missingInResume = linkedinSkills.filter(skill => !resumeSkills.includes(skill));
  
  if (missingInLinkedIn.length > 2) {
    consistency.push({
      field: 'Skills',
      issue: `Resume mentions skills not in LinkedIn: ${missingInLinkedIn.slice(0, 3).join(', ')}`
    });
  }
  
  if (missingInResume.length > 2) {
    consistency.push({
      field: 'Skills',
      issue: `LinkedIn mentions skills not in resume: ${missingInResume.slice(0, 3).join(', ')}`
    });
  }
  
  return consistency;
}

function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'angular', 'vue', 'node.js',
    'sql', 'mongodb', 'aws', 'azure', 'docker', 'git', 'agile', 'scrum',
    'leadership', 'management', 'communication', 'project management'
  ];
  
  return commonSkills.filter(skill => text.includes(skill));
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
 * Main function to analyze resume using Gemini and Cohere APIs
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
    // Strategy: Use Gemini first, fallback to Cohere, then local analysis
    
    // Option 1: Google Gemini (FREE TIER - 1,500 requests/day)
    if (import.meta.env.VITE_GEMINI_API_KEY) {
      try {
        result = await analyzeWithGemini(request);
      } catch (geminiError) {
        console.warn('⚠️ Gemini API failed, trying Cohere...', geminiError);
        
        // Option 2: Cohere (FREE TIER - 5M tokens/month)
        if (import.meta.env.VITE_COHERE_API_KEY) {
          try {
            result = await analyzeWithCohere(request);
          } catch (cohereError) {
            console.warn('⚠️ Both Gemini and Cohere failed, using enhanced local analysis...', cohereError);
            result = generateEnhancedLocalAnalysis(request);
          }
        } else {
          console.warn('⚠️ No Cohere API key configured, using enhanced local analysis...');
          result = generateEnhancedLocalAnalysis(request);
        }
      }
    }
    // If no Gemini key, try Cohere directly
    else if (import.meta.env.VITE_COHERE_API_KEY) {
      try {
        result = await analyzeWithCohere(request);
      } catch (cohereError) {
        console.warn('⚠️ Cohere API failed, using enhanced local analysis...', cohereError);
        result = generateEnhancedLocalAnalysis(request);
      }
    }
    // Final fallback - enhanced local analysis
    else {
      console.warn('⚠️ No API keys configured, using enhanced local analysis...');
      result = generateEnhancedLocalAnalysis(request);
    }

    // Ensure result is valid
    if (!result || typeof result.score !== 'number') {
      console.error('🚨 Invalid result, creating emergency fallback...');
      result = {
        score: 50,
        summary: 'Basic analysis completed due to technical issues.',
        ats_score: 50,
        suggestions: [
          { section: 'Technical Issue', issue: 'Analysis service temporarily unavailable', improvement: 'Please try again later' }
        ],
        keywords: { matched: [], missing: [] },
        red_flags: ['Technical analysis error'],
        buzzwords: [],
        formats: ['hybrid'],
        linkedin_consistency: []
      };
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
    console.error('🚨 Analysis failed, using enhanced local analysis as final backup:', error);
    
    // If all methods fail, use enhanced local analysis as final fallback
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

/**
 * Debug function to test local analysis directly (remove this after debugging)
 */
export function debugLocalAnalysis(resumeText: string): AnalysisResult {
  const request: ResumeAnalysisRequest = {
    resumeText,
    jobTitle: 'Test Job',
    industry: 'Technology'
  };
  
  console.warn('Debug: Starting local analysis...');
  const result = generateLocalAnalysis(request);
  console.warn('Debug: Local analysis result score:', result.score);
  console.warn('Debug: Local analysis result ats_score:', result.ats_score);
  
  return result;
}
