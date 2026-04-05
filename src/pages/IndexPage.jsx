import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Loader2,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { durationTagFromMinutes } from '../utils/momentum';

const priorityBadge = {
  high: 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400',
  medium: 'bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
  low: 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
};

export default function IndexPage() {
  const { breakdownGoal, aiSubtasks, aiLoading, addTask, addMultipleTasks, user, language } = useGlobalState();
  const navigate = useNavigate();
  const isArabic = language === 'ar';
  const [goal, setGoal] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());

  const handleStartSession = async () => {
    if (!goal.trim() || aiLoading) return;

    const userGoal = goal.trim();
    setShowResults(true);
    await breakdownGoal(userGoal);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStartSession();
    }
  };

  const handleAddSingle = (subtask) => {
    addTask(subtask);
    setAddedIds(prev => new Set(prev).add(subtask.id));
  };

  const handleAddAll = () => {
    const remaining = aiSubtasks.filter(s => !addedIds.has(s.id));
    if (remaining.length === 0) return;
    addMultipleTasks(remaining);
    setAddedIds(new Set(aiSubtasks.map(s => s.id)));
    setTimeout(() => navigate('/upcoming'), 1200);
  };

  const allAdded = aiSubtasks.length > 0 && aiSubtasks.every(s => addedIds.has(s.id));

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 min-h-full">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {isArabic ? `على ماذا سنركز، ${user?.name?.split(' ')[0] || 'صديقي'}؟` : `What are we focusing on, ${user?.name?.split(' ')[0] || 'there'}?`}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                {isArabic ? 'اكتب هدفك الكبير وسأقسمه إلى خطوات بسيطة' : 'Tell me your big goal and I\'ll break it into manageable steps'}
              </p>

              <div className="relative">
                <textarea
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isArabic ? 'أريد أن...' : 'I want to...'}
                  rows={2}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl py-4 px-5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all text-base"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleStartSession}
                disabled={!goal.trim() || aiLoading}
                className="mt-5 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {aiLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {isArabic ? 'جاري تقسيم هدفك...' : 'Breaking down your goal...'}
                  </>
                ) : (
                  <>
                    {isArabic ? 'ابدأ جلستي' : 'Start My Session'}
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {isArabic ? `قسّمت الهدف إلى ${aiSubtasks.length} خطوات` : `I've broken this into ${aiSubtasks.length} steps`}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isArabic ? 'اختر ما يناسبك أو أضفها كلها دفعة واحدة' : 'Pick the ones that feel right, or add them all at once'}
                </p>
              </div>

              <div className="space-y-2">
                {aiSubtasks.map((sub, idx) => {
                  const isAdded = addedIds.has(sub.id);
                  const durationTag = durationTagFromMinutes(sub.duration, language);
                  return (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isAdded
                          ? 'bg-green-50 dark:bg-green-950 border-green-100 dark:border-green-900'
                          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isAdded ? 'border-green-500 bg-green-500' : 'border-gray-200 dark:border-gray-700'
                      }`}>
                        {isAdded && <CheckCircle2 size={12} className="text-white" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${isAdded ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'}`}>
                          {sub.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${durationTag.tone}`}>
                            {durationTag.label}
                          </span>
                          <span className={`text-[10px] font-medium uppercase px-1.5 py-0.5 rounded ${priorityBadge[sub.priority]}`}>
                            {isArabic ? (sub.priority === 'high' ? 'عالية' : sub.priority === 'medium' ? 'متوسطة' : 'منخفضة') : sub.priority}
                          </span>
                        </div>
                      </div>

                      {!isAdded && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddSingle(sub)}
                          className="p-1.5 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <Plus size={16} />
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-5 flex gap-2">
                {!allAdded && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddAll}
                    className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    {isArabic ? 'إضافة الكل' : 'Add All'}
                  </motion.button>
                )}

                {allAdded && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/upcoming')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {isArabic ? 'عرض في القادم' : 'View in Upcoming'}
                    <ArrowRight size={16} />
                  </motion.button>
                )}

                <button
                  onClick={() => { setShowResults(false); setGoal(''); setAddedIds(new Set()); }}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isArabic ? 'هدف جديد' : 'New Goal'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
