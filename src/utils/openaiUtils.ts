import OpenAI from 'openai';

// Interface for the feedback structure
export interface ResumeFeedback {
  overallImpression: string;
  sectionFeedback: { [key: string]: string };
  suggestions: string[];
  score: number;
}

// Interface for job match analysis results
export interface JobMatchAnalysisResult {
  overallMatch: number;
  keywordMatches: { keyword: string; found: boolean }[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  relevanceScore: number;
}

// Mock feedback for testing or when API key isn't available
export const getMockFeedback = (): ResumeFeedback => {
  return {
    overallImpression: `Your resume is well-structured with clear sections, but could benefit from more quantifiable achievements and a stronger professional summary. The formatting is clean, although the content could be more impactful with specific metrics and results.`,
    sectionFeedback: {
      'Professional Summary': 'Your summary is a bit generic. Consider focusing on your unique value proposition and specific expertise that sets you apart.',
      'Work Experience': 'Good chronological ordering and company details, but many of your bullet points describe responsibilities rather than achievements. Try to include metrics and specific results.',
      'Skills': 'Good range of technical skills listed, but consider organizing them by proficiency or relevance to make them more scannable.',
      'Education': 'Education section is well-formatted with relevant details. Consider adding any notable academic achievements or relevant coursework if you\'re early in your career.'
    },    suggestions: [
      'Quantify your achievements with metrics (e.g., "Increased sales by 25%" instead of "Increased sales")',
      'Tailor your resume for each job application by emphasizing relevant skills and experience',
      'Add a LinkedIn profile and ensure it is consistent with your resume',
      'Consider adding a brief projects section if you have relevant work to showcase',
      'Use strong action verbs at the beginning of each bullet point (e.g., "Implemented", "Developed", "Led")'
    ],
    score: 72
  };
};

// Mock job match analysis for testing or when API key isn't available
export const getMockJobMatchAnalysis = (jobDescription: string): JobMatchAnalysisResult => {
  const keywords = [
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'API', 
    'Git', 'Agile', 'Testing', 'Frontend', 'Backend',
    'CI/CD', 'AWS', 'Cloud', 'Database', 'SQL'
  ];
  
  // Extract some keywords that might be in the job description
  const descriptionKeywords = keywords.filter(keyword => 
    jobDescription.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // If no keywords found, use a random selection
  const selectedKeywords = descriptionKeywords.length > 0 
    ? descriptionKeywords.slice(0, Math.min(7, descriptionKeywords.length))
    : keywords.sort(() => Math.random() - 0.5).slice(0, 7);
  
  const keywordMatches = selectedKeywords.map(keyword => ({
    keyword,
    found: Math.random() > 0.3 // 70% chance of being found
  }));
  
  const missingKeywords = selectedKeywords
    .filter((_, index) => !keywordMatches[index].found)
    .map(keyword => keyword);
  
  // Add some random additional missing keywords
  const additionalMissing = keywords
    .filter(keyword => !selectedKeywords.includes(keyword))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const allMissing = [...missingKeywords, ...additionalMissing];
  
  // Calculate match based on found keywords percentage
  const foundCount = keywordMatches.filter(k => k.found).length;
  const overallMatch = Math.floor((foundCount / keywordMatches.length) * 100);
  
  return {
    overallMatch,
    keywordMatches,
    missingKeywords: allMissing,
    suggestedImprovements: [
      `Add specific experience with ${allMissing[0] || 'relevant technologies'}`,
      'Quantify your achievements with specific metrics',
      'Highlight leadership roles or team collaboration',
      `Include keywords like ${allMissing[1] || 'industry-specific terms'}`,
      'Tailor your professional summary to match the job requirements'
    ],
    relevanceScore: Math.min(95, overallMatch + Math.floor(Math.random() * 15))
  };
};

// Function to get feedback from OpenAI
export const getAIFeedback = async (resumeText: string, apiKey: string): Promise<ResumeFeedback> => {
  try {
    if (!apiKey) {
      console.warn('No API key provided, returning mock feedback');
      return getMockFeedback();
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, it's better to use a backend service for API calls
    });

    // Define the prompt
    const prompt = `You are a professional resume coach. Review the following resume and provide:
1. Overall impressions (3-5 sentences)
2. Section-by-section feedback with specific improvements for each section
3. 5 specific, actionable suggestions for improvement
4. A score out of 100

Format your response as valid JSON with the following structure:
{
  "overallImpression": "string with overall feedback",
  "sectionFeedback": {
    "section name": "feedback for this section",
    ...other sections
  },
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "score": number
}

Here is the resume:
${resumeText}`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional resume coach who provides detailed, actionable feedback." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    try {
      // Extract JSON from the response (in case there's any extra text)
      const jsonMatch = content.match(/({[\s\S]*})/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      
      return JSON.parse(jsonString) as ResumeFeedback;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      return getMockFeedback();
    }
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    return getMockFeedback();
  }
};

// Function to analyze resume against job description
export const getJobMatchAnalysis = async (
  resumeText: string, 
  jobDescription: string,
  apiKey: string
): Promise<JobMatchAnalysisResult> => {
  try {
    if (!apiKey) {
      console.warn('No API key provided, returning mock job match analysis');
      return getMockJobMatchAnalysis(jobDescription);
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Define the prompt
    const prompt = `Analyze how well the provided resume matches the given job description. Focus on:
1. Identifying key skills, technologies, and qualifications from the job description
2. Determining if these are present in the resume
3. Calculating an overall match percentage
4. Suggesting specific improvements

Format your response as valid JSON with the following structure:
{
  "overallMatch": number (percentage of match from 0-100),
  "keywordMatches": [{ "keyword": string, "found": boolean }],
  "missingKeywords": [string],
  "suggestedImprovements": [string],
  "relevanceScore": number (overall relevance score from 0-100)
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` }
      ],
      temperature: 0.5,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as JobMatchAnalysisResult;
    
  } catch (error) {
    console.error('Error analyzing job match:', error);
    return getMockJobMatchAnalysis(jobDescription);
  }
};
