import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Components
import Header from './components/Header'
import UploadSection from './components/UploadSection'
import TextInputSection from './components/TextInputSection'
import LoadingIndicator from './components/LoadingIndicator'
import FeedbackCard from './components/FeedbackCard'
import ThemeToggle from './components/ThemeToggle'
import JobMatchAnalysis from './components/JobMatchAnalysis'
import JobMatchResult from './components/JobMatchResult'
import ResumeTemplates from './components/ResumeTemplates'
import ATSSimulator from './components/ATSSimulator'
import ResumeAnalytics from './components/ResumeAnalytics'
import CollaborationShare from './components/CollaborationShare'

// Utils
import { getAIFeedback } from './utils/openaiUtils'
import type { ResumeFeedback } from './utils/openaiUtils'
import type { MatchAnalysisResult } from './components/JobMatchAnalysis'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null)
  const [jobMatchData, setJobMatchData] = useState<MatchAnalysisResult | null>(null)
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '')
  const [showApiInput, setShowApiInput] = useState(false)
  const [activeTab, setActiveTab] = useState<'feedback' | 'jobMatch' | 'analytics' | 'ats'>('feedback')

  const handleResumeTextExtracted = (text: string) => {
    setResumeText(text)
  }

  const handleTextInput = (text: string) => {
    setResumeText(text)
  }

  const handleGenerateFeedback = async () => {
    if (!resumeText.trim()) {
      alert('Please upload a resume or enter resume text first.')
      return
    }

    setIsLoading(true)
    try {
      // Save API key to local storage if provided
      if (apiKey) {
        localStorage.setItem('openai_api_key', apiKey)
      }

      const result = await getAIFeedback(resumeText, apiKey)
      setFeedback(result)
      setActiveTab('feedback')
    } catch (error) {
      console.error('Error generating feedback:', error)
      alert('Error generating feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobMatchAnalysisComplete = (matchData: MatchAnalysisResult) => {
    setJobMatchData(matchData)
    setActiveTab('jobMatch')
  }

  const handleReset = () => {
    setResumeText('')
    setFeedback(null)
    setJobMatchData(null)
    setActiveTab('feedback')
  }

  const handleApiKeySave = () => {
    localStorage.setItem('openai_api_key', apiKey)
    setShowApiInput(false)
  }

  return (
    <>
      <ThemeToggle />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Header />

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 mb-6 overflow-x-auto py-2">
            <button
              className={`px-3 md:px-4 py-2 rounded-md font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'feedback' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              onClick={() => setActiveTab('feedback')}
            >Resume Feedback</button>
            <button
              className={`px-3 md:px-4 py-2 rounded-md font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'jobMatch' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              onClick={() => setActiveTab('jobMatch')}
              disabled={!resumeText.trim()}
            >Job Match</button>
            <button
              className={`px-3 md:px-4 py-2 rounded-md font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              onClick={() => setActiveTab('analytics')}
              disabled={!resumeText.trim()}
            >Resume Analytics</button>
            <button
              className={`px-3 md:px-4 py-2 rounded-md font-medium text-sm md:text-base whitespace-nowrap transition-colors ${activeTab === 'ats' ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600'}`}
              onClick={() => setActiveTab('ats')}
              disabled={!resumeText.trim()}
            >ATS Simulator</button>
          </div>

          {/* Main Content */}
          {activeTab === 'feedback' && !feedback && !jobMatchData && (
            <>
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <UploadSection 
                  onTextExtracted={handleResumeTextExtracted} 
                  setIsLoading={setIsLoading} 
                />
                
                <div className="my-4 sm:my-6 flex items-center">
                  <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                  <p className="px-3 text-sm text-slate-500 dark:text-slate-400">OR</p>
                  <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                </div>
                
                <TextInputSection onTextInput={handleTextInput} />
                
                <motion.div 
                  className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center mb-3 sm:mb-0">
                    <button 
                      onClick={() => setShowApiInput(!showApiInput)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {showApiInput ? 'Hide API Key Input' : 'Configure OpenAI API Key'}
                    </button>
                  </div>
                  
                  <div className="flex w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleGenerateFeedback}
                      disabled={!resumeText.trim() || isLoading}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium 
                                disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                    >
                      Generate Feedback
                    </motion.button>
                  </div>
                </motion.div>
                
                <AnimatePresence>
                  {showApiInput && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-md">
                        <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Enter your OpenAI API key"
                            className="flex-1 px-3 py-2 border rounded-md bg-white dark:bg-slate-800 
                                     border-slate-300 dark:border-slate-600 focus:outline-none 
                                     focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          <button
                            onClick={handleApiKeySave}
                            className="text-center sm:text-left whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Save
                          </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          Your API key is stored locally in your browser only. No key = mock feedback only.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6"
                  >
                    <LoadingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {resumeText.trim() && !isLoading && (
                <div className="mt-6">
                  <ResumeTemplates />
                </div>
              )}
            </>
          )}

          {activeTab === 'feedback' && feedback && (
            <FeedbackCard feedback={feedback} />
          )}

          {activeTab === 'jobMatch' && !jobMatchData && (
            <JobMatchAnalysis
              resumeText={resumeText}
              apiKey={apiKey}
              onMatchAnalysisComplete={handleJobMatchAnalysisComplete}
            />
          )}
          {activeTab === 'jobMatch' && jobMatchData && (
            <JobMatchResult matchData={jobMatchData} />
          )}

          {activeTab === 'analytics' && resumeText.trim() && (
            <ResumeAnalytics resumeText={resumeText} />
          )}

          {activeTab === 'ats' && resumeText.trim() && (
            <ATSSimulator resumeText={resumeText} />
          )}
        </motion.div>
      </div>
    </>
  )
}

export default App
