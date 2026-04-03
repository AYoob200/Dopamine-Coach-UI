import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Clock, Play, Trash2, CalendarDays } from 'lucide-react';
import { useState } from 'react';

const priorityDot = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-blue-400' };

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function UpcomingPage() {
  const { tasks, selectTask, deleteTask, addTask } = useGlobalState();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [duration, setDuration] = useState(25);

  const today = new Date();
  const dow = (today.getDay() + 6) % 7;

  const handleFocus = (id) => { selectTask(id); navigate('/work'); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, priority, duration });
    setTitle(''); setShowAdd(false);
  };

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full bg-white dark:bg-gray-950">
      <div className="px-8 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming</h2>
          <div className="flex gap-1.5">
            {days.map((day, i) => {
              const d = new Date(today);
              d.setDate(today.getDate() - dow + i);
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{day}</span>
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors ${
                    i === dow ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}>
                    {d.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Today</h3>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">{tasks.length} tasks</span>
        </div>

        <div className="space-y-1.5">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id} layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all"
              >
                <div className={`w-[18px] h-[18px] rounded-full border-2 flex-shrink-0 ${
                  task.priority === 'high' ? 'border-red-400' : 'border-gray-200 dark:border-gray-700'
                }`} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Clock size={10} /> {task.duration}min
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${priorityDot[task.priority] || priorityDot.medium}`} />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFocus(task.id)}
                    className="p-1.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                    title="Start Focus"
                  >
                    <Play size={14} fill="currentColor" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all"
                  >
                    <Trash2 size={13} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <div className="text-center py-16">
              <CalendarDays size={40} className="text-gray-200 dark:text-gray-800 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">No tasks yet</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Ask your Coach to break down a goal</p>
              <button onClick={() => navigate('/')} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                Talk to Coach
              </button>
            </div>
          )}

          <AnimatePresence>
            {showAdd ? (
              <motion.form
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAdd}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-2.5"
              >
                <input autoFocus value={title} onChange={e => setTitle(e.target.value)} placeholder="Task name..."
                  className="w-full bg-transparent border-none text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-0 p-0"
                />
                <div className="flex items-center gap-2">
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600">
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} min={5} max={120}
                    className="w-16 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-gray-600 dark:text-gray-300 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600"
                  />
                  <span className="text-xs text-gray-400 dark:text-gray-500">min</span>
                  <div className="flex-1" />
                  <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 px-2 py-1.5">Cancel</button>
                  <button type="submit" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Add</button>
                </div>
              </motion.form>
            ) : (
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-3 py-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                <Plus size={16} /> Add Task
              </button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
