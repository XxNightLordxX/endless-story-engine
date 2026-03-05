import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { addChapterToRead, updateScrollPosition } from '../store/slices/userSlice';
import type { Chapter, Character, Location } from '../types';
import ExportModal from '../components/Export/ExportModal';
import ShareModal from '../components/Share/ShareModal';
import { ChevronLeft, ChevronRight, List, Settings, Bookmark, BookmarkCheck, Globe, Download, Share2, RefreshCw } from 'lucide-react';
import { UnifiedStoryEngine } from '../services/storyEngine';
import { addToast } from '../store/slices/uiSlice';

// Initialize the story engine
const storyEngine = new UnifiedStoryEngine({
  pacing: 10,
  tone: 'dark',
  tension: 10,
  worldLogic: true,
  characterIntelligence: 10,
  consistencyScore: 10,
  qualityThreshold: 70, // Changed from 100 to 70 for more realistic acceptance
  statMergeEnabled: true,
});

// Base chapter 1 content
const baseChapter: Chapter = {
  id: 1,
  chapterNumber: 1,
  title: 'Chapter 1: The Arrival',
  content: `The package sat on his doorstep like a question without an answer.

Kael stared at it from his apartment doorway, the morning light casting long shadows across the worn welcome mat. The box was plain—no logos, no return address, nothing but his name handwritten in neat, deliberate strokes. He hadn't ordered anything. He couldn't afford to order anything. Not with the medical bills that piled up like autumn leaves in October.

He glanced down the hallway. Empty. The flickering fluorescent light buzzed overhead, a sound that had become background noise to his life in this building. His neighbors were at work, or asleep, or living their lives somewhere far from this corridor of aging apartments and forgotten dreams.

The headset was heavier than he expected. He turned it over in his hands, noting the sleek black design, the almost organic curves. It looked expensive—more expensive than anything he'd ever owned. The visor gleamed with an inner light, subtle but persistent, like a heartbeat made visible.

"Who sent you?" he whispered.

No answer. Just the distant hum of the city outside, the faint murmur of traffic, and somewhere, always, the memory of machines beeping in a hospital room.

He should throw it away. He should report it. He should do a hundred sensible things that sensible people do when mysterious packages arrive unbidden at their door.

But Kael hadn't felt sensible in two years. Not since the accident. Not since the long nights by Yuna's bedside, watching her chest rise and fall in rhythm with machines that had become her lungs, her heart, her everything.

He brought the headset inside.

The manual, if you could call it that, was a single card with four words: LOG IN. FIND YOURSELF.

That was it. No instructions, no warranty information, no customer service hotline. Just an invitation and a challenge.

He sat on the edge of his mattress—the only furniture in his bedroom besides a small nightstand—and stared at the device. His phone buzzed with a text from the hospital. His daily reminder. Visiting hours were in three hours.

"I'll be there," he said aloud, as if Yuna could hear him. "I'll be there. I just need to... figure this out first."

The headset fit perfectly. Almost too perfectly. As if it had been made specifically for his skull, his face, his eyes. When he pulled it on, the world didn't just go dark—it dissolved, replaced by a void that felt infinite and intimate at the same time.

Then came the light.

Brilliant. Overwhelming. The color of sunrise and moonlight combined, of blood and starfire and things that had no names in the waking world.

And a voice—neither male nor female, neither young nor old—that spoke directly into his mind:

"Welcome to Eclipsis Online, Traveler. Your journey begins now."

The world materialized around him. Not a character creation screen. Not a tutorial. Just... a room. Stone walls lit by torches. An ornate mirror reflecting a figure that was him, but also wasn't him. It wore his face, but the eyes...

The eyes were different. They held something ancient. Something hungry.

He tried to speak, to ask what was happening, but the voice returned:

"Your class has been assigned. Your fate has been written. Your bloodline... awakens."

Red text appeared before his eyes, floating in the air like smoke:

**CLASS: Vampire Progenitor**
**STATUS: Forbidden**
**BLOODLINE: Awakening**

He didn't know what any of it meant. He didn't know why his heart was pounding or why the air tasted like iron and copper and something else—something that made his teeth ache and his vision sharpen until he could see every crack in the stone walls, every grain of dust floating in the torchlight.

He only knew that nothing would ever be the same.

---

The hospital smelled like antiseptic and lost hope. Kael walked through corridors he'd memorized, past nurses who knew him by name, toward the room at the end of the hall where his sister lay suspended between life and death.

He hadn't taken off the headset right away. After the initial shock, after the strange notification about his class, he'd explored for a few minutes—a tutorial disguised as an abandoned castle, he realized. Basic movement, basic interaction, basic understanding of a world that seemed to blur the line between game and reality.

But now he was here, in the real world, holding Yuna's hand like he did every day.

"I found something today," he said softly. "Something weird. A headset. I don't know who sent it."

Her fingers were cool but not cold. He took that as a good sign. He took everything as a good sign. It was the only way to keep going.

"There's this game inside it. Eclipsis Online. Have you heard of it?" He smiled, though his eyes stayed dry. They'd stopped producing tears months ago. "Everyone's heard of it, right? The most popular VR game in the world. And here I am, the only person who's never played it."

He squeezed her hand gently.

"I think... I think there might be a way. To help you. The game has healing potions, magical items. Maybe something in there could—"

He stopped. It sounded insane. He knew how it sounded. But in the game, in that castle, he'd felt something. A connection. A possibility. A faint hope in a world that had stripped him of all hope.

"I'm going to try, Yuna. I'm going to play the game. I'm going to find a way to bring you back."

He stayed until visiting hours ended. He stayed until the nurses gently reminded him that he needed to take care of himself too. He stayed until the last possible moment.

And when he got home, he didn't hesitate.

He put the headset back on and logged in to his new life.

**[System Notification: Your journey in Eclipsis Online has begun. Your real-world integration will commence shortly. Welcome, Progenitor.]**

He didn't notice the notification about real-world integration. He was too busy looking at his new home—a world that would change him, challenge him, and eventually, tear down every wall between what was real and what was possible.`,
  wordCount: 1247,
  world: 'real',
  createdAt: new Date().toISOString(),
  publishedAt: new Date().toISOString(),
  summary: 'Kael receives a mysterious VR headset and discovers a forbidden class awaiting him.',
  characters: ['Kael', 'Yuna'],
  locations: ["Kael's Apartment", 'Hospital', 'Eclipsis Online - Tutorial Castle'],
};

const Reader = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { preferences } = useAppSelector((state) => state.user);
  useAppSelector((state) => state.ui);
  
  const [currentChapter, setCurrentChapter] = useState<Chapter>(baseChapter);
  const [chapters, setChapters] = useState<Chapter[]>([baseChapter]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(preferences.fontSize);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle scroll progress
  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
      
      // Save scroll position
      dispatch(updateScrollPosition(scrollTop));
    }
  }, [dispatch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mark chapter as read
  useEffect(() => {
    dispatch(addChapterToRead(currentChapter.id));
  }, [currentChapter.id, dispatch]);

  // Generate next chapter using AI Story Engine
  const generateNextChapter = useCallback(async () => {
    setIsGenerating(true);
    try {
      const previousChapter = chapters[chapters.length - 1];
      const targetWorld: 'real' | 'vr' = previousChapter.world === 'vr' ? 'real' : 'vr';
      
      // Create character objects for the story engine (partial stats, engine will handle defaults)
      const characters: Character[] = (previousChapter.characters || ['Kael']).map((name, index) => ({
        id: `char-${index}`,
        name,
        role: 'protagonist' as const,
        backstory: 'Character from the story',
        motivations: ['Survive', 'Save Yuna'],
        relationships: [],
        currentLocation: targetWorld === 'vr' ? 'tutorial-castle' : 'hospital',
        isAlive: true,
      })) as Character[];

      // Determine location based on world
      const location = targetWorld === 'vr' 
        ? { 
            id: 'tutorial-castle', 
            name: 'Tutorial Castle', 
            description: 'An abandoned castle in Eclipsis Online',
            world: 'vr' as const,
            region: 'Tutorial Zone',
            landmarks: []
          }
        : { 
            id: 'hospital', 
            name: 'Hospital', 
            description: 'The sterile corridors of the medical center',
            world: 'real' as const,
            region: 'City',
            landmarks: []
          };
      
      // Generate new chapter content using the story engine
      const result = await storyEngine.generateChapter({
        chapterNumber: chapters.length + 1,
        world: targetWorld,
        characters,
        location,
        previousChapter,
      });

      const generatedChapter = result.chapter;
      
      const newChapter: Chapter = {
        id: chapters.length + 1,
        chapterNumber: chapters.length + 1,
        title: generatedChapter.title || `Chapter ${chapters.length + 1}`,
        content: generatedChapter.content,
        wordCount: generatedChapter.content.split(/\s+/).length,
        world: generatedChapter.world || targetWorld,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        summary: generatedChapter.summary || '',
        characters: Array.isArray(generatedChapter.characters) && generatedChapter.characters.length > 0
          ? (generatedChapter.characters as any[]).map((c: { name: string }) => c.name)
          : previousChapter.characters,
        locations: Array.isArray(generatedChapter.locations) && generatedChapter.locations.length > 0
          ? (generatedChapter.locations as any[]).map((l: { name: string }) => l.name)
          : (previousChapter.locations || []),
      };

      setChapters(prev => [...prev, newChapter]);
      setCurrentChapter(newChapter);
      navigate(`/read/${newChapter.id}`);
      
      dispatch(addToast({ 
        message: `Chapter ${newChapter.id} generated! Quality: ${result.metrics.quality.toFixed(1)}`, 
        type: 'success',
        duration: 5000,
      }));
    } catch (error) {
      console.error('Failed to generate chapter:', error);
      dispatch(addToast({ message: 'Failed to generate chapter. Please try again.', type: 'error', duration: 5000 }));
    } finally {
      setIsGenerating(false);
    }
  }, [chapters, dispatch, navigate]);

  const handlePrevious = () => {
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex > 0) {
      const prevChapter = chapters[currentIndex - 1];
      setCurrentChapter(prevChapter);
      navigate(`/read/${prevChapter.id}`);
    }
  };

  const handleNext = async () => {
    const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
    if (currentIndex < chapters.length - 1) {
      // Next chapter already exists
      const nextChapter = chapters[currentIndex + 1];
      setCurrentChapter(nextChapter);
      navigate(`/read/${nextChapter.id}`);
    } else {
      // Need to generate a new chapter
      await generateNextChapter();
    }
  };

  const getWorldColor = () => {
    return currentChapter.world === 'vr' 
      ? 'from-purple-900/20 to-blue-900/20' 
      : 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900';
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((paragraph, index) => (
      <p 
        key={index} 
        className="mb-4 text-justify leading-relaxed"
        style={{ 
          fontSize: `${fontSize}px`,
          fontFamily: preferences.fontFamily === 'serif' ? 'Merriweather, serif' : 'Inter, sans-serif',
          lineHeight: preferences.lineHeight,
          letterSpacing: `${preferences.letterSpacing}px`,
        }}
      >
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getWorldColor()} transition-all duration-500`}>
      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-30">
        <div 
          className="h-full bg-primary-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* World Indicator */}
      <div className="fixed top-20 right-4 z-30">
        <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${
          currentChapter.world === 'vr' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}>
          <Globe size={14} />
          <span>{currentChapter.world === 'vr' ? 'VR World' : 'Real World'}</span>
        </div>
      </div>

      {/* Reading Settings Panel */}
      {showSettings && (
        <div className="fixed top-20 left-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72">
          <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Reading Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="10"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select 
                className="w-full p-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                defaultValue={preferences.fontFamily}
              >
                <option value="serif">Serif (Merriweather)</option>
                <option value="sans">Sans-serif (Inter)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">
                Reading Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 text-sm rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  Comfort
                </button>
                <button className="px-3 py-2 text-sm rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  Focus
                </button>
                <button className="px-3 py-2 text-sm rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  Night
                </button>
                <button className="px-3 py-2 text-sm rounded border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div 
        ref={contentRef}
        className="max-w-3xl mx-auto px-6 py-24 overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* Chapter Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            {currentChapter.title}
          </h1>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{currentChapter.wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>Chapter {currentChapter.id}</span>
          </div>
        </header>

        {/* Chapter Content */}
        <article className="reading-content prose prose-lg dark:prose-invert max-w-none">
          {renderContent(currentChapter.content)}
        </article>

        {/* Navigation */}
        <nav className="flex justify-between items-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handlePrevious}
            disabled={chapters.findIndex(c => c.id === currentChapter.id) <= 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-200"
          >
            <ChevronLeft size={20} />
            <span>Previous Chapter</span>
          </button>

          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Next Chapter</span>
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </nav>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white dark:bg-gray-800 rounded-full shadow-lg px-6 py-3 z-40">
        <button
          onClick={handlePrevious}
          disabled={chapters.findIndex(c => c.id === currentChapter.id) <= 0}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
          title="Previous Chapter"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="Chapter List"
        >
          <List size={24} />
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="Reading Settings"
        >
          <Settings size={24} />
        </button>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isBookmarked ? 'text-primary-600' : 'dark:text-white'
          }`}
          title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
        >
          {isBookmarked ? <BookmarkCheck size={24} /> : <Bookmark size={24} />}
        </button>

        <button
          onClick={() => setShowExportModal(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="Export Chapter"
        >
          <Download size={24} />
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
          title="Share Chapter"
        >
          <Share2 size={24} />
        </button>

        <button
          onClick={handleNext}
          disabled={isGenerating}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 dark:text-white"
          title={isGenerating ? "Generating..." : "Next Chapter"}
        >
          {isGenerating ? <RefreshCw size={24} className="animate-spin" /> : <ChevronRight size={24} />}
        </button>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        chapterId={currentChapter.id}
        chapterTitle={currentChapter.title}
        chapterContent={currentChapter.content}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        chapterId={currentChapter.id}
        chapterTitle={currentChapter.title}
      />
    </div>
  );
};

export default Reader;