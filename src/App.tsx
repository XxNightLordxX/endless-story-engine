import { HashRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import Toast from './components/Toast/Toast';
import { useEffect } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Reader = lazy(() => import('./pages/Reader'));
const Stats = lazy(() => import('./pages/Stats'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
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
    </Provider>
  );
}

export default App;
