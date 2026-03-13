import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Stats = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center max-w-md">
        <BookOpen className="w-16 h-16 text-purple-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Character Stats</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Kael's stats are woven into the story chapters. Read the VR world chapters to follow his progression as a Vampire Progenitor — levels, skills, abilities, and the growing reality bleed.
        </p>
        <button onClick={() => navigate('/read/1')}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Start Reading
        </button>
      </div>
    </div>
  );
};

export default Stats;
