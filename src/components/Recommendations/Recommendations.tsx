import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  TrendingUp,
  Heart,
  BookOpen,
  Star,
  ChevronRight,
  ArrowUpRight,
  BookMarked
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'continue' | 'trending' | 'similar' | 'new';
  chapter: number;
  title: string;
  description: string;
  reason: string;
  score: number;
  world: 'real' | 'vr';
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'continue',
    chapter: 15,
    title: 'Continue Your Journey',
    description: 'Pick up where you left off in Chapter 15',
    reason: 'Last read 2 hours ago',
    score: 98,
    world: 'vr',
  },
  {
    id: '2',
    type: 'trending',
    chapter: 23,
    title: 'The Awakening',
    description: 'Most popular chapter this week',
    reason: '1,234 readers this week',
    score: 95,
    world: 'real',
  },
  {
    id: '3',
    type: 'similar',
    chapter: 7,
    title: 'First Signs',
    description: 'Similar to chapters you\'ve enjoyed',
    reason: 'Based on your reading history',
    score: 89,
    world: 'vr',
  },
  {
    id: '4',
    type: 'new',
    chapter: 47,
    title: 'The Convergence',
    description: 'Brand new chapter just released',
    reason: 'Published today',
    score: 92,
    world: 'real',
  },
];

const Recommendations = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'continue':
        return <Clock className="w-4 h-4" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4" />;
      case 'similar':
        return <Heart className="w-4 h-4" />;
      case 'new':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'continue':
        return 'bg-blue-500';
      case 'trending':
        return 'bg-green-500';
      case 'similar':
        return 'bg-pink-500';
      case 'new':
        return 'bg-purple-500';
    }
  };

  const getTypeLabel = (type: Recommendation['type']) => {
    switch (type) {
      case 'continue':
        return 'Continue';
      case 'trending':
        return 'Trending';
      case 'similar':
        return 'For You';
      case 'new':
        return 'New';
    }
  };

  const handleRecommendationClick = (chapter: number) => {
    navigate(`/read/${chapter}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h2 className="font-semibold text-gray-900 dark:text-white">
            Recommended for You
          </h2>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-gray-400 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`}
        />
      </button>

      {expanded && (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mockRecommendations.map((rec, index) => (
            <button
              key={rec.id}
              onClick={() => handleRecommendationClick(rec.chapter)}
              className="w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-2 rounded-lg ${getTypeColor(
                    rec.type
                  )} text-white shrink-0`}
                >
                  {getTypeIcon(rec.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      Chapter {rec.chapter}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {rec.world === 'vr' ? 'VR World' : 'Real World'}
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {rec.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      {getTypeIcon(rec.type)}
                      {rec.reason}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-3 h-3 fill-current" />
                      {rec.score}% match
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;