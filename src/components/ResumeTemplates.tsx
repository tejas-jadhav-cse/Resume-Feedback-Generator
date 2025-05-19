import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentTextIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

interface ResumeTemplateProps {
  title: string;
  description: string;
  sampleContent: string;
}

const RESUME_TEMPLATES: ResumeTemplateProps[] = [
  {
    title: 'Modern Professional',
    description: 'Clean, contemporary layout with clear section hierarchy. Ideal for most industries.',
    sampleContent: `# John Doe
**Senior Software Engineer**
[john.doe@email.com](mailto:john.doe@email.com) | (123) 456-7890 | [LinkedIn](https://linkedin.com/in/johndoe) | [GitHub](https://github.com/johndoe)

## Professional Summary
Experienced software engineer with 7+ years building scalable web applications and cloud services. Expertise in React, Node.js, and AWS. Passionate about creating elegant solutions to complex problems, with a focus on performance optimization and clean code.

## Work Experience
### Senior Software Engineer | Tech Solutions Inc.
*May 2019 - Present*
- Led development of a React-based dashboard that reduced customer service calls by 37%
- Architected microservices infrastructure supporting 100K daily users
- Mentored 5 junior developers through technical training program
- Improved API performance by 65% through database optimization

### Software Developer | DataCraft Systems
*June 2016 - April 2019*
- Developed RESTful APIs for customer-facing applications
- Created automated testing suite that reduced QA time by 35%
- Contributed to open-source projects used by the company
`
  },
  {
    title: 'Skills-Forward',
    description: 'Emphasizes technical skills and competencies first. Great for technical roles.',
    sampleContent: `# ALEX CHEN
Seattle, WA | alexchen@email.com | (206) 555-0123 | github.com/alexchen

## CORE COMPETENCIES
- **Frontend Development:** React, TypeScript, Redux, HTML5/CSS3, Tailwind CSS, SASS
- **Backend Technology:** Node.js, Express, Python, Django, REST APIs, GraphQL
- **Database/Storage:** PostgreSQL, MongoDB, Firebase, AWS S3
- **DevOps/Tools:** Docker, CI/CD (GitHub Actions), Git, Jira, Agile methodologies
- **Testing:** Jest, React Testing Library, Cypress, Mocha

## PROFESSIONAL EXPERIENCE

### SENIOR FRONTEND DEVELOPER
**Innovate Tech Solutions | Seattle, WA | Jan 2020 - Present**
- Architected responsive frontend applications using React and TypeScript, serving 50K+ daily active users
- Reduced bundle size by 40% through code splitting and lazy loading techniques
- Implemented comprehensive test suite achieving 92% code coverage
- Mentored junior developers through pair programming and code reviews

### FULL STACK DEVELOPER
**Web Craft Studios | Portland, OR | Mar 2017 - Dec 2019**
- Built RESTful APIs using Node.js and Express that processed 1.2M daily requests
- Designed and implemented database schemas in PostgreSQL and MongoDB
- Created CI/CD pipeline that reduced deployment time from hours to minutes
`
  },
  {
    title: 'Accomplishment-Based',
    description: 'Structured around key achievements rather than job duties. Perfect for experienced professionals.',
    sampleContent: `# SARAH JOHNSON
Leadership & Operations Executive
sarah.johnson@email.com | (415) 555-7890 | linkedin.com/in/sarahjohnson

## PROFESSIONAL SUMMARY
Strategic operations executive with 12+ years experience transforming business performance through process optimization and team leadership. Consistently delivers multimillion-dollar revenue growth and cost reductions across diverse industries.

## KEY ACCOMPLISHMENTS

### BUSINESS TRANSFORMATION
- **Revenue Growth:** Increased annual revenue by $4.7M (23%) by launching new service lines and optimizing existing offerings
- **Market Expansion:** Successfully led expansion into 3 new regional markets, capturing 15% market share within 18 months
- **Digital Transformation:** Spearheaded implementation of enterprise CRM system that improved lead conversion by 35%

### OPERATIONAL EXCELLENCE
- **Cost Reduction:** Identified and eliminated process inefficiencies, reducing operational costs by $2.1M annually
- **Productivity Enhancement:** Redesigned workflow processes resulting in 27% improvement in team productivity
- **Quality Improvement:** Reduced customer complaints by 42% through implementation of new quality control systems

### TEAM LEADERSHIP
- **Team Development:** Built and mentored high-performing teams of 15-30 professionals across multiple departments
- **Talent Retention:** Improved employee retention by 38% through comprehensive development programs
- **Change Management:** Successfully led organization through major restructuring with minimal disruption

## PROFESSIONAL EXPERIENCE
**Chief Operations Officer | Innovate Partners Inc. | 2018-Present**
**Director of Operations | Strategic Solutions Group | 2014-2018**
**Senior Operations Manager | Global Enterprises Ltd. | 2011-2014**
`
  },
];

const ResumeTemplates = () => {
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  
  const handleCopyTemplate = (index: number) => {
    navigator.clipboard.writeText(RESUME_TEMPLATES[index].sampleContent);
    setCopySuccess(index);
    
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
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
          <DocumentTextIcon className="h-6 w-6 text-purple-500 mr-2" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Resume Templates</h2>
        </div>
        
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Need inspiration for your resume? Check out these professional templates to get started or improve your existing resume.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {RESUME_TEMPLATES.map((template, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                activeTemplate === index
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-500'
                  : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
              onClick={() => setActiveTemplate(activeTemplate === index ? null : index)}
            >
              <h3 className="font-medium text-slate-800 dark:text-slate-200">{template.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{template.description}</p>
              <div className="flex justify-end mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyTemplate(index);
                  }}
                  className="flex items-center text-xs font-medium text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                >
                  {copySuccess === index ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                      Copy template
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <AnimatePresence>
          {activeTemplate !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-2">
                  {RESUME_TEMPLATES[activeTemplate].title} Sample
                </h3>
                <div className="bg-white dark:bg-slate-800 p-4 rounded border border-slate-200 dark:border-slate-700 overflow-auto max-h-96">
                  <pre className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                    {RESUME_TEMPLATES[activeTemplate].sampleContent}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ResumeTemplates;
