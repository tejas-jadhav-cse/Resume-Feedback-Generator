import { motion } from 'framer-motion';

const Header = () => {
  return (    <motion.header 
      className="text-center mb-6 md:mb-8 px-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        Resume Feedback Generator
      </motion.h1>
      <motion.p 
        className="text-slate-600 dark:text-slate-300 text-base md:text-lg max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Get instant, AI-powered feedback on your resume
      </motion.p>
    </motion.header>
  );
};

export default Header;
