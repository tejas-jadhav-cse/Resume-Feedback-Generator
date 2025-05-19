import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on user preference or system preference
  useEffect(() => {
    // Check if user has a stored preference
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
    localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
  };

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-700 
                text-slate-700 dark:text-slate-200 z-10 hover:bg-slate-300 
                dark:hover:bg-slate-600 transition-colors"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
