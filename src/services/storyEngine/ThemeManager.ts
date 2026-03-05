/**
 * ThemeManager - Manages thematic cohesion and symbolic resonance
 * 
 * Tracks themes throughout the narrative, ensures consistent symbolic callbacks,
 * and maintains thematic arcs that span multiple chapters.
 */

export interface Theme {
  id: string;
  name: string;
  category: 'identity' | 'connection' | 'power' | 'reality' | 'sacrifice' | 'hope' | 'betrayal';
  description: string;
  symbols: Symbol[];
  appearances: ThemeAppearance[];
  intensity: number; // 1-10, current importance
  status: 'emerging' | 'developing' | 'peaking' | 'resolving' | 'resolved';
}

export interface Symbol {
  id: string;
  name: string;
  type: 'object' | 'color' | 'action' | 'phrase' | 'metaphor';
  meaning: string;
  variations: string[];
  frequency: number;
  associatedThemes: string[];
}

export interface ThemeAppearance {
  chapter: number;
  scene: string;
  context: string;
  symbolsUsed: string[];
  intensity: number;
  callback?: {
    toChapter: number;
    toScene: string;
    connection: string;
  };
}

export interface ThematicArc {
  themeId: string;
  startChapter: number;
  endChapter: number;
  trajectory: 'ascending' | 'descending' | 'wavelike' | 'circular';
  keyMoments: number[];
  resolution?: {
    chapter: number;
    type: 'payoff' | 'twist' | 'ambiguity';
  };
}

export class ThemeManager {
  private themes: Map<string, Theme> = new Map();
  private symbolIndex: Map<string, Symbol> = new Map();
  private thematicArcs: Map<string, ThematicArc> = new Map();
  private currentChapter: number = 1;

  // Core themes for the story
  private coreThemes: Theme[] = [
    {
      id: 'dual_existence',
      name: 'Dual Existence',
      category: 'reality',
      description: 'The tension between living in two worlds - VR and reality - and what that means for identity.',
      symbols: [
        {
          id: 'mirror',
          name: 'Mirror',
          type: 'object',
          meaning: 'Reflection of self, division between worlds',
          variations: ['reflected surface', 'looking glass', 'glimpse of self'],
          frequency: 0,
          associatedThemes: ['dual_existence', 'identity'],
        },
        {
          id: 'boundary',
          name: 'Boundary',
          type: 'object',
          meaning: 'The line between worlds, the cost of crossing',
          variations: ['threshold', 'portal', 'divide'],
          frequency: 0,
          associatedThemes: ['dual_existence', 'power'],
        },
      ],
      appearances: [],
      intensity: 7,
      status: 'developing',
    },
    {
      id: 'identity_and_destiny',
      name: 'Identity and Destiny',
      category: 'identity',
      description: 'Kael\'s struggle with who he is versus who he\'s expected to be as a Progenitor.',
      symbols: [
        {
          id: 'blood',
          name: 'Blood',
          type: 'object',
          meaning: 'Heritage, lineage, and the weight of expectations',
          variations: ['lineage', 'heritage', 'bloodline'],
          frequency: 0,
          associatedThemes: ['identity_and_destiny', 'power'],
        },
        {
          id: 'mask',
          name: 'Mask',
          type: 'object',
          meaning: 'Hiding true self, presenting what others expect',
          variations: ['facade', 'disguise', 'hiding'],
          frequency: 0,
          associatedThemes: ['identity_and_destiny', 'betrayal'],
        },
      ],
      appearances: [],
      intensity: 8,
      status: 'peaking',
    },
    {
      id: 'connection_and_sacrifice',
      name: 'Connection and Sacrifice',
      category: 'sacrifice',
      description: 'The cost of connecting with others and the sacrifices required for those we love.',
      symbols: [
        {
          id: 'hand',
          name: 'Hand',
          type: 'object',
          meaning: 'Connection, touch, reaching out or letting go',
          variations: ['grasp', 'touch', 'reach'],
          frequency: 0,
          associatedThemes: ['connection_and_sacrifice', 'hope'],
        },
        {
          id: 'tear',
          name: 'Tear',
          type: 'object',
          meaning: 'Emotional release, pain, and vulnerability',
          variations: ['crying', 'shedding tears', 'emotional release'],
          frequency: 0,
          associatedThemes: ['connection_and_sacrifice', 'identity'],
        },
      ],
      appearances: [],
      intensity: 6,
      status: 'developing',
    },
    {
      id: 'power_and_responsibility',
      name: 'Power and Responsibility',
      category: 'power',
      description: 'The weight of Progenitor abilities and what it means to use them.',
      symbols: [
        {
          id: 'light',
          name: 'Light',
          type: 'color',
          meaning: 'Power, revelation, truth',
          variations: ['illumination', 'glow', 'brilliance'],
          frequency: 0,
          associatedThemes: ['power_and_responsibility', 'hope'],
        },
        {
          id: 'weight',
          name: 'Weight',
          type: 'object',
          meaning: 'Burden, responsibility, the cost of power',
          variations: ['burden', 'load', 'pressure'],
          frequency: 0,
          associatedThemes: ['power_and_responsibility', 'sacrifice'],
        },
      ],
      appearances: [],
      intensity: 5,
      status: 'emerging',
    },
    {
      id: 'hope_against_darkness',
      name: 'Hope Against Darkness',
      category: 'hope',
      description: 'The persistent hope for Yuna\'s recovery and a better future.',
      symbols: [
        {
          id: 'spark',
          name: 'Spark',
          type: 'object',
          meaning: 'Hope, beginning, potential',
          variations: ['glimmer', 'flash', 'light'],
          frequency: 0,
          associatedThemes: ['hope_against_darkness', 'power'],
        },
        {
          id: 'dawn',
          name: 'Dawn',
          type: 'metaphor',
          meaning: 'New beginning, hope after darkness',
          variations: ['sunrise', 'morning', 'new day'],
          frequency: 0,
          associatedThemes: ['hope_against_darkness', 'reality'],
        },
      ],
      appearances: [],
      intensity: 9,
      status: 'developing',
    },
    {
      id: 'trust_and_betrayal',
      name: 'Trust and Betrayal',
      category: 'betrayal',
      description: 'The fragility of trust and the pain of betrayal.',
      symbols: [
        {
          id: 'back',
          name: 'Back',
          type: 'object',
          meaning: 'Vulnerability, trust, or where betrayal comes from',
          variations: ['vulnerable', 'unprotected', 'exposed'],
          frequency: 0,
          associatedThemes: ['trust_and_betrayal', 'sacrifice'],
        },
        {
          id: 'promise',
          name: 'Promise',
          type: 'action',
          meaning: 'Trust, commitment, or its breaking',
          variations: ['vow', 'commitment', 'agreement'],
          frequency: 0,
          associatedThemes: ['trust_and_betrayal', 'connection'],
        },
      ],
      appearances: [],
      intensity: 4,
      status: 'emerging',
    },
  ];

  constructor() {
    this.initializeThemes();
    this.buildSymbolIndex();
    this.initializeThematicArcs();
  }

  /**
   * Initialize core themes
   */
  private initializeThemes(): void {
    this.coreThemes.forEach((theme) => {
      this.themes.set(theme.id, theme);
    });
  }

  /**
   * Build symbol index for quick lookup
   */
  private buildSymbolIndex(): void {
    this.themes.forEach((theme) => {
      theme.symbols.forEach((symbol) => {
        this.symbolIndex.set(symbol.id, symbol);
      });
    });
  }

  /**
   * Initialize thematic arcs
   */
  private initializeThematicArcs(): void {
    this.thematicArcs.set('dual_existence', {
      themeId: 'dual_existence',
      startChapter: 1,
      endChapter: 30,
      trajectory: 'wavelike',
      keyMoments: [5, 15, 25],
      resolution: {
        chapter: 30,
        type: 'ambiguity',
      },
    });

    this.thematicArcs.set('identity_and_destiny', {
      themeId: 'identity_and_destiny',
      startChapter: 1,
      endChapter: 40,
      trajectory: 'ascending',
      keyMoments: [10, 20, 30, 38],
      resolution: {
        chapter: 40,
        type: 'payoff',
      },
    });

    this.thematicArcs.set('connection_and_sacrifice', {
      themeId: 'connection_and_sacrifice',
      startChapter: 3,
      endChapter: 25,
      trajectory: 'ascending',
      keyMoments: [8, 15, 22],
      resolution: {
        chapter: 25,
        type: 'payoff',
      },
    });
  }

  /**
   * Record theme appearance
   */
  recordThemeAppearance(
    themeId: string,
    appearance: Omit<ThemeAppearance, 'symbolsUsed'> & { symbolsUsed?: string[] }
  ): void {
    const theme = this.themes.get(themeId);
    if (!theme) return;

    const fullAppearance: ThemeAppearance = {
      chapter: appearance.chapter,
      scene: appearance.scene,
      context: appearance.context,
      symbolsUsed: appearance.symbolsUsed || [],
      intensity: appearance.intensity,
      callback: appearance.callback,
    };

    theme.appearances.push(fullAppearance);

    // Update symbol frequencies
    appearance.symbolsUsed?.forEach((symbolId) => {
      const symbol = this.symbolIndex.get(symbolId);
      if (symbol) {
        symbol.frequency++;
      }
    });

    // Update theme intensity and status
    this.updateThemeStatus(theme, appearance.chapter);
  }

  /**
   * Update theme status based on arc position
   */
  private updateThemeStatus(theme: Theme, chapter: number): void {
    const arc = this.thematicArcs.get(theme.id);
    if (!arc) return;

    const progress = (chapter - arc.startChapter) / (arc.endChapter - arc.startChapter);

    if (progress < 0.2) {
      theme.status = 'emerging';
      theme.intensity = Math.round(progress * 30) + 1;
    } else if (progress < 0.5) {
      theme.status = 'developing';
      theme.intensity = Math.round(progress * 40) + 4;
    } else if (progress < 0.8) {
      theme.status = 'peaking';
      theme.intensity = Math.round((progress - 0.5) * 20) + 6;
    } else {
      theme.status = 'resolving';
      theme.intensity = Math.round((1 - progress) * 40) + 4;
    }
  }

  /**
   * Generate symbolic callback
   */
  generateSymbolicCallback(
    chapter: number,
    context: { themeId?: string; intensity?: number }
  ): { symbol: Symbol; callback: string; intensity: number } | null {
    const targetThemeId = context.themeId || this.selectThemeForCallback(chapter);
    const theme = this.themes.get(targetThemeId);

    if (!theme) return null;

    // Select a symbol with good callback potential
    const callbackSymbols = theme.symbols.filter((s) => s.frequency > 0 && s.frequency < 5);
    const symbol = callbackSymbols[Math.floor(Math.random() * callbackSymbols.length)];

    if (!symbol) return null;

    // Find previous appearance
    const previousAppearance = theme.appearances.find((a) =>
      a.symbolsUsed.includes(symbol.id) && a.chapter < chapter
    );

    if (!previousAppearance) return null;

    const callbacks = [
      `This moment echoes the ${symbol.name} from chapter ${previousAppearance.chapter}, a reminder of what has changed.`,
      `Like the ${symbol.name} before, this situation carries familiar weight, though everything is different now.`,
      `The ${symbol.name} returns, transformed by all that has passed since then.`,
    ];

    return {
      symbol,
      callback: callbacks[Math.floor(Math.random() * callbacks.length)],
      intensity: context.intensity || theme.intensity,
    };
  }

  /**
   * Select theme for callback based on chapter
   */
  private selectThemeForCallback(chapter: number): string {
    const availableThemes = Array.from(this.themes.entries())
      .filter(([id, theme]) => theme.appearances.length > 0 && theme.status !== 'resolved')
      .map(([id, theme]) => ({ id, theme, arc: this.thematicArcs.get(id) }))
      .filter((item) => item.arc && chapter >= item.arc.startChapter + 2);

    if (availableThemes.length === 0) {
      return this.coreThemes[0].id;
    }

    // Select theme based on arc trajectory and chapter position
    const item = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    return item.id;
  }

  /**
   * Get appropriate themes for chapter
   */
  getThemesForChapter(chapter: number): Theme[] {
    return Array.from(this.themes.values())
      .filter((theme) => {
        const arc = this.thematicArcs.get(theme.id);
        return arc && chapter >= arc.startChapter && chapter <= arc.endChapter;
      })
      .sort((a, b) => b.intensity - a.intensity);
  }

  /**
   * Generate theme integration for content
   */
  generateThemeIntegration(chapter: number, content: string): string {
    const themes = this.getThemesForChapter(chapter);
    if (themes.length === 0) return content;

    // Select primary theme (highest intensity)
    const primaryTheme = themes[0];

    // Generate symbolic callback if appropriate
    const callback = this.generateSymbolicCallback(chapter, {
      themeId: primaryTheme.id,
      intensity: primaryTheme.intensity,
    });

    if (callback && Math.random() > 0.5) {
      // Record appearance
      this.recordThemeAppearance(primaryTheme.id, {
        chapter,
        scene: 'current',
        context: content.substring(0, 100),
        symbolsUsed: [callback.symbol.id],
        intensity: callback.intensity,
      });

      // Add callback to content
      const insertion = callback.callback;
      return `${content}\n\n${insertion}`;
    }

    return content;
  }

  /**
   * Get symbol by ID
   */
  getSymbol(symbolId: string): Symbol | undefined {
    return this.symbolIndex.get(symbolId);
  }

  /**
   * Get theme by ID
   */
  getTheme(themeId: string): Theme | undefined {
    return this.themes.get(themeId);
  }

  /**
   * Get all active themes
   */
  getActiveThemes(): Theme[] {
    return Array.from(this.themes.values()).filter((t) => t.status !== 'resolved');
  }

  /**
   * Resolve a theme
   */
  resolveTheme(themeId: string, chapter: number, resolutionType: 'payoff' | 'twist' | 'ambiguity'): void {
    const theme = this.themes.get(themeId);
    if (!theme) return;

    theme.status = 'resolved';
    theme.intensity = 3;

    const arc = this.thematicArcs.get(themeId);
    if (arc) {
      arc.resolution = {
        chapter,
        type: resolutionType,
      };
    }
  }

  /**
   * Get thematic summary
   */
  getThematicSummary(chapter: number): string {
    const themes = this.getThemesForChapter(chapter);
    if (themes.length === 0) return 'No active themes.';

    const activeDescriptions = themes
      .filter((t) => t.status !== 'resolved')
      .map((theme) => {
        const symbolsText = theme.symbols.map((s) => s.name).join(', ');
        return `${theme.name} (intensity: ${theme.intensity}, symbols: ${symbolsText})`;
      });

    return `Active themes: ${activeDescriptions.join('; ')}.`;
  }

  /**
   * Export state
   */
  exportState(): any {
    return {
      themes: Array.from(this.themes.entries()),
      symbolIndex: Array.from(this.symbolIndex.entries()),
      thematicArcs: Array.from(this.thematicArcs.entries()),
    };
  }

  /**
   * Import state
   */
  importState(state: any): void {
    if (state.themes) {
      this.themes = new Map(state.themes);
    }
    if (state.symbolIndex) {
      this.symbolIndex = new Map(state.symbolIndex);
    }
    if (state.thematicArcs) {
      this.thematicArcs = new Map(state.thematicArcs);
    }
  }
}

export default ThemeManager;