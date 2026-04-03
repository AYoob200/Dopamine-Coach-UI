import { useGlobalState } from '../../context/GlobalStateContext';
import { Bell, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar() {
  const { user, theme, toggleTheme } = useGlobalState();

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center px-8 py-3 h-14">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: theme === 'light' ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {theme === 'light' ? <Sun size={18} /> : <Moon size={18} />}
          </motion.div>
        </motion.button>

        <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell size={18} />
        </button>

        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-none">{user.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
