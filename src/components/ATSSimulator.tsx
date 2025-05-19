import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface ATSSimulatorProps {
  resumeText: string;
}

// Keywords commonly used by ATS systems for parsing resumes
const ATS_PARSE_KEYWORDS = [
  'experience', 'education', 'skills', 'projects', 'contact', 
  'email', 'phone', 'address', 'summary', 'objective', 'awards', 'certifications'
];

// Common formatting issues that may cause ATS problems
const FORMATTING_CHECKS = [
  { 
    name: 'Complex tables',
    regex: /\|\s*[-]+\s*\|/,
    negative: true,
    message: 'Tables can confuse ATS systems. Use simple bullet points instead.'
  },
  { 
    name: 'Uncommon bullet points',
    regex: /[^\w\s.,;:()-][\s]+/g,
    negative: true,
    message: 'Exotic bullet points may not parse correctly. Use standard bullets.'
  },
  { 
    name: 'Proper section headers',
    regex: /(experience|education|skills|projects)[\s]*:?[\s]*\n/i,
    negative: false,
    message: 'Clear section headers help ATS categorize information correctly.'
  },
  { 
    name: 'Contact information',
    regex: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i,
    negative: false,
    message: 'Contact information is easily identifiable.'
  },
  { 
    name: 'Date formats',
    regex: /(19|20)\d{2}\s*(-|–|to)\s*(19|20)\d{2}|present|current|now/i,
    negative: false,
    message: 'Employment dates are in a standard format that ATS can recognize.'
  }
];

// ATS simulator component
const ATSSimulator: React.FC<ATSSimulatorProps> = ({ resumeText }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsResults, setAtsResults] = useState<null | {
    overallScore: number;
    keywordResults: Array<{keyword: string, found: boolean}>;
    formattingResults: Array<{check: typeof FORMATTING_CHECKS[0], passed: boolean}>;
    recommendations: string[];
  }>(null);

  const handleATSAnalysis = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      // Check for keywords
      const keywordResults = ATS_PARSE_KEYWORDS.map(keyword => {
        const pattern = new RegExp(`\\b${keyword}\\b`, 'i');
        return {
          keyword,
          found: pattern.test(resumeText)
        };
      });

      // Check formatting issues
      const formattingResults = FORMATTING_CHECKS.map(check => {
        const testResult = check.regex.test(resumeText);
        return {
          check,
          passed: check.negative ? !testResult : testResult
        };
      });

      // Calculate score
      const keywordScore = keywordResults.filter(k => k.found).length / keywordResults.length;
      const formattingScore = formattingResults.filter(f => f.passed).length / formattingResults.length;
      const overallScore = Math.round(((keywordScore * 0.4) + (formattingScore * 0.6)) * 100);

      // Generate recommendations
      const recommendations: string[] = [];
      
      // Recommendations based on missing keywords
      const missingKeywords = keywordResults
        .filter(k => !k.found)
        .map(k => k.keyword);
        
      if (missingKeywords.length > 0) {
        recommendations.push(`Consider adding clear section headers for: ${missingKeywords.join(', ')}.`);
      }
      
      // Recommendations based on formatting issues
      formattingResults
        .filter(f => !f.passed)
        .forEach(f => {
          recommendations.push(f.check.message);
        });
        
      // Add generic recommendations
      recommendations.push('Use a clean, simple format with standard section headers.');
      recommendations.push('Ensure your name and contact details are at the top of the resume.');
      recommendations.push('Avoid images, graphics, and text boxes as ATS cannot read these.');
      recommendations.push('Use standard fonts like Arial, Calibri, or Times New Roman.');

      setAtsResults({
        overallScore,
        keywordResults,
        formattingResults,
        recommendations: recommendations.filter((r, i, self) => self.indexOf(r) === i).slice(0, 5) // Unique recommendations, max 5
      });

      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <DocumentMagnifyingGlassIcon className="h-6 w-6 text-teal-500 mr-2" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">ATS Compatibility Check</h2>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Check if your resume is optimized for Applicant Tracking Systems (ATS) that many employers use to filter candidates.
        </p>
        
        {!atsResults ? (
          <button
            onClick={handleATSAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-md shadow-sm transition-colors flex items-center justify-center"
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : "Check ATS Compatibility"}
          </button>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center mb-8">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">ATS Compatibility Score</span>
              <div className="flex justify-center items-center mt-2">
                <span className={`text-4xl font-bold ${getScoreColor(atsResults.overallScore)}`}>
                  {atsResults.overallScore}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full ${
                    atsResults.overallScore >= 80 ? 'bg-green-500' : 
                    atsResults.overallScore >= 60 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${atsResults.overallScore}%` }}
                ></div>
              </div>
            </div>
            
            {/* ATS Parsing Keywords */}
            <div>
              <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">
                ATS Parsing Keywords
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {atsResults.keywordResults.map((result, index) => (
                  <div 
                    key={index}
                    className="flex items-center p-2 rounded-md bg-slate-50 dark:bg-slate-700/50"
                  >
                    {result.found ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <span className={`text-sm capitalize ${result.found ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {result.keyword}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Formatting Checks */}
            <div>
              <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">
                Format Compatibility
              </h3>
              <div className="space-y-2">
                {atsResults.formattingResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`flex items-start p-3 rounded-md ${
                      result.passed 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30' 
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30'
                    }`}
                  >
                    {result.passed ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <span className={`text-sm font-medium ${
                        result.passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {result.check.name}
                      </span>
                      <p className={`text-xs mt-0.5 ${
                        result.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                      }`}>
                        {result.check.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h3 className="text-md font-medium text-slate-800 dark:text-white mb-3">
                Recommendations
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                {atsResults.recommendations.map((recommendation, index) => (
                  <li key={index} className="text-sm">{recommendation}</li>
                ))}
              </ul>
            </div>
            
            {/* Retry Button */}
            <div className="mt-6">
              <button
                onClick={() => setAtsResults(null)}
                className="w-full py-2 px-4 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Run Check Again
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ATSSimulator;
