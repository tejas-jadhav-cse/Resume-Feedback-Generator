import { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentCheckIcon, LightBulbIcon, StarIcon } from '@heroicons/react/24/outline';
// Import ExportButton component
import ExportButton from './ExportButton';

interface FeedbackCardProps {
  feedback: {
    overallImpression: string;
    sectionFeedback: { [key: string]: string };
    suggestions: string[];
    score: number;
  } | null;
}

const FeedbackCard = ({ feedback }: FeedbackCardProps) => {
  const [activeTab, setActiveTab] = useState('overall');

  if (!feedback) return null;

  const { overallImpression, sectionFeedback, suggestions, score } = feedback;
  
  const tabClasses = (tab: string) => 
    `px-4 py-2 text-sm font-medium rounded-md cursor-pointer ${
      activeTab === tab 
        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full mt-8"
    >      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex items-center">
              <DocumentCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mr-2" />
              <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">Resume Feedback</h2>
            </div>
            <div className="flex items-center gap-2 ml-7 sm:ml-0">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Score:</span>
              <span className={`text-lg font-bold ${
                score >= 80 ? 'text-green-500' : 
                score >= 60 ? 'text-yellow-500' : 
                'text-red-500'
              }`}>
                {score}/100
              </span>
            </div>
          </div>
            {/* Tab navigation */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6">
            <button 
              onClick={() => setActiveTab('overall')}
              className={tabClasses('overall')}
            >
              Overall Impression
            </button>
            <button 
              onClick={() => setActiveTab('sections')}
              className={tabClasses('sections')}
            >
              Section Feedback
            </button>
            <button 
              onClick={() => setActiveTab('suggestions')}
              className={tabClasses('suggestions')}
            >
              Suggestions
            </button>
          </div>
          
          {/* Tab content */}
          <div className="mt-4">
            {activeTab === 'overall' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-slate-700 dark:text-slate-200 leading-relaxed"
              >
                <p className="text-lg whitespace-pre-line">{overallImpression}</p>
              </motion.div>
            )}
            
            {activeTab === 'sections' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {Object.entries(sectionFeedback).map(([section, feedback], index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">{section}</h3>
                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{feedback}</p>
                  </div>
                ))}
              </motion.div>
            )}
            
            {activeTab === 'suggestions' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ul className="space-y-3">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
          
          <div className="mt-8">
            <ExportButton feedback={feedback} />
          </div>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              AI-powered feedback generated by GPT
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedbackCard;
