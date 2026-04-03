import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  CalendarDays,
  CheckCircle2,
  Settings,
  Plus,
  HelpCircle,
  LogOut,
  Search,
  Play,
  Clock,
  Inbox,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Zap, label: 'Coach' },
  { to: '/upcoming', icon: CalendarDays, label: 'Upcoming' },
  { to: '/completed', icon: CheckCircle2, label: 'Completed' },
  { to: '/profile', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, tasks, selectTask, logout } = useGlobalState();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const searchResults = query.trim() === ''
    ? []
    : tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartTask = (taskId) => {
    selectTask(taskId);
    setQuery('');
    setIsSearchFocused(false);
    navigate('/work');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
            <Zap size={14} className="text-white dark:text-gray-900" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight leading-none">Dopamine</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-none mt-0.5">Coach</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-4" ref={searchRef}>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search tasks..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
          />

          <AnimatePresence>
            {isSearchFocused && query.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg overflow-hidden z-50 max-h-64 overflow-y-auto"
              >
                {searchResults.length > 0 ? (
                  <div className="py-1.5">
                    {searchResults.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleStartTask(task.id)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className="text-sm text-gray-900 dark:text-gray-100 truncate">{task.title}</p>
                          <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock size={10} /> {task.duration}min
                          </p>
                        </div>
                        <div className="w-6 h-6 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={11} fill="currentColor" />
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center flex flex-col items-center justify-center">
                    <Inbox size={20} className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3 pb-4 space-y-0.5 pt-4 border-t border-gray-200 dark:border-gray-800">
        <button className="w-full flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-3 py-2.5 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors text-sm">
          <HelpCircle size={18} />
          <span>Help</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-500 px-3 py-2.5 hover:bg-white dark:hover:bg-gray-900 rounded-lg transition-colors text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>

        {user && (
          <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t border-gray-200 dark:border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
