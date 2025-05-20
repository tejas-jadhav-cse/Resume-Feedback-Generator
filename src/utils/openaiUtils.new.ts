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
  // Dynamic impression generation variable
  let overallImpression = '';
  
  // Analyze the resume text to extract potential sections
  const sections: {[key: string]: string} = {};
  
  // Dynamic score calculation
  let baseScore = 65; // Starting point
  let scoreAdjustment = 0;
  
  // Create suggestions array
  const suggestions: string[] = [];
  
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
    
    // Adjust score and build impression based on findings
    if (wordCount < 200) {
      scoreAdjustment -= 10; // Too short
      overallImpression = `Your resume appears quite brief at only about ${wordCount} words, which may not provide enough detail for recruiters. `;
    } else if (wordCount > 700) {
      scoreAdjustment -= 5; // Too long
      overallImpression = `At over ${wordCount} words, your resume is quite detailed, though possibly too lengthy for quick scanning. `;
    } else {
      scoreAdjustment += 5; // Good length
      overallImpression = `Your resume is a good length at approximately ${wordCount} words, making it substantial yet scannable. `;
    }
    
    if (averageSentenceLength > 25) {
      scoreAdjustment -= 5; // Sentences too long
      overallImpression += `Your sentences tend to be lengthy (averaging ${Math.round(averageSentenceLength)} words), which can make reading more difficult. `;
    } else if (averageSentenceLength < 8) {
      scoreAdjustment -= 3; // Sentences too short
      overallImpression += `Your writing style uses quite short sentences (averaging ${Math.round(averageSentenceLength)} words), which may appear fragmented. `;
    } else {
      scoreAdjustment += 3; // Good sentence length
      overallImpression += `Your writing style has good sentence structure with appropriate length. `;
    }
    
    if (quantifiables.length > 5) {
      scoreAdjustment += 10; // Good quantifiable achievements
      overallImpression += `Your resume effectively includes ${quantifiables.length} quantifiable achievements, which strengthens your impact. `;
    } else if (quantifiables.length > 2) {
      scoreAdjustment += 5; // Some quantifiable achievements
      overallImpression += `You've included ${quantifiables.length} quantifiable results, which is helpful, though more would strengthen your impact. `;
    } else {
      scoreAdjustment -= 8; // Few or no quantifiable achievements
      overallImpression += `Your resume lacks sufficient quantifiable achievements and metrics to demonstrate your impact. `;
    }
    
    if (actionVerbs.length > 15) {
      scoreAdjustment += 8; // Strong action verbs
      overallImpression += `You use strong action verbs throughout your descriptions, creating dynamic and engaging content. `;
    } else if (actionVerbs.length > 8) {
      scoreAdjustment += 4; // Some action verbs
      overallImpression += `Your use of action verbs is adequate, though increasing their frequency would strengthen your descriptions. `;
    } else {
      scoreAdjustment -= 7; // Few action verbs
      overallImpression += `Your descriptions could benefit from more powerful action verbs to convey your capabilities and achievements. `;
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
    
    // Generate dynamic suggestions based on resume content
    const possibleSuggestions = [
      // Quantifiable achievements suggestions
      quantifiables.length < 5 ? 
        `Add more quantifiable achievements (currently found ${quantifiables.length}). Use metrics like percentages, dollar amounts, or numbers to demonstrate impact.` : 
        `Continue to highlight quantifiable achievements throughout your experience section (${quantifiables.length} currently found).`,
      
      // Action verbs suggestions
      actionVerbs.length < 10 ? 
        `Use more powerful action verbs at the beginning of bullet points (e.g., "Implemented", "Developed", "Led") instead of passive language.` :
        `Your use of action verbs is effective. Consider varying them further to showcase diverse skills.`,
      
      // Skills suggestions
      foundTechTerms.length < 5 ? 
        `Expand your technical skills section with more industry-specific technologies and tools.` :
        `Consider organizing your technical skills by proficiency level or relevancy to make them more scannable.`,
      
      foundSoftSkills.length < 3 ?
        `Add more soft skills such as communication, leadership, or problem-solving to complement your technical abilities.` :
        `Your balance of technical and soft skills is good. Consider connecting them to specific achievements in your experience section.`,
      
      // ATS suggestions
      `Ensure your resume is ATS-compatible by using standard section headers and incorporating keywords from target job descriptions.`,
      
      // Format suggestions
      wordCount > 700 ?
        `Consider condensing your resume to improve readability. Focus on your most relevant and recent experiences.` :
        `Maintain your resume's concise format while ensuring all key achievements are highlighted.`,
      
      // LinkedIn suggestion
      `Add your LinkedIn profile and ensure it's consistent with your resume details for a cohesive professional narrative.`,
      
      // Tailoring suggestion
      `Tailor your resume for each specific job application by adjusting keywords and highlighting relevant experience.`,
      
      // Education suggestion
      `${extractedSections.includes('education') ? 
        'Consider adding relevant coursework or academic projects to your education section if relatively recent.' : 
        'Add an education section that highlights your academic credentials and relevant coursework.'}`,
      
      // Professional summary suggestion
      `${extractedSections.includes('professional summary') || extractedSections.includes('summary') ? 
        'Refine your professional summary to highlight your unique value proposition in 3-4 impactful sentences.' : 
        'Add a concise professional summary that captures your expertise, experience level, and career goals.'}`,
      
      // Layout suggestion
      `Use white space strategically to improve readability and create visual separation between sections.`,
      
      // Projects suggestion
      `${extractedSections.includes('projects') ? 
        'Enhance your projects section by quantifying results and highlighting specific technologies used.' : 
        'Consider adding a projects section to demonstrate practical application of your skills.'}`,
    ];
    
    // Select 5 unique suggestions based on the actual content
    const usedIndices = new Set<number>();
    while (suggestions.length < 5 && suggestions.length < possibleSuggestions.length) {
      const randomIndex = Math.floor(Math.random() * possibleSuggestions.length);
      if (!usedIndices.has(randomIndex)) {
        suggestions.push(possibleSuggestions[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    
  } else {
    // Fallback for empty resume text
    overallImpression = "This appears to be an empty resume. Please upload your resume content for a detailed analysis.";
    sections['Content'] = "No content was found to analyze. Please provide your resume text to receive specific feedback.";
    scoreAdjustment = -30;
    
    // Default sections
    sections['Professional Summary'] = "Unable to analyze - no content provided";
    sections['Work Experience'] = "Unable to analyze - no content provided";
    sections['Skills'] = "Unable to analyze - no content provided";
    sections['Education'] = "Unable to analyze - no content provided";
    
    // Default suggestions for empty resume
    suggestions.push("Upload your resume content to receive personalized feedback");
    suggestions.push("Ensure your resume includes clearly labeled sections for experience, skills, and education");
    suggestions.push("Use quantifiable achievements to demonstrate your impact in previous roles");
    suggestions.push("Include a concise professional summary that highlights your unique value proposition");
    suggestions.push("Structure your resume with consistent formatting and clear section headers");
  }
  
  // Calculate final score with adjustments, ensuring it stays within reasonable bounds
  const score = Math.max(35, Math.min(98, baseScore + scoreAdjustment));
  
  return {
    overallImpression,
    sectionFeedback: sections,
    suggestions,
    score
  };
};

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
      // Otherwise use random probability (60-80% chance of being found)
      return {
        keyword,
        found: Math.random() > 0.2 + (Math.random() * 0.2) // 60-80% chance
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
  overallMatch = Math.max(30, Math.min(95, overallMatch + (Math.floor(Math.random() * 15) - 7)));
  
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
    const randomSuggestion = generalSuggestions[Math.floor(Math.random() * generalSuggestions.length)];
    if (!suggestedImprovements.includes(randomSuggestion)) {
      suggestedImprovements.push(randomSuggestion);
    }
  }
  
  // Calculate relevance score (slightly different from match percentage)
  const relevanceScore = Math.floor(
    (overallMatch * 0.7) + // 70% based on keyword match
    (Math.random() * 15) + // Random factor
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

// Function to get feedback from OpenAI
export const getAIFeedback = async (resumeText: string, apiKey: string): Promise<ResumeFeedback> => {  try {
    if (!apiKey) {
      console.warn('No API key provided, returning mock feedback');
      return getMockFeedback(resumeText);
    }

    const openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, it's better to use a backend service for API calls
    });

    // Define the prompt - Enhance prompt to ensure varied feedback
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

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional resume coach who provides detailed, actionable feedback. Always make your feedback specifically tailored to the resume content. Never provide generic feedback." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9, // Increased for more variation
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
      
      return JSON.parse(jsonString) as ResumeFeedback;    } catch (parseError) {
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
): Promise<JobMatchAnalysisResult> => {  try {
    if (!apiKey) {
      console.warn('No API key provided, returning mock job match analysis');
      return getMockJobMatchAnalysis(jobDescription, resumeText);
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
    return getMockJobMatchAnalysis(jobDescription, resumeText);
  }
};
