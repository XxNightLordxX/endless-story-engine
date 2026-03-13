import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/userSlice';
import { Menu, X, Home, BookOpen, BarChart3, User, LogOut, Shield, Moon, Sun } from 'lucide-react';

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme } = useAppSelector((s) => s.ui);
  const { user, isAuthenticated } = useAppSelector((s) => s.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', show: true },
    { path: '/read', icon: BookOpen, label: 'Read Story', show: true },
    { path: '/stats', icon: BarChart3, label: 'Stats', show: true },
    { path: '/dashboard', icon: User, label: 'Dashboard', show: isAuthenticated },
    { path: '/admin', icon: Shield, label: 'Admin Panel', show: isAuthenticated && user?.role === 'admin' },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${theme}`}>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white">
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-purple-600 dark:text-purple-400 cursor-pointer" onClick={() => navigate('/')}>
              Endless Story Engine
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors dark:text-white" title="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                  {user?.username}
                  {user?.role === 'admin' && <span className="ml-1 text-xs text-purple-500">(admin)</span>}
                </span>
                <button onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200">
                  Login
                </button>
                <button onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-40 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.filter((i) => i.show).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/read' && location.pathname.startsWith('/read'));
                return (
                  <button key={item.path} onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}>
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
