/**
 * Lore Manager - Multi-Layer Lore System
 * Maintains surface, hidden, and deep lore layers
 * Manages secrets, reveals, and plot threads
 */

export interface LoreEntry {
  id: string;
  title: string;
  category: 'surface' | 'hidden' | 'deep';
  content: string;
  tags: string[];
  relatedEntities: string[];
  prerequisites: string[]; // other lore entries needed to understand this one
  discoveryMethod: string[];
  chapterRevealed?: number;
  timesReferenced: number;
}

export interface PlotThread {
  id: string;
  name: string;
  description: string;
  status: 'dormant' | 'active' | 'resolved' | 'abandoned';
  introducedChapter: number;
  resolvedChapter?: number;
  keyEvents: string[];
  connectedLore: string[];
  importance: 'main' | 'major' | 'minor';
  tension: number;
}

export interface Mystery {
  id: string;
  question: string;
  answer: string;
  hints: string[];
  revealedHints: number[];
  layer: 'surface' | 'hidden' | 'deep';
  significance: number;
  revealed: boolean;
  revealChapter?: number;
}

export class LoreManager {
  private loreEntries: Map<string, LoreEntry> = new Map();
  private plotThreads: Map<string, PlotThread> = new Map();
  private mysteries: Map<string, Mystery> = new Map();
  private discoveredLore: string[] = [];
  private currentChapter: number = 0;

  constructor() {
    this.initializeLoreDatabase();
  }

  /**
   * Initialize the multi-layer lore database
   */
  private initializeLoreDatabase(): void {
    // SURFACE LORE - Common knowledge
    this.addLoreEntry({
      id: 'eclipsis_basics',
      title: 'Eclipsis Online - The Game',
      category: 'surface',
      content: 'Eclipsis Online is a revolutionary VR MMORPG known for its unprecedented realism and mysterious origins. Players around the world have been drawn to its immersive experience.',
      tags: ['game', 'vr', 'eclipsis'],
      relatedEntities: ['The VR Headset', 'Eclipsis'],
      prerequisites: [],
      discoveryMethod: ['starting', 'default_knowledge'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'yuna_condition',
      title: "Yuna's Mysterious Coma",
      category: 'surface',
      content: 'Yuna, Kael\'s younger sister, fell into an unexplained coma two years ago. Medical science has been unable to determine the cause or find a treatment.',
      tags: ['yuna', 'coma', 'hospital', 'family'],
      relatedEntities: ['Yuna', 'Kael', 'Hospital'],
      prerequisites: [],
      discoveryMethod: ['starting', 'hospital_visit'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'vampire_class',
      title: 'Vampire Progenitor Class',
      category: 'surface',
      content: 'A rare and mysterious class in Eclipsis Online. Vampire Progenitors are said to be the original vampires, possessing powers that modern vampires can only dream of.',
      tags: ['vampire', 'class', 'progenitor'],
      relatedEntities: ['Kael', 'Eclipsis'],
      prerequisites: [],
      discoveryMethod: ['class_selection', 'game_start'],
      timesReferenced: 0,
    });

    // HIDDEN LORE - Requires discovery
    this.addLoreEntry({
      id: 'headset_origin',
      title: 'The Mysterious Headset',
      category: 'hidden',
      content: 'The VR headset Kael received was not from any known manufacturer. Its technology is decades ahead of current VR systems, and its true purpose remains unknown.',
      tags: ['headset', 'mystery', 'technology'],
      relatedEntities: ['VR Headset', 'Unknown Benefactor'],
      prerequisites: ['yuna_condition', 'eclipsis_basics'],
      discoveryMethod: ['investigation', 'rare_event', 'system_glitch'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'blood_sickness',
      title: 'The Blood Sickness',
      category: 'hidden',
      content: 'A mysterious affliction that affects those with strong vampire bloodlines. It slowly consumes the host unless they can find a cure or embrace their true nature.',
      tags: ['vampire', 'disease', 'bloodline'],
      relatedEntities: ['Vampire Clans', 'Elder Vampires'],
      prerequisites: ['vampire_class'],
      discoveryMethod: ['exploration', 'npc_dialogue', 'lore_book'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'system_anomalies',
      title: 'System Anomalies',
      category: 'hidden',
      content: 'Players have reported strange occurrences in Eclipsis - NPCs with awareness beyond their programming, areas that shouldn\'t exist, and messages from unknown sources.',
      tags: ['system', 'anomaly', 'glitch'],
      relatedEntities: ['System', 'NPCs'],
      prerequisites: ['eclipsis_basics'],
      discoveryMethod: ['exploration', 'rare_encounter', 'bug_exploit'],
      timesReferenced: 0,
    });

    // DEEP LORE - Major secrets
    this.addLoreEntry({
      id: 'true_purpose',
      title: 'The True Purpose of Eclipsis',
      category: 'deep',
      content: 'Eclipsis was not created as a game. Its true purpose is far more sinister and world-changing. The boundaries between game and reality are weakening for a reason.',
      tags: ['secret', 'purpose', 'reality'],
      relatedEntities: ['The Creators', 'Reality'],
      prerequisites: ['headset_origin', 'system_anomalies', 'blood_sickness'],
      discoveryMethod: ['major_quest', 'hidden_zone', 'progenitor_memoirs'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'yuna_truth',
      title: 'Yuna\'s True State',
      category: 'deep',
      content: 'Yuna is not merely in a coma. Her consciousness has become trapped within Eclipsis, and her condition in the real world is connected to events in the virtual realm.',
      tags: ['yuna', 'consciousness', 'connection'],
      relatedEntities: ['Yuna', 'Eclipsis', 'Reality'],
      prerequisites: ['yuna_condition', 'true_purpose'],
      discoveryMethod: ['progenitor_revelation', 'yuna_contact', 'hidden_memory'],
      timesReferenced: 0,
    });

    this.addLoreEntry({
      id: 'progenitor_origins',
      title: 'Origin of the Progenitors',
      category: 'deep',
      content: 'The Progenitors were not originally vampires. They were the first to cross between realities, and their transformation was a side effect of this crossing. Kael\'s bloodline connects to the original Progenitors.',
      tags: ['progenitor', 'origin', 'bloodline'],
      relatedEntities: ['Kael', 'First Progenitor', 'Reality Crossing'],
      prerequisites: ['vampire_class', 'true_purpose'],
      discoveryMethod: ['elder_revelation', 'ancient_text', 'progenitor_test'],
      timesReferenced: 0,
    });

    // Initialize Plot Threads
    this.initializePlotThreads();
    
    // Initialize Mysteries
    this.initializeMysteries();
  }

  /**
   * Initialize main plot threads
   */
  private initializePlotThreads(): void {
    this.plotThreads.set('save_yuna', {
      id: 'save_yuna',
      name: 'Saving Yuna',
      description: 'Kael\'s primary motivation - find a way to save his sister from her mysterious coma',
      status: 'active',
      introducedChapter: 1,
      keyEvents: [],
      connectedLore: ['yuna_condition', 'yuna_truth'],
      importance: 'main',
      tension: 8,
    });

    this.plotThreads.set('eclipsis_mystery', {
      id: 'eclipsis_mystery',
      name: 'The Mystery of Eclipsis',
      description: 'Uncovering the true nature and purpose of the VR game Eclipsis Online',
      status: 'active',
      introducedChapter: 1,
      keyEvents: [],
      connectedLore: ['eclipsis_basics', 'headset_origin', 'true_purpose'],
      importance: 'main',
      tension: 7,
    });

    this.plotThreads.set('progenitor_awakening', {
      id: 'progenitor_awakening',
      name: 'Progenitor Awakening',
      description: 'Kael\'s transformation and growth as a Vampire Progenitor',
      status: 'active',
      introducedChapter: 1,
      keyEvents: [],
      connectedLore: ['vampire_class', 'blood_sickness', 'progenitor_origins'],
      importance: 'major',
      tension: 6,
    });

    this.plotThreads.set('reality_bleed', {
      id: 'reality_bleed',
      name: 'Reality Bleed',
      description: 'The growing connection between VR and the real world, with strange effects manifesting in reality',
      status: 'dormant',
      introducedChapter: 5,
      keyEvents: [],
      connectedLore: ['system_anomalies', 'true_purpose'],
      importance: 'major',
      tension: 5,
    });
  }

  /**
   * Initialize mysteries
   */
  private initializeMysteries(): void {
    this.mysteries.set('who_sent_headset', {
      id: 'who_sent_headset',
      question: 'Who sent the mysterious VR headset to Kael?',
      answer: 'A faction of the original Progenitors, seeking to reconnect with their lost bloodline',
      hints: [
        'The headset arrived without a return address',
        'Its technology is impossibly advanced',
        'Yuna\'s condition began before the headset arrived',
        'The system recognizes Kael\'s bloodline',
        'Hidden messages from "The First"',
      ],
      revealedHints: [],
      layer: 'hidden',
      significance: 8,
      revealed: false,
    });

    this.mysteries.set('yuna_location', {
      id: 'yuna_location',
      question: 'Where is Yuna\'s consciousness?',
      answer: 'Trapped in a hidden sector of Eclipsis that exists between VR and reality',
      hints: [
        'Yuna sometimes whispers about "the other place"',
        'Eclipsis has zones that don\'t appear on any map',
        'Progenitors can sense souls across worlds',
        'System glitches show a phantom player ID',
        'Blood connection reveals paths to lost souls',
      ],
      revealedHints: [],
      layer: 'deep',
      significance: 10,
      revealed: false,
    });

    this.mysteries.set('eclipsis_creator', {
      id: 'eclipsis_creator',
      question: 'Who created Eclipsis Online?',
      answer: 'The original Progenitors created it as a bridge between realities, but it was corrupted by an unknown force',
      hints: [
        'No company claims ownership of Eclipsis',
        'The code contains languages that shouldn\'t exist',
        'Ancient vampire texts mention "The Bridge"',
        'System administrators are not human',
        'The game updates itself from unknown sources',
      ],
      revealedHints: [],
      layer: 'deep',
      significance: 9,
      revealed: false,
    });
  }

  /**
   * Add a lore entry
   */
  private addLoreEntry(entry: LoreEntry): void {
    this.loreEntries.set(entry.id, entry);
  }

  /**
   * Discover lore entry
   */
  discoverLore(loreId: string, chapterNumber: number): LoreEntry | null {
    const lore = this.loreEntries.get(loreId);
    if (!lore) return null;
    
    // Check prerequisites
    const hasPrerequisites = lore.prerequisites.every(p => this.discoveredLore.includes(p));
    if (!hasPrerequisites) return null;
    
    // Mark as discovered
    if (!this.discoveredLore.includes(loreId)) {
      this.discoveredLore.push(loreId);
      lore.chapterRevealed = chapterNumber;
    }
    
    lore.timesReferenced++;
    return lore;
  }

  /**
   * Get lore appropriate for current chapter
   */
  getLoreForChapter(chapterNumber: number): {
    surface: LoreEntry[];
    hidden: LoreEntry[];
    deep: LoreEntry[];
  } {
    this.currentChapter = chapterNumber;
    
    const surface = Array.from(this.loreEntries.values())
      .filter(l => l.category === 'surface' && l.chapterRevealed && l.chapterRevealed <= chapterNumber)
      .slice(-5);
    
    const hidden = Array.from(this.loreEntries.values())
      .filter(l => l.category === 'hidden' && l.chapterRevealed && l.chapterRevealed <= chapterNumber)
      .slice(-3);
    
    const deep = Array.from(this.loreEntries.values())
      .filter(l => l.category === 'deep' && l.chapterRevealed && l.chapterRevealed <= chapterNumber)
      .slice(-2);
    
    return { surface, hidden, deep };
  }

  /**
   * Suggest next lore discovery
   */
  suggestNextDiscovery(): LoreEntry | null {
    const availableLore = Array.from(this.loreEntries.values())
      .filter(l => !l.chapterRevealed)
      .filter(l => l.prerequisites.every(p => this.discoveredLore.includes(p)))
      .sort((a, b) => {
        const order = { surface: 1, hidden: 2, deep: 3 };
        return order[a.category] - order[b.category];
      });
    
    return availableLore[0] || null;
  }

  /**
   * Get hint for mystery
   */
  getMysteryHint(mysteryId: string): string | null {
    const mystery = this.mysteries.get(mysteryId);
    if (!mystery || mystery.revealed) return null;
    
    const unrevealedHints = mystery.hints.filter((_, i) => !mystery.revealedHints.includes(i));
    if (unrevealedHints.length === 0) return null;
    
    const hintIndex = mystery.hints.indexOf(unrevealedHints[Math.floor(Math.random() * unrevealedHints.length)]);
    mystery.revealedHints.push(hintIndex);
    
    return mystery.hints[hintIndex];
  }

  /**
   * Reveal mystery answer
   */
  revealMystery(mysteryId: string, chapterNumber: number): Mystery | null {
    const mystery = this.mysteries.get(mysteryId);
    if (!mystery || mystery.revealed) return null;
    
    mystery.revealed = true;
    mystery.revealChapter = chapterNumber;
    
    return mystery;
  }

  /**
   * Update plot thread
   */
  updatePlotThread(threadId: string, event: string): PlotThread | null {
    const thread = this.plotThreads.get(threadId);
    if (!thread) return null;
    
    thread.keyEvents.push(event);
    return thread;
  }

  /**
   * Activate dormant plot thread
   */
  activatePlotThread(threadId: string): void {
    const thread = this.plotThreads.get(threadId);
    if (thread && thread.status === 'dormant') {
      thread.status = 'active';
    }
  }

  /**
   * Resolve plot thread
   */
  resolvePlotThread(threadId: string, chapterNumber: number): void {
    const thread = this.plotThreads.get(threadId);
    if (thread) {
      thread.status = 'resolved';
      thread.resolvedChapter = chapterNumber;
    }
  }

  /**
   * Get active plot threads
   */
  getActiveThreads(): PlotThread[] {
    return Array.from(this.plotThreads.values())
      .filter(t => t.status === 'active')
      .sort((a, b) => b.tension - a.tension);
  }

  /**
   * Generate lore reference for narrative
   */
  generateLoreReference(context: string): string {
    const relevantLore = Array.from(this.loreEntries.values())
      .filter(l => l.chapterRevealed && l.chapterRevealed <= this.currentChapter)
      .filter(l => l.tags.some(t => context.toLowerCase().includes(t.toLowerCase())))
      .sort((a, b) => b.timesReferenced - a.timesReferenced);
    
    if (relevantLore.length === 0) return '';
    
    const selected = relevantLore[0];
    selected.timesReferenced++;
    
    return selected.content;
  }

  /**
   * Export lore state
   */
  exportState(): any {
    return {
      loreEntries: Array.from(this.loreEntries.entries()),
      plotThreads: Array.from(this.plotThreads.entries()),
      mysteries: Array.from(this.mysteries.entries()),
      discoveredLore: this.discoveredLore,
      currentChapter: this.currentChapter,
    };
  }

  /**
   * Import lore state
   */
  importState(state: any): void {
    if (state.loreEntries) this.loreEntries = new Map(state.loreEntries);
    if (state.plotThreads) this.plotThreads = new Map(state.plotThreads);
    if (state.mysteries) this.mysteries = new Map(state.mysteries);
    if (state.discoveredLore) this.discoveredLore = state.discoveredLore;
    if (state.currentChapter) this.currentChapter = state.currentChapter;
  }
}

export default LoreManager;