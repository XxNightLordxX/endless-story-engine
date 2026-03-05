import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { toggleSidebar, toggleTheme } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/userSlice';
import {
  Menu,
  X,
  Home,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  Shield,
  Moon,
  Sun,
  HelpCircle
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const Layout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme } = useAppSelector((state) => state.ui);
  const { user, isAuthenticated } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home', public: true },
    { path: '/read', icon: BookOpen, label: 'Read Story', public: true },
    { path: '/stats', icon: BarChart3, label: 'Stats', public: true },
    { path: '/dashboard', icon: User, label: 'Dashboard', public: false },
    { path: '/admin', icon: Shield, label: 'Admin Panel', public: false, admin: true },
  ];

  const handleHelp = () => {
    // Dispatch keyboard event to open help
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }));
  };

  const filteredNavItems = navItems.filter(item => {
    if (!isAuthenticated) {
      return item.public && !item.admin;
    }
    if (item.admin && user?.role !== 'admin') {
      return false;
    }
    return true;
  });

  // Main content ref for skip link
  const mainContentRef = useRef<HTMLElement>(null);

  // Skip to main content
  const skipToMain = () => {
    mainContentRef.current?.focus();
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${theme}`}>
      {/* Skip Link for Accessibility */}
      <button
        onClick={skipToMain}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </button>
      
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
              Endless Story Engine
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleHelp}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Help (? for keyboard shortcut)"
            >
              <HelpCircle size={20} />
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
              >
                <LogOut size={20} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
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
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Reading Progress Widget */}
            {isAuthenticated && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Reading Progress
                </h3>
                <div className="text-sm text-gray-700 dark:text-gray-200">
                  <p>Chapter: {user?.readingProgress.currentChapter}</p>
                  <p>Streak: {user?.readingProgress.readingStreak} days</p>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Main Content */}
        <main 
          ref={mainContentRef}
          tabIndex={-1}
          className={`flex-1 min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;