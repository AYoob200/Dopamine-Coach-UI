import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function BreakGuard({ children }) {
  const { taskState } = useGlobalState();

  if (taskState !== 'break') {
    return <Navigate to="/upcoming" replace />;
  }

  return children;
}
