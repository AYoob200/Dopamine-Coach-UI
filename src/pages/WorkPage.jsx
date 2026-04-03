import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'framer-motion';
import { Pause, Play, Coffee, X } from 'lucide-react';

export default function WorkPage() {
  const { currentTask, workDuration, startBreak, pauseTask, completeTask } = useGlobalState();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const total = workDuration;
  const progress = ((total - timeLeft) / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (progress / 100) * circumference;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      completeTask();
      navigate('/completed');
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft, completeTask, navigate]);

  const handleSkipBreak = () => { clearInterval(intervalRef.current); startBreak(); navigate('/break'); };
  const handleQuit = () => { clearInterval(intervalRef.current); pauseTask(); navigate('/upcoming'); };

  if (!currentTask) { navigate('/upcoming'); return null; }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12 bg-white dark:bg-gray-950">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Focus Session</p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{currentTask.title}</h2>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="3" className="stroke-gray-100 dark:stroke-gray-800" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none" strokeWidth="4" strokeLinecap="round"
            className="stroke-gray-900 dark:stroke-white"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
            {isPaused ? 'Paused' : 'Remaining'}
          </span>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 mt-10">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl px-6 py-3 font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
          {isPaused ? <Play size={18} fill="currentColor" /> : <Pause size={18} />}
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={handleSkipBreak}
          className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-6 py-3 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Coffee size={18} /> Break
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={handleQuit}
          className="flex items-center gap-2 text-gray-400 dark:text-gray-500 rounded-xl px-4 py-3 text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <X size={16} /> Quit
        </motion.button>
      </motion.div>
    </div>
  );
}
