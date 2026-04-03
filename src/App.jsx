import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGlobalState } from './context/GlobalStateContext';

// Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import WorkGuard from './components/guards/WorkGuard';
import BreakGuard from './components/guards/BreakGuard';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import IndexPage from './pages/IndexPage';
import UpcomingPage from './pages/UpcomingPage';
import WorkPage from './pages/WorkPage';
import BreakPage from './pages/BreakPage';
import CompletedPage from './pages/CompletedPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  const { theme } = useGlobalState();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Routes>
      {/* ── Public Routes (Auth) ── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* ── Protected Routes (Requires Auth) ── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Sidebar-accessible pages */}
        <Route index element={<IndexPage />} />
        <Route path="upcoming" element={<UpcomingPage />} />
        <Route path="completed" element={<CompletedPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* ── Guarded Productivity Cycle Routes ── */}
      <Route
        path="/work"
        element={
          <ProtectedRoute>
            <WorkGuard>
              <WorkPage />
            </WorkGuard>
          </ProtectedRoute>
        }
      />
      <Route
        path="/break"
        element={
          <ProtectedRoute>
            <BreakGuard>
              <BreakPage />
            </BreakGuard>
          </ProtectedRoute>
        }
      />

      {/* ── Catch-all → Login ── */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
