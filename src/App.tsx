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

// Utils
import { getAIFeedback } from './utils/openaiUtils'
import type { ResumeFeedback } from './utils/openaiUtils'

function App() {
  const [resumeText, setResumeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<ResumeFeedback | null>(null)
  const [apiKey, setApiKey] = useState(localStorage.getItem('openai_api_key') || '')
  const [showApiInput, setShowApiInput] = useState(false)

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
    } catch (error) {
      console.error('Error generating feedback:', error)
      alert('Error generating feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResumeText('')
    setFeedback(null)
  }

  const handleApiKeySave = () => {
    localStorage.setItem('openai_api_key', apiKey)
    setShowApiInput(false)
  }

  return (
    <>
      <ThemeToggle />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors py-8 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          <Header />

          {!feedback ? (
            <>
              <motion.div 
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <UploadSection 
                  onTextExtracted={handleResumeTextExtracted} 
                  setIsLoading={setIsLoading} 
                />
                
                <div className="my-6 flex items-center">
                  <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                  <p className="px-3 text-sm text-slate-500 dark:text-slate-400">OR</p>
                  <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700"></div>
                </div>
                
                <TextInputSection onTextInput={handleTextInput} />
                
                <motion.div 
                  className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center">
                    <button 
                      onClick={() => setShowApiInput(!showApiInput)}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {showApiInput ? 'Hide API Key Input' : 'Configure OpenAI API Key'}
                    </button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleGenerateFeedback}
                    disabled={!resumeText.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium 
                              disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Feedback
                  </motion.button>
                </motion.div>
                
                <AnimatePresence>
                  {showApiInput && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 overflow-hidden"
                    >
                      <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-md">
                        <label className="block text-sm font-medium mb-2">OpenAI API Key</label>
                        <div className="flex gap-2">
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
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
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
                  >
                    <LoadingIndicator />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 flex justify-end"
              >
                <button
                  onClick={handleReset}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 2v6h6M21.5 22v-6h-6" />
                    <path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" />
                  </svg>
                  Start Over
                </button>
              </motion.div>
              
              <FeedbackCard feedback={feedback} />
            </>
          )}
          
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400"
          >
            <p>
              Resume Feedback Generator © {new Date().getFullYear()} | 
              Built with React + Tailwind
            </p>
          </motion.footer>
        </motion.div>
      </div>
    </>
  )
}

export default App
