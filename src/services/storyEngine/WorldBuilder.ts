/**
 * Worldbuilding & Environmental Logic System
 * Manages both real and VR worlds, environmental conditions, and persistent consequences
 */

import type { Location, Character } from '../../types';

export interface WorldState {
  realWorld: RealWorldState;
  vrWorld: VRWorldState;
  syncLevel: number; // 0-100, how connected the worlds are
  bleedEffects: string[];
  transitionHistory: WorldTransition[];
}

export interface RealWorldState {
  locations: Map<string, Location>;
  environmentalConditions: string;
  timeOfDay: string;
  weather: string;
  activeCharacters: string[];
  events: string[];
  consequences: string[];
}

export interface VRWorldState {
  zones: Map<string, VRZone>;
  currentZone: string;
  systemLevel: number; // 1-100, system control/power
  stability: number; // 1-100, world stability
  anomalies: Anomaly[];
  entities: VREntity[];
  activePlayers: string[];
}

export interface VRZone {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  theme: string;
  features: string[];
  secrets: string[];
  connectivity: string[]; // connected zones
}

export interface Anomaly {
  id: string;
  type: 'glitch' | 'bug' | 'artifact' | 'reality_bleed' | 'system_error';
  severity: number; // 1-10
  description: string;
  location: string;
  effects: string[];
  resolved: boolean;
}

export interface VREntity {
  id: string;
  name: string;
  type: 'npc' | 'creature' | 'construct' | 'boss' | 'neutral';
  level: number;
  behavior: string;
  loyalty: number; // 0-100
  dialogue: string[];
}

export interface WorldTransition {
  from: 'real' | 'vr';
  to: 'real' | 'vr';
  timestamp: string;
  trigger: string;
  effects: string[];
}

export class WorldBuilder {
  private worldState: WorldState;
  private zoneTemplates: VRZone[];
  private environmentalEffects: Map<string, string[]>;

  constructor() {
    this.worldState = this.initializeWorldState();
    this.zoneTemplates = this.createZoneTemplates();
    this.environmentalEffects = this.createEnvironmentalEffects();
  }

  /**
   * Initialize the dual world state
   */
  private initializeWorldState(): WorldState {
    return {
      realWorld: {
        locations: new Map([
          ['Hospital', {
            id: 'Hospital',
            name: 'St. Jude Hospital',
            description: 'Sterile hospital environment where Yuna lies in a coma',
            world: 'real',
            region: 'City Center',
            landmarks: ['Emergency Room', 'ICU', 'Cafeteria'],
            connectedLocations: ['Parking Lot', 'Roof'],
            conditions: ['quiet', 'sterile', 'cold'],
            charactersPresent: ['Kael', 'Doctors'],
          }],
          ['Parking Lot', {
            id: 'Parking Lot',
            name: 'Hospital Parking',
            description: 'Empty parking lot with Alex\'s car',
            world: 'real',
            region: 'City Center',
            landmarks: ['Alex\'s Car', 'Hospital Entrance'],
            connectedLocations: ['Hospital', 'Street'],
            conditions: ['empty', 'dimly lit'],
            charactersPresent: ['Alex'],
          }],
          ['Kael\'s Apartment', {
            id: 'Kael\'s Apartment',
            name: 'Kael\'s Apartment',
            description: 'Small apartment with VR equipment setup',
            world: 'real',
            region: 'Residential District',
            landmarks: ['VR Setup', 'Bedroom', 'Kitchen'],
            connectedLocations: ['Hallway', 'Street'],
            conditions: ['cluttered', 'technological'],
            charactersPresent: [],
          }],
        ]),
        environmentalConditions: 'Urban environment, overcast sky',
        timeOfDay: 'evening',
        weather: 'cloudy',
        activeCharacters: ['Kael', 'Alex'],
        events: [],
        consequences: [],
      },
      vrWorld: {
        zones: new Map([
          ['Starting Zone', {
            id: 'Starting Zone',
            name: 'Digital Genesis',
            description: 'A simple tutorial area where Kael first enters VR',
            difficulty: 1,
            theme: 'beginner_friendly',
            features: ['glowing pathways', 'floating platforms', 'tutorial NPCs'],
            secrets: ['hidden data cache', 'power-up location'],
            connectivity: ['Central Hub'],
          }],
          ['Central Hub', {
            id: 'Central Hub',
            name: 'Nexus Central',
            description: 'The main hub connecting all VR zones',
            difficulty: 2,
            theme: 'neutral',
            features: ['portals', 'vendors', 'guild hall'],
            secrets: ['underground passage', 'secret shop'],
            connectivity: ['Starting Zone', 'Forest Zone', 'City Zone', 'Mountain Zone'],
          }],
          ['Forest Zone', {
            id: 'Forest Zone',
            name: 'Verdant Circuit',
            description: 'A mystical forest zone with ancient digital trees',
            difficulty: 3,
            theme: 'nature',
            features: ['digital flora', 'forest spirits', 'ancient ruins'],
            secrets: ['hidden grove', 'rare monster spawn'],
            connectivity: ['Central Hub', 'Mountain Zone'],
          }],
        ]),
        currentZone: 'Starting Zone',
        systemLevel: 50,
        stability: 100,
        anomalies: [],
        entities: [
          {
            id: 'guide_npc_1',
            name: 'System Guide',
            type: 'npc',
            level: 1,
            behavior: 'helpful and informative',
            loyalty: 100,
            dialogue: [
              'Welcome to the system, Kael.',
              'Your path lies ahead.',
              'The world responds to your actions.',
            ],
          },
        ],
        activePlayers: ['Kael'],
      },
      syncLevel: 0,
      bleedEffects: [],
      transitionHistory: [],
    };
  }

  /**
   * Create zone templates for procedural generation
   */
  private createZoneTemplates(): VRZone[] {
    return [
      {
        id: 'City Zone',
        name: 'Neon Metropolis',
        description: 'A futuristic city with towering skyscrapers and holographic advertisements',
        difficulty: 4,
        theme: 'urban',
        features: ['holograms', 'flying vehicles', 'dense population', 'nightlife'],
        secrets: ['underground market', 'rooftop gardens', 'hidden apartments'],
        connectivity: ['Central Hub', 'Forest Zone', 'Mountain Zone'],
      },
      {
        id: 'Mountain Zone',
        name: 'Peak Protocol',
        description: 'Treacherous mountain terrain with ancient digital fortresses',
        difficulty: 5,
        theme: 'mountain',
        features: ['cliffs', 'fortresses', 'harsh weather', 'high altitude'],
        secrets: ['hidden temples', 'ancient artifacts', 'treasure vaults'],
        connectivity: ['Central Hub', 'Forest Zone', 'City Zone'],
      },
      {
        id: 'Desert Zone',
        name: 'Silicon Wastes',
        description: 'Endless desert of data particles and mirage illusions',
        difficulty: 4,
        theme: 'desert',
        features: ['sandstorms', 'oases', 'ancient ruins', 'heat waves'],
        secrets: ['underground tombs', 'buried cities', 'rare minerals'],
        connectivity: ['Central Hub', 'Mountain Zone'],
      },
      {
        id: 'Ocean Zone',
        name: 'Data Abyss',
        description: 'Vast underwater world with sunken data structures',
        difficulty: 4,
        theme: 'ocean',
        features: ['underwater cities', 'sea creatures', 'pressure zones', 'bioluminescence'],
        secrets: ['ancient shipwrecks', 'deep sea caves', 'lost data fragments'],
        connectivity: ['Central Hub', 'City Zone'],
      },
    ];
  }

  /**
   * Create environmental effect mappings
   */
  private createEnvironmentalEffects(): Map<string, string[]> {
    const effects = new Map();

    // Real world weather effects
    effects.set('real_weather_sunny', [
      'clear visibility',
      'bright lighting',
      'improved mood',
      'increased activity',
    ]);

    effects.set('real_weather_rainy', [
      'reduced visibility',
      'atmospheric lighting',
      'indoor-focused scenes',
      'emotional depth',
    ]);

    effects.set('real_weather_stormy', [
      'tense atmosphere',
      'dramatic lighting',
      'conflict escalation',
      'heightened emotions',
    ]);

    // VR zone effects
    effects.set('vr_zone_city', [
      'urban landscape',
      'neon lights',
      'holographic elements',
      'crowded areas',
    ]);

    effects.set('vr_zone_forest', [
      'natural beauty',
      'mysterious atmosphere',
      'hidden paths',
      'ancient mysteries',
    ]);

    effects.set('vr_zone_mountain', [
      'challenging terrain',
      'epic views',
      'isolation',
      'dangerous encounters',
    ]);

    return effects;
  }

  /**
   * Transition between worlds
   */
  transitionWorld(from: 'real' | 'vr', to: 'real' | 'vr', trigger: string): string[] {
    const effects: string[] = [];
    const timestamp = new Date().toISOString();

    // Calculate sync level impact
    if (from !== to) {
      this.worldState.syncLevel += Math.floor(Math.random() * 10);
      this.worldState.syncLevel = Math.min(100, this.worldState.syncLevel);

      // Generate bleed effect if sync level is high
      if (this.worldState.syncLevel >= 50) {
        const bleedEffect = this.generateBleedEffect(from, to);
        if (bleedEffect) {
          this.worldState.bleedEffects.push(bleedEffect);
          effects.push(bleedEffect);
        }
      }

      // Record transition
      this.worldState.transitionHistory.push({
        from,
        to,
        timestamp,
        trigger,
        effects,
      });
    }

    return effects;
  }

  /**
   * Generate a bleed effect between worlds
   */
  private generateBleedEffect(from: 'real' | 'vr', to: 'real' | 'vr'): string | null {
    const bleedEffects = [
      'Kael feels phantom pain from VR damage',
      'Yuna\'s voice echoes in Kael\'s hospital room',
      'Real world objects glitch when touched',
      'VR NPCs appear in peripheral vision',
      'System messages appear on real devices',
      'Emotions from VR persist in reality',
      'Physical changes mirror VR upgrades',
      'Time perception shifts between worlds',
    ];

    return bleedEffects[Math.floor(Math.random() * bleedEffects.length)];
  }

  /**
   * Generate new VR zone procedurally
   */
  generateZone(difficulty: number, theme?: string): VRZone {
    const template = this.zoneTemplates[Math.floor(Math.random() * this.zoneTemplates.length)];
    const zoneId = `zone_${Date.now()}`;

    const newZone: VRZone = {
      id: zoneId,
      name: template.name,
      description: template.description,
      difficulty: difficulty,
      theme: theme || template.theme,
      features: [...template.features],
      secrets: this.generateSecrets(2 + Math.floor(Math.random() * 3)),
      connectivity: ['Central Hub'],
    };

    // Add procedural variations
    const variations = this.generateZoneVariations(newZone.theme);
    newZone.features.push(...variations);

    this.worldState.vrWorld.zones.set(zoneId, newZone);
    return newZone;
  }

  /**
   * Generate zone-specific variations
   */
  private generateZoneVariations(theme: string): string[] {
    const variations: { [key: string]: string[] } = {
      urban: [
        'neon-lit alleys',
        'hidden arcades',
        'rooftop gardens',
        'underground clubs',
      ],
      nature: [
        'ancient groves',
        'mystical springs',
        'hidden clearings',
        'enchanted flora',
      ],
      mountain: [
        'treacherous passes',
        'ancient temples',
        'snow-covered peaks',
        'cave systems',
      ],
      desert: [
        'mirage oases',
        'buried ruins',
        'shifting dunes',
        'underground caverns',
      ],
      ocean: [
        'deep sea trenches',
        'bioluminescent reefs',
        'sunken temples',
        'underwater cities',
      ],
    };

    return variations[theme] || [];
  }

  /**
   * Generate secrets for a zone
   */
  private generateSecrets(count: number): string[] {
    const secretTemplates = [
      'hidden treasure',
      'secret passage',
      'rare monster spawn',
      'ancient artifact',
      'data fragment',
      'merchant shortcut',
      'bonus area',
      'lore location',
    ];

    const secrets = [];
    for (let i = 0; i < count; i++) {
      secrets.push(secretTemplates[Math.floor(Math.random() * secretTemplates.length)]);
    }

    return secrets;
  }

  /**
   * Generate an anomaly in VR world
   */
  generateAnomaly(severity: number, location: string): Anomaly {
    const anomalyTypes: Anomaly['type'][] = [
      'glitch',
      'bug',
      'artifact',
      'reality_bleed',
      'system_error',
    ];

    const anomaly: Anomaly = {
      id: `anomaly_${Date.now()}`,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity,
      description: this.generateAnomalyDescription(severity),
      location,
      effects: this.generateAnomalyEffects(severity),
      resolved: false,
    };

    this.worldState.vrWorld.anomalies.push(anomaly);
    this.worldState.vrWorld.stability -= severity;

    return anomaly;
  }

  /**
   * Generate anomaly description
   */
  private generateAnomalyDescription(severity: number): string {
    const descriptions: { [key: number]: string[] } = {
      1: ['Minor visual glitch', 'Flickering texture', 'Small particle error'],
      3: ['Geometry distortion', 'NPC behavior glitch', 'Lighting inconsistency'],
      5: ['Physics engine error', 'Sound loop issue', 'Model clipping problem'],
      7: ['Major rendering failure', 'NPC corruption', 'World geometry break'],
      10: ['System-wide instability', 'Reality breach', 'Critical data corruption'],
    };

    const category = Math.min(10, Math.max(1, Math.floor(severity)));
    const availableDescriptions = descriptions[category] || descriptions[5];

    return availableDescriptions[Math.floor(Math.random() * availableDescriptions.length)];
  }

  /**
   * Generate anomaly effects
   */
  private generateAnomalyEffects(severity: number): string[] {
    const effects: string[] = [];
    const baseEffects = [
      'Visual distortion',
      'Audio glitch',
      'Physics instability',
    ];

    const count = Math.ceil(severity / 3);
    for (let i = 0; i < count; i++) {
      effects.push(baseEffects[Math.floor(Math.random() * baseEffects.length)]);
    }

    if (severity >= 7) {
      effects.push('NPC corruption', 'World geometry failure');
    }

    if (severity >= 10) {
      effects.push('Reality breach imminent', 'System crash risk');
    }

    return effects;
  }

  /**
   * Update environmental conditions
   */
  updateEnvironment(world: 'real' | 'vr', conditions: Partial<RealWorldState> | Partial<VRWorldState>): void {
    if (world === 'real') {
      Object.assign(this.worldState.realWorld, conditions);
    } else {
      Object.assign(this.worldState.vrWorld, conditions);
    }
  }

  /**
   * Get current environment description
   */
  getEnvironmentDescription(world: 'real' | 'vr'): string {
    if (world === 'real') {
      const real = this.worldState.realWorld;
      return `${real.environmentalConditions}, ${real.timeOfDay}, ${real.weather}`;
    } else {
      const vr = this.worldState.vrWorld;
      const zone = vr.zones.get(vr.currentZone);
      if (zone) {
        return `VR Zone: ${zone.name}, Stability: ${vr.stability}%, System Level: ${vr.systemLevel}%`;
      }
      return 'Unknown VR Zone';
    }
  }

  /**
   * Add consequence to real world
   */
  addConsequence(consequence: string): void {
    this.worldState.realWorld.consequences.push(consequence);
  }

  /**
   * Check for active anomalies
   */
  getActiveAnomalies(): Anomaly[] {
    return this.worldState.vrWorld.anomalies.filter(a => !a.resolved);
  }

  /**
   * Resolve anomaly
   */
  resolveAnomaly(anomalyId: string): boolean {
    const anomaly = this.worldState.vrWorld.anomalies.find(a => a.id === anomalyId);
    if (anomaly) {
      anomaly.resolved = true;
      this.worldState.vrWorld.stability += Math.floor(anomaly.severity / 2);
      return true;
    }
    return false;
  }

  /**
   * Get world state for persistence
   */
  getWorldState(): WorldState {
    return {
      realWorld: {
        ...this.worldState.realWorld,
        locations: new Map(this.worldState.realWorld.locations),
      },
      vrWorld: {
        ...this.worldState.vrWorld,
        zones: new Map(this.worldState.vrWorld.zones),
      },
      syncLevel: this.worldState.syncLevel,
      bleedEffects: [...this.worldState.bleedEffects],
      transitionHistory: [...this.worldState.transitionHistory],
    };
  }

  /**
   * Restore world state
   */
  restoreWorldState(state: WorldState): void {
    this.worldState = {
      realWorld: {
        ...state.realWorld,
        locations: new Map(state.realWorld.locations),
      },
      vrWorld: {
        ...state.vrWorld,
        zones: new Map(state.vrWorld.zones),
      },
      syncLevel: state.syncLevel,
      bleedEffects: [...state.bleedEffects],
      transitionHistory: [...state.transitionHistory],
    };
  }
}

export default WorldBuilder;