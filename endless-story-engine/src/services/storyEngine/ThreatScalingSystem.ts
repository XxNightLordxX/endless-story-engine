/**
 * Threat Scaling System
 * Ensures enemies and challenges evolve with Kael's power level
 * Provides meaningful challenge at all progression stages
 */

import type { CharacterStat } from '../../types';

export interface ThreatProfile {
  id: string;
  name: string;
  type: 'creature' | 'boss' | 'faction' | 'environmental' | 'system';
  baseLevel: number;
  scalingFactor: number;
  abilities: string[];
  weaknesses: string[];
  threatLevel: number; // 1-100
  evolutionStage: number;
  adaptationHistory: string[];
}

export interface ThreatContext {
  kaelLevel: number;
  kaelStats: CharacterStat;
  kaelSkills: string[];
  recentBattles: string[];
  currentZone: string;
  syncLevel: number;
  narrativePhase: string;
}

export interface ScaledEncounter {
  threat: ThreatProfile;
  difficulty: 'trivial' | 'easy' | 'moderate' | 'challenging' | 'deadly';
  recommendedLevel: number;
  expectedOutcome: 'victory' | 'struggle' | 'retreat' | 'unknown';
  tensionContribution: number;
  rewards: {
    experience: number;
    items: string[];
    skills: string[];
    lore: string[];
  };
  narrativeImpact: string[];
}

export class ThreatScalingSystem {
  private threatRegistry: Map<string, ThreatProfile>;
  private defeatedThreats: Map<string, number[]>; // threatId -> levels when defeated
  private adaptationRate: number;
  private challengeHistory: ScaledEncounter[];

  constructor() {
    this.threatRegistry = new Map();
    this.defeatedThreats = new Map();
    this.adaptationRate = 0.1; // How fast threats adapt to Kael's strategies
    this.challengeHistory = [];
    this.initializeBaseThreats();
  }

  /**
   * Initialize base threat templates
   */
  private initializeBaseThreats(): void {
    // VR World Threats
    this.registerThreat({
      id: 'vampire_hunter',
      name: 'Vampire Hunter',
      type: 'creature',
      baseLevel: 1,
      scalingFactor: 1.2,
      abilities: ['Holy Strike', 'Vampire Detection', 'Stake Attack'],
      weaknesses: ['Stealth', 'Blood Magic', 'Shadow Manipulation'],
      threatLevel: 10,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'blood_beast',
      name: 'Blood Beast',
      type: 'creature',
      baseLevel: 5,
      scalingFactor: 1.3,
      abilities: ['Blood Frenzy', 'Regeneration', 'Scent Tracking'],
      weaknesses: ['Fire', 'Sunlight', 'Holy Water'],
      threatLevel: 25,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'shadow_lord',
      name: 'Shadow Lord',
      type: 'boss',
      baseLevel: 10,
      scalingFactor: 1.5,
      abilities: ['Shadow Step', 'Darkness Aura', 'Soul Drain'],
      weaknesses: ['Light Magic', 'True Sight', 'Blood of Progenitor'],
      threatLevel: 50,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'system_enforcer',
      name: 'System Enforcer',
      type: 'system',
      baseLevel: 15,
      scalingFactor: 1.4,
      abilities: ['Code Manipulation', 'Reality Warp', 'Anti-Virus Protocol'],
      weaknesses: ['System Exploits', 'Progenitor Authority', 'Bloodline Override'],
      threatLevel: 60,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'elder_vampire',
      name: 'Elder Vampire',
      type: 'boss',
      baseLevel: 20,
      scalingFactor: 1.6,
      abilities: ['Ancient Blood Magic', 'Mist Form', 'Vampire Lord\'s Command'],
      weaknesses: ['Progenitor Blood', 'Sunlight', 'True Death'],
      threatLevel: 75,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'reality_bleeder',
      name: 'Reality Bleeder',
      type: 'system',
      baseLevel: 25,
      scalingFactor: 1.7,
      abilities: ['Dimensional Tear', 'Existence Erosion', 'Code Corruption'],
      weaknesses: ['Stability Anchors', 'Progenitor Shield', 'System Reset'],
      threatLevel: 85,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    // Real World Threats
    this.registerThreat({
      id: 'investigator',
      name: 'Mysterious Investigator',
      type: 'faction',
      baseLevel: 1,
      scalingFactor: 1.1,
      abilities: ['Surveillance', 'Questioning', 'Connection Discovery'],
      weaknesses: ['Misdirection', 'Plausible Deniability', 'Secret Keeping'],
      threatLevel: 15,
      evolutionStage: 1,
      adaptationHistory: [],
    });

    this.registerThreat({
      id: 'rival_company',
      name: 'Rival Corporation',
      type: 'faction',
      baseLevel: 10,
      scalingFactor: 1.3,
      abilities: ['Corporate Espionage', 'Resource Denial', 'Legal Pressure'],
      weaknesses: ['Counter-Intelligence', 'Public Exposure', 'VR Advantage'],
      threatLevel: 40,
      evolutionStage: 1,
      adaptationHistory: [],
    });
  }

  /**
   * Register a new threat
   */
  registerThreat(threat: ThreatProfile): void {
    this.threatRegistry.set(threat.id, threat);
  }

  /**
   * Generate appropriately scaled encounter
   */
  generateEncounter(context: ThreatContext): ScaledEncounter {
    // Calculate Kael's effective power level
    const kaelPower = this.calculatePowerLevel(context);
    
    // Select appropriate threat
    const threat = this.selectThreatForPowerLevel(kaelPower, context);
    
    // Scale the threat
    const scaledThreat = this.scaleThreat(threat, kaelPower, context);
    
    // Determine difficulty
    const difficulty = this.calculateDifficulty(scaledThreat, kaelPower);
    
    // Calculate rewards
    const rewards = this.calculateRewards(scaledThreat, difficulty);
    
    // Generate narrative impact
    const narrativeImpact = this.generateNarrativeImpact(scaledThreat, context);

    const encounter: ScaledEncounter = {
      threat: scaledThreat,
      difficulty,
      recommendedLevel: Math.floor(kaelPower / 10),
      expectedOutcome: this.predictOutcome(difficulty, context),
      tensionContribution: this.calculateTensionContribution(difficulty),
      rewards,
      narrativeImpact,
    };

    this.challengeHistory.push(encounter);
    return encounter;
  }

  /**
   * Calculate Kael's effective power level
   */
  private calculatePowerLevel(context: ThreatContext): number {
    const stats = context.kaelStats;
    const baseStatTotal = (stats.strength || 0) + 
                          (stats.dexterity || 0) + 
                          (stats.constitution || 0) + 
                          (stats.intelligence || 0) + 
                          (stats.wisdom || 0) + 
                          (stats.perception || 0);
    
    // Skill bonus
    const skillBonus = context.kaelSkills.length * 5;
    
    // Level bonus
    const levelBonus = context.kaelLevel * 10;
    
    // Sync bonus (VR powers bleeding to reality)
    const syncBonus = context.syncLevel * 0.5;
    
    return baseStatTotal + skillBonus + levelBonus + syncBonus;
  }

  /**
   * Select threat appropriate for power level
   */
  private selectThreatForPowerLevel(powerLevel: number, context: ThreatContext): ThreatProfile {
    const suitableThreats: ThreatProfile[] = [];
    
    for (const threat of this.threatRegistry.values()) {
      const minPower = threat.baseLevel * 10 * threat.scalingFactor;
      const maxPower = minPower * 3;
      
      // Check if threat is suitable
      if (powerLevel >= minPower * 0.5 && powerLevel <= maxPower * 2) {
        suitableThreats.push(threat);
      }
    }
    
    // If no suitable threats, pick closest
    if (suitableThreats.length === 0) {
      let closest = Array.from(this.threatRegistry.values())[0];
      let closestDiff = Infinity;
      
      for (const threat of this.threatRegistry.values()) {
        const threatPower = threat.baseLevel * 10 * threat.scalingFactor;
        const diff = Math.abs(threatPower - powerLevel);
        if (diff < closestDiff) {
          closestDiff = diff;
          closest = threat;
        }
      }
      suitableThreats.push(closest);
    }
    
    // Prioritize threats not recently encountered
    const recentThreatIds = this.challengeHistory
      .slice(-5)
      .map(e => e.threat.id);
    
    const notRecent = suitableThreats.filter(t => !recentThreatIds.includes(t.id));
    
    const selected = notRecent.length > 0 
      ? notRecent[Math.floor(Math.random() * notRecent.length)]
      : suitableThreats[Math.floor(Math.random() * suitableThreats.length)];
    
    return { ...selected };
  }

  /**
   * Scale threat to match player level
   */
  private scaleThreat(threat: ThreatProfile, kaelPower: number, context: ThreatContext): ThreatProfile {
    const targetThreatLevel = kaelPower * 0.9; // Slightly lower than player for satisfying combat
    const currentThreatLevel = threat.baseLevel * 10 * threat.scalingFactor;
    const scaleFactor = targetThreatLevel / currentThreatLevel;
    
    // Apply scaling
    const scaledThreat: ThreatProfile = {
      ...threat,
      threatLevel: Math.min(100, Math.round(threat.threatLevel * scaleFactor)),
      abilities: this.scaleAbilities(threat.abilities, scaleFactor),
      evolutionStage: Math.max(1, Math.floor(scaleFactor)),
    };
    
    // Adapt to player's strategies
    if (context.recentBattles.length > 0) {
      scaledThreat.adaptationHistory = this.generateAdaptations(threat, context);
    }
    
    return scaledThreat;
  }

  /**
   * Scale abilities based on power level
   */
  private scaleAbilities(abilities: string[], scaleFactor: number): string[] {
    const scaledAbilities = [...abilities];
    
    // Add enhanced versions of abilities at higher scale
    if (scaleFactor > 1.5) {
      abilities.forEach(ability => {
        scaledAbilities.push(`Enhanced ${ability}`);
      });
    }
    
    if (scaleFactor > 2.0) {
      abilities.forEach(ability => {
        scaledAbilities.push(`Ultimate ${ability}`);
      });
    }
    
    return scaledAbilities;
  }

  /**
   * Generate adaptations based on player's recent battles
   */
  private generateAdaptations(threat: ThreatProfile, context: ThreatContext): string[] {
    const adaptations: string[] = [];
    
    // Analyze recent victories
    context.recentBattles.forEach(battle => {
      if (battle.includes('stealth')) {
        adaptations.push('Enhanced Detection');
      }
      if (battle.includes('magic')) {
        adaptations.push('Magic Resistance');
      }
      if (battle.includes('speed')) {
        adaptations.push('Speed Counter');
      }
      if (battle.includes('blood')) {
        adaptations.push('Blood Resistance');
      }
    });
    
    return [...new Set(adaptations)];
  }

  /**
   * Calculate encounter difficulty
   */
  private calculateDifficulty(threat: ThreatProfile, kaelPower: number): 'trivial' | 'easy' | 'moderate' | 'challenging' | 'deadly' {
    const threatPower = threat.threatLevel * 10;
    const ratio = threatPower / kaelPower;
    
    if (ratio < 0.5) return 'trivial';
    if (ratio < 0.75) return 'easy';
    if (ratio < 1.0) return 'moderate';
    if (ratio < 1.5) return 'challenging';
    return 'deadly';
  }

  /**
   * Predict encounter outcome
   */
  private predictOutcome(difficulty: string, context: ThreatContext): 'victory' | 'struggle' | 'retreat' | 'unknown' {
    switch (difficulty) {
      case 'trivial':
      case 'easy':
        return 'victory';
      case 'moderate':
        return Math.random() > 0.3 ? 'struggle' : 'victory';
      case 'challenging':
        return Math.random() > 0.5 ? 'struggle' : 'retreat';
      case 'deadly':
        return Math.random() > 0.7 ? 'retreat' : 'unknown';
      default:
        return 'unknown';
    }
  }

  /**
   * Calculate tension contribution
   */
  private calculateTensionContribution(difficulty: string): number {
    const tensionMap: { [key: string]: number } = {
      trivial: 1,
      easy: 3,
      moderate: 5,
      challenging: 8,
      deadly: 10,
    };
    return tensionMap[difficulty] || 5;
  }

  /**
   * Calculate rewards based on threat and difficulty
   */
  private calculateRewards(threat: ThreatProfile, difficulty: string): ScaledEncounter['rewards'] {
    const difficultyMultiplier: { [key: string]: number } = {
      trivial: 0.5,
      easy: 1.0,
      moderate: 1.5,
      challenging: 2.5,
      deadly: 4.0,
    };
    
    const multiplier = difficultyMultiplier[difficulty] || 1.0;
    const baseExp = threat.baseLevel * 100;
    
    return {
      experience: Math.round(baseExp * multiplier),
      items: this.generateRewardItems(threat, multiplier),
      skills: this.generateRewardSkills(threat, multiplier),
      lore: this.generateLoreDrops(threat),
    };
  }

  /**
   * Generate reward items
   */
  private generateRewardItems(threat: ThreatProfile, multiplier: number): string[] {
    const items: string[] = [];
    
    if (multiplier >= 1.0) {
      items.push(`${threat.name} Essence`);
    }
    if (multiplier >= 1.5) {
      items.push(`${threat.name} Artifact`);
    }
    if (multiplier >= 2.5) {
      items.push(`Legendary ${threat.name} Relic`);
    }
    
    return items;
  }

  /**
   * Generate reward skills
   */
  private generateRewardSkills(threat: ThreatProfile, multiplier: number): string[] {
    if (multiplier >= 1.5 && threat.abilities.length > 0) {
      const ability = threat.abilities[Math.floor(Math.random() * threat.abilities.length)];
      return [`Derived: ${ability}`];
    }
    return [];
  }

  /**
   * Generate lore drops
   */
  private generateLoreDrops(threat: ThreatProfile): string[] {
    return [
      `Secrets of ${threat.name}`,
      `${threat.type === 'boss' ? 'Boss' : 'Creature'} Lore Fragment`,
    ];
  }

  /**
   * Generate narrative impact
   */
  private generateNarrativeImpact(threat: ThreatProfile, context: ThreatContext): string[] {
    const impacts: string[] = [];
    
    // Type-specific impacts
    switch (threat.type) {
      case 'boss':
        impacts.push('Major confrontation resolved');
        impacts.push('Power progression milestone');
        break;
      case 'faction':
        impacts.push('Faction relationship changed');
        impacts.push('World state affected');
        break;
      case 'system':
        impacts.push('System stability affected');
        impacts.push('Hidden truth revealed');
        break;
      default:
        impacts.push('Combat experience gained');
    }
    
    // Context-specific impacts
    if (context.syncLevel > 50) {
      impacts.push('Reality bleed accelerated');
    }
    
    if (context.narrativePhase === 'climax') {
      impacts.push('Critical plot point');
    }
    
    return impacts;
  }

  /**
   * Record threat defeat for future scaling
   */
  recordDefeat(threatId: string, kaelLevel: number): void {
    if (!this.defeatedThreats.has(threatId)) {
      this.defeatedThreats.set(threatId, []);
    }
    this.defeatedThreats.get(threatId)!.push(kaelLevel);
    
    // Evolve the threat
    const threat = this.threatRegistry.get(threatId);
    if (threat) {
      threat.evolutionStage++;
      threat.adaptationHistory.push(`Defeated at level ${kaelLevel}`);
    }
  }

  /**
   * Get challenge history
   */
  getChallengeHistory(limit?: number): ScaledEncounter[] {
    return limit ? this.challengeHistory.slice(-limit) : [...this.challengeHistory];
  }

  /**
   * Get threat by ID
   */
  getThreat(id: string): ThreatProfile | null {
    return this.threatRegistry.get(id) || null;
  }

  /**
   * Generate dynamic boss for special encounters
   */
  generateDynamicBoss(context: ThreatContext): ThreatProfile {
    const kaelPower = this.calculatePowerLevel(context);
    const bossLevel = Math.floor(kaelPower / 10) + 5;
    
    const bossNames = [
      'Void Walker', 'Blood Monarch', 'Shadow Emperor', 'Code Breaker',
      'Reality Shaper', 'Ancient One', 'System Lord', 'Dimensional Horror',
    ];
    
    const boss: ThreatProfile = {
      id: `dynamic_boss_${Date.now()}`,
      name: bossNames[Math.floor(Math.random() * bossNames.length)],
      type: 'boss',
      baseLevel: bossLevel,
      scalingFactor: 1.8,
      abilities: [
        'Reality Manipulation',
        'Ancient Power',
        'Devastating Strike',
        'Summon Minions',
        'Phase Shift',
      ],
      weaknesses: [
        'Progenitor Blood',
        'System Vulnerability',
        'Coordinated Assault',
      ],
      threatLevel: 90,
      evolutionStage: 1,
      adaptationHistory: [],
    };
    
    this.registerThreat(boss);
    return boss;
  }
}

export default ThreatScalingSystem;