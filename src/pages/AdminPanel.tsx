import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { setAdminData, setGenerating } from '../store/slices/adminSlice';
import { addToast } from '../store/slices/uiSlice';
import {
  BookOpen, Settings, Trash2, RefreshCw, Zap, Eye, CheckCircle
} from 'lucide-react';
import * as api from '../api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.user);
  const { data: adminData, isGenerating } = useAppSelector((s) => s.admin);

  const [storyPromptInput, setStoryPromptInput] = useState('');
  const [genCount, setGenCount] = useState(1);

  // Redirect non-admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Load admin state
  const refreshAdminState = useCallback(async () => {
    try {
      const state = await api.getAdminState();
      dispatch(setAdminData(state));
      setStoryPromptInput(state.storyConfig.storyPrompt);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to load admin state', duration: 3000 }));
    }
  }, [dispatch]);

  useEffect(() => { refreshAdminState(); }, [refreshAdminState]);

  // Generate chapters
  const handleGenerate = async () => {
    dispatch(setGenerating(true));
    try {
      const result = await api.generateChapters(genCount);
      if (result.ok) {
        dispatch(addToast({ type: 'success', message: `Generated ${result.generated} chapter(s)! Total: ${result.totalChapters}`, duration: 4000 }));
      } else {
        dispatch(addToast({ type: 'warning', message: result.error || 'Could not generate', duration: 4000 }));
      }
      refreshAdminState();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      dispatch(addToast({ type: 'error', message: msg, duration: 4000 }));
    } finally {
      dispatch(setGenerating(false));
    }
  };

  // Update story config
  const handleConfigUpdate = async (updates: Partial<api.StoryConfig>) => {
    try {
      const { config } = await api.updateStoryConfig(updates);
      if (adminData) {
        dispatch(setAdminData({ ...adminData, storyConfig: config }));
      }
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to update config', duration: 3000 }));
    }
  };

  // Delete chapter
  const handleDeleteChapter = async (chapterNum: number) => {
    if (chapterNum === 1) {
      dispatch(addToast({ type: 'warning', message: 'Cannot delete Chapter 1 (seed chapter)', duration: 3000 }));
      return;
    }
    try {
      await api.deleteChapter(chapterNum);
      dispatch(addToast({ type: 'success', message: `Chapter ${chapterNum} deleted`, duration: 3000 }));
      refreshAdminState();
    } catch {
      dispatch(addToast({ type: 'error', message: 'Failed to delete chapter', duration: 3000 }));
    }
  };

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <RefreshCw className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }

  const config = adminData.storyConfig;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Control the Endless Story Engine &mdash; procedural chapter generation
          </p>
        </header>

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Chapters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{adminData.totalChapters}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin Last Read</p>
            <p className="text-2xl font-bold text-purple-600">{adminData.lastReadChapter}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Max Allowed</p>
            <p className="text-2xl font-bold text-blue-600">{adminData.maxAllowedChapters}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Engine</p>
            <p className="text-lg font-bold flex items-center space-x-2">
              <CheckCircle size={18} className="text-green-500" /><span className="text-green-600">Ready</span>
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">How Chapter Generation Works</h3>
          <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
            <li>1. Chapters are generated instantly using the built-in story engine &mdash; no API key needed</li>
            <li>2. When you (admin) read a chapter, the system automatically generates up to 5 chapters ahead</li>
            <li>3. The cap = your last read chapter + 5. If you've read chapter 3, max chapters is 8</li>
            <li>4. Regular users can only read existing chapters &mdash; only admin reading triggers generation</li>
            <li>5. You can also manually generate chapters using the button below</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manual Generation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generate Chapters</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Manually generate chapters (still respects the 5-ahead cap).
            </p>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Count:</label>
              <input type="number" min={1} max={5} value={genCount} onChange={(e) => setGenCount(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm" />
              <button onClick={handleGenerate} disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
                {isGenerating ? <><RefreshCw size={16} className="animate-spin" /><span>Generating...</span></> : <><Zap size={16} /><span>Generate</span></>}
              </button>
            </div>
            {adminData.totalChapters >= adminData.maxAllowedChapters && (
              <p className="text-xs text-yellow-600 mt-2">Cap reached! Read more chapters to allow generation of new ones.</p>
            )}
          </div>

          {/* Story Config */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Story Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone: <span className="capitalize">{config.tone}</span>
                </label>
                <div className="flex space-x-2">
                  {(['light', 'neutral', 'dark'] as const).map((t) => (
                    <button key={t} onClick={() => handleConfigUpdate({ tone: t })}
                      className={`px-3 py-1.5 rounded text-sm capitalize ${config.tone === t ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pacing: {config.pacing}/10
                </label>
                <input type="range" min={1} max={10} value={config.pacing}
                  onChange={(e) => handleConfigUpdate({ pacing: parseInt(e.target.value) })} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tension: {config.tension}/10
                </label>
                <input type="range" min={1} max={10} value={config.tension}
                  onChange={(e) => handleConfigUpdate({ tension: parseInt(e.target.value) })} className="w-full" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter Length
                </label>
                <div className="flex space-x-2">
                  {(['short', 'medium', 'long'] as const).map((l) => (
                    <button key={l} onClick={() => handleConfigUpdate({ chapterLength: l })}
                      className={`px-3 py-1.5 rounded text-sm capitalize ${config.chapterLength === l ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Story Prompt */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Story Direction (optional — influences generated chapter themes)
              </label>
              <div className="flex space-x-2">
                <textarea value={storyPromptInput} onChange={(e) => setStoryPromptInput(e.target.value)}
                  placeholder="E.g., 'In the next chapters, Kael should encounter a rival vampire player...'"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm resize-none"
                  rows={3} />
                <button onClick={() => handleConfigUpdate({ storyPrompt: storyPromptInput })}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium self-end">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Chapter List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Chapters ({adminData.chapters.length})</h3>
              </div>
              <button onClick={refreshAdminState} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <RefreshCw size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {adminData.chapters.map((ch) => (
                <div key={ch.chapterNumber} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${ch.world === 'vr' ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'}`}>
                      {ch.world === 'vr' ? 'VR' : 'Real'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{ch.title}</p>
                      <p className="text-xs text-gray-500">{ch.wordCount.toLocaleString()} words</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => navigate(`/read/${ch.chapterNumber}`)}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600" title="Read">
                      <Eye size={14} className="text-gray-500" />
                    </button>
                    {ch.chapterNumber > 1 && (
                      <button onClick={() => handleDeleteChapter(ch.chapterNumber)}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30" title="Delete">
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
