import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'framer-motion';
import { Lock, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useGlobalState();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [notif, setNotif] = useState(true);

  return (
    <div className="max-w-xl mx-auto px-8 py-10">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">Settings</h2>

      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
        <div className="w-14 h-14 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold text-xl">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block ml-0.5">Name</label>
          <input
            type="text" value={name} onChange={e => setName(e.target.value)}
            className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block ml-0.5">Email</label>
          <div className="w-full h-11 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>{user?.email}</span>
            <Lock size={14} className="text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Notifications</h3>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 dark:text-gray-300">Daily focus reminders</span>
            <button onClick={() => setNotif(!notif)}
              className={`w-10 h-5 rounded-full relative transition-colors ${notif ? 'bg-gray-900 dark:bg-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow transition-all ${notif ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-800">
          <button onClick={() => { logout(); navigate('/login'); }}
            className="text-red-600 dark:text-red-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-2">
            <LogOut size={16} /> Sign Out
          </button>
          <motion.button whileTap={{ scale: 0.97 }}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
            Save
          </motion.button>
        </div>
      </div>
    </div>
  );
}
