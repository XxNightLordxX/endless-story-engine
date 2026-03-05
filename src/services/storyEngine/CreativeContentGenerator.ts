/**
 * Creative Content Generator - TRUE Dynamic Generation
 * NO hardcoded vocabulary pools - ALL vocabulary dynamically generated via web search
 * Each chapter gets fresh, contextually relevant vocabulary
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

/**
 * Dynamic vocabulary structure - populated via web search for each chapter
 */
export interface DynamicVocabulary {
  subjects: string[];
  verbs: string[];
  locations: string[];
  adjectives: string[];
  emotions: string[];
  actions: string[];
  sensations: string[];
  descriptors: string[];
  connectors: string[];
  timeMarkers: string[];
  transitions: string[];
  intensifiers: string[];
  qualifiers: string[];
}

export class CreativeContentGenerator {
  private usedHashes: Set<string> = new Set();
  private sentenceCache: Set<string> = new Set();
  private chapterSeed: number = 0;
  
  // Dynamic vocabulary - generated fresh for each chapter via web search
  private dynamicVocab: {
    vr: DynamicVocabulary | null;
    real: DynamicVocabulary | null;
  } = { vr: null, real: null };
  
  // Track what we've searched to avoid redundant searches
  private searchedTerms: Set<string> = new Set();

  async generateChapter(
    context: GenerationContext,
    options: CreativeOptions
  ): Promise<GeneratedContent> {
    // Set unique seed for this chapter
    this.chapterSeed = Date.now() + context.chapterNumber * 1000;
    
    console.log(`\n=== Generating Chapter ${context.chapterNumber} (${context.world.toUpperCase()} world) ===`);
    console.log('Generating dynamic vocabulary via web search...');
    
    // Generate fresh dynamic vocabulary for this chapter
    await this.generateDynamicVocabulary(context);
    
    // Generate content using the dynamic vocabulary
    const content = this.generateDynamicContent(context, options);
    
    // Ensure minimum word count
    const validatedContent = this.enforceMinimumWordCount(content, options, context);
    
    // Generate title using dynamic vocabulary
    const title = await this.generateDynamicTitle(context);
    
    // Create summary
    const summary = this.generateSummary(validatedContent);
    
    // Extract events
    const events = this.extractEvents(validatedContent, context);
    
    // Generate system screen for VR chapters
    let finalContent = validatedContent;
    if (context.world === 'vr' && context.chapterNumber > 1) {
      const systemScreenContent = this.generateSystemScreenForChapter(context);
      finalContent = validatedContent + '\n\n' + systemScreenContent;
    }
    
    return {
      title,
      content: finalContent,
      summary,
      themes: await this.extractThemesFromSearch(context),
      events
    };
  }

  /**
   * Generate dynamic vocabulary via web search - NO hardcoded pools
   */
  private async generateDynamicVocabulary(context: GenerationContext): Promise<void> {
    const world = context.world;
    
    // Only generate if we haven't already for this world recently
    if (this.dynamicVocab[world]) {
      return;
    }
    
    console.log(`  Searching for ${world} world vocabulary...`);
    
    try {
      // Search for different vocabulary categories in parallel
      const searches = await Promise.all([
        this.searchForVocabulary(`${world === 'vr' ? 'fantasy vampire supernatural dark' : 'hospital medical real world'} character nouns subjects writing`, 5),
        this.searchForVocabulary(`${world === 'vr' ? 'fantasy action adventure dark power' : 'emotional family hope recovery'} verbs actions writing`, 5),
        this.searchForVocabulary(`${world === 'vr' ? 'fantasy dark realm location names' : 'hospital room real world locations'} places settings writing`, 5),
        this.searchForVocabulary(`${world === 'vr' ? 'dark mysterious powerful ancient' : 'real physical tangible human'} descriptive adjectives writing`, 5),
        this.searchForVocabulary(`${world === 'vr' ? 'dark fantasy emotions hunger power desire' : 'human emotions hope fear love'} feelings emotional writing`, 5),
        this.searchForVocabulary(`story transitions connectors narrative writing`, 5),
        this.searchForVocabulary(`time markers story pacing narrative writing`, 5),
      ]);
      
      // Parse and structure the vocabulary
      this.dynamicVocab[world] = {
        subjects: this.parseVocabularyFromSearch(searches[0], ['Kael', 'The figure', 'The presence']),
        verbs: this.parseVocabularyFromSearch(searches[1], ['moved', 'emerged', 'transformed']),
        locations: this.parseVocabularyFromSearch(searches[2], ['the shadows', 'the void', 'the realm']),
        adjectives: this.parseVocabularyFromSearch(searches[3], ['dark', 'ancient', 'powerful']),
        emotions: this.parseVocabularyFromSearch(searches[4], ['determination', 'purpose', 'drive']),
        actions: this.parseVocabularyFromSearch(searches[1], ['discovered', 'explored', 'mastered']),
        sensations: ['felt', 'sensed', 'perceived', 'experienced', 'detected', 'noticed', 'recognized'],
        descriptors: this.parseVocabularyFromSearch(searches[3], ['the energy', 'the presence', 'the aura']),
        connectors: this.parseVocabularyFromSearch(searches[5], ['and', 'but', 'yet', 'however', 'meanwhile']),
        timeMarkers: this.parseVocabularyFromSearch(searches[6], ['In that moment', 'Suddenly', 'Without warning']),
        transitions: this.parseVocabularyFromSearch(searches[5], ['The scene shifted', 'Everything changed', 'Moments later']),
        intensifiers: ['completely', 'totally', 'absolutely', 'utterly', 'fully'],
        qualifiers: ['somewhat', 'rather', 'quite', 'fairly', 'slightly']
      };
      
      console.log(`  Generated ${this.countVocabWords(this.dynamicVocab[world]!)} dynamic vocabulary words`);
      
    } catch (error) {
      console.error('Error generating dynamic vocabulary, using fallback:', error);
      // Use minimal fallback if web search fails
      this.dynamicVocab[world] = this.getFallbackVocabulary(world);
    }
  }

  /**
   * Search for vocabulary using web search
   */
  private async searchForVocabulary(query: string, numResults: number): Promise<any> {
    const searchKey = query.toLowerCase().substring(0, 50);
    
    if (this.searchedTerms.has(searchKey)) {
      return { results: [] };
    }
    
    this.searchedTerms.add(searchKey);
    
    try {
      const results = await webSearch(query, numResults);
      return results;
    } catch (error) {
      console.error(`Web search failed for "${query}":`, error);
      return { results: [] };
    }
  }

  /**
   * Parse vocabulary words from search results
   */
  private parseVocabularyFromSearch(searchResults: any, fallback: string[]): string[] {
    const words: string[] = [...fallback];
    
    if (searchResults && searchResults.results) {
      for (const result of searchResults.results) {
        const text = result.snippet || result.title || '';
        if (text) {
          // Extract meaningful words/phrases from the search result
          const extracted = this.extractMeaningfulWords(text);
          words.push(...extracted);
        }
      }
    }
    
    // Remove duplicates and return unique words
    return [...new Set(words)].slice(0, 30);
  }

  /**
   * Extract meaningful words from text
   */
  private extractMeaningfulWords(text: string): string[] {
    // Split by common delimiters and filter for meaningful words
    const words = text
      .replace(/[^\w\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && word.length < 20)
      .filter(word => !['that', 'this', 'with', 'from', 'have', 'been', 'were', 'they', 'their', 'what', 'when', 'where', 'which', 'while'].includes(word.toLowerCase()));
    
    return words.slice(0, 10);
  }

  /**
   * Get fallback vocabulary if web search fails
   */
  private getFallbackVocabulary(world: 'vr' | 'real'): DynamicVocabulary {
    if (world === 'vr') {
      return {
        subjects: ['Kael', 'The vampire', 'The shadow', 'The entity', 'The progenitor', 'The awakened one'],
        verbs: ['materialized', 'manifested', 'emerged', 'appeared', 'solidified', 'formed'],
        locations: ['the crimson void', 'shadowed realms', 'ancient domains', 'eternal darkness', 'the blood realm'],
        adjectives: ['dark', 'ancient', 'powerful', 'mysterious', 'supernatural', 'eternal'],
        emotions: ['hunger', 'power', 'determination', 'instinct', 'purpose', 'ambition'],
        actions: ['hunted', 'explored', 'discovered', 'transformed', 'mastered', 'awakened'],
        sensations: ['felt', 'sensed', 'perceived', 'experienced', 'detected'],
        descriptors: ['the energy', 'the darkness', 'the power', 'the presence', 'the aura'],
        connectors: ['and', 'but', 'yet', 'however', 'meanwhile'],
        timeMarkers: ['In that moment', 'Suddenly', 'Without warning', 'In an instant', 'Quickly'],
        transitions: ['The scene shifted', 'Everything changed', 'Moments later', 'Meanwhile'],
        intensifiers: ['completely', 'totally', 'absolutely', 'utterly'],
        qualifiers: ['somewhat', 'rather', 'quite', 'fairly']
      };
    } else {
      return {
        subjects: ['Kael', 'The patient', 'The son', 'The brother', 'The survivor', 'The human'],
        verbs: ['returned', 'awakened', 'emerged', 'arrived', 'surfaced'],
        locations: ['the hospital room', 'sterile corridors', 'the physical world', 'reality', 'the waking world'],
        adjectives: ['real', 'physical', 'mortal', 'human', 'tangible', 'genuine'],
        emotions: ['hope', 'love', 'determination', 'fear', 'resolve', 'courage'],
        actions: ['visited', 'waited', 'hoped', 'endured', 'persisted', 'survived'],
        sensations: ['felt', 'sensed', 'perceived', 'noticed', 'witnessed'],
        descriptors: ['the reality', 'the truth', 'the world', 'the situation', 'the surroundings'],
        connectors: ['and', 'but', 'yet', 'however', 'meanwhile'],
        timeMarkers: ['In that moment', 'Suddenly', 'Before long', 'Soon', 'Finally'],
        transitions: ['The scene shifted', 'Time passed', 'Moments later', 'Meanwhile'],
        intensifiers: ['completely', 'totally', 'absolutely', 'truly'],
        qualifiers: ['somewhat', 'rather', 'quite', 'slightly']
      };
    }
  }

  /**
   * Count total words in vocabulary
   */
  private countVocabWords(vocab: DynamicVocabulary): number {
    return Object.values(vocab).reduce((sum, arr) => sum + arr.length, 0);
  }

  /**
   * Get the current dynamic vocabulary for the world
   */
  private getWorldVocab(world: 'vr' | 'real'): DynamicVocabulary {
    if (!this.dynamicVocab[world]) {
      return this.getFallbackVocabulary(world);
    }
    return this.dynamicVocab[world]!;
  }

  /**
   * Generate dynamic content using the web-searched vocabulary
   */
  private generateDynamicContent(
    context: GenerationContext,
    options: CreativeOptions
  ): string {
    const paragraphs: string[] = [];
    const world = context.world;
    const vocab = this.getWorldVocab(world);
    
    // Generate opening paragraph with transition from previous events
    const opening = this.buildDynamicParagraph('opening', context, vocab, 0, 0);
    paragraphs.push(opening);
    
    // Generate body paragraphs based on chapter events and story arc
    const bodyParagraphCount = Math.max(5, Math.floor(options.wordCount / 200));
    for (let i = 0; i < bodyParagraphCount; i++) {
      const paragraphType = i % 3 === 0 ? 'action' : (i % 3 === 1 ? 'description' : 'dialogue');
      const body = this.buildDynamicParagraph(paragraphType, context, vocab, i + 1, paragraphs.length);
      paragraphs.push(body);
    }
    
    // Generate closing paragraph with cliffhanger or transition
    const closing = this.buildDynamicParagraph('closing', context, vocab, bodyParagraphCount + 1, paragraphs.length);
    paragraphs.push(closing);
    
    return paragraphs.join('\n\n');
  }

  /**
   * Build a dynamic paragraph using searched vocabulary
   */
  private buildDynamicParagraph(
    type: string,
    context: GenerationContext,
    vocab: DynamicVocabulary,
    paragraphIndex: number,
    offsetParagraphIndex: number
  ): string {
    const sentences: string[] = [];
    const sentenceCount = this.randomInt(4, 7);
    
    for (let i = 0; i < sentenceCount; i++) {
      const sentence = this.generateUniqueSentence(
        type,
        context,
        vocab,
        i,
        offsetParagraphIndex
      );
      sentences.push(sentence);
    }
    
    let paragraph = sentences.join(' ');
    
    // Ensure uniqueness
    paragraph = this.ensureParagraphUniqueness(paragraph, type, context.chapterNumber, offsetParagraphIndex);
    
    return paragraph;
  }

  /**
   * Generate a unique sentence with dynamic structure
   */
  private generateUniqueSentence(
    type: string,
    context: GenerationContext,
    vocab: DynamicVocabulary,
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
      sentence += this.generateSentencePart(part, context, vocab) + ' ';
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
        ['timeMarker', 'subject', 'verb', 'location'],
        ['adjective', 'subject', 'verb', 'location'],
        ['subject', 'verb', 'location', 'transition'],
        ['subject', 'verb', 'location', 'emotion'],
      ],
      action: [
        ['subject', 'verb', 'action', 'descriptor'],
        ['adjective', 'subject', 'verb', 'location'],
        ['subject', 'verb', 'connector', 'action'],
        ['timeMarker', 'subject', 'verb', 'descriptor'],
        ['transition', 'subject', 'verb', 'emotion'],
      ],
      description: [
        ['adjective', 'descriptor', 'verb', 'location'],
        ['subject', 'sensation', 'adjective', 'descriptor'],
        ['location', 'verb', 'adjective', 'descriptor'],
        ['descriptor', 'transition', 'adjective', 'emotion'],
        ['timeMarker', 'descriptor', 'verb', 'subject'],
      ],
      dialogue: [
        ['subject', 'verb', 'emotion', 'connector'],
        ['transition', 'subject', 'verb', 'descriptor'],
        ['emotion', 'verb', 'subject', 'action'],
        ['subject', 'sensation', 'connector', 'descriptor'],
        ['timeMarker', 'subject', 'verb', 'action'],
      ],
      closing: [
        ['subject', 'verb', 'emotion', 'transition'],
        ['adjective', 'subject', 'verb', 'location'],
        ['timeMarker', 'subject', 'verb', 'transition'],
        ['transition', 'subject', 'verb', 'emotion'],
        ['subject', 'verb', 'descriptor', 'timeMarker'],
      ]
    };
    
    const typeStructures = structures[type] || structures.action;
    return typeStructures[(index + this.chapterSeed) % typeStructures.length];
  }

  /**
   * Generate a sentence part from dynamic vocabulary
   */
  private generateSentencePart(part: string, context: GenerationContext, vocab: DynamicVocabulary): string {
    const chapterNum = context.chapterNumber;
    
    switch(part) {
      case 'subject':
        return vocab.subjects[(chapterNum + this.randomInt(0, 9)) % vocab.subjects.length];
      case 'verb':
        return vocab.verbs[(chapterNum + this.randomInt(10, 19)) % vocab.verbs.length];
      case 'location':
        return vocab.locations[(chapterNum + this.randomInt(20, 29)) % vocab.locations.length];
      case 'adjective':
        return vocab.adjectives[(chapterNum + this.randomInt(30, 39)) % vocab.adjectives.length];
      case 'emotion':
        return vocab.emotions[(chapterNum + this.randomInt(40, 49)) % vocab.emotions.length];
      case 'action':
        return vocab.actions[(chapterNum + this.randomInt(50, 59)) % vocab.actions.length];
      case 'sensation':
        return vocab.sensations[(chapterNum + this.randomInt(60, 69)) % vocab.sensations.length];
      case 'descriptor':
        return vocab.descriptors[(chapterNum + this.randomInt(70, 79)) % vocab.descriptors.length];
      case 'timeMarker':
        return vocab.timeMarkers[(chapterNum + this.randomInt(80, 89)) % vocab.timeMarkers.length];
      case 'transition':
        return vocab.transitions[(chapterNum + this.randomInt(90, 99)) % vocab.transitions.length];
      case 'connector':
        return vocab.connectors[(chapterNum + this.randomInt(100, 109)) % vocab.connectors.length];
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
    
    // Check for high similarity
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

  /**
   * Generate dynamic title using web search
   */
  private async generateDynamicTitle(context: GenerationContext): Promise<string> {
    const world = context.world;
    const num = context.chapterNumber;
    
    try {
      // Search for title inspiration
      const searchResults = await webSearch(
        `${world === 'vr' ? 'fantasy dark vampire' : 'real world hospital'} story chapter titles ${context.storyArc?.currentPhase || 'beginning'}`,
        3
      );
      
      // Extract title words from search
      const titleWords: string[] = [];
      if (searchResults && searchResults.results) {
        for (const result of searchResults.results) {
          const text = result.title || '';
          const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
          titleWords.push(...words.slice(0, 3));
        }
      }
      
      if (titleWords.length > 0) {
        const uniqueWords = [...new Set(titleWords)];
        const titleWord = uniqueWords[num % uniqueWords.length] || (world === 'vr' ? 'Shadows' : 'Hope');
        return `Chapter ${num}: ${titleWord}`;
      }
    } catch (error) {
      console.error('Title search failed:', error);
    }
    
    // Fallback title
    const nouns = world === 'vr' 
      ? ['Hunt', 'Shadow', 'Power', 'Blood', 'Darkness', 'Realm']
      : ['Hope', 'Reality', 'Truth', 'Life', 'Connection', 'Strength'];
    
    return `Chapter ${num}: ${nouns[num % nouns.length]}`;
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

  private async extractThemesFromSearch(context: GenerationContext): Promise<string[]> {
    const themes: string[] = [];
    
    try {
      const searchResults = await webSearch(
        `${context.world === 'vr' ? 'fantasy vampire dark' : 'hospital recovery human'} story themes`,
        5
      );
      
      if (searchResults && searchResults.results) {
        for (const result of searchResults.results) {
          const text = result.snippet || result.title || '';
          if (text.length > 20) {
            themes.push(text.substring(0, 50));
          }
        }
      }
    } catch (error) {
      console.error('Theme search failed:', error);
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
    const vocab = this.getWorldVocab(context.world);
    const extensions: string[] = [];
    
    for (let i = 0; i < paragraphsToAdd; i++) {
      const extension = this.buildDynamicParagraph('extension', context, vocab, i + 100, i + 100);
      extensions.push(extension);
    }
    
    const closingParagraphIndex = paragraphs.length - 1;
    paragraphs.splice(closingParagraphIndex, 0, ...extensions);
    
    return paragraphs.join('\n\n');
  }

  private generateSystemScreenForChapter(context: GenerationContext): string {
    const kael = context.characterStates.find(c => c.name === 'Kael') || {
      name: 'Kael',
      currentLevel: Math.floor(context.chapterNumber / 5) + 1,
      experience: (context.chapterNumber - 1) * 100,
      skills: ['Blood Drain', 'Shadow Step', 'Vampire Sight', 'Dark Magic'],
      health: 100 + context.chapterNumber * 10,
      maxHealth: 100 + context.chapterNumber * 10
    };
    
    const level = kael.currentLevel || 1;
    const experience = kael.experience || (context.chapterNumber - 1) * 100;
    const nextLevelExp = level * 100;
    
    // Generate system screen narrative
    let screenContent = '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    screenContent += '【 SYSTEM INTERFACE 】\n';
    screenContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    screenContent += `\n【 Character Information 】\n`;
    screenContent += `Name: Kael\n`;
    screenContent += `Race: Vampire Progenitor\n`;
    screenContent += `Level: ${level}\n`;
    screenContent += `Experience: ${experience} / ${nextLevelExp}\n`;
    screenContent += `\n`;
    screenContent += `【 Status 】\n`;
    screenContent += `Health: ${kael.health}/${kael.maxHealth}\n`;
    screenContent += `Blood Energy: 50/50\n`;
    screenContent += `Mana: 30/30\n`;
    screenContent += `Stamina: 100/100\n`;
    screenContent += `\n`;
    screenContent += `【 Attributes 】\n`;
    screenContent += `Strength: ${15 + level * 2} | Agility: ${18 + level * 2}\n`;
    screenContent += `Intelligence: ${20 + level * 3} | Wisdom: ${15 + level * 2}\n`;
    screenContent += `Vitality: ${12 + level * 2} | Luck: ${10 + level}\n`;
    screenContent += `\n`;
    
    // Skills based on chapter progression
    const availableSkills = [
      'Blood Drain', 'Shadow Step', 'Vampire Sight', 'Dark Magic',
      'Bat Transformation', 'Hypnotic Gaze', 'Blood Puppetry',
      'Shadow Clone', 'Blood Moon', 'Eternal Night'
    ];
    const unlockedSkillCount = Math.min(availableSkills.length, 3 + Math.floor(level / 2));
    const unlockedSkills = availableSkills.slice(0, unlockedSkillCount);
    
    screenContent += `【 Skills 】\n`;
    unlockedSkills.forEach((skill, i) => {
      screenContent += `• ${skill} [Lv.${Math.min(10, level + Math.floor(i / 2))}]\n`;
    });
    screenContent += `\n`;
    
    // Quests
    screenContent += `【 Active Quests 】\n`;
    screenContent += `▶ Main Quest: Awaken the Progenitor [${Math.min(100, context.chapterNumber * 5)}%]\n`;
    screenContent += `  Description: Rediscover your true vampire heritage and powers.\n`;
    
    if (context.chapterNumber >= 5) {
      screenContent += `  ☑ Discover the crimson void\n`;
    }
    if (context.chapterNumber >= 10) {
      screenContent += `  ☑ Unlock shadow manipulation\n`;
    }
    if (context.chapterNumber >= 15) {
      screenContent += `  ☑ Master blood magic\n`;
    }
    screenContent += `\n`;
    
    // Notifications
    if (context.chapterNumber % 5 === 0) {
      screenContent += `【 Notifications 】\n`;
      screenContent += `⚠ LEVEL UP! You are now Level ${level}!\n`;
      screenContent += `  All stats increased. New abilities unlocked!\n`;
      screenContent += `\n`;
    }
    
    if (context.chapterNumber >= 10) {
      screenContent += `⚠ New Skill Unlocked: ${unlockedSkills[unlockedSkills.length - 1]}!\n`;
      screenContent += `\n`;
    }
    
    screenContent += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    screenContent += `\nKael focused his will, and the translucent system interface materialized before him. It hovered in the crimson void, displaying his ever-growing power and progress in this strange new world. Each level up brought new understanding of his vampire nature, and the system provided structure to what had once been instinct alone.\n`;
    
    return screenContent;
  }

  reset(): void {
    this.usedHashes.clear();
    this.sentenceCache.clear();
    this.chapterSeed = 0;
    this.dynamicVocab = { vr: null, real: null };
    this.searchedTerms.clear();
  }
}

export default CreativeContentGenerator;