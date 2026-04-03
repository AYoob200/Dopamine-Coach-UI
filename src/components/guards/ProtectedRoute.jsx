import { Navigate, useLocation } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useGlobalState();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
