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
export const getMockFeedback = (resumeText: string = ''): ResumeFeedback => {
  // Dynamic impression generation based on resume content
  let impression = '';
  
  // Analyze the resume text to extract potential sections
  const sections: {[key: string]: string} = {};
  
  // Dynamic score that will be more varied and responds to content
  let baseScore = 65; // Starting point
  let scoreAdjustment = 0;
  
  // Process resume text for more dynamic feedback
  if (resumeText) {
    const words = resumeText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const averageSentenceLength = words.length / Math.max(1, sentences.length);
    
    // Extract common sections and keywords
    const extractedSections: string[] = [];
    const possibleSections = [
      'professional summary', 'summary', 'objective', 'profile',
      'experience', 'work experience', 'employment history', 'work history',
      'skills', 'technical skills', 'core competencies', 'qualifications',
      'education', 'academic background', 'training',
      'projects', 'portfolio', 'achievements',
      'certifications', 'licenses', 'publications',
      'volunteering', 'community service', 'activities',
      'languages', 'interests', 'references'
    ];
    
    possibleSections.forEach(section => {
      const regex = new RegExp(`\\b${section}\\b`, 'i');
      if (regex.test(resumeText)) {
        extractedSections.push(section);
      }
    });
    
    // Look for quantifiable achievements
    const quantifiablePattern = /\d+%|\$\d+|\d+ years|\d+ months|\d+ users|\d+ customers|\d+ projects/gi;
    const quantifiables = resumeText.match(quantifiablePattern) || [];
    
    // Look for action verbs
    const actionVerbPattern = /\b(led|developed|managed|created|implemented|designed|achieved|improved|increased|decreased|reduced|saved|delivered|launched|built|optimized|transformed)\b/gi;
    const actionVerbs = resumeText.match(actionVerbPattern) || [];
    
    // Adjust score based on findings
    if (wordCount < 200) {
      scoreAdjustment -= 10; // Too short
      impression = `Your resume appears quite brief at only about ${wordCount} words, which may not provide enough detail for recruiters. `;
    } else if (wordCount > 700) {
      scoreAdjustment -= 5; // Too long
      impression = `At over ${wordCount} words, your resume is quite detailed, though possibly too lengthy for quick scanning. `;
    } else {
      scoreAdjustment += 5; // Good length
      impression = `Your resume is a good length at approximately ${wordCount} words, making it substantial yet scannable. `;
    }
    
    if (averageSentenceLength > 25) {
      scoreAdjustment -= 5; // Sentences too long
      impression += `Your sentences tend to be lengthy (averaging ${Math.round(averageSentenceLength)} words), which can make reading more difficult. `;
    } else if (averageSentenceLength < 8) {
      scoreAdjustment -= 3; // Sentences too short
      impression += `Your writing style uses quite short sentences (averaging ${Math.round(averageSentenceLength)} words), which may appear fragmented. `;
    } else {
      scoreAdjustment += 3; // Good sentence length
      impression += `Your writing style has good sentence structure with appropriate length. `;
    }
    
    if (quantifiables.length > 5) {
      scoreAdjustment += 10; // Good quantifiable achievements
      impression += `Your resume effectively includes ${quantifiables.length} quantifiable achievements, which strengthens your impact. `;
    } else if (quantifiables.length > 2) {
      scoreAdjustment += 5; // Some quantifiable achievements
      impression += `You've included ${quantifiables.length} quantifiable results, which is helpful, though more would strengthen your impact. `;
    } else {
      scoreAdjustment -= 8; // Few or no quantifiable achievements
      impression += `Your resume lacks sufficient quantifiable achievements and metrics to demonstrate your impact. `;
    }
    
    if (actionVerbs.length > 15) {
      scoreAdjustment += 8; // Strong action verbs
      impression += `You use strong action verbs throughout your descriptions, creating dynamic and engaging content. `;
    } else if (actionVerbs.length > 8) {
      scoreAdjustment += 4; // Some action verbs
      impression += `Your use of action verbs is adequate, though increasing their frequency would strengthen your descriptions. `;
    } else {
      scoreAdjustment -= 7; // Few action verbs
      impression += `Your descriptions could benefit from more powerful action verbs to convey your capabilities and achievements. `;
    }
    
    // Create dynamic section feedback
    if (extractedSections.includes('professional summary') || extractedSections.includes('summary') || extractedSections.includes('objective')) {
      const hasClearValue = /value|contribute|expertise|specialize|experienced in/i.test(resumeText.slice(0, 500));
      if (hasClearValue) {
        sections['Professional Summary'] = `Your summary effectively communicates your value proposition and key expertise. Consider adding 1-2 more specific achievements to make it even stronger.`;
        scoreAdjustment += 5;
      } else {
        sections['Professional Summary'] = `Your summary would benefit from a clearer articulation of your unique value proposition and specific expertise. Currently, it's somewhat generic and doesn't immediately grab attention.`;
        scoreAdjustment -= 3;
      }
    } else {
      sections['Professional Summary'] = `Your resume appears to be missing a clear professional summary or objective section. Adding a concise 3-4 line summary would help recruiters quickly understand your value proposition.`;
      scoreAdjustment -= 5;
    }
    
    // Experience section evaluation
    if (extractedSections.includes('experience') || extractedSections.includes('work experience') || extractedSections.includes('employment history')) {
      if (quantifiables.length > 3) {
        sections['Work Experience'] = `Your experience section effectively uses quantifiable achievements (${quantifiables.length} instances noted) which demonstrates your impact. Continue using the STAR method to showcase results.`;
        scoreAdjustment += 8;
      } else {
        sections['Work Experience'] = `While your experience section outlines your responsibilities, it would be significantly stronger with more measurable outcomes and specific accomplishments. Try adding metrics like percentages, dollar amounts, or other quantifiable results.`;
        scoreAdjustment -= 5;
      }
    } else {
      sections['Work Experience'] = `The work experience section appears to be missing or not clearly defined. This is a critical section that should highlight your relevant roles, responsibilities, and especially your achievements.`;
      scoreAdjustment -= 10;
    }
    
    // Look for skills and technical terms
    const techTerms = ['python', 'javascript', 'java', 'react', 'angular', 'node', 'aws', 'cloud', 'database', 'sql', 'api', 'agile', 'scrum'];
    const softSkills = ['communication', 'leadership', 'teamwork', 'problem solving', 'analytical', 'time management', 'creativity', 'adaptability'];
    
    const foundTechTerms = techTerms.filter(term => resumeText.toLowerCase().includes(term.toLowerCase()));
    const foundSoftSkills = softSkills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()));
    
    if (foundTechTerms.length > 0 || foundSoftSkills.length > 0) {
      let skillsFeedback = '';
      if (foundTechTerms.length >= 4) {
        skillsFeedback = `Good range of technical skills including ${foundTechTerms.slice(0, 3).join(', ')}, and ${foundTechTerms.length - 3} more. `;
        scoreAdjustment += 7;
      } else if (foundTechTerms.length > 0) {
        skillsFeedback = `You mention some technical skills like ${foundTechTerms.join(', ')}, but consider expanding this list. `;
        scoreAdjustment += 3;
      } else {
        skillsFeedback = `Your resume could benefit from more specific technical skills relevant to your field. `;
        scoreAdjustment -= 5;
      }
      
      if (foundSoftSkills.length >= 3) {
        skillsFeedback += `You effectively highlight soft skills such as ${foundSoftSkills.slice(0, 3).join(', ')}.`;
        scoreAdjustment += 5;
      } else if (foundSoftSkills.length > 0) {
        skillsFeedback += `You mention ${foundSoftSkills.join(', ')} as soft skills, but should include more to show well-roundedness.`;
        scoreAdjustment += 2;
      } else {
        skillsFeedback += `Consider adding relevant soft skills to complement your technical abilities.`;
        scoreAdjustment -= 3;
      }
      
      sections['Skills'] = skillsFeedback;
    } else {
      sections['Skills'] = `Your resume lacks a clear skills section or doesn't highlight specific competencies. Adding a well-organized skills section would help recruiters quickly identify your capabilities.`;
      scoreAdjustment -= 8;
    }
    
    // Education section
    if (extractedSections.includes('education') || extractedSections.includes('academic background')) {
      const hasDegreeMention = /degree|bachelor|master|phd|diploma|certificate/i.test(resumeText);
      if (hasDegreeMention) {
        sections['Education'] = `Your education section is clearly presented with necessary details. Consider adding any relevant coursework or academic achievements that relate to your target role.`;
        scoreAdjustment += 4;
      } else {
        sections['Education'] = `Your education section could be enhanced with more details about your degrees, relevant coursework, or academic achievements.`;
        scoreAdjustment += 0;
      }
    } else {
      sections['Education'] = `Your resume appears to be missing an education section. Even with extensive experience, including your educational background provides a complete picture.`;
      scoreAdjustment -= 5;
    }
    
    // Additional sections commonly found in strong resumes
    if (extractedSections.includes('projects')) {
      sections['Projects'] = `Including a projects section demonstrates initiative and practical application of your skills. Make sure each project highlights specific technologies used and measurable outcomes.`;
      scoreAdjustment += 5;
    }
    
    if (extractedSections.includes('certifications') || extractedSections.includes('licenses')) {
      sections['Certifications'] = `Your certifications add credibility to your qualifications. Keep these updated and ensure they're relevant to your target roles.`;
      scoreAdjustment += 4;
    }
    
    // Add any other identified sections with custom feedback
    extractedSections.forEach(section => {
      if (!['professional summary', 'summary', 'objective', 'profile', 'experience', 'work experience', 'employment history', 'skills', 'technical skills', 'education', 'projects', 'certifications', 'licenses'].includes(section)) {
        const sectionName = section.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const hasExistingSection = Object.keys(sections).find(key => key.toLowerCase() === sectionName.toLowerCase());
        
        if (!hasExistingSection) {
          sections[sectionName] = `This ${sectionName} section adds dimension to your profile. Consider connecting these elements more explicitly to your professional value proposition.`;
        }
      }
    });
    
    // Ensure we always have basic sections even if not explicitly found
    if (!sections['Professional Summary'] && !sections['Summary'] && !sections['Objective']) {
      sections['Professional Summary'] = `Adding a concise professional summary would help hiring managers quickly understand your value proposition and key qualifications.`;
      scoreAdjustment -= 5;
    }
    
    if (!sections['Work Experience'] && !sections['Experience'] && !sections['Employment History']) {
      sections['Work Experience'] = `Your experience section should be the focal point of your resume, highlighting your achievements, not just responsibilities.`;
      scoreAdjustment -= 5;
    }
    
    if (!sections['Skills'] && !sections['Technical Skills'] && !sections['Core Competencies']) {
      sections['Skills'] = `A dedicated skills section would help highlight your technical and professional capabilities in an easily scannable format.`;
      scoreAdjustment -= 5;
    }
    
    if (!sections['Education']) {
      sections['Education'] = `Including your educational background provides completeness to your professional story, even if your experience is more relevant.`;
      scoreAdjustment -= 3;
    }

    // Check for common technical terms to personalize feedback
    const techKeywords = ['python', 'javascript', 'java', 'react', 'angular', 'node', 'aws', 'cloud', 'database', 'sql', 'api'];
    const foundTechKeywords = techKeywords.filter(term => resumeText.toLowerCase().includes(term.toLowerCase()));
    
    if (foundTechKeywords.length > 0 && !sections['Technical Skills']) {
      sections['Technical Skills'] = `Good mention of ${foundTechKeywords.join(', ')}, but consider organizing these by proficiency level and adding more context about how you've applied them in your work.`;
    }

    // Calculate final score with some randomness to ensure different scores for different resumes
    const randomFactor = Math.floor(Math.random() * 5) - 2; // -2 to +2 random adjustment
    const calculatedScore = Math.max(30, Math.min(98, baseScore + scoreAdjustment + randomFactor));
    
    return {
      overallImpression: impression,
      sectionFeedback: sections,
      suggestions: selectSuggestions(resumeText),
      score: calculatedScore
    };
  } else {
    // Fallback for empty resume text
    impression = "This appears to be an empty resume. Please upload your resume content for a detailed analysis.";
    sections['Content'] = "No content was found to analyze. Please provide your resume text to receive specific feedback.";
    
    // Default sections
    sections['Professional Summary'] = "Unable to analyze - no content provided";
    sections['Work Experience'] = "Unable to analyze - no content provided";
    sections['Skills'] = "Unable to analyze - no content provided";
    sections['Education'] = "Unable to analyze - no content provided";
    
    return {
      overallImpression: impression,
      sectionFeedback: sections,
      suggestions: generateDefaultSuggestions(),
      score: 0
    };
  }
};

// Helper function to select relevant suggestions based on resume content
const selectSuggestions = (resumeText: string): string[] => {
  // Array of possible suggestions
  const allSuggestions = [
    'Quantify your achievements with metrics (e.g., "Increased sales by 25%" instead of "Increased sales")',
    'Tailor your resume for each job application by emphasizing relevant skills and experience',
    'Add a LinkedIn profile and ensure it is consistent with your resume',
    'Consider adding a brief projects section if you have relevant work to showcase',
    'Use strong action verbs at the beginning of each bullet point (e.g., "Implemented", "Developed", "Led")',
    'Create a more focused professional summary that highlights your unique value proposition',
    'Remove outdated or irrelevant experience to keep your resume concise',
    'Incorporate industry keywords to help your resume pass through ATS systems',
    'Add specific technical skills with proficiency levels where applicable',
    'Include certifications and continuing education to demonstrate ongoing professional development',
    'Make your achievements more specific by including context, action, and results',
    'Ensure consistent formatting throughout your resume (fonts, bullet points, spacing)',
    'Consider a skills-based format if you\'re changing industries or have employment gaps',
    'Add a brief technologies/tools section for technical roles',
    'Use white space strategically to improve readability and visual appeal',
    'Replace generic phrases like "team player" with specific examples of collaboration',
    'Include relevant volunteer work, especially if it demonstrates transferable skills',
    'Eliminate pronouns like "I" and "my" to maintain a professional tone',
    'Adjust your resume length based on your experience level (1 page for early career, 2 pages for 10+ years)',
    'Have your resume reviewed by someone in your target industry for specialized feedback'
  ];
  
  const lowerCaseResumeText = resumeText.toLowerCase();
  
  // Prioritize suggestions based on content analysis
  const prioritizedSuggestions = [...allSuggestions];
  
  // Check for quantifiable achievements
  if (!/\d+%|\$\d+|\d+ years|\d+ months|\d+ users|\d+ customers|\d+ projects/gi.test(resumeText)) {
    // Move quantifiable suggestions to the top
    moveToTop(prioritizedSuggestions, 'Quantify your achievements');
  }
  
  // Check for action verbs
  if (!/\b(led|developed|managed|created|implemented|designed|achieved|improved)\b/gi.test(resumeText)) {
    moveToTop(prioritizedSuggestions, 'Use strong action verbs');
  }
  
  // Check for LinkedIn profile
  if (!/(linkedin\.com|linkedin profile)/i.test(resumeText)) {
    moveToTop(prioritizedSuggestions, 'Add a LinkedIn profile');
  }
  
  // Check for projects section
  if (!/\bproject(s)?\b/i.test(resumeText)) {
    moveToTop(prioritizedSuggestions, 'Consider adding a brief projects section');
  }
  
  // Check for technical content
  if (/\b(developer|engineer|programmer|coding|software|web|app)\b/i.test(resumeText)) {
    moveToTop(prioritizedSuggestions, 'Add a brief technologies/tools section for technical roles');
    moveToTop(prioritizedSuggestions, 'Add specific technical skills with proficiency levels');
  }
  
  // Randomly select 5 unique suggestions with priority given to the top ones
  const suggestions: string[] = [];
  const usedIndices = new Set<number>();
  
  // First try to pick from the first 8 suggestions (which include our prioritized ones)
  while (suggestions.length < 3 && prioritizedSuggestions.length > 0) {
    const index = Math.floor(Math.random() * Math.min(8, prioritizedSuggestions.length));
    if (!usedIndices.has(index)) {
      suggestions.push(prioritizedSuggestions[index]);
      usedIndices.add(index);
      prioritizedSuggestions.splice(index, 1); // Remove the selected suggestion
    }
  }
  
  // Fill the rest with random suggestions
  while (suggestions.length < 5 && prioritizedSuggestions.length > 0) {
    const index = Math.floor(Math.random() * prioritizedSuggestions.length);
    suggestions.push(prioritizedSuggestions[index]);
    prioritizedSuggestions.splice(index, 1);
  }
  
  return suggestions;
};

// Helper function to move matching suggestions to the top of the array
function moveToTop(suggestions: string[], startsWithText: string): void {
  const index = suggestions.findIndex(suggestion => 
    suggestion.toLowerCase().startsWith(startsWithText.toLowerCase())
  );
  
  if (index !== -1) {
    const [suggestion] = suggestions.splice(index, 1);
    suggestions.unshift(suggestion);
  }
}

// Generate default suggestions when no resume is provided
function generateDefaultSuggestions(): string[] {
  return [
    'Start by creating a clear and concise resume with your contact information at the top',
    'Include a strong professional summary that highlights your key qualifications',
    'Organize your experience section chronologically with most recent positions first',
    'Include a skills section that highlights both technical and soft skills',
    'Add your education and any relevant certifications or training'
  ];
}

// Mock job match analysis for testing or when API key isn't available
export const getMockJobMatchAnalysis = (jobDescription: string, resumeText: string = ''): JobMatchAnalysisResult => {
  // Expanded list of common keywords across various industries
  const keywords = [
    // Tech/Development
    'React', 'TypeScript', 'JavaScript', 'Node.js', 'API', 'Python', 'Java', 'C#', 'Ruby', 
    'Git', 'Agile', 'Scrum', 'Testing', 'Frontend', 'Backend', 'Full Stack',
    'CI/CD', 'AWS', 'Azure', 'Cloud', 'Docker', 'Kubernetes', 'Database', 'SQL', 'NoSQL',
    
    // Business/Marketing
    'Strategy', 'Analytics', 'Management', 'Leadership', 'Sales', 'Marketing', 'SEO', 
    'Social Media', 'Content', 'Campaign', 'Budget', 'ROI', 'KPI', 'CRM',
    
    // Design/UX
    'UX', 'UI', 'User Experience', 'User Interface', 'Figma', 'Sketch', 'Adobe', 'Photoshop',
    'Illustrator', 'Wireframes', 'Prototyping', 'Responsive Design',
    
    // General Professional Skills
    'Communication', 'Teamwork', 'Project Management', 'Problem Solving', 'Critical Thinking',
    'Customer Service', 'Time Management', 'Stakeholder', 'Presentation', 'Negotiation'
  ];
  
  // Extract keywords from job description
  let extractedKeywords: string[] = [];
  
  if (jobDescription.trim()) {
    // Try to extract specific keywords from the job description
    extractedKeywords = keywords.filter(keyword => 
      jobDescription.toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Extract additional keywords that might be requirements (look for patterns like "X years of Y" or "experience with Y")
    const experiencePatterns = [
      /experience (?:in|with) ([\w\s\-\/]+?)(?:\.|,|\s(?:and|or))/gi,
      /knowledge of ([\w\s\-\/]+?)(?:\.|,|\s(?:and|or))/gi,
      /proficiency (?:in|with) ([\w\s\-\/]+?)(?:\.|,|\s(?:and|or))/gi,
      /familiar with ([\w\s\-\/]+?)(?:\.|,|\s(?:and|or))/gi,
      /skill(?:s)? (?:in|with) ([\w\s\-\/]+?)(?:\.|,|\s(?:and|or))/gi
    ];
    
    experiencePatterns.forEach(pattern => {
      const matches = [...jobDescription.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].length > 3 && match[1].length < 30) {
          extractedKeywords.push(match[1].trim());
        }
      });
    });
  }
  
  // If no keywords were found, use a random selection
  const selectedKeywords = extractedKeywords.length > 0 
    ? [...new Set(extractedKeywords)].slice(0, Math.min(10, extractedKeywords.length))
    : keywords.sort(() => Math.random() - 0.5).slice(0, 10);
  
  // Determine whether each keyword is found in the resume
  const keywordMatches = selectedKeywords.map(keyword => {
    // If we have resume text, check if the keyword is actually in it
    if (resumeText) {
      const isFound = resumeText.toLowerCase().includes(keyword.toLowerCase());
      return {
        keyword,
        found: isFound
      };
    } else {
      // Otherwise use random probability (40-60% chance of being found to create more realistic variability)
      return {
        keyword,
        found: Math.random() > 0.4 + (Math.random() * 0.2)
      };
    }
  });
  
  const missingKeywords = keywordMatches
    .filter(match => !match.found)
    .map(match => match.keyword);
  
  // Add some random additional missing keywords that might be relevant
  const additionalMissing = keywords
    .filter(keyword => !selectedKeywords.includes(keyword))
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  
  const allMissing = [...missingKeywords, ...additionalMissing];
  
  // Calculate match based on found keywords percentage with some randomization
  // but ensure it relates to actual keywords if we have resume text
  const foundCount = keywordMatches.filter(k => k.found).length;
  let overallMatch = Math.floor((foundCount / keywordMatches.length) * 100);
  
  // Add some minor randomization to the match percentage
  // Using a seeded random value based on content for consistency when reanalyzing same content
  const contentHash = hashString(resumeText + jobDescription);
  const randomOffset = (contentHash % 15) - 7; // -7 to +7 range
  
  overallMatch = Math.max(30, Math.min(95, overallMatch + randomOffset));
  
  // Generate improvement suggestions based on missing keywords
  const suggestedImprovements: string[] = [];
  
  if (allMissing.length > 0) {
    suggestedImprovements.push(`Add specific experience with ${allMissing.slice(0, 2).join(' and ')}`);
  } else {
    suggestedImprovements.push('Further develop your expertise in key technologies mentioned in the job description');
  }
  
  // Add some general suggestions
  const generalSuggestions = [
    'Quantify your achievements with specific metrics and outcomes',
    'Highlight leadership roles or team collaboration examples',
    'Include specific examples of relevant projects you\'ve completed',
    'Tailor your professional summary to better match the job requirements',
    'Reorganize your skills section to prioritize the most relevant technologies',
    'Add more industry-specific terminology throughout your resume',
    'Emphasize problem-solving abilities with concrete examples',
    'Include relevant certifications or continued education in your field',
    'Demonstrate your communication skills with specific examples',
    'Show progression and growth in your career history'
  ];
  
  // Add 4 general suggestions
  while (suggestedImprovements.length < 5) {
    const randomIndex = (contentHash + suggestedImprovements.length) % generalSuggestions.length;
    const suggestion = generalSuggestions[randomIndex];
    if (!suggestedImprovements.includes(suggestion)) {
      suggestedImprovements.push(suggestion);
    } else {
      // If we already used this suggestion, pick randomly
      const unusedSuggestions = generalSuggestions.filter(s => !suggestedImprovements.includes(s));
      if (unusedSuggestions.length > 0) {
        suggestedImprovements.push(unusedSuggestions[0]);
      }
    }
  }
  
  // Calculate relevance score (slightly different from match percentage)
  const relevanceScore = Math.floor(
    (overallMatch * 0.7) + // 70% based on keyword match
    ((contentHash % 10) + 5) + // 5-15 random factor based on content
    (resumeText ? Math.min(15, resumeText.length / 500) : 10) // Length factor (more content = potentially more relevant)
  );
  
  return {
    overallMatch,
    keywordMatches,
    missingKeywords: allMissing,
    suggestedImprovements,
    relevanceScore: Math.min(98, Math.max(40, relevanceScore)) // Keep it between 40-98
  };
};

// Simple string hashing function to generate a deterministic number from text
function hashString(str: string): number {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash);
}

// Function to get feedback from OpenAI
export const getAIFeedback = async (resumeText: string, apiKey: string): Promise<ResumeFeedback> => {  
  try {
    if (!apiKey) {
      console.warn('No API key provided, returning mock feedback');
      return getMockFeedback(resumeText);
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, it's better to use a backend service for API calls
    });

    // Define the prompt - Enhanced for more varied feedback
    const prompt = `You are a professional resume coach. Review the following resume and provide:
1. Overall impressions (3-5 sentences) - be specific to the actual content in this resume
2. Section-by-section feedback with specific improvements for each section
3. 5 specific, actionable suggestions for improvement that directly relate to this specific resume
4. A score out of 100 that accurately reflects the quality of this particular resume

Your feedback should be unique and tailored specifically to this resume. 
Generate different insights each time even for similar resumes.
Make sure to mention specific details from the resume in your feedback.
Vary your scoring approach to reflect the actual quality of the resume.

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

    // Call OpenAI API with a unique temperature for each request
    // This ensures different responses even for the same resume
    const dynamicTemperature = 0.7 + (Math.random() * 0.3); // 0.7-1.0 range
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional resume coach who provides detailed, actionable feedback. Always make your feedback specifically tailored to the resume content. Never provide generic feedback." },
        { role: "user", content: prompt }
      ],
      temperature: dynamicTemperature,
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
      return getMockFeedback(resumeText);
    }
  } catch (error) {
    console.error('Error getting AI feedback:', error);
    return getMockFeedback(resumeText);
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
      return getMockJobMatchAnalysis(jobDescription, resumeText);
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true
    });

    // Define the prompt - Enhanced for more varied responses
    const prompt = `Analyze how well the provided resume matches the given job description. Focus on:
1. Identifying key skills, technologies, and qualifications from the job description
2. Determining if these are present in the resume
3. Calculating an overall match percentage
4. Suggesting specific improvements

Each time you analyze a resume, ensure you're providing unique insights and specific recommendations.
Even if analyzing similar resumes against the same job, vary your approach and focus on different aspects.

Format your response as valid JSON with the following structure:
{
  "overallMatch": number (percentage of match from 0-100),
  "keywordMatches": [{ "keyword": string, "found": boolean }],
  "missingKeywords": [string],
  "suggestedImprovements": [string],
  "relevanceScore": number (overall relevance score from 0-100)
}`;

    const dynamicTemperature = 0.5 + (Math.random() * 0.3); // 0.5-0.8 range

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` }
      ],
      temperature: dynamicTemperature,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as JobMatchAnalysisResult;
  } catch (error) {
    console.error('Error analyzing job match:', error);
    return getMockJobMatchAnalysis(jobDescription, resumeText);
  }
};
