import { Navigate } from 'react-router-dom';
import { useGlobalState } from '../../context/GlobalStateContext';

export default function WorkGuard({ children }) {
  const { currentTask, taskState } = useGlobalState();

  if (!currentTask || taskState !== 'working') {
    return <Navigate to="/upcoming" replace />;
  }

  return children;
}
