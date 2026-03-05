import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import Toast from './components/Toast/Toast';
import OnboardingTour from './components/Onboarding/OnboardingTour';
import HelpDocumentation from './components/Help/HelpDocumentation';
import { useEffect, useState } from 'react';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.default })));
const Reader = lazy(() => import('./pages/Reader').then(module => ({ default: module.default })));
const Stats = lazy(() => import('./pages/Stats').then(module => ({ default: module.default })));
const AdminPanel = lazy(() => import('./pages/AdminPanel').then(module => ({ default: module.default })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.default })));
const Register = lazy(() => import('./pages/Register').then(module => ({ default: module.default })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(module => ({ default: module.default })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    // Add keyboard shortcut for help
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          setHelpOpen(true);
        }
      }
      if (e.key === 'Escape') {
        setHelpOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Provider store={store}>
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="read" element={<Reader />} />
              <Route path="read/:chapterId" element={<Reader />} />
              <Route path="stats" element={<Stats />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="admin" element={<AdminPanel />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </Suspense>
      </HashRouter>
      <Toast />
      <OnboardingTour />
      <HelpDocumentation isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </Provider>
  );
}

export default App;