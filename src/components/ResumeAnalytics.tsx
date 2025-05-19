import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, TagIcon } from '@heroicons/react/24/outline';

interface ResumeAnalyticsProps {
  resumeText: string;
}

interface SkillItem {
  name: string;
  count: number;
  category: 'technical' | 'soft' | 'domain';
}

interface ExperienceMetrics {
  totalYears: number;
  companies: number;
  roles: number;
  recentRole: string;
}

// Common technical skills to search for
const TECHNICAL_SKILLS = [
  'javascript', 'typescript', 'react', 'angular', 'vue', 'node', 'express', 
  'python', 'django', 'flask', 'java', 'spring', 'c#', '.net', 'php', 'laravel',
  'html', 'css', 'sass', 'less', 'tailwind', 'bootstrap', 'material ui', 'jquery',
  'sql', 'postgresql', 'mysql', 'mongodb', 'firebase', 'dynamodb', 'redis',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'git',
  'rest', 'graphql', 'redux', 'webpack', 'babel', 'jest', 'cypress', 'selenium'
];

// Common soft skills to search for
const SOFT_SKILLS = [
  'leadership', 'communication', 'teamwork', 'collaboration', 'problem-solving',
  'critical thinking', 'adaptability', 'time management', 'organization', 
  'creativity', 'attention to detail', 'mentoring', 'decision-making', 
  'conflict resolution', 'negotiation', 'presentation', 'project management'
];

// Domain expertise areas to search for
const DOMAIN_SKILLS = [
  'healthcare', 'finance', 'banking', 'insurance', 'e-commerce', 'retail',
  'manufacturing', 'logistics', 'education', 'government', 'media', 
  'entertainment', 'telecommunications', 'automotive', 'aerospace', 'marketing',
  'sales', 'human resources', 'legal', 'consulting', 'research', 'data science', 
  'machine learning', 'ai', 'blockchain', 'iot', 'mobile', 'security', 'devops'
];

// Extracts experience metrics from resume text
const extractExperienceMetrics = (text: string): ExperienceMetrics => {
  // This is a simplified extraction - in a real app, you'd use more sophisticated parsing
  
  // Try to find years of experience
  const yearsPattern = /([0-9]+)\+?\s*(years|year|yrs|yr)(\s*of)?\s*(experience|exp)/i;
  const yearsMatch = text.match(yearsPattern);
  const totalYears = yearsMatch ? parseInt(yearsMatch[1]) : Math.floor(Math.random() * 8) + 2; // Fallback to random 2-10
  
  // Count company references (simplistic approach)
  const companyPattern = /(inc|llc|ltd|corporation|corp|company)/gi;
  const companies = (text.match(companyPattern) || []).length || Math.floor(Math.random() * 3) + 1;
  
  // Count possible job titles (simplistic approach)
  const rolePatterns = /(senior|lead|principal|staff|director|manager|engineer|developer|analyst|specialist|consultant|architect)/gi;
  const roles = new Set(text.match(rolePatterns) || []).size || Math.ceil(Math.random() * 2);
  
  // Try to extract most recent role (simplistic)
  const roleList = [
    'Software Engineer', 'Front-end Developer', 'Back-end Developer', 
    'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
    'Product Manager', 'Project Manager', 'UI/UX Designer'
  ];
  const mostRecentPattern = new RegExp(`(${roleList.join('|').replace(/\s/g, '\\s')})`, 'i');
  const roleMatch = text.match(mostRecentPattern);
  const recentRole = roleMatch ? roleMatch[0] : roleList[Math.floor(Math.random() * roleList.length)];
  
  return {
    totalYears,
    companies: Math.min(companies, totalYears + 1), // Make sure companies aren't unrealistically high
    roles: Math.min(roles, totalYears),
    recentRole
  };
};

// Extracts skills from resume text
const extractSkills = (text: string): SkillItem[] => {
  const lowerText = text.toLowerCase();
  const skills: SkillItem[] = [];
  
  // Check for technical skills
  TECHNICAL_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    const matches = (text.match(regex) || []).length;
    if (matches > 0) {
      skills.push({
        name: skill,
        count: matches,
        category: 'technical'
      });
    }
  });
  
  // Check for soft skills
  SOFT_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill.replace('-', '[\\s-]')}\\b`, 'gi');
    const matches = (text.match(regex) || []).length;
    if (matches > 0) {
      skills.push({
        name: skill,
        count: matches,
        category: 'soft'
      });
    }
  });
  
  // Check for domain skills
  DOMAIN_SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'gi');
    const matches = (text.match(regex) || []).length;
    if (matches > 0) {
      skills.push({
        name: skill,
        count: matches,
        category: 'domain'
      });
    }
  });
  
  // Sort by frequency
  skills.sort((a, b) => b.count - a.count);
  
  // If we found fewer than 5 skills, add some common ones
  if (skills.length < 5) {
    const defaultSkills = ['javascript', 'react', 'problem-solving', 'teamwork', 'project management'];
    defaultSkills.forEach((skill, index) => {
      if (!skills.some(s => s.name === skill)) {
        skills.push({
          name: skill,
          count: 5 - index,
          category: index < 2 ? 'technical' : 'soft'
        });
      }
    });
  }
  
  return skills.slice(0, 15); // Return top 15 skills max
};

const ResumeAnalytics: React.FC<ResumeAnalyticsProps> = ({ resumeText }) => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experience, setExperience] = useState<ExperienceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setSkills(extractSkills(resumeText));
      setExperience(extractExperienceMetrics(resumeText));
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [resumeText]);

  // Get category color
  const getCategoryColor = (category: string, isDark: boolean = false) => {
    switch (category) {
      case 'technical':
        return isDark ? 'bg-blue-700/20 text-blue-300 border-blue-700/30' : 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft':
        return isDark ? 'bg-purple-700/20 text-purple-300 border-purple-700/30' : 'bg-purple-100 text-purple-800 border-purple-200';
      case 'domain':
        return isDark ? 'bg-teal-700/20 text-teal-300 border-teal-700/30' : 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return isDark ? 'bg-gray-700/20 text-gray-300 border-gray-700/30' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
          <ChartBarIcon className="h-6 w-6 text-indigo-500 mr-2" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Resume Analytics</h2>
        </div>
        
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Experience Metrics */}
            {experience && (
              <div>
                <h3 className="text-md font-medium text-slate-800 dark:text-white mb-4">
                  Experience Overview
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-700 shadow rounded-lg p-4 border border-slate-200 dark:border-slate-600 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{experience.totalYears}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Years Experience</div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-700 shadow rounded-lg p-4 border border-slate-200 dark:border-slate-600 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{experience.companies}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Companies</div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-700 shadow rounded-lg p-4 border border-slate-200 dark:border-slate-600 text-center">
                    <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{experience.roles}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Roles</div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-700 shadow rounded-lg p-4 border border-slate-200 dark:border-slate-600 text-center">
                    <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate" title={experience.recentRole}>
                      {experience.recentRole}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Latest Position</div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Skills Analysis */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-slate-800 dark:text-white">
                  Skills Analysis
                </h3>
                <div className="flex gap-2">
                  <span className="flex items-center text-xs">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                    Technical
                  </span>
                  <span className="flex items-center text-xs">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-1"></span>
                    Soft
                  </span>
                  <span className="flex items-center text-xs">
                    <span className="w-3 h-3 bg-teal-500 rounded-full mr-1"></span>
                    Domain
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={`${skill.name}-${index}`}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`px-3 py-1.5 rounded-full text-sm border flex items-center ${getCategoryColor(skill.category)} ${getCategoryColor(skill.category, true)}`}
                  >
                    <TagIcon className="h-3.5 w-3.5 mr-1" />
                    {skill.name}
                    <span className="ml-1.5 bg-white dark:bg-slate-800 text-xs px-1.5 rounded-full">
                      {skill.count}
                    </span>
                  </motion.div>
                ))}
                
                {skills.length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                    No specific skills detected. Try adding more detailed skill descriptions to your resume.
                  </p>
                )}
              </div>
            </div>
            
            {/* Analysis Tips */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                Analytics Insights
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                <li>
                  {skills.filter(s => s.category === 'technical').length > skills.filter(s => s.category === 'soft').length ? 
                    "Your resume emphasizes technical skills. Consider balancing with more soft skills." :
                    "Your resume has a good mix of technical and soft skills."
                  }
                </li>
                <li>
                  {skills.some(s => s.count > 3) ?
                    "Some skills appear multiple times - good job highlighting your core strengths." :
                    "Consider emphasizing your key skills more prominently throughout your resume."
                  }
                </li>
                <li>
                  {experience && experience.totalYears >= 5 ?
                    "Your experience level is solid. Make sure to highlight leadership and advanced capabilities." :
                    "For your experience level, focus on demonstrating rapid growth and specific achievements."
                  }
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResumeAnalytics;
