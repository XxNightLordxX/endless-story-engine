import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { 
  setPaused, setSpeed, setPacing, setTone, setTension, setWorldLogic,
  toggleDiagnostics, toggleStatSystem, toggleSystemScreen, toggleRealityIntegration,
  addCommand
} from '../store/slices/adminSlice';
import { addToast } from '../store/slices/uiSlice';
import { 
  Terminal, Play, Pause, BarChart3, Users, 
  Activity, BookOpen
} from 'lucide-react';

// Tab Component
interface TabProps {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}

const Tab = ({ label, icon: Icon, active, onClick }: TabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 font-medium transition-colors border-b-2 ${
      active
        ? 'text-primary-600 border-primary-600'
        : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

// Command Box Component
const CommandBox = () => {
  const dispatch = useAppDispatch();
  const { commands } = useAppSelector((state) => state.admin);
  const inputRef = useRef<HTMLInputElement>(null);

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');

  const commonCommands = [
    { cmd: '/pause', desc: 'Pause story generation' },
    { cmd: '/resume', desc: 'Resume story generation' },
    { cmd: '/speed fast', desc: 'Set generation speed to fast' },
    { cmd: '/pacing 7', desc: 'Increase pacing intensity' },
    { cmd: '/tone dark', desc: 'Set tone to dark' },
    { cmd: '/tension 8', desc: 'Increase tension' },
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    dispatch(addCommand(inputValue));
    setCommandHistory(prev => [...prev, inputValue]);
    setHistoryIndex(-1);

    // Process command (simplified for demo)
    processCommand(inputValue);
    
    setInputValue('');
  };

  const processCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case '/pause':
        dispatch(setPaused(true));
        dispatch(addToast({ type: 'success', message: 'Story generation paused', duration: 3000 }));
        break;
      case '/resume':
        dispatch(setPaused(false));
        dispatch(addToast({ type: 'success', message: 'Story generation resumed', duration: 3000 }));
        break;
      case '/speed':
        if (['slow', 'normal', 'fast'].includes(args[0])) {
          dispatch(setSpeed(args[0] as 'slow' | 'normal' | 'fast'));
          dispatch(addToast({ type: 'success', message: `Speed set to ${args[0]}`, duration: 3000 }));
        }
        break;
      case '/pacing':
        const pacing = parseInt(args[0]);
        if (!isNaN(pacing) && pacing >= 1 && pacing <= 10) {
          dispatch(setPacing(pacing));
          dispatch(addToast({ type: 'success', message: `Pacing set to ${pacing}`, duration: 3000 }));
        }
        break;
      case '/tone':
        if (['dark', 'neutral', 'light'].includes(args[0])) {
          dispatch(setTone(args[0] as 'dark' | 'neutral' | 'light'));
          dispatch(addToast({ type: 'success', message: `Tone set to ${args[0]}`, duration: 3000 }));
        }
        break;
      case '/tension':
        const tension = parseInt(args[0]);
        if (!isNaN(tension) && tension >= 1 && tension <= 10) {
          dispatch(setTension(tension));
          dispatch(addToast({ type: 'success', message: `Tension set to ${tension}`, duration: 3000 }));
        }
        break;
      default:
        dispatch(addToast({ type: 'error', message: 'Unknown command', duration: 3000 }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Terminal size={20} />
          <span className="text-gray-300">Command Box</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>NLP Enabled</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Command Suggestions */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <p className="text-xs text-gray-500 mb-2">Common Commands:</p>
        <div className="flex flex-wrap gap-2">
          {commonCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => setInputValue(cmd.cmd)}
              className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors"
            >
              {cmd.cmd}
            </button>
          ))}
        </div>
      </div>

      {/* Command History */}
      <div className="h-48 overflow-y-auto mb-4 space-y-2">
        {commands.map((cmd, idx) => (
          <div key={idx} className="text-sm">
            <span className="text-gray-500">{idx + 1}. </span>
            <span className="text-white">{cmd}</span>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleCommandSubmit}>
        <div className="flex items-center space-x-2">
          <span className="text-green-500">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command (try /help)..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
          />
        </div>
      </form>

      <div className="mt-2 text-xs text-gray-600">
        Tip: Use arrow keys for command history. Try NLP: "slow down the pacing"
      </div>
    </div>
  );
};

// Story Generation Panel
const StoryGenerationPanel = () => {
  const dispatch = useAppDispatch();
  const { storyGeneration, storyControls } = useAppSelector((state) => state.admin);

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Story Generation Controls
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {storyGeneration.paused ? (
                <Play className="w-6 h-6 text-green-600" />
              ) : (
                <Pause className="w-6 h-6 text-yellow-600" />
              )}
              <span className="text-gray-700 dark:text-gray-300">
                {storyGeneration.paused ? 'Generation Paused' : 'Generating...'}
              </span>
            </div>
            <button
              onClick={() => dispatch(setPaused(!storyGeneration.paused))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                storyGeneration.paused
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {storyGeneration.paused ? 'Resume' : 'Pause'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generation Speed: {storyGeneration.speed}
            </label>
            <div className="flex space-x-2">
              {['slow', 'normal', 'fast'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => dispatch(setSpeed(speed as 'slow' | 'normal' | 'fast'))}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    storyGeneration.speed === speed
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Story Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Story Parameters
        </h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pacing: {storyControls.pacing}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={storyControls.pacing}
              onChange={(e) => dispatch(setPacing(parseInt(e.target.value)))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tone: {storyControls.tone}
            </label>
            <div className="flex space-x-2">
              {['light', 'neutral', 'dark'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => dispatch(setTone(tone as 'light' | 'neutral' | 'dark'))}
                  className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                    storyControls.tone === tone
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tension: {storyControls.tension}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={storyControls.tension}
              onChange={(e) => dispatch(setTension(parseInt(e.target.value)))}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">World Logic</span>
            <button
              onClick={() => dispatch(setWorldLogic(!storyControls.worldLogic))}
              className={`w-12 h-6 rounded-full transition-colors ${
                storyControls.worldLogic ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  storyControls.worldLogic ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Queue Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generation Queue
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Queued Chapters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {storyGeneration.queue.length}
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Published Chapters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {storyGeneration.published}
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Quality Score</p>
            <p className="text-2xl font-bold text-green-600">
              {storyGeneration.qualityScore}%
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p className={`text-lg font-bold ${
              storyGeneration.paused ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {storyGeneration.paused ? 'Paused' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Panel
const DashboardPanel = () => {
  const { analytics, systemControls } = useAppSelector((state) => state.admin);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-6">
      {/* System Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Controls
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Diagnostics</span>
            <button
              onClick={() => dispatch(toggleDiagnostics())}
              className={`w-10 h-5 rounded-full transition-colors ${
                systemControls.diagnostics ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  systemControls.diagnostics ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Stat System</span>
            <button
              onClick={() => dispatch(toggleStatSystem())}
              className={`w-10 h-5 rounded-full transition-colors ${
                systemControls.statSystem ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  systemControls.statSystem ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">System Screen</span>
            <button
              onClick={() => dispatch(toggleSystemScreen())}
              className={`w-10 h-5 rounded-full transition-colors ${
                systemControls.systemScreen ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  systemControls.systemScreen ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span className="text-gray-700 dark:text-gray-300">Reality Integration</span>
            <button
              onClick={() => dispatch(toggleRealityIntegration())}
              className={`w-10 h-5 rounded-full transition-colors ${
                systemControls.realityIntegration ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  systemControls.realityIntegration ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Chapters</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.storyMetrics.totalChapters}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Words</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.storyMetrics.totalWords.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Chapter Length</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {analytics.storyMetrics.averageChapterLength.toLocaleString()} words
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Continuity Score</span>
              <span className="font-semibold text-green-600">
                {analytics.storyMetrics.continuityScore}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Health</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
              <span className="font-semibold text-green-600">
                {analytics.systemHealth.generationSuccessRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Error Count</span>
              <span className="font-semibold text-red-600">
                {analytics.systemHealth.errorCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Resource Usage</span>
              <span className="font-semibold text-yellow-600">
                {analytics.systemHealth.resourceUsage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Performance</span>
              <span className="font-semibold text-blue-600">
                {analytics.systemHealth.performanceScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Engagement */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reader Engagement</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Readers</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {analytics.readerEngagement.totalReaders}
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Now</p>
            <p className="text-2xl font-bold text-green-600">
              {analytics.readerEngagement.activeReaders}
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.floor(analytics.readerEngagement.averageSessionTime / 60)}m
            </p>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Popular Chapter</p>
            <p className="text-2xl font-bold text-purple-600">
              #{analytics.readerEngagement.popularChapters[0] || 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Panel Component
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<'command' | 'story' | 'dashboard' | 'users'>('command');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Full administrative control over the Endless Story Engine
          </p>
        </header>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6">
          <div className="flex overflow-x-auto">
            <Tab
              label="Command Box"
              icon={Terminal}
              active={activeTab === 'command'}
              onClick={() => setActiveTab('command')}
            />
            <Tab
              label="Story Generation"
              icon={BookOpen}
              active={activeTab === 'story'}
              onClick={() => setActiveTab('story')}
            />
            <Tab
              label="Dashboard"
              icon={BarChart3}
              active={activeTab === 'dashboard'}
              onClick={() => setActiveTab('dashboard')}
            />
            <Tab
              label="Users"
              icon={Users}
              active={activeTab === 'users'}
              onClick={() => setActiveTab('users')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'command' && <CommandBox />}
          {activeTab === 'story' && <StoryGenerationPanel />}
          {activeTab === 'dashboard' && <DashboardPanel />}
          {activeTab === 'users' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                User Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                User management interface coming soon...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;