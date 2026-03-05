/**
 * Pacing, Tone, and Atmosphere Management System
 * Controls narrative rhythm, emotional tone, and atmospheric elements
 */

import type { NarrativeArc } from './NarrativeLogic';

export interface PacingConfiguration {
  currentPacing: number; // 1-10
  targetPacing: number;
  paceChangeRate: number; // How quickly to change pacing
  momentum: number; // Forward momentum of story
  tensionBuildup: number; // Accumulated tension
}

export interface AtmosphereSettings {
  mood: string;
  lighting: string;
  soundscape: string;
  temperature: string;
  timeOfDay: string;
  weather: string;
  sensoryDetails: string[];
}

export interface ToneOptions {
  tone: 'dark' | 'neutral' | 'light';
  intensity: number; // 1-10
  emotionalDepth: number; // 1-10
  humor: number; // 0-10
  hope: number; // 0-10
  dread: number; // 0-10
}

export class PacingSystem {
  private pacing: PacingConfiguration;
  private currentTone: ToneOptions;
  private currentAtmosphere: AtmosphereSettings;
  private chapterHistory: number[];
  private arcTransitions: Map<string, number[]>;

  constructor() {
    this.pacing = {
      currentPacing: 5,
      targetPacing: 5,
      paceChangeRate: 0.5,
      momentum: 5,
      tensionBuildup: 3,
    };

    this.currentTone = {
      tone: 'neutral',
      intensity: 5,
      emotionalDepth: 4,
      humor: 3,
      hope: 6,
      dread: 2,
    };

    this.currentAtmosphere = this.initializeAtmosphere();
    this.chapterHistory = [];
    this.arcTransitions = new Map();
  }

  /**
   * Initialize default atmosphere
   */
  private initializeAtmosphere(): AtmosphereSettings {
    return {
      mood: 'curious',
      lighting: 'soft_indoor',
      soundscape: 'quiet',
      temperature: 'comfortable',
      timeOfDay: 'evening',
      weather: 'cloudy',
      sensoryDetails: ['sterile hospital smell', 'hum of equipment'],
    };
  }

  /**
   * Update pacing based on narrative arc
   */
  updatePacingForArc(arc: NarrativeArc): void {
    this.pacing.targetPacing = arc.intensity;
    
    // Adjust pace change rate based on arc intensity
    switch (arc.type) {
      case 'setup':
        this.pacing.paceChangeRate = 0.3;
        break;
      case 'rising_action':
        this.pacing.paceChangeRate = 0.5;
        break;
      case 'climax':
        this.pacing.paceChangeRate = 1.0;
        break;
      case 'falling_action':
        this.pacing.paceChangeRate = -0.4;
        break;
      case 'resolution':
        this.pacing.paceChangeRate = -0.5;
        break;
    }

    this.applyPacingChange();
  }

  /**
   * Apply pacing change
   */
  private applyPacingChange(): void {
    const difference = this.pacing.targetPacing - this.pacing.currentPacing;
    const change = Math.sign(difference) * Math.min(Math.abs(difference), this.pacing.paceChangeRate);
    
    this.pacing.currentPacing = Math.max(1, Math.min(10, this.pacing.currentPacing + change));
  }

  /**
   * Adjust pacing for scene
   */
  adjustScenePacing(conflictLevel: number, emotionalStakes: number): void {
    this.pacing.tensionBuildup += (conflictLevel - 5) * 0.2;
    this.pacing.tensionBuildup = Math.max(0, Math.min(10, this.pacing.tensionBuildup));

    // Increase momentum with higher stakes
    this.pacing.momentum += (emotionalStakes - 5) * 0.1;
    this.pacing.momentum = Math.max(1, Math.min(10, this.pacing.momentum));
  }

  /**
   * Get scene length based on pacing
   */
  getSceneLength(): 'short' | 'medium' | 'long' {
    if (this.pacing.currentPacing >= 7) {
      return 'short'; // Fast pacing = shorter, punchier scenes
    } else if (this.pacing.currentPacing <= 3) {
      return 'long'; // Slow pacing = longer, more detailed scenes
    }
    return 'medium';
  }

  /**
   * Generate pacing description
   */
  getPacingDescription(): string {
    const pace = this.pacing.currentPacing;
    
    if (pace >= 8) {
      return 'intense and rapid-fire';
    } else if (pace >= 6) {
      return 'brisk and engaging';
    } else if (pace >= 4) {
      return 'steady and balanced';
    } else if (pace >= 2) {
      return 'measured and deliberate';
    }
    return 'slow and contemplative';
  }

  /**
   * Update tone for narrative context
   */
  updateTone(arc: NarrativeArc, context: string): void {
    // Base tone on arc
    switch (arc.type) {
      case 'setup':
        this.currentTone.tone = 'neutral';
        this.currentTone.intensity = 3;
        this.currentTone.emotionalDepth = 3;
        this.currentTone.humor = 4;
        this.currentTone.hope = 7;
        this.currentTone.dread = 1;
        break;
      case 'rising_action':
        this.currentTone.tone = context.includes('danger') ? 'dark' : 'neutral';
        this.currentTone.intensity = 6;
        this.currentTone.emotionalDepth = 6;
        this.currentTone.humor = 2;
        this.currentTone.hope = 5;
        this.currentTone.dread = 4;
        break;
      case 'climax':
        this.currentTone.tone = 'dark';
        this.currentTone.intensity = 10;
        this.currentTone.emotionalDepth = 9;
        this.currentTone.humor = 0;
        this.currentTone.hope = 3;
        this.currentTone.dread = 8;
        break;
      case 'falling_action':
        this.currentTone.tone = 'neutral';
        this.currentTone.intensity = 5;
        this.currentTone.emotionalDepth = 7;
        this.currentTone.humor = 2;
        this.currentTone.hope = 6;
        this.currentTone.dread = 3;
        break;
      case 'resolution':
        this.currentTone.tone = 'light';
        this.currentTone.intensity = 4;
        this.currentTone.emotionalDepth = 6;
        this.currentTone.humor = 3;
        this.currentTone.hope = 8;
        this.currentTone.dread = 1;
        break;
    }
  }

  /**
   * Generate tone description
   */
  getToneDescription(): string {
    const { tone, intensity, emotionalDepth } = this.currentTone;
    
    let description = `${tone} tone with `;
    
    if (intensity >= 8) {
      description += 'high intensity';
    } else if (intensity >= 5) {
      description += 'moderate intensity';
    } else {
      description += 'low intensity';
    }

    description += ` and `;
    
    if (emotionalDepth >= 7) {
      description += 'deep emotional resonance';
    } else if (emotionalDepth >= 4) {
      description += 'moderate emotional depth';
    } else {
      description += 'surface-level emotions';
    }

    return description;
  }

  /**
   * Update atmosphere for scene
   */
  updateAtmosphere(world: 'real' | 'vr', context: string): void {
    const atmosphereMap: { [key: string]: Partial<AtmosphereSettings> } = {
      'real_hospital': {
        mood: 'sterile',
        lighting: 'fluorescent',
        soundscape: 'medical_equipment',
        temperature: 'cool',
        sensoryDetails: ['antiseptic smell', 'beeping monitors', 'white walls'],
      },
      'real_apartment': {
        mood: 'intimate',
        lighting: 'dim',
        soundscape: 'urban_ambient',
        temperature: 'comfortable',
        sensoryDetails: ['computer hum', 'familiar clutter', 'city sounds outside'],
      },
      'real_outdoors': {
        mood: 'uncertain',
        lighting: 'variable',
        soundscape: 'city_noise',
        temperature: 'variable',
        sensoryDetails: ['traffic', 'wind', 'distant sirens'],
      },
      'vr_starting_zone': {
        mood: 'welcoming',
        lighting: 'glowing',
        soundscape: 'digital_ambient',
        temperature: 'perfect',
        sensoryDetails: ['subtle data streams', 'smooth surfaces', 'perfect clarity'],
      },
      'vr_forest': {
        mood: 'mysterious',
        lighting: 'filtered',
        soundscape: 'natural_sounds',
        temperature: 'cool',
        sensoryDetails: ['digital flora', 'mystical aura', 'ancient energy'],
      },
      'vr_city': {
        mood: 'energetic',
        lighting: 'neon',
        soundscape: 'urban_hum',
        temperature: 'comfortable',
        sensoryDetails: ['holographic displays', 'flying vehicles', 'crowded streets'],
      },
      'vr_danger': {
        mood: 'tense',
        lighting: 'dim',
        soundscape: 'threatening',
        temperature: 'uncomfortable',
        sensoryDetails: ['dark corners', 'unseen threats', 'system warnings'],
      },
    };

    const key = `${world}_${context}`;
    const atmosphere = atmosphereMap[key];

    if (atmosphere) {
      this.currentAtmosphere = {
        ...this.currentAtmosphere,
        ...atmosphere,
      };
    }
  }

  /**
   * Generate atmosphere description
   */
  getAtmosphereDescription(): string {
    const { mood, lighting, soundscape, temperature, weather } = this.currentAtmosphere;
    
    return `The atmosphere is ${mood} with ${lighting} lighting, ${soundscape} in the background, and ${temperature} temperature. ${weather ? `Weather is ${weather}.` : ''}`;
  }

  /**
   * Generate sensory description
   */
  generateSensoryDescription(): string {
    const details = this.currentAtmosphere.sensoryDetails;
    const selected: string[] = [];

    for (let i = 0; i < Math.min(3, details.length); i++) {
      const index = Math.floor(Math.random() * details.length);
      if (!selected.includes(details[index])) {
        selected.push(details[index]);
      }
    }

    return selected.map(d => {
      if (d.includes('smell') || d.includes('scent')) {
        return `The scent of ${d} fills the air.`;
      } else if (d.includes('sound') || d.includes('hum') || d.includes('beep')) {
        return `${d} can be heard.`;
      } else {
        return `${d} surrounds the area.`;
      }
    }).join(' ');
  }

  /**
   * Apply pacing modifier
   */
  applyPacingModifier(modifier: number): void {
    this.pacing.targetPacing = Math.max(1, Math.min(10, this.pacing.targetPacing + modifier));
    this.applyPacingChange();
  }

  /**
   * Apply tension modifier
   */
  applyTensionModifier(modifier: number): void {
    this.pacing.tensionBuildup = Math.max(0, Math.min(10, this.pacing.tensionBuildup + modifier));
  }

  /**
   * Release tension
   */
  releaseTension(): number {
    const released = this.pacing.tensionBuildup;
    this.pacing.tensionBuildup = Math.max(0, this.pacing.tensionBuildup - 2);
    return released;
  }

  /**
   * Get current pacing
   */
  getCurrentPacing(): PacingConfiguration {
    return { ...this.pacing };
  }

  /**
   * Get current tone
   */
  getCurrentTone(): ToneOptions {
    return { ...this.currentTone };
  }

  /**
   * Get current atmosphere
   */
  getCurrentAtmosphere(): AtmosphereSettings {
    return { ...this.currentAtmosphere };
  }

  /**
   * Record chapter pacing
   */
  recordChapterPacing(pacing: number): void {
    this.chapterHistory.push(pacing);
    
    // Keep only last 10 chapters
    if (this.chapterHistory.length > 10) {
      this.chapterHistory.shift();
    }
  }

  /**
   * Analyze pacing trends
   */
  analyzePacingTrends(): { trend: 'rising' | 'falling' | 'stable'; recommendation: string } {
    if (this.chapterHistory.length < 3) {
      return { trend: 'stable', recommendation: 'Need more data for analysis' };
    }

    const recent = this.chapterHistory.slice(-3);
    const average = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlier = this.chapterHistory.slice(-6, -3) || recent;
    const earlierAverage = earlier.reduce((a, b) => a + b, 0) / earlier.length;

    const difference = average - earlierAverage;

    if (difference > 1) {
      return {
        trend: 'rising',
        recommendation: 'Pacing is accelerating. Consider slowing down for reflection.',
      };
    } else if (difference < -1) {
      return {
        trend: 'falling',
        recommendation: 'Pacing is decelerating. Consider adding action or tension.',
      };
    }

    return {
      trend: 'stable',
      recommendation: 'Pacing is balanced. Continue current approach.',
    };
  }

  /**
   * Reset pacing for new story
   */
  resetPacing(): void {
    this.pacing = {
      currentPacing: 5,
      targetPacing: 5,
      paceChangeRate: 0.5,
      momentum: 5,
      tensionBuildup: 3,
    };
    this.chapterHistory = [];
  }
}

export default PacingSystem;