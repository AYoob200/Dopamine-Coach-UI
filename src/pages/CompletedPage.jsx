import { useGlobalState } from '../context/GlobalStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Undo2, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

function ConfettiParticle({ delay }) {
  const colors = ['#111827', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const x = Math.random() * 100;
  const rotation = Math.random() * 720 - 360;
  const size = Math.random() * 6 + 4;

  return (
    <motion.div
      initial={{ y: -20, x: `${x}vw`, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: '100vh',
        rotate: rotation,
        opacity: [1, 1, 1, 0],
        scale: [1, 1.2, 0.8, 0],
      }}
      transition={{ duration: 2.5 + Math.random() * 1.5, delay, ease: 'easeOut' }}
      className="fixed top-0 z-[200] pointer-events-none"
      style={{ left: `${x}%` }}
    >
      <div
        style={{ width: size, height: size * 1.5, backgroundColor: color, borderRadius: 2 }}
      />
    </motion.div>
  );
}

function DopaminePop({ show, onComplete }) {
  if (!show) return null;

  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <ConfettiParticle key={i} delay={i * 0.03} />
      ))}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
        className="fixed inset-0 z-[199] flex items-center justify-center pointer-events-none"
      >
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Trophy size={64} className="text-amber-500" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold text-gray-900 dark:text-white mt-4"
          >
            Task Crushed!
          </motion.p>
        </div>
      </motion.div>
    </>
  );
}

export default function CompletedPage() {
  const { completedTasks, restoreTask, taskState } = useGlobalState();
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    if (taskState === 'completed') {
      setShowPop(true);
    }
  }, [taskState]);

  const grouped = completedTasks.reduce((acc, task) => {
    const date = new Date(task.completedAt || task.createdAt);
    const today = new Date();
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

    let label;
    if (date.toDateString() === today.toDateString()) label = 'Today';
    else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday';
    else label = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    if (!acc[label]) acc[label] = [];
    acc[label].push(task);
    return acc;
  }, {});

  return (
    <div className="flex-1 px-8 py-8 max-w-3xl mx-auto w-full bg-white dark:bg-gray-950">
      <DopaminePop show={showPop} onComplete={() => setShowPop(false)} />

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Completed</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{completedTasks.length} tasks done</p>
      </div>

      {completedTasks.length === 0 ? (
        <div className="text-center py-20">
          <Trophy size={40} className="text-gray-200 dark:text-gray-800 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No completed tasks yet</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Complete a focus session to celebrate here</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, tasks]) => (
            <section key={date}>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{date}</h3>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>

              <div className="space-y-1.5">
                <AnimatePresence>
                  {tasks.map((task, i) => (
                    <motion.div
                      key={task.id} layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: i * 0.04 }}
                      className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: i * 0.04 + 0.1 }}
                      >
                        <CheckCircle2 size={20} className="text-gray-900 dark:text-white" fill="currentColor" strokeWidth={0} />
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-400 dark:text-gray-500 line-through">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">
                          {task.completedAt && new Date(task.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => restoreTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center gap-1.5"
                      >
                        <Undo2 size={12} /> Undo
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
