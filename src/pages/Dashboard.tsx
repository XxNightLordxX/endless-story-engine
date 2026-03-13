import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/slices/userSlice';
import { BookOpen, TrendingUp, ArrowRight, LogOut } from 'lucide-react';
import * as api from '../api';
import type { ChapterSummary } from '../api';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.user);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);

  useEffect(() => {
    api.getChapters().then(({ chapters }) => setChapters(chapters)).catch(() => {});
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please log in to view your dashboard.</p>
          <button onClick={() => navigate('/login')} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
            Login
          </button>
        </div>
      </div>
    );
  }

  const lastRead = user.lastReadChapter || 0;
  const nextChapter = Math.min(lastRead + 1, chapters.length);
  const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome, {user.username}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user.role === 'admin' ? 'Admin Dashboard' : 'Your reading journey'}
              </p>
            </div>
            <button onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <LogOut size={20} /><span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button onClick={() => navigate(`/read/${nextChapter}`)}
            className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-left">
            <BookOpen className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-1">
              {lastRead === 0 ? 'Start Reading' : 'Continue Reading'}
            </h3>
            <p className="text-purple-100 text-sm">
              {lastRead === 0 ? 'Begin Chapter 1' : `Chapter ${nextChapter}`}
            </p>
            <ArrowRight className="w-5 h-5 mt-3" />
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Chapters Read</h3>
            <p className="text-3xl font-bold text-purple-600">
              {lastRead} <span className="text-lg text-gray-500">/ {chapters.length}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <BookOpen className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Available</h3>
            <p className="text-3xl font-bold text-green-600">
              {chapters.length} <span className="text-lg text-gray-500">chapters</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{totalWords.toLocaleString()} total words</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">All Chapters</h2>
          <div className="space-y-2">
            {chapters.map((ch) => (
              <button key={ch.chapterNumber} onClick={() => navigate(`/read/${ch.chapterNumber}`)}
                className={`w-full text-left p-4 rounded-lg transition-colors flex items-center justify-between ${
                  ch.chapterNumber <= lastRead
                    ? 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                <div className="flex items-center space-x-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    ch.chapterNumber <= lastRead ? 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}>
                    {ch.chapterNumber}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{ch.title}</p>
                    <p className="text-sm text-gray-500">{ch.summary}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${ch.world === 'vr' ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                    {ch.world === 'vr' ? 'VR' : 'Real'}
                  </span>
                  <span className="text-xs text-gray-400">{ch.wordCount.toLocaleString()} words</span>
                </div>
              </button>
            ))}
            {chapters.length === 0 && (
              <p className="text-center text-gray-500 py-8">No chapters available yet.</p>
            )}
          </div>
        </div>

        {/* Admin Link */}
        {user.role === 'admin' && (
          <div className="mt-8 text-center">
            <button onClick={() => navigate('/admin')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Open Admin Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
