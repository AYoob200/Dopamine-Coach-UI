import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Toast from '../ui/Toast';

export default function AppLayout() {
  return (
    <div className="app-layout flex min-h-screen bg-white dark:bg-gray-950">
      <Sidebar />
      <main className="app-layout-main flex-1 flex flex-col min-h-screen">
        <TopBar />
        <div className="flex-1 bg-white dark:bg-gray-950">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  );
}
