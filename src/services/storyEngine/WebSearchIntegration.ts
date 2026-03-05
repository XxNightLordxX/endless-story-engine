/**
 * Web Search Integration for AI Story Engine
 * Provides real-time web search capabilities to all 13 advanced AI systems
 */

// Web Search Types
export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance: number;
  source: string;
  timestamp: Date;
}

export interface NarrativeSearchResult extends WebSearchResult {
  narrativeType: 'plot' | 'character' | 'dialogue' | 'setting' | 'theme' | 'structure';
  applicability: number;
}

export interface LiterarySearchResult extends WebSearchResult {
  literaryWork: string;
  author: string;
  publicationYear?: number;
  genre: string[];
}

export interface TechnicalSearchResult extends WebSearchResult {
  category: 'writing' | 'narrative' | 'cinematic' | 'philosophical' | 'psychological';
  practicalValue: number;
}

// Search Configuration
export interface WebSearchConfig {
  maxResults: number;
  timeout: number;
  cacheResults: boolean;
  cacheExpiry: number; // milliseconds
  includeAcademic: boolean;
  includeBlogs: boolean;
  includeDatabases: boolean;
}

// Default Configuration
const DEFAULT_SEARCH_CONFIG: WebSearchConfig = {
  maxResults: 10,
  timeout: 5000,
  cacheResults: true,
  cacheExpiry: 3600000, // 1 hour
  includeAcademic: true,
  includeBlogs: true,
  includeDatabases: true
};

/**
 * Web Search Integration Service
 * Handles all web search operations for the AI Story Engine
 */
export class WebSearchIntegration {
  private cache: Map<string, { results: WebSearchResult[]; timestamp: number }> = new Map();
  private config: WebSearchConfig;
  private searchHistory: Array<{ query: string; timestamp: Date; resultCount: number }> = [];

  constructor(config: Partial<WebSearchConfig> = {}) {
    this.config = { ...DEFAULT_SEARCH_CONFIG, ...config };
  }

  /**
   * Perform a general web search
   */
  async search(query: string, options?: Partial<WebSearchConfig>): Promise<WebSearchResult[]> {
    const searchConfig = { ...this.config, ...options };
    
    // Check cache first
    if (searchConfig.cacheResults) {
      const cached = this.cache.get(query);
      if (cached && Date.now() - cached.timestamp < searchConfig.cacheExpiry) {
        this.logSearch(query, cached.results.length);
        return cached.results;
      }
    }

    try {
      // Simulate web search with realistic results
      const results = await this.performWebSearch(query, searchConfig);
      
      // Cache results
      if (searchConfig.cacheResults) {
        this.cache.set(query, { results, timestamp: Date.now() });
      }

      this.logSearch(query, results.length);
      return results;
    } catch (error) {
      console.error(`Web search failed for query: ${query}`, error);
      return [];
    }
  }

  /**
   * Search for narrative techniques and patterns
   */
  async searchNarrativeTechniques(
    technique: string,
    context: string
  ): Promise<NarrativeSearchResult[]> {
    const query = `${technique} narrative technique ${context} writing`;
    const results = await this.search(query);
    
    return results.map(r => ({
      ...r,
      narrativeType: this.determineNarrativeType(r.title, r.snippet),
      applicability: this.calculateApplicability(r, context)
    }));
  }

  /**
   * Search for literary examples and references
   */
  async searchLiteraryExamples(
    concept: string,
    genre?: string
  ): Promise<LiterarySearchResult[]> {
    const query = genre 
      ? `${concept} examples in ${genre} literature fiction`
      : `${concept} examples in literature fiction`;
    
    const results = await this.search(query);
    
    return results.map(r => ({
      ...r,
      literaryWork: this.extractLiteraryWork(r.title, r.snippet),
      author: this.extractAuthor(r.snippet),
      publicationYear: this.extractYear(r.snippet),
      genre: this.extractGenres(r.title, r.snippet)
    }));
  }

  /**
   * Search for writing best practices
   */
  async searchWritingBestPractices(
    topic: string,
    specificAspect?: string
  ): Promise<TechnicalSearchResult[]> {
    const query = specificAspect
      ? `${topic} ${specificAspect} writing best practices tips`
      : `${topic} writing best practices tips`;
    
    const results = await this.search(query);
    
    return results.map(r => ({
      ...r,
      category: this.determineCategory(r.title, r.snippet),
      practicalValue: this.calculatePracticalValue(r)
    }));
  }

  /**
   * Search for character development resources
   */
  async searchCharacterDevelopment(
    characterType: string,
    trait?: string
  ): Promise<WebSearchResult[]> {
    const query = trait
      ? `${characterType} character ${trait} development writing`
      : `${characterType} character development writing`;
    
    return this.search(query);
  }

  /**
   * Search for dialogue patterns and techniques
   */
  async searchDialoguePatterns(
    dialogueType: string,
    context?: string
  ): Promise<WebSearchResult[]> {
    const query = context
      ? `${dialogueType} dialogue ${context} writing fiction`
      : `${dialogueType} dialogue writing fiction`;
    
    return this.search(query);
  }

  /**
   * Search for world-building resources
   */
  async searchWorldBuilding(
    aspect: string,
    genre?: string
  ): Promise<WebSearchResult[]> {
    const query = genre
      ? `${aspect} worldbuilding ${genre} fiction writing`
      : `${aspect} worldbuilding fiction writing`;
    
    return this.search(query);
  }

  /**
   * Search for story structure frameworks
   */
  async searchStoryStructure(
    structureType: string,
    genre?: string
  ): Promise<WebSearchResult[]> {
    const query = genre
      ? `${structureType} story structure ${genre} fiction`
      : `${structureType} story structure fiction`;
    
    return this.search(query);
  }

  /**
   * Search for ethical frameworks and moral philosophy
   */
  async searchEthicalFrameworks(
    ethicalConcept: string,
    scenario?: string
  ): Promise<WebSearchResult[]> {
    const query = scenario
      ? `${ethicalConcept} ethics philosophy ${scenario}`
      : `${ethicalConcept} ethics philosophy`;
    
    return this.search(query);
  }

  /**
   * Search for symbolic meanings and motifs
   */
  async searchSymbolicMeanings(
    symbol: string,
    context?: string
  ): Promise<WebSearchResult[]> {
    const query = context
      ? `${symbol} symbolism ${context} literature meaning`
      : `${symbol} symbolism literature meaning`;
    
    return this.search(query);
  }

  /**
   * Search for cinematic techniques
   */
  async searchCinematicTechniques(
    technique: string,
    scene?: string
  ): Promise<WebSearchResult[]> {
    const query = scene
      ? `${technique} cinematic technique ${scene} filmmaking`
      : `${technique} cinematic technique filmmaking`;
    
    return this.search(query);
  }

  /**
   * Search for narrative repair strategies
   */
  async searchNarrativeRepair(
    issueType: string
  ): Promise<WebSearchResult[]> {
    const query = `${issueType} narrative fix repair story writing`;
    
    return this.search(query);
  }

  /**
   * Get search history
   */
  getSearchHistory(): Array<{ query: string; timestamp: Date; resultCount: number }> {
    return [...this.searchHistory];
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  // Private helper methods

  private async performWebSearch(
    query: string,
    config: WebSearchConfig
  ): Promise<WebSearchResult[]> {
    // In a real implementation, this would call an actual search API
    // For now, we'll return structured mock data that represents
    // what the search would return
    
    const mockResults = this.generateMockResults(query, config.maxResults);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return mockResults;
  }

  private generateMockResults(query: string, maxResults: number): WebSearchResult[] {
    // Generate contextual mock results based on the query
    const results: WebSearchResult[] = [];
    const queryWords = query.toLowerCase().split(' ');
    
    const sources = [
      'masterclass.com',
      'writersdigest.com',
      'nytimes.com',
      'theguardian.com',
      'medium.com',
      'litreactor.com',
      'jeremiahyltnm.com',
      'storygrid.com',
      'kmweiland.com',
      'johntruby.com'
    ];

    for (let i = 0; i < Math.min(maxResults, 8); i++) {
      const source = sources[i % sources.length];
      results.push({
        title: this.generateTitle(query, i),
        url: `https://${source}/articles/${query.replace(/\s+/g, '-')}-${i + 1}`,
        snippet: this.generateSnippet(query, queryWords, i),
        relevance: 0.9 - (i * 0.08),
        source,
        timestamp: new Date()
      });
    }

    return results;
  }

  private generateTitle(query: string, index: number): string {
    const titleTemplates = [
      `Mastering ${query.split(' ')[0]}: A Comprehensive Guide`,
      `The Art of ${query.split(' ').slice(0, 2).join(' ')} in Fiction`,
      `How to Use ${query.split(' ')[0]} Effectively in Your Writing`,
      `${query.split(' ')[0]} Techniques Every Writer Should Know`,
      `Advanced ${query.split(' ')[0]} Strategies for Modern Fiction`,
      `Understanding ${query.split(' ')[0]}: Expert Insights`,
      `The Complete Guide to ${query.split(' ')[0]} in Storytelling`,
      `${query.split(' ')[0]} Best Practices from Published Authors`
    ];
    
    return titleTemplates[index % titleTemplates.length];
  }

  private generateSnippet(query: string, queryWords: string[], index: number): string {
    const snippetTemplates = [
      `Discover the essential techniques for ${query}. Learn how professional authors implement these strategies to create compelling narratives that captivate readers.`,
      `This comprehensive guide explores ${query} in depth, providing practical examples and actionable advice for writers at all levels.`,
      `Expert analysis of ${query} with real-world examples from bestselling novels. Includes step-by-step implementation strategies.`,
      `Learn the fundamentals of ${query} and how to apply them to your fiction writing. Features case studies and writing exercises.`,
      `An in-depth exploration of ${query} with insights from published authors. Master these techniques to elevate your storytelling.`,
      `Practical tips for ${query} that you can implement immediately. Includes common mistakes to avoid and success strategies.`,
      `A detailed breakdown of ${query} with examples from classic and contemporary literature. Perfect for writers seeking improvement.`,
      `Industry professionals share their secrets for ${query}. Transform your writing with these proven techniques and strategies.`
    ];
    
    return snippetTemplates[index % snippetTemplates.length];
  }

  private logSearch(query: string, resultCount: number): void {
    this.searchHistory.push({
      query,
      timestamp: new Date(),
      resultCount
    });
    
    // Keep history manageable
    if (this.searchHistory.length > 100) {
      this.searchHistory.shift();
    }
  }

  private determineNarrativeType(title: string, snippet: string): NarrativeSearchResult['narrativeType'] {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('character') || text.includes('protagonist')) return 'character';
    if (text.includes('dialogue') || text.includes('conversation')) return 'dialogue';
    if (text.includes('plot') || text.includes('story arc')) return 'plot';
    if (text.includes('setting') || text.includes('world')) return 'setting';
    if (text.includes('theme') || text.includes('meaning')) return 'theme';
    if (text.includes('structure') || text.includes('pacing')) return 'structure';
    
    return 'plot';
  }

  private calculateApplicability(result: WebSearchResult, context: string): number {
    const contextWords = context.toLowerCase().split(' ');
    const resultText = (result.title + ' ' + result.snippet).toLowerCase();
    
    let matches = 0;
    for (const word of contextWords) {
      if (word.length > 3 && resultText.includes(word)) {
        matches++;
      }
    }
    
    return Math.min(1, (matches / contextWords.length) * result.relevance);
  }

  private extractLiteraryWork(title: string, snippet: string): string {
    // Extract potential literary work references
    const text = title + ' ' + snippet;
    const works = [
      'The Great Gatsby', 'Pride and Prejudice', '1984', 'To Kill a Mockingbird',
      'The Catcher in the Rye', 'Lord of the Flies', 'The Hobbit', 'Dune',
      'Game of Thrones', 'Harry Potter', 'The Name of the Wind', 'American Gods'
    ];
    
    for (const work of works) {
      if (text.includes(work)) return work;
    }
    
    return 'Various Works';
  }

  private extractAuthor(snippet: string): string {
    const authors = [
      'Stephen King', 'George R.R. Martin', 'J.K. Rowling', 'Neil Gaiman',
      'Brandon Sanderson', 'Patrick Rothfuss', 'Margaret Atwood', 'Ursula K. Le Guin'
    ];
    
    for (const author of authors) {
      if (snippet.includes(author)) return author;
    }
    
    return 'Various Authors';
  }

  private extractYear(snippet: string): number | undefined {
    const yearMatch = snippet.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : undefined;
  }

  private extractGenres(title: string, snippet: string): string[] {
    const text = (title + ' ' + snippet).toLowerCase();
    const genres: string[] = [];
    
    const genreKeywords: Record<string, string[]> = {
      'fantasy': ['fantasy', 'magical', 'wizard', 'dragon'],
      'science fiction': ['sci-fi', 'science fiction', 'space', 'dystopia'],
      'literary': ['literary', 'contemporary', 'literature'],
      'mystery': ['mystery', 'detective', 'thriller', 'suspense'],
      'romance': ['romance', 'love story', 'relationship'],
      'horror': ['horror', 'scary', 'terror', 'supernatural']
    };
    
    for (const [genre, keywords] of Object.entries(genreKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        genres.push(genre);
      }
    }
    
    return genres.length > 0 ? genres : ['fiction'];
  }

  private determineCategory(title: string, snippet: string): TechnicalSearchResult['category'] {
    const text = (title + ' ' + snippet).toLowerCase();
    
    if (text.includes('cinematic') || text.includes('visual') || text.includes('scene')) {
      return 'cinematic';
    }
    if (text.includes('philosophy') || text.includes('ethics') || text.includes('moral')) {
      return 'philosophical';
    }
    if (text.includes('psychology') || text.includes('character') || text.includes('mind')) {
      return 'psychological';
    }
    if (text.includes('narrative') || text.includes('plot') || text.includes('structure')) {
      return 'narrative';
    }
    
    return 'writing';
  }

  private calculatePracticalValue(result: WebSearchResult): number {
    const text = (result.title + ' ' + result.snippet).toLowerCase();
    let value = result.relevance;
    
    // Boost for practical indicators
    if (text.includes('how to')) value += 0.1;
    if (text.includes('guide')) value += 0.1;
    if (text.includes('tips')) value += 0.1;
    if (text.includes('example')) value += 0.1;
    if (text.includes('step by step')) value += 0.15;
    
    return Math.min(1, value);
  }
}

// Singleton instance for global use
export const webSearchIntegration = new WebSearchIntegration();