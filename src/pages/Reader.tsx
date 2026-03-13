import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { updateUserLastRead } from '../store/slices/userSlice';
import { setCurrentChapter, setChapterList, setLoading } from '../store/slices/storySlice';
import { addToast } from '../store/slices/uiSlice';
import { ChevronLeft, ChevronRight, List, Settings, Globe, RefreshCw, X } from 'lucide-react';
import * as api from '../api';

const Reader = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((s) => s.user);
  const { currentChapter, chapterList, isLoading } = useAppSelector((s) => s.story);
  const { preferences } = useAppSelector((s) => s.user);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(preferences.fontSize);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [markingRead, setMarkingRead] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  // Load chapter list on mount
  useEffect(() => {
    api.getChapters().then(({ chapters }) => {
      dispatch(setChapterList(chapters));
    }).catch(() => {});
  }, [dispatch]);

  // Load specific chapter
  const loadChapter = useCallback(async (num: number) => {
    dispatch(setLoading(true));
    try {
      const { chapter } = await api.getChapter(num);
      dispatch(setCurrentChapter(chapter));

      // Mark as read on the backend (triggers generation if admin)
      if (user) {
        setMarkingRead(true);
        try {
          const result = await api.markChapterRead(num, user.id);
          dispatch(updateUserLastRead(num));
          if (result.generated > 0) {
            dispatch(addToast({
              type: 'info',
              message: `${result.generated} new chapter${result.generated > 1 ? 's' : ''} generated! (Total: ${result.totalChapters})`,
              duration: 4000,
            }));
            // Refresh chapter list
            const { chapters } = await api.getChapters();
            dispatch(setChapterList(chapters));
          }
        } catch {
          // Non-critical
        } finally {
          setMarkingRead(false);
        }
      }
    } catch {
      dispatch(addToast({ type: 'error', message: 'Chapter not found', duration: 3000 }));
      navigate('/read/1');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, user, navigate]);

  // Load chapter on mount or chapterId change
  useEffect(() => {
    const num = chapterId ? parseInt(chapterId) : 1;
    if (!isNaN(num) && num > 0) {
      loadChapter(num);
    } else {
      loadChapter(1);
    }
  }, [chapterId, loadChapter]);

  // Scroll progress
  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = scrollHeight > clientHeight
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 100;
      setScrollProgress(Math.min(progress, 100));
    }
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const currentNum = currentChapter?.chapterNumber || 1;
  const hasPrev = currentNum > 1;
  const hasNext = chapterList.some((c) => c.chapterNumber > currentNum);

  const goToPrev = () => { if (hasPrev) navigate(`/read/${currentNum - 1}`); };
  const goToNext = () => { if (hasNext) navigate(`/read/${currentNum + 1}`); };

  const getWorldColor = () =>
    currentChapter?.world === 'vr'
      ? 'from-purple-900/20 to-blue-900/20'
      : 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900';

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => {
      // Handle bold markdown
      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} className="mb-4 text-justify leading-relaxed"
          style={{ fontSize: `${fontSize}px`, fontFamily: preferences.fontFamily === 'serif' ? 'Merriweather, serif' : 'Inter, sans-serif', lineHeight: preferences.lineHeight }}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j} className="text-purple-400 font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={j}>{part}</span>;
          })}
        </p>
      );
    });
  };

  if (isLoading && !currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (!currentChapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No chapters available yet.</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWorldColor()} transition-all duration-500`}>
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-30">
        <div className="h-full bg-purple-600 transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* World Indicator */}
      <div className="fixed top-20 right-4 z-30">
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${
          currentChapter.world === 'vr' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'
        }`}>
          <Globe size={14} />
          <span>{currentChapter.world === 'vr' ? 'VR World' : 'Real World'}</span>
        </div>
        {markingRead && (
          <div className="mt-2 px-3 py-1 rounded-full text-xs bg-green-600 text-white flex items-center space-x-1">
            <RefreshCw size={12} className="animate-spin" />
            <span>Generating...</span>
          </div>
        )}
      </div>

      {/* Chapter Sidebar */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowSidebar(false)} />
          <div className="relative w-80 bg-white dark:bg-gray-800 shadow-xl overflow-y-auto">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Chapters</h3>
              <button onClick={() => setShowSidebar(false)}><X size={20} className="text-gray-500" /></button>
            </div>
            <div className="p-2">
              {chapterList.map((ch) => (
                <button
                  key={ch.chapterNumber}
                  onClick={() => { navigate(`/read/${ch.chapterNumber}`); setShowSidebar(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg mb-1 transition-colors ${
                    ch.chapterNumber === currentNum
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <p className="font-medium text-sm">{ch.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {ch.wordCount.toLocaleString()} words
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${ch.world === 'vr' ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                      {ch.world === 'vr' ? 'VR' : 'Real'}
                    </span>
                  </p>
                </button>
              ))}
              {chapterList.length === 0 && (
                <p className="text-center text-gray-500 py-8">No chapters yet</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed top-20 left-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Reading Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">Font Size: {fontSize}px</label>
              <input type="range" min="12" max="32" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div ref={contentRef} className="max-w-3xl mx-auto px-6 py-24 overflow-y-auto" onScroll={handleScroll}>
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {currentChapter.title}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{currentChapter.wordCount.toLocaleString()} words</span>
            <span>Chapter {currentChapter.chapterNumber}</span>
          </div>
        </header>

        <article className="reading-content prose prose-lg dark:prose-invert max-w-none">
          {renderContent(currentChapter.content)}
        </article>

        {/* Navigation */}
        <nav className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button onClick={goToPrev} disabled={!hasPrev}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200">
            <ChevronLeft size={20} /><span>Previous</span>
          </button>
          <button onClick={goToNext} disabled={!hasNext}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span>Next Chapter</span><ChevronRight size={20} />
          </button>
        </nav>

        {!hasNext && (
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              {user?.role === 'admin'
                ? 'You\'ve caught up! Reading this chapter will trigger generation of new chapters ahead.'
                : 'You\'ve reached the latest chapter. Check back soon for more!'}
            </p>
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3 z-40">
        <button onClick={goToPrev} disabled={!hasPrev} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white" title="Previous">
          <ChevronLeft size={24} />
        </button>
        <button onClick={() => setShowSidebar(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white" title="Chapter List">
          <List size={24} />
        </button>
        <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white" title="Settings">
          <Settings size={24} />
        </button>
        <button onClick={goToNext} disabled={!hasNext} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white" title="Next">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Reader;
