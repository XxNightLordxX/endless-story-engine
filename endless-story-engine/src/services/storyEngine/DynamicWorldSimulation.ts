/**
 * DynamicWorldSimulation - World State Evolution System
 * 
 * Simulates world state changes, tracks environmental conditions,
 * manages factions, and ensures consistent world logic.
 * 
 * Enhanced with real-time web search for world-building techniques,
 * geographical and cultural details, and historical references.
 */

import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

// ============================================================================
// INTERFACES
// ============================================================================

export interface WorldState {
  timestamp: number;
  location: WorldLocation;
  environmentalConditions: EnvironmentalCondition[];
  activeThreats: ThreatState[];
  factionStates: Map<string, FactionState>;
  economicState: EconomicState;
  politicalState: PoliticalState;
  magicalState: MagicalState;
  eventHistory: WorldEvent[];
}

export interface WorldLocation {
  id: string;
  name: string;
  type: 'city' | 'wilderness' | 'dungeon' | 'safe_haven' | 'danger_zone' | 'neutral';
  region: string;
  connectedLocations: string[];
  population: number;
  dangerLevel: number; // 0-1
  stability: number; // 0-1
  resources: ResourceState[];
  notableFeatures: string[];
  activeEvents: string[];
}

export interface EnvironmentalCondition {
  type: 'weather' | 'time' | 'season' | 'magical_influence' | 'threat_level';
  state: string;
  intensity: number; // 0-1
  duration: number; // chapters
  effects: string[];
}

export interface ResourceState {
  resource: string;
  abundance: number; // 0-1
  accessibility: number; // 0-1
  controlledBy?: string; // faction id
}

export interface ThreatState {
  id: string;
  type: 'monster' | 'faction' | 'environmental' | 'magical' | 'unknown';
  name: string;
  dangerLevel: number; // 0-1
  location: string;
  activity: 'dormant' | 'active' | 'escalating' | 'declining';
  affectedAreas: string[];
  resolutionRequirements: string[];
}

export interface FactionState {
  id: string;
  name: string;
  type: 'government' | 'guild' | 'cult' | 'military' | 'merchant' | 'rebel' | 'neutral';
  power: number; // 0-1
  influence: number; // 0-1
  resources: number; // 0-1
  territories: string[];
  relationships: Map<string, FactionRelationship>;
  goals: FactionGoal[];
  recentActions: FactionAction[];
  publicPerception: number; // -1 to 1
}

export interface FactionRelationship {
  factionId: string;
  status: 'allied' | 'friendly' | 'neutral' | 'hostile' | 'at_war';
  trust: number; // -1 to 1
  history: RelationshipEvent[];
}

export interface RelationshipEvent {
  chapter: number;
  event: string;
  impact: number; // -1 to 1
}

export interface FactionGoal {
  goal: string;
  priority: number; // 0-1
  progress: number; // 0-1
  deadline?: number; // chapter
  obstacles: string[];
}

export interface FactionAction {
  chapter: number;
  action: string;
  type: 'military' | 'economic' | 'political' | 'covert' | 'diplomatic';
  success: boolean;
  consequences: string[];
}

export interface EconomicState {
  overallHealth: number; // 0-1
  inflation: number; // 0-1
  tradeRoutes: TradeRoute[];
  marketTrends: MarketTrend[];
  scarcity: Map<string, number>; // resource -> scarcity level
}

export interface TradeRoute {
  id: string;
  from: string;
  to: string;
  status: 'open' | 'disrupted' | 'closed' | 'dangerous';
  profitability: number; // 0-1
  controlledBy: string[];
}

export interface MarketTrend {
  resource: string;
  direction: 'rising' | 'stable' | 'falling' | 'volatile';
  changeRate: number; // -1 to 1
  cause: string;
}

export interface PoliticalState {
  overallStability: number; // 0-1
  tensions: PoliticalTension[];
  leadership: Map<string, LeaderState>;
  activeConflicts: ConflictState[];
  treaties: Treaty[];
}

export interface PoliticalTension {
  between: string[]; // faction ids
  level: number; // 0-1
  cause: string;
  potentialFlashpoint: string;
}

export interface LeaderState {
  id: string;
  name: string;
  factionId: string;
  position: string;
  stability: number; // 0-1
  publicSupport: number; // 0-1
  challenges: string[];
}

export interface ConflictState {
  id: string;
  type: 'war' | 'cold_war' | 'insurgency' | 'civil_war' | 'border_dispute';
  participants: string[];
  intensity: number; // 0-1
  location: string;
  duration: number; // chapters
  casualties: number;
  outcome: 'ongoing' | 'stalemate' | 'decisive';
}

export interface Treaty {
  id: string;
  name: string;
  type: 'alliance' | 'non_aggression' | 'trade' | 'peace' | 'vassalage';
  parties: string[];
  signed: number; // chapter
  expires?: number; // chapter
  terms: string[];
  stability: number; // 0-1
}

export interface MagicalState {
  ambientLevel: number; // 0-1
  anomalies: MagicalAnomaly[];
  activeSpells: ActiveSpell[];
  conduitHealth: number; // 0-1
  restrictions: MagicalRestriction[];
}

export interface MagicalAnomaly {
  id: string;
  type: 'rift' | 'surge' | 'dead_zone' | 'corruption' | 'blessing';
  location: string;
  intensity: number; // 0-1
  spread: number; // 0-1
  effects: string[];
  containmentEfforts: string[];
}

export interface ActiveSpell {
  id: string;
  name: string;
  type: 'ward' | 'curse' | 'blessing' | 'binding' | 'enchantment';
  location: string;
  caster: string;
  strength: number; // 0-1
  remainingDuration: number; // chapters
  effects: string[];
}

export interface MagicalRestriction {
  region: string;
  type: 'banned' | 'restricted' | 'monitored';
  magicTypes: string[];
  enforcement: string;
}

export interface WorldEvent {
  chapter: number;
  type: 'disaster' | 'political' | 'economic' | 'magical' | 'military' | 'discovery';
  description: string;
  impact: EventImpact;
  affectedRegions: string[];
  resolved: boolean;
  resolution?: string;
}

export interface EventImpact {
  economic: number; // -1 to 1
  political: number; // -1 to 1
  social: number; // -1 to 1
  magical: number; // -1 to 1
}

export interface SimulationResult {
  chaptersSimulated: number;
  finalState: WorldState;
  events: SimulatedEvent[];
  divergences: DivergencePoint[];
  probability: number; // 0-1
}

export interface SimulatedEvent {
  chapter: number;
  event: string;
  probability: number;
  triggers: string[];
  consequences: string[];
}

export interface DivergencePoint {
  chapter: number;
  description: string;
  alternativePaths: string[];
  significance: number; // 0-1
}

// ============================================================================
// DYNAMIC WORLD SIMULATION SYSTEM
// ============================================================================

export class DynamicWorldSimulation {
  private worldState: WorldState;
  private stateHistory: Map<number, WorldState> = new Map();
  private simulationResults: SimulationResult[] = [];
  
  // Web search integration
  private worldBuildingCache: Map<string, TechnicalSearchResult[]> = new Map();
  private geographicalCache: Map<string, WebSearchResult[]> = new Map();
  private historicalCache: Map<string, WebSearchResult[]> = new Map();
  private technologicalCache: Map<string, WebSearchResult[]> = new Map();

  // Simulation parameters
  private readonly SIMULATION_DEPTH = 10; // chapters to simulate ahead
  private readonly EVENT_PROBABILITY_THRESHOLD = 0.3;
  private readonly STABILITY_THRESHOLD = 0.5;

  constructor() {
    this.worldState = this.initializeWorldState();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private initializeWorldState(): WorldState {
    const factions = this.initializeFactions();
    
    return {
      timestamp: Date.now(),
      location: this.initializeLocations(),
      environmentalConditions: [
        { type: 'time', state: 'day', intensity: 0.7, duration: 1, effects: ['Normal visibility', 'Standard activity'] },
        { type: 'season', state: 'autumn', intensity: 0.5, duration: 20, effects: ['Cooling temperatures', 'Shorter days'] }
      ],
      activeThreats: this.initializeThreats(),
      factionStates: factions,
      economicState: this.initializeEconomy(),
      politicalState: this.initializePolitics(factions),
      magicalState: this.initializeMagic(),
      eventHistory: []
    };
  }

  private initializeLocations(): WorldLocation {
    return {
      id: 'shadow_haven',
      name: 'Shadow Haven',
      type: 'safe_haven',
      region: 'Eastern Frontier',
      connectedLocations: ['crimson_valley', 'merchant_crossing'],
      population: 50000,
      dangerLevel: 0.2,
      stability: 0.75,
      resources: [
        { resource: 'food', abundance: 0.6, accessibility: 0.8 },
        { resource: 'medicine', abundance: 0.4, accessibility: 0.5 },
        { resource: 'weapons', abundance: 0.3, accessibility: 0.4 }
      ],
      notableFeatures: ['Central market', 'Healing shrine', 'Underground resistance'],
      activeEvents: []
    };
  }

  private initializeThreats(): ThreatState[] {
    return [
      {
        id: 'eclipsis_threat',
        type: 'monster',
        name: 'Eclipsis Horrors',
        dangerLevel: 0.85,
        location: 'Crimson Valley',
        activity: 'active',
        affectedAreas: ['Crimson Valley', 'Eastern Frontier'],
        resolutionRequirements: ['Power amplification', 'Allied forces', 'Strategic knowledge']
      },
      {
        id: 'unknown_entity',
        type: 'unknown',
        name: 'The Silent Watcher',
        dangerLevel: 0.95,
        location: 'Unknown',
        activity: 'dormant',
        affectedAreas: ['All regions'],
        resolutionRequirements: ['Unknown']
      }
    ];
  }

  private initializeFactions(): Map<string, FactionState> {
    const factions = new Map<string, FactionState>();

    // System Authority
    factions.set('system_authority', {
      id: 'system_authority',
      name: 'System Authority',
      type: 'government',
      power: 0.8,
      influence: 0.85,
      resources: 0.9,
      territories: ['Central District', 'Administrative Zone'],
      relationships: new Map(),
      goals: [
        { goal: 'Maintain order', priority: 0.9, progress: 0.7, obstacles: ['Rising threats', 'Resource scarcity'] },
        { goal: 'Control awakened', priority: 0.7, progress: 0.5, obstacles: ['Resistance', 'Unknown variables'] }
      ],
      recentActions: [],
      publicPerception: 0.2
    });

    // Resistance
    factions.set('resistance', {
      id: 'resistance',
      name: 'The Resistance',
      type: 'rebel',
      power: 0.4,
      influence: 0.5,
      resources: 0.3,
      territories: ['Shadow Haven Underground'],
      relationships: new Map(),
      goals: [
        { goal: 'Overthrow System Authority', priority: 0.8, progress: 0.2, obstacles: ['Superior enemy forces', 'Limited resources'] },
        { goal: 'Protect awakened', priority: 0.9, progress: 0.4, obstacles: ['Detection', 'Limited capacity'] }
      ],
      recentActions: [],
      publicPerception: 0.6
    });

    // Merchants Guild
    factions.set('merchants_guild', {
      id: 'merchants_guild',
      name: 'Merchants Guild',
      type: 'merchant',
      power: 0.5,
      influence: 0.7,
      resources: 0.8,
      territories: ['Trade Routes', 'Market Districts'],
      relationships: new Map(),
      goals: [
        { goal: 'Maintain trade profits', priority: 0.9, progress: 0.6, obstacles: ['Dangerous routes', 'Taxation'] },
        { goal: 'Neutral standing', priority: 0.7, progress: 0.5, obstacles: ['Pressure from factions'] }
      ],
      recentActions: [],
      publicPerception: 0.4
    });

    // Initialize faction relationships
    factions.get('system_authority')!.relationships.set('resistance', {
      factionId: 'resistance',
      status: 'hostile',
      trust: -0.8,
      history: []
    });

    factions.get('resistance')!.relationships.set('system_authority', {
      factionId: 'system_authority',
      status: 'hostile',
      trust: -0.9,
      history: []
    });

    factions.get('merchants_guild')!.relationships.set('system_authority', {
      factionId: 'system_authority',
      status: 'neutral',
      trust: 0.1,
      history: []
    });

    factions.get('merchants_guild')!.relationships.set('resistance', {
      factionId: 'resistance',
      status: 'friendly',
      trust: 0.3,
      history: []
    });

    return factions;
  }

  private initializeEconomy(): EconomicState {
    return {
      overallHealth: 0.6,
      inflation: 0.15,
      tradeRoutes: [
        { id: 'eastern_route', from: 'Shadow Haven', to: 'Eastern Cities', status: 'open', profitability: 0.7, controlledBy: ['merchants_guild'] },
        { id: 'northern_route', from: 'Central District', to: 'Northern Territories', status: 'dangerous', profitability: 0.9, controlledBy: [] }
      ],
      marketTrends: [
        { resource: 'medicine', direction: 'rising', changeRate: 0.3, cause: 'Increased demand due to threats' },
        { resource: 'weapons', direction: 'rising', changeRate: 0.4, cause: 'Growing conflict' }
      ],
      scarcity: new Map([
        ['rare_materials', 0.7],
        ['medicine', 0.5],
        ['food', 0.3]
      ])
    };
  }

  private initializePolitics(factions: Map<string, FactionState>): PoliticalState {
    return {
      overallStability: 0.5,
      tensions: [
        { between: ['system_authority', 'resistance'], level: 0.8, cause: 'Ideological conflict', potentialFlashpoint: 'Awakened control' }
      ],
      leadership: new Map([
        ['system_authority', { id: 'administrator', name: 'The Administrator', factionId: 'system_authority', position: 'Supreme Authority', stability: 0.7, publicSupport: 0.4, challenges: ['Rising resistance', 'Unknown threats'] }],
        ['resistance', { id: 'resistance_leader', name: 'Unknown Leader', factionId: 'resistance', position: 'Resistance Commander', stability: 0.6, publicSupport: 0.7, challenges: ['Limited resources', 'Secrecy'] }]
      ]),
      activeConflicts: [],
      treaties: []
    };
  }

  private initializeMagic(): MagicalState {
    return {
      ambientLevel: 0.4,
      anomalies: [
        { id: 'crimson_rift', type: 'rift', location: 'Crimson Valley', intensity: 0.6, spread: 0.3, effects: ['Monster spawning', 'Reality instability'], containmentEfforts: [] }
      ],
      activeSpells: [
        { id: 'haven_ward', name: 'Shadow Haven Ward', type: 'ward', location: 'Shadow Haven', caster: 'Unknown', strength: 0.7, remainingDuration: 100, effects: ['Monster deterrence', 'Early warning'] }
      ],
      conduitHealth: 0.5,
      restrictions: [
        { region: 'Central District', type: 'restricted', magicTypes: ['combat', 'summoning'], enforcement: 'System Authority monitors' }
      ]
    };
  }

  // ============================================================================
  // WEB SEARCH INTEGRATION
  // ============================================================================

  /**
   * Search for world-building techniques
   */
  async searchWorldBuildingTechniques(
    aspect: string,
    genre: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${aspect}-${genre}`;
    if (this.worldBuildingCache.has(key)) {
      return this.worldBuildingCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWorldBuilding(aspect, genre);
    this.worldBuildingCache.set(key, results as TechnicalSearchResult[]);
    return results as TechnicalSearchResult[];
  }

  /**
   * Research geographical and cultural details
   */
  async searchGeographicalDetails(
    terrainType: string,
    climate: string
  ): Promise<WebSearchResult[]> {
    const key = `${terrainType}-${climate}`;
    if (this.geographicalCache.has(key)) {
      return this.geographicalCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${terrainType} ${climate} geography worldbuilding fiction`
    );
    this.geographicalCache.set(key, results);
    return results;
  }

  /**
   * Find historical references for world events
   */
  async searchHistoricalReferences(
    eventType: string,
    period: string
  ): Promise<WebSearchResult[]> {
    const key = `${eventType}-${period}`;
    if (this.historicalCache.has(key)) {
      return this.historicalCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${eventType} historical events ${period} fiction inspiration`
    );
    this.historicalCache.set(key, results);
    return results;
  }

  /**
   * Look up scientific/technological developments
   */
  async searchTechDevelopments(
    techLevel: string,
    focus: string
  ): Promise<WebSearchResult[]> {
    const key = `${techLevel}-${focus}`;
    if (this.technologicalCache.has(key)) {
      return this.technologicalCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${techLevel} technology ${focus} worldbuilding`
    );
    this.technologicalCache.set(key, results);
    return results;
  }

  /**
   * Enhance world simulation with web research
   */
  async simulateWithWebResearch(
    fromChapter: number,
    depth: number,
    genre: string
  ): Promise<SimulationResult> {
    // Standard simulation
    const standardResult = this.simulateWorldEvolution(fromChapter, depth);
    
    // Get web research for enrichment
    const worldBuilding = await this.searchWorldBuildingTechniques('faction', genre);
    
    // Add insights to simulation result
    for (const result of worldBuilding) {
      if (result.practicalValue > 0.7) {
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          standardResult.events.push({
            chapter: fromChapter + 1,
            event: `World Building Insight: ${sentences[0].trim()}`,
            probability: 0.7,
            triggers: ['web_research'],
            consequences: []
          });
        }
      }
    }
    
    return standardResult;
  }

  /**
   * Get faction inspiration from web
   */
  async getFactionInspiration(
    factionType: string,
    setting: string
  ): Promise<string[]> {
    const results = await this.searchWorldBuildingTechniques(
      `${factionType} faction`,
      setting
    );
    
    const inspirations: string[] = [];
    for (const result of results) {
      if (result.practicalValue > 0.6) {
        const sentences = result.snippet.split(/[.!?]/).filter(s => s.trim().length > 15);
        if (sentences.length > 0) {
          inspirations.push(sentences[0].trim());
        }
      }
    }
    
    return inspirations.slice(0, 5);
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.worldBuildingCache.clear();
    this.geographicalCache.clear();
    this.historicalCache.clear();
    this.technologicalCache.clear();
  }

  // ============================================================================
  // WORLD STATE MANAGEMENT
  // ============================================================================

  getCurrentState(): WorldState {
    return { ...this.worldState };
  }

  getStateAtChapter(chapter: number): WorldState | undefined {
    return this.stateHistory.get(chapter);
  }

  saveState(chapter: number): void {
    this.stateHistory.set(chapter, JSON.parse(JSON.stringify(this.worldState)));
  }

  // ============================================================================
  // WORLD SIMULATION
  // ============================================================================

  /**
   * Simulate world evolution for upcoming chapters
   */
  simulateWorldEvolution(fromChapter: number, depth: number = this.SIMULATION_DEPTH): SimulationResult {
    const events: SimulatedEvent[] = [];
    const divergences: DivergencePoint[] = [];
    
    // Clone current state
    let simulatedState = JSON.parse(JSON.stringify(this.worldState));

    for (let chapter = fromChapter; chapter < fromChapter + depth; chapter++) {
      // Simulate faction actions
      const factionEvents = this.simulateFactionActions(simulatedState, chapter);
      events.push(...factionEvents);

      // Simulate threat evolution
      const threatEvents = this.simulateThreatEvolution(simulatedState, chapter);
      events.push(...threatEvents);

      // Simulate economic changes
      const economicEvents = this.simulateEconomicChanges(simulatedState, chapter);
      events.push(...economicEvents);

      // Simulate magical phenomena
      const magicalEvents = this.simulateMagicalPhenomena(simulatedState, chapter);
      events.push(...magicalEvents);

      // Identify divergence points
      const newDivergences = this.identifyDivergencePoints(simulatedState, chapter);
      divergences.push(...newDivergences);

      // Random events
      const randomEvents = this.generateRandomEvents(simulatedState, chapter);
      events.push(...randomEvents);
    }

    // Calculate overall probability
    const probability = this.calculateSimulationProbability(events, divergences);

    const result: SimulationResult = {
      chaptersSimulated: depth,
      finalState: simulatedState,
      events,
      divergences,
      probability
    };

    this.simulationResults.push(result);
    return result;
  }

  private simulateFactionActions(state: WorldState, chapter: number): SimulatedEvent[] {
    const events: SimulatedEvent[] = [];

    // Handle both Map and plain object (from JSON clone)
    const factionStates = state.factionStates;
    if (!factionStates) {
      return events;
    }

    // Convert to entries if it's a Map, otherwise use Object.entries
    const entries = factionStates instanceof Map 
      ? Array.from(factionStates.entries())
      : Object.entries(factionStates);

    entries.forEach(([factionId, faction]) => {
      // Determine likely actions based on goals and situation
      const topGoal = faction.goals.sort((a, b) => b.priority - a.priority)[0];
      
      if (topGoal && Math.random() < 0.3) {
        const action = this.determineFactionAction(faction, topGoal);
        
        events.push({
          chapter,
          event: `${faction.name}: ${action}`,
          probability: 0.4,
          triggers: [topGoal.goal],
          consequences: this.predictActionConsequences(faction, action)
        });
      }
    });

    return events;
  }

  private determineFactionAction(faction: FactionState, goal: FactionGoal): string {
    const actionsByType: Record<string, string[]> = {
      government: ['Policy change', 'Resource allocation', 'Enforcement action'],
      rebel: ['Guerrilla operation', 'Recruitment drive', 'Sabotage'],
      merchant: ['Trade agreement', 'Price adjustment', 'Route establishment'],
      military: ['Patrol increase', 'Strategic positioning', 'Training exercise'],
      cult: ['Ritual performance', 'Recruitment', 'Artifact search'],
      neutral: ['Diplomatic outreach', 'Resource gathering', 'Information exchange']
    };

    const actions = actionsByType[faction.type] || actionsByType['neutral'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private predictActionConsequences(faction: FactionState, action: string): string[] {
    const consequences: string[] = [];
    
    if (action.includes('operation') || action.includes('sabotage')) {
      consequences.push('Increased tension with opposing factions');
      consequences.push('Potential retaliation');
    }
    if (action.includes('Recruitment')) {
      consequences.push('Increased faction power');
      consequences.push('Risk of infiltration');
    }
    if (action.includes('agreement') || action.includes('outreach')) {
      consequences.push('Improved relations');
      consequences.push('Resource benefits');
    }

    return consequences;
  }

  private simulateThreatEvolution(state: WorldState, chapter: number): SimulatedEvent[] {
    const events: SimulatedEvent[] = [];

    state.activeThreats.forEach(threat => {
      // Threats evolve based on their activity state
      if (threat.activity === 'active' && Math.random() < 0.4) {
        const evolution = this.determineThreatEvolution(threat);
        events.push({
          chapter,
          event: `Threat Evolution: ${threat.name} - ${evolution}`,
          probability: threat.dangerLevel,
          triggers: ['Threat activity', 'Lack of intervention'],
          consequences: [`Affected areas: ${threat.affectedAreas.join(', ')}`]
        });
      }
    });

    return events;
  }

  private determineThreatEvolution(threat: ThreatState): string {
    const evolutions = [
      'Activity escalation',
      'Territory expansion',
      'New manifestation',
      'Alliance with other threats',
      'Mutation/evolution'
    ];

    return evolutions[Math.floor(Math.random() * evolutions.length)];
  }

  private simulateEconomicChanges(state: WorldState, chapter: number): SimulatedEvent[] {
    const events: SimulatedEvent[] = [];

    // Random market fluctuations
    if (Math.random() < 0.2) {
      const resource = ['medicine', 'weapons', 'food', 'rare_materials'][Math.floor(Math.random() * 4)];
      const direction = Math.random() > 0.5 ? 'shortage' : 'surplus';
      
      events.push({
        chapter,
        event: `Market Event: ${resource} ${direction}`,
        probability: 0.3,
        triggers: ['Market forces', 'External events'],
        consequences: [`Price ${direction === 'shortage' ? 'increase' : 'decrease'}`, 'Economic ripple effects']
      });
    }

    // Trade route events
    state.economicState.tradeRoutes.forEach(route => {
      if (route.status === 'dangerous' && Math.random() < 0.3) {
        events.push({
          chapter,
          event: `Trade Route Event: ${route.id} - Attack or disruption`,
          probability: 0.5,
          triggers: ['Danger level', 'Threat proximity'],
          consequences: ['Trade disruption', 'Economic impact']
        });
      }
    });

    return events;
  }

  private simulateMagicalPhenomena(state: WorldState, chapter: number): SimulatedEvent[] {
    const events: SimulatedEvent[] = [];

    // Anomaly evolution
    state.magicalState.anomalies.forEach(anomaly => {
      if (anomaly.intensity > 0.5 && Math.random() < 0.3) {
        events.push({
          chapter,
          event: `Magical Event: ${anomaly.type} at ${anomaly.location} intensifies`,
          probability: anomaly.intensity,
          triggers: ['Uncontained anomaly', 'Magical flux'],
          consequences: anomaly.effects
        });
      }
    });

    // New magical events
    if (Math.random() < 0.15) {
      events.push({
        chapter,
        event: 'Magical Phenomenon: Surge detected',
        probability: 0.2,
        triggers: ['Ambient magic fluctuation'],
        consequences: ['Potential awakening trigger', 'Anomaly formation']
      });
    }

    return events;
  }

  private identifyDivergencePoints(state: WorldState, chapter: number): DivergencePoint[] {
    const divergences: DivergencePoint[] = [];

    // Check for high-stakes situations
    state.activeThreats.forEach(threat => {
      if (threat.dangerLevel > 0.8 && threat.activity === 'active') {
        divergences.push({
          chapter,
          description: `Critical threat decision point: ${threat.name}`,
          alternativePaths: ['Intervention', 'Evacuation', 'Containment', 'Escalation'],
          significance: threat.dangerLevel
        });
      }
    });

    // Check for faction flashpoints
    state.politicalState.tensions.forEach(tension => {
      if (tension.level > 0.7) {
        divergences.push({
          chapter,
          description: `Political flashpoint: ${tension.between.join(' vs ')}`,
          alternativePaths: ['Diplomatic resolution', 'Conflict escalation', 'Third-party intervention'],
          significance: tension.level
        });
      }
    });

    return divergences;
  }

  private generateRandomEvents(state: WorldState, chapter: number): SimulatedEvent[] {
    const events: SimulatedEvent[] = [];

    // Small chance of major random events
    if (Math.random() < 0.1) {
      const eventTypes = [
        'Natural disaster strikes region',
        'Important figure dies or disappears',
        'New discovery changes understanding',
        'Unexpected alliance forms',
        'Resource deposit found or depleted'
      ];

      events.push({
        chapter,
        event: `Random Event: ${eventTypes[Math.floor(Math.random() * eventTypes.length)]}`,
        probability: 0.1,
        triggers: ['Chance'],
        consequences: ['Unexpected story development']
      });
    }

    return events;
  }

  private calculateSimulationProbability(events: SimulatedEvent[], divergences: DivergencePoint[]): number {
    // Base probability
    let probability = 0.8;

    // Reduce for each event (more events = more uncertainty)
    probability -= events.length * 0.02;

    // Reduce for each divergence point
    probability -= divergences.length * 0.05;

    return Math.max(0.1, Math.min(1, probability));
  }

  // ============================================================================
  // WORLD STATE UPDATES
  // ============================================================================

  /**
   * Update world state based on chapter events
   */
  updateWorldState(chapter: number, events: WorldUpdateEvent[]): WorldState {
    // Save current state before update
    this.saveState(chapter);

    events.forEach(event => {
      switch (event.type) {
        case 'location_change':
          this.applyLocationChange(event);
          break;
        case 'threat_change':
          this.applyThreatChange(event);
          break;
        case 'faction_change':
          this.applyFactionChange(event);
          break;
        case 'economic_change':
          this.applyEconomicChange(event);
          break;
        case 'political_change':
          this.applyPoliticalChange(event);
          break;
        case 'magical_change':
          this.applyMagicalChange(event);
          break;
        case 'environmental_change':
          this.applyEnvironmentalChange(event);
          break;
      }
    });

    // Record in event history
    events.forEach(event => {
      this.worldState.eventHistory.push({
        chapter,
        type: event.type as WorldEvent['type'],
        description: event.description,
        impact: event.impact || { economic: 0, political: 0, social: 0, magical: 0 },
        affectedRegions: event.affectedRegions || [],
        resolved: false
      });
    });

    return this.worldState;
  }

  private applyLocationChange(event: WorldUpdateEvent): void {
    if (event.locationId && event.locationChanges) {
      // Update location properties
      const location = this.worldState.location;
      if (location.id === event.locationId) {
        Object.assign(location, event.locationChanges);
      }
    }
  }

  private applyThreatChange(event: WorldUpdateEvent): void {
    if (event.threatId && event.threatChanges) {
      const threat = this.worldState.activeThreats.find(t => t.id === event.threatId);
      if (threat) {
        Object.assign(threat, event.threatChanges);
      }
    }
  }

  private applyFactionChange(event: WorldUpdateEvent): void {
    if (event.factionId && event.factionChanges) {
      const faction = this.worldState.factionStates.get(event.factionId);
      if (faction) {
        Object.assign(faction, event.factionChanges);
      }
    }
  }

  private applyEconomicChange(event: WorldUpdateEvent): void {
    if (event.economicChanges) {
      Object.assign(this.worldState.economicState, event.economicChanges);
    }
  }

  private applyPoliticalChange(event: WorldUpdateEvent): void {
    if (event.politicalChanges) {
      Object.assign(this.worldState.politicalState, event.politicalChanges);
    }
  }

  private applyMagicalChange(event: WorldUpdateEvent): void {
    if (event.magicalChanges) {
      Object.assign(this.worldState.magicalState, event.magicalChanges);
    }
  }

  private applyEnvironmentalChange(event: WorldUpdateEvent): void {
    if (event.environmentalChanges) {
      this.worldState.environmentalConditions = event.environmentalChanges;
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Get all active threats
   */
  getActiveThreats(): ThreatState[] {
    return [...this.worldState.activeThreats];
  }

  /**
   * Get faction by ID
   */
  getFaction(factionId: string): FactionState | undefined {
    return this.worldState.factionStates.get(factionId);
  }

  /**
   * Get all factions
   */
  getAllFactions(): FactionState[] {
    return Array.from(this.worldState.factionStates.values());
  }

  /**
   * Get economic state
   */
  getEconomicState(): EconomicState {
    return { ...this.worldState.economicState };
  }

  /**
   * Get political state
   */
  getPoliticalState(): PoliticalState {
    return { ...this.worldState.politicalState };
  }

  /**
   * Get magical state
   */
  getMagicalState(): MagicalState {
    return { ...this.worldState.magicalState };
  }

  /**
   * Get simulation results
   */
  getSimulationResults(): SimulationResult[] {
    return [...this.simulationResults];
  }

  /**
   * Generate world summary report
   */
  generateWorldReport(): {
    stability: number;
    activeThreats: number;
    economicHealth: number;
    politicalStability: number;
    magicalStability: number;
    keyEvents: string[];
    recommendations: string[];
  } {
    const activeThreats = this.worldState.activeThreats.filter(t => t.activity === 'active' || t.activity === 'escalating').length;
    
    const stability = (
      this.worldState.location.stability +
      (1 - this.worldState.economicState.inflation) +
      this.worldState.politicalState.overallStability +
      (1 - this.worldState.magicalState.anomalies.reduce((sum, a) => sum + a.intensity, 0) / Math.max(1, this.worldState.magicalState.anomalies.length))
    ) / 4;

    const recommendations: string[] = [];
    
    if (activeThreats > 2) {
      recommendations.push('Multiple active threats require attention');
    }
    if (this.worldState.economicState.overallHealth < 0.5) {
      recommendations.push('Economic intervention may be needed');
    }
    if (this.worldState.politicalState.tensions.some(t => t.level > 0.7)) {
      recommendations.push('Political tensions approaching critical level');
    }

    return {
      stability,
      activeThreats,
      economicHealth: this.worldState.economicState.overallHealth,
      politicalStability: this.worldState.politicalState.overallStability,
      magicalStability: 1 - (this.worldState.magicalState.anomalies.length * 0.1),
      keyEvents: this.worldState.eventHistory.slice(-5).map(e => e.description),
      recommendations
    };
  }
}

// Interface for world update events
export interface WorldUpdateEvent {
  type: 'location_change' | 'threat_change' | 'faction_change' | 'economic_change' | 'political_change' | 'magical_change' | 'environmental_change';
  description: string;
  locationId?: string;
  locationChanges?: Partial<WorldLocation>;
  threatId?: string;
  threatChanges?: Partial<ThreatState>;
  factionId?: string;
  factionChanges?: Partial<FactionState>;
  economicChanges?: Partial<EconomicState>;
  politicalChanges?: Partial<PoliticalState>;
  magicalChanges?: Partial<MagicalState>;
  environmentalChanges?: EnvironmentalCondition[];
  impact?: EventImpact;
  affectedRegions?: string[];
}

export default DynamicWorldSimulation;