import OpenAI from 'openai';

// Interface for the feedback structure
export interface ResumeFeedback {
  overallImpression: string;
  sectionFeedback: { [key: string]: string };
  suggestions: string[];
  score: number;
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
