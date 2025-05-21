import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentDuplicateIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { getMockJobMatchAnalysis } from '../utils/openaiUtils';

interface JobMatchAnalysisProps {
  resumeText: string;
  apiKey: string;
  onMatchAnalysisComplete: (matchData: MatchAnalysisResult) => void;
}

export interface MatchAnalysisResult {
  overallMatch: number;
  keywordMatches: { keyword: string; found: boolean }[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  relevanceScore: number;
}

const JobMatchAnalysis: React.FC<JobMatchAnalysisProps> = ({ resumeText, apiKey, onMatchAnalysisComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const handleAnalyzeMatch = async () => {
    if (!resumeText || !jobDescription) {
      alert('Please ensure both resume text and job description are provided.');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      // Check if a valid API key is provided
      if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 20) {
        console.warn('No valid API key provided, using mock job match analysis');
        setTimeout(() => {
          const mockResult = getMockJobMatchAnalysis(jobDescription, resumeText);
          onMatchAnalysisComplete(mockResult);
          setIsAnalyzing(false);
        }, 1500);
        return;
      }

      // Create a unique session ID to ensure different responses even for the same inputs
      const sessionId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      
      // Define the OpenAI API request
      const prompt = `Analyze how well the provided resume matches the given job description. Focus on:
1. Identifying key skills, technologies, and qualifications from the job description
2. Determining if these are present in the resume
3. Calculating an overall match percentage
4. Suggesting specific improvements

Each time you analyze a resume, ensure you're providing unique insights and specific recommendations.
Even if analyzing similar resumes against the same job, vary your approach and focus on different aspects.
This is session ID: ${sessionId} - use this to ensure unique responses.

Format your response as valid JSON with the following structure:
{
  "overallMatch": number (percentage of match from 0-100),
  "keywordMatches": [{ "keyword": string, "found": boolean }],
  "missingKeywords": [string],
  "suggestedImprovements": [string],
  "relevanceScore": number (overall relevance score from 0-100)
}`;

      const dynamicTemperature = 0.5 + (Math.random() * 0.3); // 0.5-0.8 range for variability
      
      // Make the API call using fetch for better browser compatibility
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: `Resume:\n${resumeText}\n\nJob Description:\n${jobDescription}` }
          ],
          temperature: dynamicTemperature,
          max_tokens: 1500,
          response_format: { type: "json_object" },
          user: sessionId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        // Check for quota error and show a user-friendly message
        if (response.status === 429 && errorText.includes('insufficient_quota')) {
          alert('You have exceeded your OpenAI API quota. Please check your OpenAI account billing and usage.');
        }
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content in OpenAI response');
      }

      // Parse the JSON response
      const result = JSON.parse(content);
      onMatchAnalysisComplete(result);
      
    } catch (error: any) {
      console.error('Error analyzing job match:', error?.message || error);
      alert('Error analyzing job match. Falling back to sample analysis.');
      // Fall back to mock analysis
      const mockResult = getMockJobMatchAnalysis(jobDescription, resumeText);
      onMatchAnalysisComplete(mockResult);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center mb-4">
        <DocumentDuplicateIcon className="h-6 w-6 text-indigo-500 mr-2" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Job Match Analysis</h2>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Paste Job Description
        </label>
        <textarea
          className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-800 focus:ring-opacity-50 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition"
          placeholder="Paste the job description here to get personalized match analysis..."
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>
      
      <button
        onClick={handleAnalyzeMatch}
        disabled={isAnalyzing}
        className="flex items-center justify-center w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-md shadow-sm transition-colors"
      >
        {isAnalyzing ? (
          <>
            <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <SparklesIcon className="h-5 w-5 mr-2" />
            Analyze Job Match
          </>
        )}
      </button>
    </motion.div>
  );
};

export default JobMatchAnalysis;
