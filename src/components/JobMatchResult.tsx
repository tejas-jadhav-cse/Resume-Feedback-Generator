import { motion } from 'framer-motion';
import { ChartBarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { MatchAnalysisResult } from './JobMatchAnalysis';

interface JobMatchResultProps {
  matchData: MatchAnalysisResult | null;
}

const JobMatchResult: React.FC<JobMatchResultProps> = ({ matchData }) => {
  if (!matchData) return null;
  
  const { overallMatch, keywordMatches, missingKeywords, suggestedImprovements, relevanceScore } = matchData;
  
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-6 w-6 text-indigo-500 mr-2" />
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Job Match Results</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">Match:</span>
            <span className={`text-lg font-bold ${getMatchColor(overallMatch)}`}>
              {overallMatch}%
            </span>
          </div>
        </div>

        {/* Match Visualization */}
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full mb-6 overflow-hidden">
          <div 
            className={`h-full ${
              overallMatch >= 80 ? 'bg-green-500' : 
              overallMatch >= 60 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: `${overallMatch}%` }}
          ></div>
        </div>
        
        {/* Keyword Analysis */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">
            Keyword Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {keywordMatches.map((match, index) => (
              <div 
                key={index}
                className="flex items-center p-2 rounded-md bg-slate-50 dark:bg-slate-700/50"
              >
                {match.found ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                )}
                <span className={`text-sm ${match.found ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {match.keyword}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Missing Keywords */}
        {missingKeywords.length > 0 && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-slate-800 dark:text-white mb-2">
              Consider Adding These Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 rounded-md text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Suggested Improvements */}
        <div className="mb-4">
          <h3 className="text-md font-medium text-slate-800 dark:text-white mb-2">
            Suggested Improvements
          </h3>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            {suggestedImprovements.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
        </div>
        
        {/* Relevance Score */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Overall Relevance Score
            </span>
            <div className="flex items-center">
              <span className={`text-lg font-bold ${getMatchColor(relevanceScore)}`}>
                {relevanceScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default JobMatchResult;
