/**
 * Memory System - World Remembers Everything
 * NPCs, factions, and the world remember Kael's actions and respond accordingly
 * Provides persistent consequences for player choices
 */

export interface MemoryEntry {
  id: string;
  timestamp: string;
  type: 'interaction' | 'battle' | 'discovery' | 'choice' | 'betrance' | 'ally';
  actor: string; // Who performed the action (usually "Kael")
  target: string; // Who received the action
  action: string;
  location: string;
  world: 'real' | 'vr';
  impact: number; // -10 to 10, negative = harmful, positive = helpful
  witnesses: string[];
  consequences: string[];
  emotionalResonance: number; // 0-10
}

export interface RelationshipState {
  character1: string;
  character2: string;
  currentStanding: number; // -100 to 100
  history: MemoryEntry[];
  trustLevel: number; // 0-100
  fearLevel: number; // 0-100
  respectLevel: number; // 0-100
  grudges: string[];
  favors: string[];
  secretsShared: string[];
}

export interface WorldConsequence {
  id: string;
  type: 'environmental' | 'social' | 'economic' | 'political' | 'system';
  description: string;
  cause: MemoryEntry;
  duration: 'temporary' | 'permanent' | 'until_resolved';
  affectedEntities: string[];
  severity: number; // 1-10
  timeUntilResolution?: number; // chapters until resolution
}

export interface NPCMemoryProfile {
  npcId: string;
  name: string;
  memoryEntries: MemoryEntry[];
  personalFeelingsAboutKael: number; // -100 to 100
  rumorsKnown: string[];
  knowledgeOfSecrets: string[];
  desires: string[];
  fears: string[];
  loyalties: Map<string, number>; // who they're loyal to and how much
  goals: string[];
  reactionStrategy: 'friendly' | 'neutral' | 'hostile' | 'cautious' | 'opportunistic';
}

export class MemorySystem {
  private memoryEntries: MemoryEntry[] = [];
  private relationships: Map<string, RelationshipState> = new Map();
  private consequences: WorldConsequence[] = [];
  private npcProfiles: Map<string, NPCMemoryProfile> = new Map();
  private worldState: {
    reputation: { [key: string]: number }; // faction -> reputation
    rumors: string[];
    culturalShifts: string[];
    economicChanges: string[];
  };

  constructor() {
    this.worldState = {
      reputation: {
        'vampire_clans': 0,
        'human_guilds': 0,
        'system_admins': 0,
        'hospital_staff': 0,
        'general_public': 0,
      },
      rumors: [],
      culturalShifts: [],
      economicChanges: [],
    };
    this.initializeNPCProfiles();
  }

  /**
   * Initialize key NPC memory profiles
   */
  private initializeNPCProfiles(): void {
    // Hospital staff
    this.createNPCProfile({
      npcId: 'doctor_mercer',
      name: 'Dr. Mercer',
      personalFeelingsAboutKael: 30,
      rumorsKnown: ['Kael visits his sister daily'],
      knowledgeOfSecrets: [],
      desires: ['Help patients', 'Discover medical breakthrough'],
      fears: ['Losing patients', 'Medical malpractice'],
      loyalties: new Map([['hospital', 90], ['patients', 85]]),
      goals: ['Find treatment for Yuna', 'Maintain hospital reputation'],
      reactionStrategy: 'cautious',
    });

    // System Guide
    this.createNPCProfile({
      npcId: 'system_guide',
      name: 'System Guide',
      personalFeelingsAboutKael: 50,
      rumorsKnown: [],
      knowledgeOfSecrets: ['Progenitor origin', 'System limitations'],
      desires: ['Help Kael succeed', 'Maintain system stability'],
      fears: ['System collapse', 'Corruption'],
      loyalties: new Map([['system', 100], ['progenitors', 80]]),
      goals: ['Guide Kael', 'Prevent catastrophic errors'],
      reactionStrategy: 'friendly',
    });

    // Vampire Elder
    this.createNPCProfile({
      npcId: 'vampire_elder_dracul',
      name: 'Elder Dracul',
      personalFeelingsAboutKael: 20,
      rumorsKnown: ['New Progenitor appeared'],
      knowledgeOfSecrets: ['Ancient bloodlines', 'Hidden vampire history'],
      desires: ['Restore vampire supremacy', 'Control Eclipsis'],
      fears: ['True death', 'Loss of power'],
      loyalties: new Map([['vampire_clans', 95], ['bloodline', 70]]),
      goals: ['Manipulate Kael', 'Eliminate rivals'],
      reactionStrategy: 'opportunistic',
    });

    // Alex (Kael's friend)
    this.createNPCProfile({
      npcId: 'alex',
      name: 'Alex',
      personalFeelingsAboutKael: 80,
      rumorsKnown: [],
      knowledgeOfSecrets: ['Kael\'s sister situation', 'VR headset origin'],
      desires: ['Help Kael', 'Protect friendship'],
      fears: ['Losing Kael', 'Being left behind'],
      loyalties: new Map([['kael', 95], ['their_group', 70]]),
      goals: ['Support Kael', 'Keep secrets safe'],
      reactionStrategy: 'friendly',
    });
  }

  /**
   * Create NPC memory profile
   */
  private createNPCProfile(profile: Omit<NPCMemoryProfile, 'memoryEntries'>): void {
    const fullProfile: NPCMemoryProfile = {
      ...profile,
      memoryEntries: [],
    };
    this.npcProfiles.set(profile.npcId, fullProfile);
  }

  /**
   * Record a memory entry
   */
  recordMemory(entry: MemoryEntry): void {
    this.memoryEntries.push(entry);
    
    // Update relationships
    this.updateRelationships(entry);
    
    // Update NPC profiles
    this.updateNPCProfiles(entry);
    
    // Generate consequences
    this.generateConsequences(entry);
    
    // Update world state
    this.updateWorldState(entry);
  }

  /**
   * Update relationships based on action
   */
  private updateRelationships(entry: MemoryEntry): void {
    const relationshipKey = `${entry.actor}-${entry.target}`;
    const reverseKey = `${entry.target}-${entry.actor}`;
    
    let relationship = this.relationships.get(relationshipKey) || 
                      this.relationships.get(reverseKey);
    
    if (!relationship) {
      relationship = {
        character1: entry.actor,
        character2: entry.target,
        currentStanding: 0,
        history: [],
        trustLevel: 50,
        fearLevel: 0,
        respectLevel: 50,
        grudges: [],
        favors: [],
        secretsShared: [],
      };
      this.relationships.set(relationshipKey, relationship);
    }
    
    // Update standing based on impact
    relationship.currentStanding += entry.impact;
    relationship.currentStanding = Math.max(-100, Math.min(100, relationship.currentStanding));
    
    // Update trust
    if (entry.type === 'ally' || entry.impact > 0) {
      relationship.trustLevel += Math.floor(entry.impact / 2);
    } else if (entry.type === 'betrance' || entry.impact < -5) {
      relationship.trustLevel -= Math.floor(Math.abs(entry.impact) / 2);
    }
    relationship.trustLevel = Math.max(0, Math.min(100, relationship.trustLevel));
    
    // Update fear
    if (entry.type === 'battle' && entry.impact > 5) {
      relationship.fearLevel += 10;
    }
    relationship.fearLevel = Math.max(0, Math.min(100, relationship.fearLevel));
    
    // Update respect
    if (entry.impact > 5) {
      relationship.respectLevel += 5;
    }
    relationship.respectLevel = Math.max(0, Math.min(100, relationship.respectLevel));
    
    // Track grudges
    if (entry.impact < -5) {
      relationship.grudges.push(entry.action);
    }
    
    // Track favors
    if (entry.impact > 5 && entry.type !== 'battle') {
      relationship.favors.push(entry.action);
    }
    
    relationship.history.push(entry);
  }

  /**
   * Update NPC profiles with new memory
   */
  private updateNPCProfiles(entry: MemoryEntry): void {
    // Update personal feelings if NPC is involved
    const targetProfile = this.npcProfiles.get(entry.target);
    if (targetProfile) {
      targetProfile.personalFeelingsAboutKael += entry.impact;
      targetProfile.personalFeelingsAboutKael = Math.max(-100, Math.min(100, targetProfile.personalFeelingsAboutKael));
      
      if (entry.type === 'interaction') {
        targetProfile.memoryEntries.push(entry);
      }
    }
    
    // Witnesses remember
    for (const witness of entry.witnesses) {
      const witnessProfile = this.npcProfiles.get(witness);
      if (witnessProfile) {
        witnessProfile.rumorsKnown.push(`${entry.actor} ${entry.action} ${entry.target}`);
        witnessProfile.memoryEntries.push(entry);
      }
    }
  }

  /**
   * Generate world consequences from actions
   */
  private generateConsequences(entry: MemoryEntry): void {
    const consequences: WorldConsequence[] = [];
    
    // High-impact actions have consequences
    if (Math.abs(entry.impact) >= 7) {
      if (entry.type === 'battle' && entry.target.includes('boss')) {
        consequences.push({
          id: `consequence_${Date.now()}_1`,
          type: 'political',
          description: `${entry.target}'s defeat causes power vacuum in ${entry.location}`,
          cause: entry,
          duration: 'until_resolved',
          affectedEntities: ['vampire_clans', 'local_guilds'],
          severity: Math.ceil(Math.abs(entry.impact) / 2),
          timeUntilResolution: 10,
        });
      }
      
      if (entry.type === 'choice' && entry.impact > 7) {
        consequences.push({
          id: `consequence_${Date.now()}_2`,
          type: 'social',
          description: `${entry.actor}'s heroic act spreads as rumors throughout ${entry.world}`,
          cause: entry,
          duration: 'permanent',
          affectedEntities: ['general_public'],
          severity: Math.floor(entry.impact / 2),
        });
      }
      
      if (entry.type === 'betrance' && entry.impact < -7) {
        consequences.push({
          id: `consequence_${Date.now()}_3`,
          type: 'political',
          description: `${entry.target}'s betrayal destroys trust with ${entry.actor}`,
          cause: entry,
          duration: 'permanent',
          affectedEntities: [entry.target, `${entry.target}_allies`],
          severity: Math.ceil(Math.abs(entry.impact) / 2),
        });
      }
    }
    
    // Environmental consequences
    if (entry.type === 'battle' && entry.location.includes('zone')) {
      consequences.push({
        id: `consequence_${Date.now()}_4`,
        type: 'environmental',
        description: `${entry.location} damaged from battle, temporary instability`,
        cause: entry,
        duration: 'temporary',
        affectedEntities: [entry.location],
        severity: 3,
        timeUntilResolution: 5,
      });
    }
    
    this.consequences.push(...consequences);
  }

  /**
   * Update world state based on action
   */
  private updateWorldState(entry: MemoryEntry): void {
    // Update reputation
    for (const faction in this.worldState.reputation) {
      if (entry.action.toLowerCase().includes(faction)) {
        this.worldState.reputation[faction] += entry.impact;
        this.worldState.reputation[faction] = Math.max(-100, Math.min(100, this.worldState.reputation[faction]));
      }
    }
    
    // Generate rumors
    if (entry.emotionalResonance > 5) {
      const rumor = `${entry.actor} ${entry.action.toLowerCase()} in ${entry.location}`;
      if (!this.worldState.rumors.includes(rumor)) {
        this.worldState.rumors.push(rumor);
        // Keep only recent rumors
        if (this.worldState.rumors.length > 20) {
          this.worldState.rumors.shift();
        }
      }
    }
  }

  /**
   * Get relationship between two characters
   */
  getRelationship(char1: string, char2: string): RelationshipState | null {
    const key = `${char1}-${char2}`;
    const reverseKey = `${char2}-${char1}`;
    return this.relationships.get(key) || this.relationships.get(reverseKey) || null;
  }

  /**
   * Get NPC reaction based on history
   */
  getNPCReaction(npcId: string, currentSituation: string): string {
    const profile = this.npcProfiles.get(npcId);
    if (!profile) {
      return 'Unknown NPC';
    }
    
    const kaelRelationship = this.getRelationship(npcId, 'Kael');
    const feelings = kaelRelationship?.currentStanding || 0;
    
    // Generate reaction based on feelings and strategy
    switch (profile.reactionStrategy) {
      case 'friendly':
        if (feelings > 30) {
          return `${profile.name} greets Kael warmly, ${this.generateFriendlyDialogue(profile)}`;
        }
        return `${profile.name} offers cautious assistance`;
      
      case 'hostile':
        if (feelings < -20) {
          return `${profile.name} reacts with hostility, ${this.generateHostileDialogue(profile)}`;
        }
        return `${profile.name} watches warily`;
      
      case 'cautious':
        return `${profile.name} assesses the situation carefully before responding`;
      
      case 'opportunistic':
        if (feelings > 20) {
          return `${profile.name} sees an opportunity to advance their goals`;
        }
        return `${profile.name} waits for the right moment`;
      
      case 'neutral':
      default:
        return `${profile.name} responds according to established protocols`;
    }
  }

  /**
   * Generate friendly dialogue
   */
  private generateFriendlyDialogue(profile: NPCMemoryProfile): string {
    const dialogues = [
      '"I\'ve heard good things about what you\'ve been doing."',
      '"We appreciate your help around here."',
      '"Let me know if there\'s anything I can do."',
      '"You\'ve earned my trust."',
      '"I believe in what you\'re trying to accomplish."',
    ];
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }

  /**
   * Generate hostile dialogue
   */
  private generateHostileDialogue(profile: NPCMemoryProfile): string {
    const dialogues = [
      '"You\'ve made a dangerous enemy."',
      '"I won\'t forget what you\'ve done."',
      '"Your actions have consequences."',
      '"I\'m watching you."',
      '"This isn\'t over."',
    ];
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  }

  /**
   * Get active consequences affecting current situation
   */
  getActiveConsequences(location?: string): WorldConsequence[] {
    const active = this.consequences.filter(c => {
      if (location && c.affectedEntities.includes(location)) {
        return true;
      }
      return c.duration === 'permanent' || 
             (c.timeUntilResolution && c.timeUntilResolution > 0);
    });
    
    // Decrease resolution timers
    for (const consequence of active) {
      if (consequence.timeUntilResolution) {
        consequence.timeUntilResolution--;
      }
    }
    
    return active;
  }

  /**
   * Get world rumors
   */
  getRumors(limit?: number): string[] {
    return limit ? this.worldState.rumors.slice(-limit) : [...this.worldState.rumors];
  }

  /**
   * Get faction reputation
   */
  getFactionReputation(faction: string): number {
    return this.worldState.reputation[faction] || 0;
  }

  /**
   * Get NPC memory profile
   */
  getNPCProfile(npcId: string): NPCMemoryProfile | null {
    return this.npcProfiles.get(npcId) || null;
  }

  /**
   * Get recent memories for context
   */
  getRecentMemories(limit?: number): MemoryEntry[] {
    return limit ? this.memoryEntries.slice(-limit) : [...this.memoryEntries];
  }

  /**
   * Get memory entries by type
   */
  getMemoriesByType(type: MemoryEntry['type']): MemoryEntry[] {
    return this.memoryEntries.filter(m => m.type === type);
  }

  /**
   * Check if character remembers specific event
   */
  characterRemembers(characterId: string, eventDescription: string): boolean {
    const profile = this.npcProfiles.get(characterId);
    if (!profile) return false;
    
    return profile.memoryEntries.some(m => 
      m.action.toLowerCase().includes(eventDescription.toLowerCase())
    );
  }

  /**
   * Generate world reaction to Kael's actions
   */
  generateWorldReaction(): string[] {
    const reactions: string[] = [];
    const recentMemories = this.getRecentMemories(5);
    
    // Analyze recent actions
    const positiveActions = recentMemories.filter(m => m.impact > 3).length;
    const negativeActions = recentMemories.filter(m => m.impact < -3).length;
    const battleActions = recentMemories.filter(m => m.type === 'battle').length;
    
    // Generate reactions based on patterns
    if (positiveActions > negativeActions) {
      reactions.push('Word of Kael\'s heroics spreads throughout the realm');
      reactions.push('NPCs view Kael with increasing respect');
    }
    
    if (negativeActions > positiveActions) {
      reactions.push('Whispers of Kael\'s dark deeds spread fear');
      reactions.push('Some factions begin to oppose Kael');
    }
    
    if (battleActions >= 3) {
      reactions.push('Combat prowess attracts attention from powerful entities');
      reactions.push('Mercenaries and warriors seek challenge against Kael');
    }
    
    // Add rumor-based reactions
    const rumors = this.getRumors(3);
    rumors.forEach(rumor => {
      reactions.push(`Rumors circulate: "${rumor}"`);
    });
    
    return reactions;
  }

  /**
   * Export memory state for persistence
   */
  exportState(): any {
    return {
      memoryEntries: this.memoryEntries,
      relationships: Array.from(this.relationships.entries()),
      consequences: this.consequences,
      npcProfiles: Array.from(this.npcProfiles.entries()),
      worldState: this.worldState,
    };
  }

  /**
   * Import memory state
   */
  importState(state: any): void {
    if (state.memoryEntries) this.memoryEntries = state.memoryEntries;
    if (state.relationships) this.relationships = new Map(state.relationships);
    if (state.consequences) this.consequences = state.consequences;
    if (state.npcProfiles) this.npcProfiles = new Map(state.npcProfiles);
    if (state.worldState) this.worldState = state.worldState;
  }
}

export default MemorySystem;