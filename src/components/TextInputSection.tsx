import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface TextInputSectionProps {
  onTextInput: (text: string) => void;
}

const TextInputSection = ({ onTextInput }: TextInputSectionProps) => {
  const [resumeText, setResumeText] = useState('');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(e.target.value);
    onTextInput(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full mt-6"
    >
      <div className="border rounded-lg p-4">
        <div className="flex items-center mb-4">
          <DocumentTextIcon className="w-6 h-6 text-slate-500 mr-2" />
          <h3 className="text-lg font-medium">Or paste your resume text</h3>
        </div>
        <textarea
          className="w-full h-64 p-4 border rounded-md bg-slate-50 dark:bg-slate-800 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Paste your resume content here..."
          value={resumeText}
          onChange={handleTextChange}
        />
      </div>
    </motion.div>
  );
};

export default TextInputSection;
