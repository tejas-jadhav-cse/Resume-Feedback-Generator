import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentDuplicateIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

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
      // In a real implementation, this would use the OpenAI API
      // For now, we'll simulate with a timeout and mock data
      setTimeout(() => {
        const mockResult: MatchAnalysisResult = {
          overallMatch: Math.floor(Math.random() * 30) + 50, // 50-80%
          keywordMatches: [
            { keyword: 'React', found: true },
            { keyword: 'TypeScript', found: true },
            { keyword: 'Team leadership', found: Math.random() > 0.5 },
            { keyword: 'Project management', found: Math.random() > 0.5 },
            { keyword: 'Agile methodology', found: Math.random() > 0.3 },
            { keyword: 'CI/CD', found: Math.random() > 0.7 }
          ],
          missingKeywords: ['Docker', 'Kubernetes', 'AWS', 'GraphQL'].filter(() => Math.random() > 0.5),
          suggestedImprovements: [
            'Add specific examples of React project implementations',
            'Highlight your experience with CI/CD pipelines',
            'Include metrics from past projects showing quantifiable results',
            'Mention your experience with cloud platforms like AWS',
            'Emphasize your Agile methodology experience'
          ],
          relevanceScore: Math.floor(Math.random() * 20) + 60
        };
        
        onMatchAnalysisComplete(mockResult);
        setIsAnalyzing(false);
      }, 2000);
      
      // In production, you would use OpenAI like:
      /*
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Analyze a resume against a job description. Evaluate keyword matches, missing skills, and overall match percentage.`
          },
          {
            role: "user",
            content: `Resume: ${resumeText}\n\nJob Description: ${jobDescription}`
          }
        ],
        temperature: 0.5,
        response_format: { type: "json_object" }
      });
      
      const result = JSON.parse(response.choices[0].message.content);
      onMatchAnalysisComplete(result);
      */
      
    } catch (error) {
      console.error('Error analyzing job match:', error);
      alert('Error analyzing job match. Please try again.');
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
