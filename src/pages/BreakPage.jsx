import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'framer-motion';
import { Play, Pause, Plus, ArrowRight } from 'lucide-react';
import { getMomentumState } from '../utils/momentum';

const quotes = [
  { text: "Rest is not idleness. It is the cultivation of what matters next.", author: "John Lubbock" },
  { text: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
  { text: "The time to relax is when you don't have time for it.", author: "Sydney Harris" },
];

export default function BreakPage() {
  const { breakDuration, startWork, resetCycle, language } = useGlobalState();
  const navigate = useNavigate();
  const isArabic = language === 'ar';

  const [timeLeft, setTimeLeft] = useState(breakDuration);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const total = breakDuration;
  const progress = ((total - timeLeft) / total) * 100;
  const circumference = 2 * Math.PI * 45;
  const dashOffset = circumference - (progress / 100) * circumference;
  const momentum = getMomentumState({ progress, isPaused, mode: 'break', language });

  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      startWork(); navigate('/work');
    }
    return () => clearInterval(intervalRef.current);
  }, [isPaused, timeLeft, startWork, navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12 bg-white dark:bg-gray-950">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-widest mb-2">{isArabic ? 'وقت الاستراحة' : 'Break Time'}</p>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{isArabic ? 'استرح واستعد طاقتك' : 'Rest & Recharge'}</h2>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="relative w-56 h-56 md:w-64 md:h-64 flex items-center justify-center"
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" strokeWidth="3" className="stroke-gray-100 dark:stroke-gray-800" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none" strokeWidth="5" strokeLinecap="round"
            className="stroke-green-600 dark:stroke-green-400"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1, ease: 'linear' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center px-4">
            {momentum.label}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">{momentum.vibe}</span>
          <span className="mt-2 text-[11px] px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 uppercase tracking-wide">
            {momentum.chip}
          </span>
          <div className="mt-4 flex items-end gap-1.5 h-8">
            {momentum.bars.map((bar, i) => (
              <div
                key={i}
                className="w-2 rounded-full bg-green-400/70 dark:bg-green-500/60"
                style={{ height: `${Math.max(bar * 100, 20)}%` }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 max-w-md text-center">
        <p className="text-sm italic text-gray-500 dark:text-gray-400 leading-relaxed">"{quote.text}"</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">— {quote.author}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-3 mt-8">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-2 bg-green-600 text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors">
          {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} />}
          {isPaused ? (isArabic ? 'استئناف' : 'Resume') : (isArabic ? 'إيقاف مؤقت' : 'Pause')}
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setTimeLeft(p => p + 300)}
          className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl px-5 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Plus size={16} /> {isArabic ? 'تمديد الاستراحة' : 'Boost Break'}
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { startWork(); navigate('/work'); }}
          className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl px-5 py-3 text-sm font-semibold transition-colors">
          {isArabic ? 'العودة للعمل' : 'Back to Work'} <ArrowRight size={16} />
        </motion.button>

        <motion.button whileTap={{ scale: 0.95 }} onClick={() => { resetCycle(); navigate('/upcoming'); }}
          className="text-gray-400 dark:text-gray-500 px-3 py-3 text-sm hover:text-red-500 dark:hover:text-red-400 transition-colors">
          {isArabic ? 'إنهاء' : 'End'}
        </motion.button>
      </motion.div>
    </div>
  );
}
