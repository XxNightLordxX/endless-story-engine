import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { addToast } from '../../store/slices/uiSlice';
import {
  X,
  BookOpen,
  Keyboard,
  Settings,
  BarChart3,
  Shield,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Moon,
  Sun,
  Type,
  AlignLeft,
  Bookmark,
  Play,
  Pause,
  Zap,
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
}

const helpSections: HelpSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: <Play className="w-5 h-5" />,
    articles: [
      {
        id: 'welcome',
        title: 'Welcome to Endless Story Engine',
        content: `Endless Story Engine is a fully deterministic, infinitely scalable narrative platform following Kael's journey across two merging worlds.

**Key Features:**
• Immersive reading experience with customizable interface
• 23 character stats to track progress
• Dual-world narrative (Real and VR worlds)
• Admin controls for story generation
• Dark mode support

**Quick Start:**
1. Click "Start Reading" to begin from Chapter 1
2. Use the sidebar to navigate between sections
3. Customize your reading experience in the Reader settings
4. Track your progress in the Dashboard`,
      },
      {
        id: 'navigation',
        title: 'Navigation Guide',
        content: `**Main Navigation:**
• **Home** - Landing page with story overview
• **Read Story** - Reading interface for chapters
• **Stats** - Character statistics dashboard
• **Dashboard** - Your personal reading dashboard
• **Admin Panel** - Story generation controls (admin only)

**Keyboard Shortcuts:**
• \`←\` Previous chapter
• \`→\` Next chapter
• \`↑\` Scroll up
• \`↓\` Scroll down
• \`Esc\` Close modals
• \`?\` Open help`,
      },
    ],
  },
  {
    id: 'reading',
    title: 'Reading Interface',
    icon: <BookOpen className="w-5 h-5" />,
    articles: [
      {
        id: 'reader-settings',
        title: 'Customizing Your Reading Experience',
        content: `**Text Customization:**
• **Font Size**: Adjust from 10px to 32px using the slider
• **Font Family**: Choose between Serif and Sans-serif
• **Line Height**: Adjust from 1.4 to 2.0 for comfortable reading
• **Letter Spacing**: Fine-tune from -0.5px to +0.5px

**Reading Modes:**
• **Comfort** - Balanced settings for extended reading
• **Focus** - Minimal distractions with optimized contrast
• **Night** - Dark theme with reduced blue light
• **Print** - Classic black on white for printing

**Progress Tracking:**
• Your scroll position is saved automatically
• Chapter progress is tracked in your dashboard
• Reading streaks are calculated daily`,
      },
      {
        id: 'bookmarks',
        title: 'Using Bookmarks',
        content: `**Creating Bookmarks:**
• Click the bookmark icon in the reader toolbar
• Bookmarks save your current position and chapter
• Add notes to your bookmarks for reference

**Managing Bookmarks:**
• View all bookmarks in your Dashboard
• Click a bookmark to jump to that position
• Delete bookmarks you no longer need`,
      },
    ],
  },
  {
    id: 'stats',
    title: 'Character Statistics',
    icon: <BarChart3 className="w-5 h-5" />,
    articles: [
      {
        id: 'stat-system',
        title: 'Understanding the 23 Stats',
        content: `**Core Stats:**
• **Level** - Current character level
• **Experience** - Points towards next level

**Primary Attributes:**
• Strength, Agility, Vitality, Intelligence, Wisdom, Perception, Charisma, Luck

**Vampire Traits:**
• Blood Essence, Vampire Level, Regeneration, Blood Control, Shadow Mastery, Nocturnal Power

**Combat Stats:**
• Attack, Defense, Critical Rate, Critical Damage

**Resource Stats:**
• Health, Mana, Stamina (each with current and max values)`,
      },
      {
        id: 'skills-abilities',
        title: 'Skills & Abilities',
        content: `**Skills:**
• Passive abilities that improve with use
• Categories: Combat, Magic, Passive, Vampire
• Level up skills by meeting requirements

**Abilities:**
• Active powers that can be triggered
• Have cooldowns and resource costs
• Unlock at specific character levels

**Managing Your Build:**
• View all unlocked skills and abilities
• Check requirements for locked content
• Plan your character progression`,
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin Panel',
    icon: <Shield className="w-5 h-5" />,
    articles: [
      {
        id: 'command-box',
        title: 'Using the Command Box',
        content: `**NLP Commands:**
The command box supports natural language processing for intuitive control.

**Example Commands:**
• "pause story generation"
• "set pacing to 7"
• "increase tension"
• "show recent errors"
• "generate chapter 15"

**Command History:**
• Use ↑/↓ arrows to navigate history
• Commands are saved for the session

**Autocomplete:**
• Start typing to see suggestions
• Tab to accept suggestion`,
      },
      {
        id: 'story-controls',
        title: 'Story Generation Controls',
        content: `**Generation Settings:**
• **Pause/Resume** - Control story generation
• **Speed** - Slow, Normal, or Fast generation
• **Pacing** - Narrative pace (1-10)
• **Tone** - Dark, Neutral, or Light atmosphere
• **Tension** - Story tension level (1-10)

**System Toggles:**
• **Diagnostics** - Enable system diagnostics
• **Stat System** - Enable/disable stat tracking
• **System Screen** - Show/hide game-like UI
• **Reality Integration** - Merge real and VR worlds

**Queue Management:**
• View chapters in generation queue
• Preview upcoming content
• Adjust chapter priority`,
      },
    ],
  },
  {
    id: 'keyboard',
    title: 'Keyboard Shortcuts',
    icon: <Keyboard className="w-5 h-5" />,
    articles: [
      {
        id: 'shortcuts',
        title: 'All Keyboard Shortcuts',
        content: `**Navigation:**
• \`←\` Previous chapter
• \`→\` Next chapter
• \`Home\` Go to first chapter
• \`End\` Go to latest chapter

**Reading:**
• \`↑\` Scroll up
• \`↓\` Scroll down
• \`Page Up\` Scroll up one page
• \`Page Down\` Scroll down one page
• \`Space\` Scroll down one page

**Interface:**
• \`Esc\` Close modals/panels
• \`?\` Open help documentation
• \`B\` Toggle bookmark
• \`T\` Toggle theme

**Admin:**
• \`Ctrl + K\` Open command box
• \`Ctrl + S\` Save current state`,
      },
    ],
  },
];

interface HelpDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpDocumentation = ({ isOpen, onClose }: HelpDocumentationProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [selectedArticle, setSelectedArticle] = useState<string>('welcome');
  const dispatch = useAppDispatch();

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const filteredSections = helpSections.map((section) => ({
    ...section,
    articles: section.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.articles.length > 0);

  const currentArticle = helpSections
    .flatMap((s) => s.articles)
    .find((a) => a.id === selectedArticle);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[80vh] mx-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Sidebar */}
        <div className="w-72 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          </div>

          {/* Sections */}
          <div className="p-2">
            {filteredSections.map((section) => (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {section.title}
                    </span>
                  </div>
                  {expandedSections.includes(section.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.includes(section.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section.articles.map((article) => (
                      <button
                        key={article.id}
                        onClick={() => setSelectedArticle(article.id)}
                        className={`block w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                          selectedArticle === article.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {article.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentArticle && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {currentArticle.title}
              </h1>
              <div className="prose dark:prose-invert max-w-none">
                {currentArticle.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith(':**')) {
                    return (
                      <h3
                        key={index}
                        className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3"
                      >
                        {paragraph.replace(/\*\*/g, '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('• ')) {
                    const items = paragraph.split('\n');
                    return (
                      <ul key={index} className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                        {items.map((item, i) => (
                          <li key={i}>{item.replace(/^• /, '')}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.includes('`')) {
                    return (
                      <p key={index} className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {paragraph.split('`').map((part, i) =>
                          i % 2 === 1 ? (
                            <code
                              key={i}
                              className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-blue-600 dark:text-blue-400"
                            >
                              {part}
                            </code>
                          ) : (
                            part
                          )
                        )}
                      </p>
                    );
                  }
                  return (
                    <p
                      key={index}
                      className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpDocumentation;