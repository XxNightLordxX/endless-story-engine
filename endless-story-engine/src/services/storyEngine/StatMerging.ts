/**
 * Stat Merging & Reality Integration System
 * Handles the transfer and merging of stats between Real and VR worlds
 */

import type { CharacterStat } from '../../types';

export interface StatMergeConfig {
  enabled: boolean;
  conversionRate: number; // How much VR stats transfer to real world
  maxTransferPerDay: number;
  minimumSyncLevel: number; // Minimum sync required for stat transfer
  decayRate: number; // How fast unconsolidated stats decay
}

export interface StatHistory {
  timestamp: string;
  statName: string;
  oldValue: number;
  newValue: number;
  source: 'real' | 'vr';
  reason: string;
}

export interface SyncEvent {
  timestamp: string;
  syncLevel: number;
  effects: string[];
  transferredStats: { stat: string; amount: number }[];
}

export interface RealityIntegration {
  realWorld: {
    stats: CharacterStat;
    skills: string[];
    abilities: string[];
    physicalCondition: number;
    mentalCondition: number;
  };
  vrWorld: {
    stats: CharacterStat;
    skills: string[];
    abilities: string[];
    avatarCondition: number;
    systemConnection: number;
  };
  syncLevel: number;
  bleedEffects: string[];
  mergeQueue: { stat: string; amount: number; source: 'real' | 'vr' }[];
}

export class StatMerging {
  private config: StatMergeConfig;
  private history: StatHistory[];
  private syncEvents: SyncEvent[];
  private currentIntegration: RealityIntegration;
  private statCaps: Map<string, number>;

  constructor(config?: Partial<StatMergeConfig>) {
    this.config = {
      enabled: true,
      conversionRate: 0.8,
      maxTransferPerDay: 10,
      minimumSyncLevel: 30,
      decayRate: 0.05,
      ...config,
    };

    this.history = [];
    this.syncEvents = [];
    this.statCaps = new Map([
      ['strength', 100],
      ['dexterity', 100],
      ['constitution', 100],
      ['intelligence', 100],
      ['wisdom', 100],
      ['charisma', 100],
      ['perception', 100],
      ['luck', 100],
      ['attack', 200],
      ['defense', 200],
      ['maxHP', 1000],
      ['maxMP', 500],
    ]);

    this.currentIntegration = this.initializeIntegration();
  }

  /**
   * Initialize reality integration state
   */
  private initializeIntegration(): RealityIntegration {
    const baseStats: CharacterStat = {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      perception: 10,
      luck: 5,
      attack: 15,
      defense: 10,
      maxHP: 100,
      maxMP: 50,
    };

    return {
      realWorld: {
        stats: { ...baseStats },
        skills: [],
        abilities: [],
        physicalCondition: 100,
        mentalCondition: 100,
      },
      vrWorld: {
        stats: { ...baseStats },
        skills: [],
        abilities: [],
        avatarCondition: 100,
        systemConnection: 50,
      },
      syncLevel: 0,
      bleedEffects: [],
      mergeQueue: [],
    };
  }

  /**
   * Update VR world stats
   */
  updateVRStats(statName: string, value: number, reason: string): StatHistory {
    const oldValue = this.currentIntegration.vrWorld.stats[statName as keyof CharacterStat] || 0;
    const newValue = Math.min(this.statCaps.get(statName) || 100, Math.max(0, value));
    
    if (statName in this.currentIntegration.vrWorld.stats) {
      (this.currentIntegration.vrWorld.stats as any)[statName] = newValue;
    }

    const historyEntry: StatHistory = {
      timestamp: new Date().toISOString(),
      statName,
      oldValue,
      newValue,
      source: 'vr',
      reason,
    };

    this.history.push(historyEntry);
    return historyEntry;
  }

  /**
   * Update Real world stats
   */
  updateRealStats(statName: string, value: number, reason: string): StatHistory {
    const oldValue = this.currentIntegration.realWorld.stats[statName as keyof CharacterStat] || 0;
    const newValue = Math.min(this.statCaps.get(statName) || 100, Math.max(0, value));
    
    if (statName in this.currentIntegration.realWorld.stats) {
      (this.currentIntegration.realWorld.stats as any)[statName] = newValue;
    }

    const historyEntry: StatHistory = {
      timestamp: new Date().toISOString(),
      statName,
      oldValue,
      newValue,
      source: 'real',
      reason,
    };

    this.history.push(historyEntry);
    return historyEntry;
  }

  /**
   * Queue stat for transfer between worlds
   */
  queueStatTransfer(statName: string, amount: number, source: 'real' | 'vr'): void {
    if (!this.config.enabled) return;

    this.currentIntegration.mergeQueue.push({
      stat: statName,
      amount,
      source,
    });
  }

  /**
   * Process stat merge (VR -> Real transfer)
   */
  processMerge(): SyncEvent {
    const event: SyncEvent = {
      timestamp: new Date().toISOString(),
      syncLevel: this.currentIntegration.syncLevel,
      effects: [],
      transferredStats: [],
    };

    if (!this.config.enabled) {
      event.effects.push('Stat merging is disabled');
      return event;
    }

    if (this.currentIntegration.syncLevel < this.config.minimumSyncLevel) {
      event.effects.push(`Sync level too low (${this.currentIntegration.syncLevel}% < ${this.config.minimumSyncLevel}%)`);
      return event;
    }

    // Process merge queue
    let totalTransferred = 0;
    const queueToProcess = [...this.currentIntegration.mergeQueue];
    this.currentIntegration.mergeQueue = [];

    for (const item of queueToProcess) {
      if (totalTransferred >= this.config.maxTransferPerDay) {
        // Re-queue remaining items
        this.currentIntegration.mergeQueue.push(item);
        continue;
      }

      const transferAmount = item.amount * this.config.conversionRate;
      
      if (item.source === 'vr') {
        // VR to Real transfer
        const currentValue = this.currentIntegration.realWorld.stats[item.stat as keyof CharacterStat] || 0;
        const newValue = Math.min(
          this.statCaps.get(item.stat) || 100,
          currentValue + transferAmount
        );

        (this.currentIntegration.realWorld.stats as any)[item.stat] = newValue;
        
        event.transferredStats.push({
          stat: item.stat,
          amount: newValue - currentValue,
        });
        
        event.effects.push(`Transferred ${item.stat}: +${(newValue - currentValue).toFixed(1)} to Real World`);
      } else {
        // Real to VR transfer (rare)
        const currentValue = this.currentIntegration.vrWorld.stats[item.stat as keyof CharacterStat] || 0;
        const newValue = Math.min(
          this.statCaps.get(item.stat) || 100,
          currentValue + transferAmount
        );

        (this.currentIntegration.vrWorld.stats as any)[item.stat] = newValue;
        
        event.transferredStats.push({
          stat: item.stat,
          amount: newValue - currentValue,
        });
        
        event.effects.push(`Transferred ${item.stat}: +${(newValue - currentValue).toFixed(1)} to VR World`);
      }

      totalTransferred += Math.abs(transferAmount);
    }

    // Generate bleed effects at high sync
    if (this.currentIntegration.syncLevel >= 70) {
      const bleedEffect = this.generateBleedEffect();
      if (bleedEffect) {
        event.effects.push(`Bleed effect: ${bleedEffect}`);
        this.currentIntegration.bleedEffects.push(bleedEffect);
      }
    }

    this.syncEvents.push(event);
    return event;
  }

  /**
   * Generate bleed effect at high sync levels
   */
  private generateBleedEffect(): string | null {
    const effects = [
      'Phantom sensation from VR damage persists',
      'VR skill reflexes appear in real world',
      'Dreams of the VR world',
      'Enhanced real-world senses',
      'Muscle memory from VR training',
      'Intuition enhanced by VR experience',
      'Real world feels slightly unreal',
      'System messages appear in peripheral vision',
    ];

    // Only generate effect 30% of the time
    if (Math.random() > 0.3) return null;

    return effects[Math.floor(Math.random() * effects.length)];
  }

  /**
   * Update sync level between worlds
   */
  updateSyncLevel(change: number): void {
    this.currentIntegration.syncLevel = Math.max(0, Math.min(100, this.currentIntegration.syncLevel + change));
  }

  /**
   * Get current sync level
   */
  getSyncLevel(): number {
    return this.currentIntegration.syncLevel;
  }

  /**
   * Get combined stats (average of both worlds weighted by sync)
   */
  getCombinedStats(): CharacterStat {
    const realStats = this.currentIntegration.realWorld.stats;
    const vrStats = this.currentIntegration.vrWorld.stats;
    const syncWeight = this.currentIntegration.syncLevel / 100;

    const combined: CharacterStat = {
      strength: Math.round((realStats.strength || 0) * (1 - syncWeight * 0.3) + (vrStats.strength || 0) * syncWeight * 0.3),
      dexterity: Math.round((realStats.dexterity || 0) * (1 - syncWeight * 0.3) + (vrStats.dexterity || 0) * syncWeight * 0.3),
      constitution: Math.round((realStats.constitution || 0) * (1 - syncWeight * 0.3) + (vrStats.constitution || 0) * syncWeight * 0.3),
      intelligence: Math.round((realStats.intelligence || 0) * (1 - syncWeight * 0.5) + (vrStats.intelligence || 0) * syncWeight * 0.5),
      wisdom: Math.round((realStats.wisdom || 0) * (1 - syncWeight * 0.5) + (vrStats.wisdom || 0) * syncWeight * 0.5),
      charisma: Math.round((realStats.charisma || 0) * (1 - syncWeight * 0.3) + (vrStats.charisma || 0) * syncWeight * 0.3),
      perception: Math.round((realStats.perception || 0) * (1 - syncWeight * 0.4) + (vrStats.perception || 0) * syncWeight * 0.4),
      luck: Math.round((realStats.luck || 0) * (1 - syncWeight * 0.2) + (vrStats.luck || 0) * syncWeight * 0.2),
      attack: Math.round((realStats.attack || 0) * (1 - syncWeight * 0.2) + (vrStats.attack || 0) * syncWeight * 0.2),
      defense: Math.round((realStats.defense || 0) * (1 - syncWeight * 0.2) + (vrStats.defense || 0) * syncWeight * 0.2),
      maxHP: Math.round((realStats.maxHP || 0) * (1 - syncWeight * 0.1) + (vrStats.maxHP || 0) * syncWeight * 0.1),
      maxMP: Math.round((realStats.maxMP || 0) * (1 - syncWeight * 0.1) + (vrStats.maxMP || 0) * syncWeight * 0.1),
    };

    return combined;
  }

  /**
   * Get real world stats
   */
  getRealStats(): CharacterStat {
    return { ...this.currentIntegration.realWorld.stats };
  }

  /**
   * Get VR world stats
   */
  getVRStats(): CharacterStat {
    return { ...this.currentIntegration.vrWorld.stats };
  }

  /**
   * Add skill to world
   */
  addSkill(skillName: string, world: 'real' | 'vr'): void {
    if (world === 'real') {
      if (!this.currentIntegration.realWorld.skills.includes(skillName)) {
        this.currentIntegration.realWorld.skills.push(skillName);
      }
    } else {
      if (!this.currentIntegration.vrWorld.skills.includes(skillName)) {
        this.currentIntegration.vrWorld.skills.push(skillName);
      }
    }
  }

  /**
   * Add ability to world
   */
  addAbility(abilityName: string, world: 'real' | 'vr'): void {
    if (world === 'real') {
      if (!this.currentIntegration.realWorld.abilities.includes(abilityName)) {
        this.currentIntegration.realWorld.abilities.push(abilityName);
      }
    } else {
      if (!this.currentIntegration.vrWorld.abilities.includes(abilityName)) {
        this.currentIntegration.vrWorld.abilities.push(abilityName);
      }
    }
  }

  /**
   * Apply stat decay (for unconsolidated gains)
   */
  applyDecay(): void {
    const decayRate = this.config.decayRate;

    // Decay VR stats slightly (encourages consolidation)
    for (const stat of Object.keys(this.currentIntegration.vrWorld.stats)) {
      const currentValue = (this.currentIntegration.vrWorld.stats as any)[stat];
      const baseValue = 10; // Base stat value
      const excessGain = Math.max(0, currentValue - baseValue);
      const decay = excessGain * decayRate;
      (this.currentIntegration.vrWorld.stats as any)[stat] = Math.max(baseValue, currentValue - decay);
    }
  }

  /**
   * Get stat history
   */
  getHistory(limit?: number): StatHistory[] {
    const history = [...this.history].reverse();
    return limit ? history.slice(0, limit) : history;
  }

  /**
   * Get sync events
   */
  getSyncEvents(limit?: number): SyncEvent[] {
    const events = [...this.syncEvents].reverse();
    return limit ? events.slice(0, limit) : events;
  }

  /**
   * Get bleed effects
   */
  getBleedEffects(): string[] {
    return [...this.currentIntegration.bleedEffects];
  }

  /**
   * Clear bleed effects
   */
  clearBleedEffects(): void {
    this.currentIntegration.bleedEffects = [];
  }

  /**
   * Get full integration state
   */
  getIntegrationState(): RealityIntegration {
    return {
      realWorld: {
        stats: { ...this.currentIntegration.realWorld.stats },
        skills: [...this.currentIntegration.realWorld.skills],
        abilities: [...this.currentIntegration.realWorld.abilities],
        physicalCondition: this.currentIntegration.realWorld.physicalCondition,
        mentalCondition: this.currentIntegration.realWorld.mentalCondition,
      },
      vrWorld: {
        stats: { ...this.currentIntegration.vrWorld.stats },
        skills: [...this.currentIntegration.vrWorld.skills],
        abilities: [...this.currentIntegration.vrWorld.abilities],
        avatarCondition: this.currentIntegration.vrWorld.avatarCondition,
        systemConnection: this.currentIntegration.vrWorld.systemConnection,
      },
      syncLevel: this.currentIntegration.syncLevel,
      bleedEffects: [...this.currentIntegration.bleedEffects],
      mergeQueue: [...this.currentIntegration.mergeQueue],
    };
  }

  /**
   * Reset integration state
   */
  resetIntegration(): void {
    this.currentIntegration = this.initializeIntegration();
    this.history = [];
    this.syncEvents = [];
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<StatMergeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get configuration
   */
  getConfig(): StatMergeConfig {
    return { ...this.config };
  }
}

export default StatMerging;