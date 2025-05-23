import { motion } from 'framer-motion';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import html2pdf from 'html2pdf.js';
import { useState } from 'react';

interface ExportButtonProps {
  feedback: {
    overallImpression: string;
    sectionFeedback: { [key: string]: string };
    suggestions: string[];
    score: number;
  };
}

const ExportButton = ({ feedback }: ExportButtonProps) => {  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Create a hidden div with formatted content for PDF
      const content = document.createElement('div');
      content.style.padding = '20px';
      content.style.fontFamily = 'Inter, sans-serif';
      
      // Add title
      const title = document.createElement('h1');
      title.textContent = 'Resume Feedback Report';
      title.style.fontSize = '24px';
      title.style.marginBottom = '20px';
      title.style.color = '#1e40af';
      content.appendChild(title);
      
      // Add score
      const scoreDiv = document.createElement('div');
      scoreDiv.style.marginBottom = '20px';
      scoreDiv.style.padding = '10px';
      scoreDiv.style.backgroundColor = '#f1f5f9';
      scoreDiv.style.borderRadius = '5px';
      scoreDiv.innerHTML = `
        <strong>Overall Score:</strong> 
        <span style="
          font-size: 18px; 
          font-weight: bold; 
          color: ${
            feedback.score >= 80 ? '#22c55e' : 
            feedback.score >= 60 ? '#eab308' : 
            '#ef4444'
          };"
        >${feedback.score}/100</span>
      `;
      content.appendChild(scoreDiv);
      
      // Overall impression
      const overallSection = document.createElement('div');
      overallSection.style.marginBottom = '30px';
      
      const overallTitle = document.createElement('h2');
      overallTitle.textContent = 'Overall Impression';
      overallTitle.style.fontSize = '20px';
      overallTitle.style.marginBottom = '10px';
      overallTitle.style.borderBottom = '1px solid #e2e8f0';
      overallTitle.style.paddingBottom = '5px';
      overallSection.appendChild(overallTitle);
      
      const overallContent = document.createElement('p');
      overallContent.textContent = feedback.overallImpression;
      overallContent.style.lineHeight = '1.6';
      overallSection.appendChild(overallContent);
      
      content.appendChild(overallSection);
      
      // Section feedback
      const sectionTitle = document.createElement('h2');
      sectionTitle.textContent = 'Section Feedback';
      sectionTitle.style.fontSize = '20px';
      sectionTitle.style.marginBottom = '15px';
      sectionTitle.style.borderBottom = '1px solid #e2e8f0';
      sectionTitle.style.paddingBottom = '5px';
      content.appendChild(sectionTitle);
      
      const sectionsDiv = document.createElement('div');
      Object.entries(feedback.sectionFeedback).forEach(([section, text]) => {
        const sectionDiv = document.createElement('div');
        sectionDiv.style.marginBottom = '20px';
        
        const sectionHeader = document.createElement('h3');
        sectionHeader.textContent = section;
        sectionHeader.style.fontSize = '16px';
        sectionHeader.style.fontWeight = 'bold';
        sectionHeader.style.marginBottom = '5px';
        sectionDiv.appendChild(sectionHeader);
        
        const sectionContent = document.createElement('p');
        sectionContent.textContent = text;
        sectionContent.style.lineHeight = '1.5';
        sectionDiv.appendChild(sectionContent);
        
        sectionsDiv.appendChild(sectionDiv);
      });
      content.appendChild(sectionsDiv);
      
      // Suggestions
      const suggestionsTitle = document.createElement('h2');
      suggestionsTitle.textContent = 'Suggestions for Improvement';
      suggestionsTitle.style.fontSize = '20px';
      suggestionsTitle.style.marginBottom = '15px';
      suggestionsTitle.style.borderBottom = '1px solid #e2e8f0';
      suggestionsTitle.style.paddingBottom = '5px';
      content.appendChild(suggestionsTitle);
      
      const suggestionsList = document.createElement('ul');
      suggestionsList.style.paddingLeft = '20px';
      feedback.suggestions.forEach(suggestion => {
        const item = document.createElement('li');
        item.textContent = suggestion;
        item.style.marginBottom = '10px';
        item.style.lineHeight = '1.5';
        suggestionsList.appendChild(item);
      });
      content.appendChild(suggestionsList);
      
      // Footer
      const footer = document.createElement('div');
      footer.style.marginTop = '30px';
      footer.style.fontSize = '12px';
      footer.style.color = '#64748b';
      footer.style.textAlign = 'center';
      footer.style.borderTop = '1px solid #e2e8f0';
      footer.style.paddingTop = '10px';
      footer.textContent = 'Generated by Resume Feedback Generator';
      content.appendChild(footer);      // Generate PDF from the content
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'resume-feedback.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().from(content).set(opt).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {isExporting ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </>
      ) : (
        <>
          <DocumentArrowDownIcon className="h-5 w-5" />
          Export as PDF
        </>
      )}
    </motion.button>
  );
};

export default ExportButton;
