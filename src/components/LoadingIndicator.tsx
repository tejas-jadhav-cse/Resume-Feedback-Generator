import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const LoadingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <ArrowPathIcon className="h-10 w-10 text-blue-500" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-slate-600 dark:text-slate-300 text-lg"
      >
        Processing your resume...
      </motion.p>
    </motion.div>
  );
};

export default LoadingIndicator;
