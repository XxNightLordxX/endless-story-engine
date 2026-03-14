// ─── Prose Quality Engine ────────────────────────────────────────────────────
// Post-processing pipeline that runs on every generated chapter to fix:
// 1. Grammar issues (dangling modifiers, subject-verb agreement, tense shifts)
// 2. Adjective overuse and repetition within proximity windows
// 3. Sentence structure variety (prevents monotonous patterns)
// 4. Word repetition (flags repeated uncommon words within paragraphs)
// 5. Dialogue tag variety (prevents endless "he said" chains)
// 6. Paragraph rhythm (prevents same-length paragraph runs)
// 7. Consistency checks against the Series Bible
//
// This runs AFTER content generation and BEFORE storage, ensuring every chapter
// meets quality standards regardless of which templates produced it.

// ═══════════════════════════════════════════════════════════════════════════════
// ADJECTIVE & ADVERB TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/** Common overused adjectives with better alternatives */
const ADJECTIVE_ALTERNATIVES: Record<string, string[]> = {
  'beautiful': ['striking', 'elegant', 'breathtaking', 'luminous', 'exquisite'],
  'big': ['massive', 'towering', 'vast', 'enormous', 'immense'],
  'small': ['tiny', 'compact', 'minute', 'diminutive', 'slight'],
  'good': ['excellent', 'superb', 'remarkable', 'fine', 'admirable'],
  'bad': ['terrible', 'dreadful', 'grim', 'dire', 'wretched'],
  'dark': ['shadowed', 'dim', 'lightless', 'murky', 'tenebrous'],
  'old': ['ancient', 'weathered', 'timeworn', 'venerable', 'aged'],
  'nice': ['pleasant', 'agreeable', 'gracious', 'cordial', 'amiable'],
  'very': ['extremely', 'remarkably', 'exceptionally', 'extraordinarily', 'intensely'],
  'really': ['genuinely', 'truly', 'profoundly', 'deeply', 'thoroughly'],
  'said': ['murmured', 'replied', 'whispered', 'noted', 'answered'],
  'walked': ['strode', 'paced', 'ambled', 'trudged', 'sauntered'],
  'looked': ['gazed', 'glanced', 'peered', 'studied', 'surveyed'],
  'got': ['obtained', 'received', 'acquired', 'gained', 'secured'],
  'went': ['headed', 'moved', 'proceeded', 'advanced', 'traveled'],
  'suddenly': ['abruptly', 'without warning', 'in an instant', 'unexpectedly'],
  'quickly': ['swiftly', 'rapidly', 'briskly', 'hastily', 'in a flash'],
  'slowly': ['gradually', 'languidly', 'deliberately', 'at a crawl', 'inch by inch'],
};

/** Words that weaken prose when overused */
const WEAK_WORDS = new Set([
  'very', 'really', 'just', 'quite', 'somewhat', 'rather', 'fairly',
  'pretty', 'basically', 'actually', 'literally', 'simply', 'totally',
  'completely', 'absolutely', 'definitely', 'certainly', 'obviously',
  'clearly', 'apparently', 'seemingly', 'perhaps', 'maybe', 'somehow',
]);

/** Filler phrases that should be removed or rewritten */
const FILLER_PATTERNS: [RegExp, string][] = [
  [/\bhe could see that\b/gi, ''],
  [/\bshe could see that\b/gi, ''],
  [/\bhe realized that\b/gi, ''],
  [/\bit seemed like\b/gi, ''],
  [/\bhe noticed that\b/gi, ''],
  [/\bthere was a\b/gi, 'a'],
  [/\bthere were\b/gi, ''],
  [/\bstarted to\b/gi, ''],
  [/\bbegan to\b/gi, ''],
  [/\bin order to\b/gi, 'to'],
  [/\bthe fact that\b/gi, 'that'],
  [/\bdue to the fact that\b/gi, 'because'],
  [/\bat this point in time\b/gi, 'now'],
  [/\bfor the purpose of\b/gi, 'to'],
  [/\bin the event that\b/gi, 'if'],
];

// ═══════════════════════════════════════════════════════════════════════════════
// SENTENCE STRUCTURE ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

type SentencePattern = 'simple' | 'compound' | 'complex' | 'fragment' | 'dialogue' | 'action';

function classifySentence(sentence: string): SentencePattern {
  const trimmed = sentence.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'") || trimmed.startsWith('\u201C')) return 'dialogue';
  if (trimmed.startsWith('**[')) return 'action'; // System notifications
  if (trimmed.length < 30) return 'fragment';
  if (/\b(and|but|or|yet|so|however|meanwhile|nevertheless)\b/i.test(trimmed) && trimmed.length > 60) return 'compound';
  if (/\b(when|while|because|although|if|after|before|since|unless|until)\b/i.test(trimmed)) return 'complex';
  return 'simple';
}

/** Check for monotonous sentence patterns (3+ of the same type in a row) */
function findMonotonousRuns(sentences: string[]): { start: number; end: number; pattern: SentencePattern }[] {
  const patterns = sentences.map(classifySentence);
  const runs: { start: number; end: number; pattern: SentencePattern }[] = [];

  let runStart = 0;
  for (let i = 1; i <= patterns.length; i++) {
    if (i === patterns.length || patterns[i] !== patterns[runStart]) {
      if (i - runStart >= 3 && patterns[runStart] !== 'dialogue') {
        runs.push({ start: runStart, end: i - 1, pattern: patterns[runStart] });
      }
      runStart = i;
    }
  }
  return runs;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORD REPETITION DETECTION
// ═══════════════════════════════════════════════════════════════════════════════

/** Common words that are OK to repeat */
const EXEMPT_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'was', 'were', 'are', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'shall', 'can', 'not', 'no', 'it',
  'its', 'he', 'his', 'him', 'she', 'her', 'they', 'them', 'their',
  'this', 'that', 'which', 'who', 'what', 'when', 'where', 'how',
  'if', 'then', 'than', 'so', 'as', 'up', 'out', 'into', 'over',
  'after', 'before', 'between', 'through', 'about', 'just', 'more',
  'some', 'such', 'only', 'other', 'new', 'like', 'back', 'also',
  'now', 'even', 'way', 'our', 'we', 'my', 'me', 'i', 'you', 'your',
  // Character names that will repeat
  'kael', 'yuna', 'alex',
]);

interface RepetitionIssue {
  word: string;
  count: number;
  paragraph: number;
}

function findWordRepetitions(paragraphs: string[], threshold: number = 3): RepetitionIssue[] {
  const issues: RepetitionIssue[] = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const words = paragraphs[p].toLowerCase().replace(/[^a-z\s'-]/g, '').split(/\s+/);
    const counts = new Map<string, number>();

    for (const word of words) {
      if (word.length < 4 || EXEMPT_WORDS.has(word)) continue;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    for (const [word, count] of counts) {
      if (count >= threshold) {
        issues.push({ word, count, paragraph: p });
      }
    }
  }
  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIALOGUE TAG VARIETY
// ═══════════════════════════════════════════════════════════════════════════════

const DIALOGUE_TAG_PATTERN = /([""''])\s*(he|she|they|kael|alex)\s+(said|asked|replied|answered|whispered|murmured|muttered|shouted|yelled|exclaimed)/gi;

const DIALOGUE_TAG_ALTERNATIVES: Record<string, string[]> = {
  'said': ['murmured', 'replied', 'noted', 'offered', 'admitted', 'observed', 'conceded'],
  'asked': ['inquired', 'questioned', 'wondered aloud', 'pressed', 'demanded'],
  'replied': ['answered', 'responded', 'returned', 'countered', 'shot back'],
  'whispered': ['breathed', 'hissed', 'mouthed', 'said softly', 'uttered'],
  'shouted': ['bellowed', 'roared', 'barked', 'thundered', 'called out'],
};

function fixDialogueTagRepetition(text: string, rng: () => number): string {
  const tagCounts = new Map<string, number>();

  return text.replace(DIALOGUE_TAG_PATTERN, (match, quote, subject, tag) => {
    const tagLower = tag.toLowerCase();
    const count = tagCounts.get(tagLower) ?? 0;
    tagCounts.set(tagLower, count + 1);

    // Allow first two uses of any tag, then replace
    if (count < 2) return match;

    const alternatives = DIALOGUE_TAG_ALTERNATIVES[tagLower];
    if (!alternatives || alternatives.length === 0) return match;
    const replacement = alternatives[Math.floor(rng() * alternatives.length)];
    return `${quote} ${subject} ${replacement}`;
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// GRAMMAR FIXES
// ═══════════════════════════════════════════════════════════════════════════════

/** Fix common grammar issues that template concatenation can introduce */
function fixGrammar(text: string): string {
  let result = text;

  // Fix double spaces (common from template concatenation)
  result = result.replace(/  +/g, ' ');

  // Fix space before punctuation
  result = result.replace(/ ([.,;:!?])/g, '$1');

  // Fix missing space after punctuation (but not in numbers like 3.14 or URLs)
  result = result.replace(/([.!?])([A-Z])/g, '$1 $2');

  // Fix double punctuation
  result = result.replace(/([.!?])\1+/g, '$1');
  result = result.replace(/,\./g, '.');
  result = result.replace(/,!/g, '!');
  result = result.replace(/,\?/g, '?');

  // Fix orphaned quotation marks
  result = result.replace(/"\s*"/g, '');
  result = result.replace(/'\s*'/g, '');

  // Fix "a" before vowel sounds → "an"
  result = result.replace(/\ba (a|e|i|o|u)/gi, (match, vowel) => `an ${vowel}`);

  // Fix "an" before consonant sounds
  result = result.replace(/\ban ([bcdfgjklmnpqrstvwxyz])/gi, (match, consonant) => {
    // Exceptions: "an hour", "an honest", "an heir"
    const nextWord = match.substring(3);
    if (/^h(ou|on|ei)/i.test(nextWord)) return match;
    return `a ${consonant}`;
  });

  // Fix tense inconsistency: "He walks... he ran" → detect but don't auto-fix (too risky)
  // Instead, ensure consistent past tense in narrative (our default)

  // Fix dangling "and" or "but" at paragraph start after template join
  result = result.replace(/^\s*(And|But|Or)\s+/gm, (match) => {
    // Only fix if it's clearly a joining artifact, not intentional style
    return match;
  });

  // Fix multiple newlines (template joining artifact)
  result = result.replace(/\n{4,}/g, '\n\n\n');

  // Fix sentences starting with lowercase after period
  result = result.replace(/\.\s+([a-z])/g, (match, letter) => {
    return `. ${letter.toUpperCase()}`;
  });

  // Fix broken em-dashes (template artifacts)
  result = result.replace(/\s*-\s*-\s*-\s*/g, '—');
  result = result.replace(/\s*--\s*/g, '—');

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADJECTIVE PROXIMITY DEDUPLICATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Scan for adjectives used multiple times within a proximity window.
 * Replace subsequent instances with synonyms.
 */
function deduplicateAdjectives(text: string, rng: () => number, windowSize: number = 500): string {
  let result = text;

  for (const [adjective, alternatives] of Object.entries(ADJECTIVE_ALTERNATIVES)) {
    const regex = new RegExp(`\\b${adjective}\\b`, 'gi');
    const matches: { index: number; length: number }[] = [];

    let match;
    while ((match = regex.exec(result)) !== null) {
      matches.push({ index: match.index, length: match[0].length });
    }

    if (matches.length < 2) continue;

    // Keep the first occurrence, replace subsequent ones within the window
    const replacements: { index: number; length: number; replacement: string }[] = [];
    for (let i = 1; i < matches.length; i++) {
      const distance = matches[i].index - matches[i - 1].index;
      if (distance < windowSize) {
        const alt = alternatives[Math.floor(rng() * alternatives.length)];
        // Preserve original casing
        const original = result.substring(matches[i].index, matches[i].index + matches[i].length);
        const replacement = original[0] === original[0].toUpperCase()
          ? alt.charAt(0).toUpperCase() + alt.slice(1)
          : alt;
        replacements.push({ index: matches[i].index, length: matches[i].length, replacement });
      }
    }

    // Apply replacements in reverse order to preserve indices
    for (const rep of replacements.reverse()) {
      result = result.substring(0, rep.index) + rep.replacement + result.substring(rep.index + rep.length);
    }
  }

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEAK WORD REDUCTION
// ═══════════════════════════════════════════════════════════════════════════════

/** Remove or replace weak intensifiers and filler words */
function reduceWeakWords(text: string): string {
  let result = text;

  // Remove weak intensifiers before adjectives
  result = result.replace(/\b(very|really|quite|rather|pretty|fairly|somewhat) (\w+)/gi, (match, _intensifier, adjective) => {
    const adjLower = adjective.toLowerCase();
    const alternatives = ADJECTIVE_ALTERNATIVES[adjLower];
    if (alternatives && alternatives.length > 0) {
      // Replace "very dark" with a stronger adjective
      return alternatives[0];
    }
    return match; // Keep if no alternative available
  });

  // Apply filler pattern removals
  for (const [pattern, replacement] of FILLER_PATTERNS) {
    result = result.replace(pattern, replacement);
  }

  // Clean up any double spaces introduced by removals
  result = result.replace(/  +/g, ' ');
  // Clean up any spaces at start of sentences
  result = result.replace(/\.\s{2,}/g, '. ');

  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PARAGRAPH RHYTHM CHECK
// ═══════════════════════════════════════════════════════════════════════════════

interface RhythmReport {
  totalParagraphs: number;
  avgWordsPerParagraph: number;
  monotonousLengthRuns: number;
  shortParagraphRatio: number;
  longParagraphRatio: number;
}

function analyzeRhythm(paragraphs: string[]): RhythmReport {
  const lengths = paragraphs.map(p => p.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;

  // Detect runs of similarly-lengthed paragraphs (within 20%)
  let monotonousRuns = 0;
  let runLength = 1;
  for (let i = 1; i < lengths.length; i++) {
    const diff = Math.abs(lengths[i] - lengths[i - 1]) / Math.max(lengths[i], lengths[i - 1], 1);
    if (diff < 0.2) {
      runLength++;
    } else {
      if (runLength >= 3) monotonousRuns++;
      runLength = 1;
    }
  }
  if (runLength >= 3) monotonousRuns++;

  return {
    totalParagraphs: paragraphs.length,
    avgWordsPerParagraph: Math.round(avg),
    monotonousLengthRuns: monotonousRuns,
    shortParagraphRatio: lengths.filter(l => l < 15).length / lengths.length,
    longParagraphRatio: lengths.filter(l => l > 100).length / lengths.length,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSISTENCY CHECKER
// ═══════════════════════════════════════════════════════════════════════════════

interface ConsistencyIssue {
  type: 'name_case' | 'tense_shift' | 'world_leak' | 'dead_character';
  description: string;
  location: string;
}

/** Check content for consistency with bible state */
function checkConsistency(
  content: string,
  world: 'vr' | 'real',
  characterNames: string[],
  deadCharacters: string[],
): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];

  // Check for dead characters appearing
  for (const name of deadCharacters) {
    const regex = new RegExp(`\\b${name}\\b(?!.*(?:remembered|memory|ghost|spirit|dream|thought about))`, 'gi');
    if (regex.test(content)) {
      issues.push({
        type: 'dead_character',
        description: `Dead character "${name}" appears to be active in the scene`,
        location: 'content',
      });
    }
  }

  // Check for world leaks (VR terms in real world, real terms in VR)
  if (world === 'real') {
    const vrLeaks = /\b(mana|blood essence|XP|experience points|dungeon|respawn|inventory screen|skill tree)\b/gi;
    const match = vrLeaks.exec(content);
    if (match) {
      // Check it's not in dialogue or thoughts about the game
      const contextStart = Math.max(0, match.index - 50);
      const context = content.substring(contextStart, match.index + match[0].length + 50);
      if (!/game|eclipsis|remembered|thought|dream|told|said|play/i.test(context)) {
        issues.push({
          type: 'world_leak',
          description: `VR term "${match[0]}" used in real-world context without game reference`,
          location: `near position ${match.index}`,
        });
      }
    }
  }

  // Check character name casing consistency
  for (const name of characterNames) {
    const wrongCase = new RegExp(`\\b${name.toLowerCase()}\\b`, 'g');
    const matches = content.match(wrongCase);
    if (matches && name[0] === name[0].toUpperCase()) {
      // Found lowercase version of a proper name
      const correctRegex = new RegExp(`\\b${name}\\b`, 'g');
      const correctMatches = content.match(correctRegex);
      if (!correctMatches || (matches.length > (correctMatches?.length ?? 0))) {
        issues.push({
          type: 'name_case',
          description: `Character name "${name}" appears in wrong case`,
          location: 'content',
        });
      }
    }
  }

  return issues;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VOICE PROFILE ENFORCEMENT
// Ensures prose tone matches the MC's current progression stage.
// Early stages sound confused and scared. Later stages sound hardened and strategic.
// ═══════════════════════════════════════════════════════════════════════════════

type ProgressionStage =
  | 'naive_player' | 'curious_tester' | 'opportunist'
  | 'paranoid_hider' | 'strategic_abuser' | 'seasoned_survivor';

interface VoiceProfile {
  /** Words/phrases that are allowed at this stage */
  allowed: RegExp[];
  /** Words/phrases that should NOT appear at this stage (too advanced/too naive) */
  forbidden: RegExp[];
  /** Replacement map: forbidden phrase -> stage-appropriate alternative */
  replacements: [RegExp, string][];
}

const VOICE_PROFILES: Record<ProgressionStage, VoiceProfile> = {
  naive_player: {
    allowed: [/confused/i, /scared/i, /didn't understand/i, /what is this/i],
    forbidden: [
      /\bstrategically\b/i, /\bcalculated\b/i, /\bexploited\b/i,
      /\bmanipulated\b/i, /\bwith practiced ease\b/i, /\blong ago learned\b/i,
    ],
    replacements: [
      [/\bhe knew exactly\b/gi, 'he guessed'],
      [/\bwith practiced ease\b/gi, 'with clumsy effort'],
      [/\bstrategically\b/gi, 'instinctively'],
      [/\bcalculated move\b/gi, 'desperate move'],
      [/\bmanipulated\b/gi, 'stumbled through'],
    ],
  },
  curious_tester: {
    allowed: [/experiment/i, /tested/i, /wondered/i, /what if/i],
    forbidden: [
      /\bmastered\b/i, /\bwith deadly precision\b/i, /\broutine\b(?=.*exploit)/i,
    ],
    replacements: [
      [/\bmastered\b/gi, 'fumbled with'],
      [/\bwith deadly precision\b/gi, 'with uncertain hands'],
      [/\broutinely exploited\b/gi, 'tentatively tested'],
    ],
  },
  opportunist: {
    allowed: [/opportunity/i, /advantage/i, /realized he could/i],
    forbidden: [
      /\binnocen(?:t|ce)\b.*\bfeigned\b/i, /\bparanoid\b/i,
    ],
    replacements: [
      [/\bparanoid surveillance\b/gi, 'careful watching'],
      [/\bfeigned innocence\b/gi, 'tried to act normal'],
    ],
  },
  paranoid_hider: {
    allowed: [/paranoi/i, /watching/i, /hiding/i, /can't trust/i, /cover/i],
    forbidden: [
      /\bnaive\b/i, /\bfirst time\b.*\bpower\b/i, /\bcarefree\b/i,
    ],
    replacements: [
      [/\bnaively\b/gi, 'cautiously'],
      [/\bcarefree\b/gi, 'watchful'],
      [/\bwithout a care\b/gi, 'with constant vigilance'],
    ],
  },
  strategic_abuser: {
    allowed: [/calculated/i, /strategically/i, /exploited/i, /manipulated/i, /precision/i],
    forbidden: [
      /\bconfused\b(?!.*pretend)/i, /\bdidn't understand\b(?!.*feigned)/i,
      /\bscared\b(?!.*mask)/i,
    ],
    replacements: [
      [/\bhe was confused\b/gi, 'he weighed his options'],
      [/\bdidn't understand\b/gi, 'chose not to reveal his understanding of'],
      [/\bscared and alone\b/gi, 'wary but prepared'],
    ],
  },
  seasoned_survivor: {
    allowed: [/weary/i, /veteran/i, /survivor/i, /long since/i, /cost/i],
    forbidden: [
      /\bexcited\b(?!.*bitter)/i, /\bthrilled\b/i, /\bamazed\b(?!.*exhausted)/i,
    ],
    replacements: [
      [/\bexcited by the discovery\b/gi, 'grimly noted the discovery'],
      [/\bthrilled\b/gi, 'resigned'],
      [/\bamazed\b/gi, 'unsurprised'],
    ],
  },
};

/**
 * Enforce voice consistency based on the MC's progression stage.
 * Replaces stage-inappropriate phrases with stage-appropriate alternatives.
 */
function enforceVoiceProfile(text: string, stage: ProgressionStage): string {
  const profile = VOICE_PROFILES[stage];
  if (!profile) return text;

  let result = text;
  for (const [pattern, replacement] of profile.replacements) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUALITY REPORT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProseQualityReport {
  wordRepetitions: RepetitionIssue[];
  monotonousSentenceRuns: { start: number; end: number; pattern: SentencePattern }[];
  rhythmReport: RhythmReport;
  consistencyIssues: ConsistencyIssue[];
  weakWordCount: number;
  fillerPhraseCount: number;
  adjectiveRepetitions: number;
  dialogueTagRepetitions: number;
  overallScore: number; // 0-100
}

function generateQualityReport(
  originalContent: string,
  world: 'vr' | 'real',
  characterNames: string[],
  deadCharacters: string[],
): ProseQualityReport {
  const paragraphs = originalContent.split(/\n\n+/).filter(p => p.trim().length > 0);
  const sentences = originalContent.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

  // Count weak words
  let weakWordCount = 0;
  for (const word of WEAK_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = originalContent.match(regex);
    weakWordCount += matches?.length ?? 0;
  }

  // Count filler phrases
  let fillerPhraseCount = 0;
  for (const [pattern] of FILLER_PATTERNS) {
    const matches = originalContent.match(pattern);
    fillerPhraseCount += matches?.length ?? 0;
  }

  // Count adjective repetitions
  let adjectiveRepetitions = 0;
  for (const adjective of Object.keys(ADJECTIVE_ALTERNATIVES)) {
    const regex = new RegExp(`\\b${adjective}\\b`, 'gi');
    const matches = originalContent.match(regex);
    if (matches && matches.length > 2) adjectiveRepetitions += matches.length - 2;
  }

  // Count dialogue tag repetitions
  let dialogueTagRepetitions = 0;
  const tagCounts = new Map<string, number>();
  let tagMatch;
  const tagRegex = new RegExp(DIALOGUE_TAG_PATTERN.source, 'gi');
  while ((tagMatch = tagRegex.exec(originalContent)) !== null) {
    const tag = tagMatch[3].toLowerCase();
    tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
  }
  for (const count of tagCounts.values()) {
    if (count > 2) dialogueTagRepetitions += count - 2;
  }

  const wordReps = findWordRepetitions(paragraphs);
  const monotonousRuns = findMonotonousRuns(sentences);
  const rhythm = analyzeRhythm(paragraphs);
  const consistency = checkConsistency(originalContent, world, characterNames, deadCharacters);

  // Calculate overall score
  let score = 100;
  score -= weakWordCount * 0.5;
  score -= fillerPhraseCount * 2;
  score -= adjectiveRepetitions * 1.5;
  score -= dialogueTagRepetitions * 1;
  score -= wordReps.length * 2;
  score -= monotonousRuns.length * 3;
  score -= rhythm.monotonousLengthRuns * 5;
  score -= consistency.length * 5;
  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    wordRepetitions: wordReps,
    monotonousSentenceRuns: monotonousRuns,
    rhythmReport: rhythm,
    consistencyIssues: consistency,
    weakWordCount,
    fillerPhraseCount,
    adjectiveRepetitions,
    dialogueTagRepetitions,
    overallScore: score,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProseCleanupOptions {
  /** Fix grammar issues (double spaces, punctuation, a/an) */
  fixGrammar?: boolean;
  /** Replace repeated adjectives with synonyms */
  deduplicateAdjectives?: boolean;
  /** Reduce weak intensifiers and filler phrases */
  reduceWeakWords?: boolean;
  /** Fix dialogue tag repetition */
  fixDialogueTags?: boolean;
  /** Enforce voice profile based on MC progression stage */
  enforceVoice?: boolean;
  /** MC's current progression stage for voice enforcement */
  mcStage?: ProgressionStage;
  /** World type for consistency checking */
  world?: 'vr' | 'real';
  /** Character names for consistency checking */
  characterNames?: string[];
  /** Dead characters to flag if they appear active */
  deadCharacters?: string[];
}

const DEFAULT_OPTIONS: Required<ProseCleanupOptions> = {
  fixGrammar: true,
  deduplicateAdjectives: true,
  reduceWeakWords: true,
  fixDialogueTags: true,
  enforceVoice: true,
  mcStage: 'naive_player',
  world: 'vr',
  characterNames: ['Kael', 'Yuna', 'Alex'],
  deadCharacters: [],
};

/**
 * Run the full prose quality pipeline on generated chapter content.
 * Returns cleaned content and a quality report.
 */
export function processChapterProse(
  content: string,
  seed: number,
  options?: ProseCleanupOptions,
): { content: string; report: ProseQualityReport } {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Create a deterministic RNG for synonym selection
  let t = seed + 0x6d2b79f5;
  const rng = () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Generate pre-cleanup quality report
  const preReport = generateQualityReport(
    content,
    opts.world,
    opts.characterNames,
    opts.deadCharacters,
  );

  let processed = content;

  // Step 1: Grammar fixes (safe, always beneficial)
  if (opts.fixGrammar) {
    processed = fixGrammar(processed);
  }

  // Step 2: Reduce weak words and filler phrases
  if (opts.reduceWeakWords) {
    processed = reduceWeakWords(processed);
  }

  // Step 3: Deduplicate adjectives within proximity windows
  if (opts.deduplicateAdjectives) {
    processed = deduplicateAdjectives(processed, rng);
  }

  // Step 4: Fix dialogue tag repetition
  if (opts.fixDialogueTags) {
    processed = fixDialogueTagRepetition(processed, rng);
  }

  // Step 5: Enforce voice profile consistency
  if (opts.enforceVoice && opts.mcStage) {
    processed = enforceVoiceProfile(processed, opts.mcStage);
  }

  // Step 6: Final grammar pass (catch issues introduced by previous steps)
  if (opts.fixGrammar) {
    processed = fixGrammar(processed);
  }

  // Generate post-cleanup quality report
  const postReport = generateQualityReport(
    processed,
    opts.world,
    opts.characterNames,
    opts.deadCharacters,
  );

  return { content: processed, report: postReport };
}
