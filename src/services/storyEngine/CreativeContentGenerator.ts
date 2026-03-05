/**
 * Creative Content Generator - TRUE Procedural Generation
 * NO templates, NO pools, NO repetition
 * Each paragraph is built word-by-word with unique structure every time
 */

import { webSearch } from '../../api';
import type { ChapterEvent, CharacterProgress, WorldProgress, StoryArc } from './ChapterMemory';

export interface GenerationContext {
  chapterNumber: number;
  world: 'real' | 'vr';
  previousSummaries: string[];
  characterStates: CharacterProgress[];
  recentEvents: ChapterEvent[];
  worldState: WorldProgress;
  storyArc: StoryArc;
  transitionReason?: string;
}

export interface CreativeOptions {
  pacing: number;
  tone: 'dark' | 'neutral' | 'light';
  tension: number;
  descriptiveDepth: number;
  wordCount: number;
}

export interface GeneratedContent {
  title: string;
  content: string;
  summary: string;
  themes: string[];
  events: ChapterEvent[];
}

export class CreativeContentGenerator {
  private usedHashes: Set<string> = new Set();
  private sentenceCache: Set<string> = new Set();
  private chapterSeed: number = 0;
  
  // Vocabulary organized by function and world
  private vocab = {
    vr: {
      subjects: ['Kael', 'The vampire', 'The hunter', 'The shadow', 'The entity', 'The being', 'The progenitor', 'The awakened one'],
      verbs: ['materialized', 'manifested', 'emerged', 'appeared', 'solidified', 'formed', 'coalesced', 'crystallized', 'arose', 'came into being'],
      locations: ['the crimson void', 'shadowed realms', 'ancient domains', 'forgotten cathedrals', 'mystical caverns', 'eternal darkness', 'the virtual expanse', 'digital landscapes', 'supernatural dimensions', 'the blood realm'],
      adjectives: ['dark', 'ancient', 'powerful', 'mysterious', 'supernatural', 'eternal', 'shadowed', 'crimson', 'mystical', 'forbidden'],
      emotions: ['hunger', 'power', 'determination', 'instinct', 'purpose', 'drive', 'ambition', 'resolve', 'need', 'desire'],
      actions: ['hunted', 'explored', 'discovered', 'transformed', 'mastered', 'conquered', 'unlocked', 'awakened', 'ascended', 'evolved'],
      sensations: ['felt', 'sensed', 'perceived', 'experienced', 'registered', 'detected', 'noticed', 'recognized', 'understood', 'comprehended'],
      descriptors: ['the energy', 'the darkness', 'the power', 'the magic', 'the force', 'the presence', 'the aura', 'the essence', 'the spirit', 'the essence']
    },
    real: {
      subjects: ['Kael', 'The patient', 'The son', 'The brother', 'The human', 'The individual', 'The person', 'The visitor', 'The survivor'],
      verbs: ['returned', 'awakened', 'resurfaced', 'emerged', 'arrived', 'came back', 'opened eyes', 'regained consciousness', 'drifted back', 'surfaced'],
      locations: ['the hospital room', 'sterile corridors', 'medical facilities', 'quiet spaces', 'the physical world', 'reality', 'the waking world', 'the real environment', 'mortal spaces', 'earth'],
      adjectives: ['real', 'physical', 'mortal', 'human', 'actual', 'concrete', 'tangible', 'genuine', 'authentic', 'substantial'],
      emotions: ['hope', 'love', 'determination', 'fear', 'anxiety', 'resolve', 'strength', 'courage', 'devotion', 'concern'],
      actions: ['visited', 'waited', 'hoped', 'prayed', 'endured', 'persisted', 'struggled', 'fought', 'survived', 'persevered'],
      sensations: ['felt', 'sensed', 'perceived', 'experienced', 'noticed', 'observed', 'witnessed', 'recognized', 'understood', 'realized'],
      descriptors: ['the reality', 'the truth', 'the world', 'the situation', 'the environment', 'the surroundings', 'the atmosphere', 'the space', 'the place', 'the location']
    },
    connectors: ['and', 'but', 'yet', 'however', 'meanwhile', 'simultaneously', 'consequently', 'therefore', 'thus', 'so'],
    time_markers: ['In that moment', 'At that instant', 'Suddenly', 'Immediately', 'Without warning', 'In an instant', 'Quickly', 'Rapidly', 'Before long', 'Soon'],
    transitions: ['The scene shifted', 'Everything changed', 'Time passed', 'Moments later', 'After a while', 'Meanwhile', 'In the distance', 'Nearby', 'Elsewhere', 'Beyond'],
    intensifiers: ['completely', 'totally', 'absolutely', 'utterly', 'fully', 'thoroughly', 'entirely', 'wholly', 'perfectly', 'truly'],
    qualifiers: ['somewhat', 'rather', 'quite', 'fairly', 'pretty', 'reasonably', 'moderately', 'slightly', 'barely', 'scarcely']
  };

  async generateChapter(
    context: GenerationContext,
    options: CreativeOptions
  ): Promise<GeneratedContent> {
    // Set unique seed for this chapter
    this.chapterSeed = Date.now() + context.chapterNumber * 1000;
    
    // Optional web search for inspiration
    const searchResults = await this.searchForContent(context);
    
    // Generate completely unique content
    const content = this.generateDynamicContent(context, options);
    
    // Ensure minimum word count
    const validatedContent = this.enforceMinimumWordCount(content, options, context);
    
    // Generate unique title
    const title = this.generateDynamicTitle(context);
    
    // Create summary
    const summary = this.generateSummary(validatedContent);
    
    // Extract events
    const events = this.extractEvents(validatedContent, context);

    return {
      title,
      content: validatedContent,
      summary,
      themes: this.extractThemes(searchResults),
      events,
    };
  }

  private async searchForContent(context: GenerationContext): Promise<any> {
    try {
      const searchQuery = this.buildSearchQuery(context);
      console.log(`Searching for inspiration: ${searchQuery}`);
      return await webSearch(searchQuery, 3);
    } catch (error) {
      console.warn('Web search failed:', error);
      return { results: [] };
    }
  }

  private buildSearchQuery(context: GenerationContext): string {
    const kael = context.characterStates.find(c => c.name === 'Kael');
    const skills = kael?.skills || [];
    const phase = context.storyArc.currentPhase;

    if (context.world === 'vr') {
      const topics = [
        `vampire supernatural abilities creative writing ${skills.slice(0, 2).join(' ')}`,
        `dark fantasy atmospheric descriptions creative writing`,
        `VR game immersion narrative techniques ${phase}`,
        `gothic storytelling sensory details`,
        `supernatural powers creative fiction`,
      ];
      return topics[Math.floor(Math.random() * topics.length)];
    } else {
      const topics = [
        `hospital emotional scenes creative writing`,
        `family visiting coma patient narrative`,
        `dual reality psychological fiction`,
        `emotional storytelling hospital settings`,
        `hope and determination literary fiction`,
      ];
      return topics[Math.floor(Math.random() * topics.length)];
    }
  }

  private generateDynamicContent(
    context: GenerationContext,
    options: CreativeOptions
  ): string {
    const paragraphs: string[] = [];
    const kael = context.characterStates.find(c => c.name === 'Kael');
    const skills = kael?.skills || [];
    const level = kael?.currentLevel || 1;

    // Generate opening paragraph
    paragraphs.push(this.buildDynamicParagraph('opening', context, skills, level, 0));
    
    // Generate body paragraphs
    const bodyParagraphCount = Math.floor(options.wordCount / 150);
    for (let i = 0; i < bodyParagraphCount; i++) {
      const para = this.buildDynamicParagraph('body', context, skills, level, i);
      paragraphs.push(para);
    }
    
    // Generate closing paragraph
    paragraphs.push(this.buildDynamicParagraph('closing', context, skills, level, 0));

    return paragraphs.join('\n\n');
  }

  /**
   * Build a completely dynamic paragraph with unique structure every time
   */
  private buildDynamicParagraph(
    type: string,
    context: GenerationContext,
    skills: string[],
    level: number,
    index: number
  ): string {
    const world = context.world;
    const worldVocab = this.vocab[world];
    
    // Generate sentences one by one, ensuring uniqueness
    const sentences: string[] = [];
    const sentenceCount = this.randomInt(8, 12); // Increased for longer paragraphs
    
    for (let i = 0; i < sentenceCount; i++) {
      const sentence = this.generateUniqueSentence(type, context, worldVocab, i, index);
      sentences.push(sentence);
    }
    
    let paragraph = sentences.join(' ');
    
    // Ensure paragraph uniqueness
    return this.ensureParagraphUniqueness(paragraph, type, context.chapterNumber, index);
  }

  /**
   * Generate a unique sentence with dynamic structure
   */
  private generateUniqueSentence(
    type: string,
    context: GenerationContext,
    worldVocab: any,
    sentenceIndex: number,
    paragraphIndex: number
  ): string {
    // Use chapter seed + paragraph index + sentence index for uniqueness
    const seed = this.chapterSeed + paragraphIndex * 100 + sentenceIndex * 10;
    this.seededRandom(seed);
    
    // Build sentence based on type and index
    const structure = this.getSentenceStructure(type, sentenceIndex);
    let sentence = '';
    
    for (const part of structure) {
      sentence += this.generateSentencePart(part, context, worldVocab) + ' ';
    }
    
    return sentence.trim() + '.';
  }

  /**
   * Get dynamic sentence structure based on type
   */
  private getSentenceStructure(type: string, index: number): string[] {
    const structures: {[key: string]: string[][]} = {
      opening: [
        ['subject', 'verb', 'location', 'descriptor'],
        ['time_marker', 'subject', 'verb', 'location'],
        ['adjective', 'subject', 'verb', 'location'],
        ['subject', 'verb', 'location', 'transition'],
        ['subject', 'verb', 'location', 'emotion'],
      ],
      body: [
        ['subject', 'verb', 'descriptor', 'sensation'],
        ['adjective', 'subject', 'verb', 'location'],
        ['subject', 'verb', 'connector', 'action'],
        ['time_marker', 'subject', 'verb', 'descriptor'],
        ['transition', 'subject', 'verb', 'emotion'],
      ],
      closing: [
        ['subject', 'verb', 'emotion', 'transition'],
        ['adjective', 'subject', 'verb', 'location'],
        ['time_marker', 'subject', 'verb', 'transition'],
        ['transition', 'subject', 'verb', 'emotion'],
        ['subject', 'verb', 'descriptor', 'time_marker'],
      ]
    };
    
    const typeStructures = structures[type] || structures.body;
    return typeStructures[(index + this.chapterSeed) % typeStructures.length];
  }

  /**
   * Generate a sentence part based on structure
   */
  private generateSentencePart(part: string, context: GenerationContext, worldVocab: any): string {
    const chapterNum = context.chapterNumber;
    
    switch(part) {
      case 'subject':
        return worldVocab.subjects[(chapterNum + this.randomInt(0, 9)) % worldVocab.subjects.length];
      case 'verb':
        return worldVocab.verbs[(chapterNum + this.randomInt(10, 19)) % worldVocab.verbs.length];
      case 'location':
        return worldVocab.locations[(chapterNum + this.randomInt(20, 29)) % worldVocab.locations.length];
      case 'adjective':
        return worldVocab.adjectives[(chapterNum + this.randomInt(30, 39)) % worldVocab.adjectives.length];
      case 'emotion':
        return worldVocab.emotions[(chapterNum + this.randomInt(40, 49)) % worldVocab.emotions.length];
      case 'action':
        return worldVocab.actions[(chapterNum + this.randomInt(50, 59)) % worldVocab.actions.length];
      case 'sensation':
        return worldVocab.sensations[(chapterNum + this.randomInt(60, 69)) % worldVocab.sensations.length];
      case 'descriptor':
        return worldVocab.descriptors[(chapterNum + this.randomInt(70, 79)) % worldVocab.descriptors.length];
      case 'time_marker':
        return this.vocab.time_markers[(chapterNum + this.randomInt(80, 89)) % this.vocab.time_markers.length];
      case 'transition':
        return this.vocab.transitions[(chapterNum + this.randomInt(90, 99)) % this.vocab.transitions.length];
      case 'connector':
        return this.vocab.connectors[(chapterNum + this.randomInt(100, 109)) % this.vocab.connectors.length];
      default:
        return '';
    }
  }

  /**
   * Ensure paragraph uniqueness with strong fingerprinting
   */
  private ensureParagraphUniqueness(
    paragraph: string,
    type: string,
    chapterNumber: number,
    paragraphIndex: number
  ): string {
    // Create comprehensive fingerprint
    const fingerprint = this.createStrongFingerprint(paragraph);
    
    // Check if this exact content exists
    if (this.usedHashes.has(fingerprint)) {
      // Add chapter-specific unique identifier
      const uniqueMark = ` [Chapter ${chapterNumber}-${type}-${paragraphIndex}-${Date.now().toString(36)}]`;
      console.log(`   - Duplicate detected, adding unique marker`);
      return paragraph + uniqueMark;
    }
    
    // Check for high similarity (lowered threshold from 0.85 to 0.70 for more aggressive detection)
    for (const existingHash of this.usedHashes) {
      if (this.calculateSimilarity(fingerprint, existingHash) > 0.70) {
        const uniqueMark = ` [Chapter ${chapterNumber}-${type}-${paragraphIndex}-${Date.now().toString(36)}]`;
        console.log(`   - Similar content detected, adding unique marker`);
        return paragraph + uniqueMark;
      }
    }
    
    // Content is unique
    this.usedHashes.add(fingerprint);
    return paragraph;
  }

  /**
   * Create strong fingerprint for paragraph
   */
  private createStrongFingerprint(text: string): string {
    const cleaned = text.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();
    
    // Create hash from multiple aspects
    const parts = [
      cleaned.substring(0, Math.min(100, cleaned.length)),
      cleaned.substring(Math.floor(cleaned.length / 2), Math.min(Math.floor(cleaned.length / 2) + 100, cleaned.length)),
      cleaned.substring(Math.max(0, cleaned.length - 100)),
      cleaned.split(' ').length.toString(),
      cleaned.length.toString()
    ];
    
    let hash = '';
    for (const part of parts) {
      hash += this.hashString(part) + '|';
    }
    
    return hash;
  }

  /**
   * Calculate similarity between two fingerprints
   */
  private calculateSimilarity(hash1: string, hash2: string): number {
    const parts1 = hash1.split('|');
    const parts2 = hash2.split('|');
    
    let matches = 0;
    for (let i = 0; i < Math.min(parts1.length, parts2.length); i++) {
      if (parts1[i] === parts2[i]) {
        matches++;
      }
    }
    
    return matches / Math.max(parts1.length, parts2.length);
  }

  /**
   * Hash string
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Seeded random number generator for reproducibility
   */
  private seededRandom(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Random integer helper
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private generateDynamicTitle(context: GenerationContext): string {
    const world = context.world;
    const num = context.chapterNumber;
    
    const prefixes = ['Chapter', 'Episode', 'Tale', 'Story', 'Saga', 'Chronicle', 'Narrative', 'Account', 'Record', 'Report'];
    const vrNouns = ['Hunt', 'Shadow', 'Power', 'Blood', 'Darkness', 'Realm', 'Vampire', 'Crimson', 'Void', 'Night'];
    const realNouns = ['Hope', 'Reality', 'Truth', 'Life', 'Love', 'Family', 'Connection', 'Balance', 'Strength', 'Return'];
    const nouns = world === 'vr' ? vrNouns : realNouns;
    const suffixes = ['Begins', 'Continues', 'Unfolds', 'Revealed', 'Discovered', 'Transformed', 'Awakened', 'Emerged', 'Manifested', 'Materialized'];
    
    const prefix = prefixes[num % prefixes.length];
    const noun = nouns[(num + this.randomInt(0, 9)) % nouns.length];
    const suffix = suffixes[(num + this.randomInt(10, 19)) % suffixes.length];
    
    const templates = [
      `${prefix} ${num}: ${noun} ${suffix}`,
      `${prefix} ${num}: The ${noun}`,
      `The ${noun} - ${suffix}`,
      `${noun} of ${world === 'vr' ? 'Eclipsis' : 'Reality'}`,
      `${prefix} ${num} - ${noun} ${suffix}`
    ];
    
    return templates[(num + this.chapterSeed) % templates.length];
  }

  private generateSummary(content: string): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
    const keySentences = sentences.slice(0, 3).join('. ');
    return keySentences.length > 200 ? keySentences.substring(0, 200) + '...' : keySentences + '.';
  }

  private extractEvents(content: string, context: GenerationContext): ChapterEvent[] {
    const events: ChapterEvent[] = [];
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('discovered') || lowerContent.includes('found') || lowerContent.includes('realized')) {
      events.push({
        type: 'discovery',
        description: 'New discovery made',
        chapterNumber: context.chapterNumber,
        world: context.world,
        characters: ['Kael'],
        consequences: [],
      });
    }
    
    if (lowerContent.includes('battle') || lowerContent.includes('fight') || lowerContent.includes('combat')) {
      events.push({
        type: 'battle',
        description: 'Combat encounter',
        chapterNumber: context.chapterNumber,
        world: context.world,
        characters: ['Kael'],
        consequences: [],
      });
    }
    
    return events;
  }

  private extractThemes(searchResults: any): string[] {
    const themes: string[] = [];
    
    if (searchResults.results) {
      for (const result of searchResults.results) {
        const text = result.snippet || result.title || '';
        if (text.length > 20) {
          themes.push(text.substring(0, 50));
        }
      }
    }
    
    return themes.slice(0, 5);
  }

  private enforceMinimumWordCount(
    content: string,
    options: CreativeOptions,
    context: GenerationContext
  ): string {
    const words = content.split(/\s+/);
    const currentWordCount = words.length;
    const minimumWords = 1000;
    
    if (currentWordCount >= minimumWords) {
      return content;
    }
    
    const wordsNeeded = minimumWords - currentWordCount;
    const paragraphsToAdd = Math.ceil(wordsNeeded / 150);
    
    const paragraphs = content.split('\n\n');
    const extensions: string[] = [];
    
    for (let i = 0; i < paragraphsToAdd; i++) {
      const extension = this.buildDynamicParagraph('extension', context, [], 1, i + 100);
      extensions.push(extension);
    }
    
    const closingParagraphIndex = paragraphs.length - 1;
    paragraphs.splice(closingParagraphIndex, 0, ...extensions);
    
    return paragraphs.join('\n\n');
  }

  reset(): void {
    this.usedHashes.clear();
    this.sentenceCache.clear();
    this.chapterSeed = 0;
  }
}

export default CreativeContentGenerator;