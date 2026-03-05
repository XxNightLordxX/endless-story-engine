import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { updateReadingProgress } from '../../store/slices/userSlice';
import { addToast } from '../../store/slices/uiSlice';
import {
  Target,
  Flame,
  Trophy,
  Calendar,
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
  CheckCircle,
  Circle
} from 'lucide-react';

interface ReadingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: 'chapters' | 'words' | 'minutes';
  startDate: string;
  endDate: string;
  completed: boolean;
}

interface StreakData {
  current: number;
  longest: number;
  lastReadDate: string;
  thisWeek: number[];
}

const mockGoals: ReadingGoal[] = [
  {
    id: '1',
    type: 'daily',
    target: 2,
    current: 1,
    unit: 'chapters',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    completed: false,
  },
  {
    id: '2',
    type: 'weekly',
    target: 10,
    current: 7,
    unit: 'chapters',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    completed: false,
  },
  {
    id: '3',
    type: 'monthly',
    target: 50000,
    current: 32500,
    unit: 'words',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
    completed: false,
  },
];

const mockStreak: StreakData = {
  current: 14,
  longest: 32,
  lastReadDate: new Date().toISOString(),
  thisWeek: [1, 1, 1, 1, 0, 1, 0], // 1 = read, 0 = not read
};

const ReadingGoals = () => {
  const [goals, setGoals] = useState<ReadingGoal[]>(mockGoals);
  const [streak, setStreak] = useState<StreakData>(mockStreak);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const dispatch = useAppDispatch();
  const { readingProgress } = useAppSelector((state) => state.user);

  const getProgressPercentage = (goal: ReadingGoal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getGoalIcon = (type: ReadingGoal['type']) => {
    switch (type) {
      case 'daily':
        return <Calendar className="w-5 h-5" />;
      case 'weekly':
        return <Clock className="w-5 h-5" />;
      case 'monthly':
        return <Trophy className="w-5 h-5" />;
    }
  };

  const getGoalColor = (type: ReadingGoal['type']) => {
    switch (type) {
      case 'daily':
        return 'bg-blue-500';
      case 'weekly':
        return 'bg-green-500';
      case 'monthly':
        return 'bg-purple-500';
    }
  };

  const getDayName = (index: number) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days[index];
  };

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-8 h-8" />
              <span className="text-sm font-medium opacity-90">Reading Streak</span>
            </div>
            <div className="text-5xl font-bold">{streak.current}</div>
            <div className="text-sm opacity-90 mt-1">days in a row</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Longest streak</div>
            <div className="text-2xl font-semibold">{streak.longest} days</div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="mt-6 flex justify-between">
          {streak.thisWeek.map((read, index) => (
            <div
              key={index}
              className={`flex flex-col items-center ${
                read ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  read
                    ? 'bg-white text-orange-500'
                    : 'bg-white/20 text-white/70'
                }`}
              >
                {read ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs mt-1 opacity-90">{getDayName(index)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${getGoalColor(goal.type)} text-white`}>
                {getGoalIcon(goal.type)}
              </div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {goal.type}
              </span>
            </div>

            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {goal.target} {goal.unit}
            </h3>

            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {goal.current.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                / {goal.target.toLocaleString()} {goal.unit}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getGoalColor(
                  goal.type
                )}`}
                style={{ width: `${getProgressPercentage(goal)}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(getProgressPercentage(goal))}% complete
              </span>
              {goal.completed && (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Done!
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Set New Goal Button */}
      <button
        onClick={() => setShowGoalModal(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
      >
        <Target className="w-5 h-5" />
        Set a New Reading Goal
      </button>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-500" />
          Reading Achievements
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'First Chapter', icon: '📖', unlocked: true },
            { name: 'Week Warrior', icon: '🔥', unlocked: true },
            { name: 'Speed Reader', icon: '⚡', unlocked: false },
            { name: 'Bookworm', icon: '🐛', unlocked: false },
            { name: 'Night Owl', icon: '🦉', unlocked: true },
            { name: 'Marathon', icon: '🏃', unlocked: false },
            { name: 'Dedicated', icon: '💎', unlocked: false },
            { name: 'Legendary', icon: '👑', unlocked: false },
          ].map((achievement) => (
            <div
              key={achievement.name}
              className={`p-4 rounded-lg text-center ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30'
                  : 'bg-gray-100 dark:bg-gray-700/50 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {achievement.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadingGoals;