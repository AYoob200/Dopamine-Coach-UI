import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

const GlobalStateContext = createContext(null);

// ─── Helpers ──────────────────────────────────────────
const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
};

const saveToStorage = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// ─── Mock AI Task Breakdown ───────────────────────────
const mockAIBreakdown = (goal) => {
  const templates = [
    { prefix: 'Research', duration: 15 },
    { prefix: 'Outline', duration: 10 },
    { prefix: 'Draft', duration: 25 },
    { prefix: 'Review', duration: 15 },
    { prefix: 'Refine', duration: 20 },
    { prefix: 'Finalize', duration: 10 },
  ];
  const words = goal.trim().split(' ').slice(0, 6).join(' ');
  return templates.map((t, i) => ({
    id: generateId() + i,
    title: `${t.prefix}: ${words}`,
    duration: t.duration,
    priority: i === 0 ? 'high' : i < 3 ? 'medium' : 'low',
  }));
};

// ─── Initial State ────────────────────────────────────
const createInitialState = () => ({
  // Auth
  user: loadFromStorage('dc_user', null),
  isAuthenticated: !!loadFromStorage('dc_user', null),

  // Tasks
  tasks: loadFromStorage('dc_tasks', []),
  completedTasks: loadFromStorage('dc_completed', []),

  // Productivity Cycle
  currentTask: loadFromStorage('dc_current_task', null),
  taskState: loadFromStorage('dc_task_state', 'idle'), // idle | working | break | completed

  // Timer
  workDuration: 25 * 60,  // 25 min in seconds
  breakDuration: 5 * 60,  // 5 min in seconds
  timerRunning: false,

  // AI
  aiSubtasks: [],
  aiLoading: false,

  // UI
  toast: null,
  theme: loadFromStorage('dc_theme', 'light'), // light | dark
});

// ─── Reducer ──────────────────────────────────────────
function globalReducer(state, action) {
  switch (action.type) {
    // ── Auth ──
    case 'LOGIN': {
      const user = { name: action.payload.name || 'User', email: action.payload.email };
      return { ...state, user, isAuthenticated: true };
    }
    case 'SIGNUP': {
      const user = { name: action.payload.name, email: action.payload.email };
      return { ...state, user, isAuthenticated: true };
    }
    case 'LOGOUT':
      return {
        ...createInitialState(),
        user: null,
        isAuthenticated: false,
        tasks: [],
        completedTasks: [],
        currentTask: null,
        taskState: 'idle',
      };

    // ── Tasks ──
    case 'ADD_TASK': {
      const newTask = {
        id: generateId(),
        title: action.payload.title,
        description: action.payload.description || '',
        priority: action.payload.priority || 'medium',
        duration: action.payload.duration || 25,
        subtasks: action.payload.subtasks || [],
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      return { ...state, tasks: [newTask, ...state.tasks] };
    }
    case 'ADD_MULTIPLE_TASKS': {
      const newTasks = action.payload.map(t => ({
        id: generateId(),
        title: t.title,
        description: t.description || '',
        priority: t.priority || 'medium',
        duration: t.duration || 25,
        subtasks: [],
        createdAt: new Date().toISOString(),
        status: 'pending',
      }));
      return { ...state, tasks: [...newTasks, ...state.tasks] };
    }
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

    // ── Productivity Cycle ──
    case 'SELECT_TASK': {
      const task = state.tasks.find(t => t.id === action.payload);
      if (!task) return state;
      return {
        ...state,
        currentTask: { ...task, status: 'working' },
        taskState: 'working',
        tasks: state.tasks.map(t => t.id === action.payload ? { ...t, status: 'working' } : t),
        timerRunning: true,
      };
    }
    case 'START_WORK':
      return { ...state, taskState: 'working', timerRunning: true };
    case 'START_BREAK':
      return { ...state, taskState: 'break', timerRunning: true };
    case 'PAUSE_TASK':
      return {
        ...state,
        taskState: 'idle',
        timerRunning: false,
        tasks: state.tasks.map(t =>
          t.id === state.currentTask?.id ? { ...t, status: 'pending' } : t
        ),
        currentTask: null,
      };
    case 'COMPLETE_TASK': {
      const completed = {
        ...state.currentTask,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };
      return {
        ...state,
        taskState: 'completed',
        timerRunning: false,
        currentTask: null,
        tasks: state.tasks.filter(t => t.id !== completed.id),
        completedTasks: [completed, ...state.completedTasks],
      };
    }
    case 'RESTORE_TASK': {
      const task = state.completedTasks.find(t => t.id === action.payload);
      if (!task) return state;
      const restored = { ...task, status: 'pending', completedAt: undefined };
      return {
        ...state,
        completedTasks: state.completedTasks.filter(t => t.id !== action.payload),
        tasks: [restored, ...state.tasks],
      };
    }
    case 'RESET_CYCLE':
      return { ...state, taskState: 'idle', currentTask: null, timerRunning: false };

    // ── Timer ──
    case 'SET_WORK_DURATION':
      return { ...state, workDuration: action.payload };
    case 'SET_BREAK_DURATION':
      return { ...state, breakDuration: action.payload };
    case 'SET_TIMER_RUNNING':
      return { ...state, timerRunning: action.payload };

    // ── AI ──
    case 'AI_LOADING':
      return { ...state, aiLoading: true };
    case 'AI_RESULT':
      return { ...state, aiLoading: false, aiSubtasks: action.payload };
    case 'AI_CLEAR':
      return { ...state, aiSubtasks: [], aiLoading: false };

    // ── UI ──
    case 'SHOW_TOAST':
      return { ...state, toast: action.payload };
    case 'HIDE_TOAST':
      return { ...state, toast: null };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };

    default:
      return state;
  }
}

// ─── Provider ─────────────────────────────────────────
export function GlobalStateProvider({ children }) {
  const [state, dispatch] = useReducer(globalReducer, null, createInitialState);

  // Persist to localStorage on state changes
  useEffect(() => {
    saveToStorage('dc_user', state.user);
    saveToStorage('dc_tasks', state.tasks);
    saveToStorage('dc_completed', state.completedTasks);
    saveToStorage('dc_current_task', state.currentTask);
    saveToStorage('dc_task_state', state.taskState);
    saveToStorage('dc_theme', state.theme);
  }, [state.user, state.tasks, state.completedTasks, state.currentTask, state.taskState, state.theme]);

  // Auto-hide toast
  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

  // ── Actions ──
  const login = useCallback((email, password) => {
    const name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    dispatch({ type: 'LOGIN', payload: { email, name } });
  }, []);

  const signup = useCallback((name, email, password) => {
    dispatch({ type: 'SIGNUP', payload: { name, email } });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dc_user');
    localStorage.removeItem('dc_tasks');
    localStorage.removeItem('dc_completed');
    localStorage.removeItem('dc_current_task');
    localStorage.removeItem('dc_task_state');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const addTask = useCallback((task) => {
    dispatch({ type: 'ADD_TASK', payload: task });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Task added ✨', type: 'success' } });
  }, []);

  const addMultipleTasks = useCallback((tasks) => {
    dispatch({ type: 'ADD_MULTIPLE_TASKS', payload: tasks });
    dispatch({ type: 'SHOW_TOAST', payload: { message: `${tasks.length} tasks added ✨`, type: 'success' } });
  }, []);

  const deleteTask = useCallback((id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
  }, []);

  const selectTask = useCallback((taskId) => {
    dispatch({ type: 'SELECT_TASK', payload: taskId });
  }, []);

  const startWork = useCallback(() => dispatch({ type: 'START_WORK' }), []);
  const startBreak = useCallback(() => dispatch({ type: 'START_BREAK' }), []);
  const pauseTask = useCallback(() => dispatch({ type: 'PAUSE_TASK' }), []);

  const completeTask = useCallback(() => {
    dispatch({ type: 'COMPLETE_TASK' });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Task completed! 🎉', type: 'celebration' } });
  }, []);

  const restoreTask = useCallback((id) => {
    dispatch({ type: 'RESTORE_TASK', payload: id });
    dispatch({ type: 'SHOW_TOAST', payload: { message: 'Task restored', type: 'info' } });
  }, []);

  const resetCycle = useCallback(() => dispatch({ type: 'RESET_CYCLE' }), []);

  const breakdownGoal = useCallback(async (goal) => {
    dispatch({ type: 'AI_LOADING' });
    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    const subtasks = mockAIBreakdown(goal);
    dispatch({ type: 'AI_RESULT', payload: subtasks });
    return subtasks;
  }, []);

  const clearAI = useCallback(() => dispatch({ type: 'AI_CLEAR' }), []);

  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
  }, []);

  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);

  const value = {
    ...state,
    login, signup, logout,
    addTask, addMultipleTasks, deleteTask,
    selectTask, startWork, startBreak, pauseTask,
    completeTask, restoreTask, resetCycle,
    breakdownGoal, clearAI,
    showToast, toggleTheme,
    dispatch,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
}

export default GlobalStateContext;
