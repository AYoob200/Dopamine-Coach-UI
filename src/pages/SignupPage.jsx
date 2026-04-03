import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalStateContext';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Sun, Moon } from 'lucide-react';

export default function SignupPage() {
  const { signup, isAuthenticated, theme, toggleTheme } = useGlobalState();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    signup(name, email, password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm px-6"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
              <Zap size={16} className="text-white dark:text-gray-900" fill="currentColor" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-gray-900 dark:text-white leading-none">Dopamine</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">Coach</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Create account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Start your focus journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-0.5">Full Name</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-0.5">Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-0.5">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-gray-300 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full h-11 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <>Create Account <ArrowRight size={16} /></>
            )}
          </motion.button>
        </form>

        <div className="flex items-center justify-center mt-8">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-gray-900 dark:text-white hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </motion.main>
    </div>
  );
}
