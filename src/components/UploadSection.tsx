import { useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { extractTextFromPdf } from '../utils/pdfUtils';

interface UploadSectionProps {
  onTextExtracted: (text: string) => void;
  setIsLoading: (loading: boolean) => void;
}

const UploadSection = ({ onTextExtracted, setIsLoading }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }

    setIsLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      onTextExtracted(text);
    } catch (error) {
      console.error('Error processing PDF:', error);
      alert('Error processing PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full"
    >
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-slate-300 hover:border-blue-400 dark:border-slate-600'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <DocumentArrowUpIcon className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
        <h3 className="text-lg font-medium mb-2">Upload Resume (PDF)</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Drag and drop your file here, or click to browse
        </p>
        <input 
          type="file" 
          id="file-input" 
          className="hidden" 
          accept="application/pdf" 
          onChange={handleFileChange}
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Browse Files
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UploadSection;
