import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { logout } from '../store/slices/userSlice';
import ReadingGoals from '../components/ReadingGoals/ReadingGoals';
import Recommendations from '../components/Recommendations/Recommendations';
import { BookOpen, TrendingUp, Trophy, Clock, Target, Flame, ArrowRight, LogOut, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, readingProgress } = useAppSelector((state) => state.user);
  const { stats } = useAppSelector((state) => state.system);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user.username}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Continue your journey through the dual worlds
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Recommendations */}
        <div className="mb-8">
          <Recommendations />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <button
            onClick={() => navigate(`/read/${readingProgress.currentChapter}`)}
            className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <BookOpen className="w-8 h-8 mb-3" />
            <h3 className="text-xl font-semibold mb-1">Continue Reading</h3>
            <p className="text-purple-100 text-sm">
              Chapter {readingProgress.currentChapter}
            </p>
            <ArrowRight className="w-5 h-5 mt-3" />
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <TrendingUp className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Reading Streak
            </h3>
            <p className="text-3xl font-bold text-primary-600">
              {readingProgress.readingStreak} <span className="text-lg text-gray-500">days</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <Trophy className="w-8 h-8 text-yellow-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Chapters Read
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {readingProgress.chaptersRead.length} <span className="text-lg text-gray-500">total</span>
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <Target className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              Words Read
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {readingProgress.totalWordsRead.toLocaleString()} <span className="text-lg text-gray-500">words</span>
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reading Goals */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Reading Goals
            </h2>
            <ReadingGoals />
          </div>

          {/* Character Stats Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Kael's Status
              </h2>
              <button
                onClick={() => navigate('/stats')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All Stats →
              </button>
            </div>

            {stats && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Level</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.level}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Experience</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stats.experience.toLocaleString()}
                    </span>
                    <span className="text-gray-500"> / {stats.experienceToNext.toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${(stats.experience / stats.experienceToNext) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Strength</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.strength}</p>
                  </div>

                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Agility</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.agility}</p>
                  </div>

                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Vitality</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.vitality}</p>
                  </div>

                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Perception</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.perception}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  Finished reading <span className="font-medium">Chapter {readingProgress.currentChapter - 1}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  Reading streak reached <span className="font-medium">{readingProgress.readingStreak} days</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Keep going to unlock the 7-day achievement!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white">
                  Total words read: <span className="font-medium">{readingProgress.totalWordsRead.toLocaleString()}</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You're making great progress!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;