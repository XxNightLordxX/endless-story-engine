/**
 * DynamicWorldSimulation - World State Evolution System
 * 
 * Manages the dynamic evolution of the story world:
 * - Tracks world state changes over time
 * - Simulates cause-effect relationships
 * - Manages environment and atmosphere
 * - Handles world reactions to story events
 * - Maintains world consistency and logic
 */

import { Chapter, StoryState } from '../types';
import { StoryGenerationOptions } from '../types';

interface WorldState {
  time: WorldTime;
  location: LocationState;
  environment: EnvironmentState;
  atmosphere: AtmosphereState;
  population: PopulationState;
  resources: ResourceState;
  politics: PoliticalState;
  economy: EconomicState;
  magic: MagicState;
  technology: TechnologyState;
  weather: WeatherState;
  events: WorldEvent[];
  connections: WorldConnection[];
}

interface WorldTime {
  day: number;
  season: 'spring' | 'summer' | 'fall' | 'winter';
  year: number;
  era: string;
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night' | 'midnight';
  timeProgression: number;
}

interface LocationState {
  current: string;
  visited: string[];
  discovered: string[];
  locked: string[];
  connections: Map<string, string[]>;
  descriptions: Map<string, string>;
  conditions: Map<string, string>;
}

interface EnvironmentState {
  light: number; // 0-1
  temperature: number;
  humidity: number;
  airQuality: number;
  gravity: number;
  atmosphere: string;
  hazards: string[];
}

interface AtmosphereState {
  mood: string;
  tension: number;
  mystery: number;
  wonder: number;
  dread: number;
  hope: number;
  culturalContext: string;
  socialClimate: string;
}

interface PopulationState {
  factions: Map<string, Faction>;
  characters: Map<string, CharacterPresence>;
  demographics: Demographics;
  movements: Movement[];
}

interface Faction {
  id: string;
  name: string;
  power: number;
  influence: number;
  resources: number;
  territory: string[];
  allies: string[];
  enemies: string[];
  goals: string[];
  currentStatus: string;
}

interface CharacterPresence {
  location: string;
  activity: string;
  visible: boolean;
  accessible: boolean;
  interactions: string[];
}

interface Demographics {
  totalPopulation: number;
  distribution: Map<string, number>;
  sentiment: Map<string, number>;
  unrest: number;
  prosperity: number;
}

interface Movement {
  faction: string;
  from: string;
  to: string;
  reason: string;
  timestamp: number;
}

interface ResourceState {
  food: number;
  water: number;
  energy: number;
  materials: number;
  luxury: number;
  scarcity: string[];
  abundance: string[];
}

interface PoliticalState {
  stability: number;
  government: string;
  laws: string[];
  conflicts: Conflict[];
  treaties: Treaty[];
  alliances: string[];
}

interface Conflict {
  id: string;
  parties: string[];
  type: 'war' | 'civil' | 'diplomatic' | 'trade' | 'ideological';
  severity: number;
  status: 'active' | 'escalating' | 'de-escalating' | 'resolved';
  affectedAreas: string[];
}

interface Treaty {
  parties: string[];
  terms: string[];
  status: string;
  expiration?: number;
}

interface EconomicState {
  prosperity: number;
  inflation: number;
  trade: TradeRoute[];
  industries: Map<string, number>;
  marketTrend: 'growing' | 'stable' | 'declining';
  crisis: string | null;
}

interface TradeRoute {
  from: string;
  to: string;
  goods: string[];
  status: 'active' | 'disrupted' | 'blocked';
  value: number;
}

interface MagicState {
  level: number;
  availability: number;
  stability: number;
  schools: Map<string, number>;
  disturbances: MagicDisturbance[];
  artifacts: Artifact[];
}

interface MagicDisturbance {
  id: string;
  type: string;
  location: string;
  severity: number;
  effects: string[];
}

interface Artifact {
  id: string;
  name: string;
  location: string;
  power: number;
  type: string;
  discovered: boolean;
}

interface TechnologyState {
  level: number;
  development: Map<string, number>;
  innovations: Innovation[];
  availability: string[];
}

interface Innovation {
  name: string;
  description: string;
  impact: number;
  discoveredAt: number;
}

interface WeatherState {
  current: string;
  forecast: string[];
  severity: number;
  seasonalTrend: string;
  patterns: WeatherPattern[];
}

interface WeatherPattern {
  type: string;
  frequency: number;
  season: string;
}

interface WorldEvent {
  id: string;
  type: 'natural' | 'political' | 'social' | 'magical' | 'economic' | 'military';
  description: string;
  location: string;
  time: WorldTime;
  impact: number;
  affectedSystems: string[];
  consequences: string[];
  duration: number;
}

interface WorldConnection {
  from: string;
  to: string;
  type: string;
  strength: number;
  affectedBy: string[];
}

interface CauseEffectRelation {
  cause: WorldEvent;
  effect: WorldEvent;
  probability: number;
  delay: number;
  chain: WorldEvent[];
}

export class DynamicWorldSimulation {
  private worldState: WorldState;
  private eventHistory: WorldEvent[] = [];
  private causeEffectChains: CauseEffectRelation[] = [];
  private currentChapter: number = 0;
  private seed: number = 0;

  constructor(config?: { seed?: number }) {
    this.seed = config?.seed ?? Date.now();
    this.worldState = this.initializeWorld();
  }

  /**
   * Initialize world state
   */
  private initializeWorld(): WorldState {
    return {
      time: {
        day: 1,
        season: 'spring',
        year: 1,
        era: 'Age of Beginnings',
        timeOfDay: 'morning',
        timeProgression: 0
      },
      location: {
        current: 'central_hub',
        visited: ['central_hub'],
        discovered: ['central_hub'],
        locked: [],
        connections: new Map([['central_hub', ['forest', 'town', 'castle']]]),
        descriptions: new Map([['central_hub', 'The heart of the realm']]),
        conditions: new Map([['central_hub', 'Peaceful']])
      },
      environment: {
        light: 0.5,
        temperature: 20,
        humidity: 50,
        airQuality: 0.9,
        gravity: 1,
        atmosphere: 'breathable',
        hazards: []
      },
      atmosphere: {
        mood: 'hopeful',
        tension: 0.3,
        mystery: 0.4,
        wonder: 0.6,
        dread: 0.2,
        hope: 0.7,
        culturalContext: 'Traditional',
        socialClimate: 'Stable'
      },
      population: {
        factions: new Map(),
        characters: new Map(),
        demographics: {
          totalPopulation: 10000,
          distribution: new Map([['citizens', 8000], ['travelers', 2000]]),
          sentiment: new Map([['government', 0.7], ['outsiders', 0.5]]),
          unrest: 0.2,
          prosperity: 0.7
        },
        movements: []
      },
      resources: {
        food: 100,
        water: 100,
        energy: 80,
        materials: 60,
        luxury: 40,
        scarcity: [],
        abundance: ['food', 'water']
      },
      politics: {
        stability: 0.8,
        government: 'Monarchy',
        laws: ['protect citizens', 'pay taxes', 'respect authority'],
        conflicts: [],
        treaties: [],
        alliances: []
      },
      economy: {
        prosperity: 0.7,
        inflation: 0.05,
        trade: [],
        industries: new Map([['agriculture', 100], ['craftsmanship', 80]]),
        marketTrend: 'stable',
        crisis: null
      },
      magic: {
        level: 0.5,
        availability: 0.4,
        stability: 0.9,
        schools: new Map([['elemental', 50], ['healing', 40]]),
        disturbances: [],
        artifacts: []
      },
      technology: {
        level: 0.5,
        development: new Map([['tools', 50], ['weapons', 40]]),
        innovations: [],
        availability: []
      },
      weather: {
        current: 'clear',
        forecast: ['sunny', 'cloudy', 'rain'],
        severity: 0.2,
        seasonalTrend: 'warming',
        patterns: [
          { type: 'clear', frequency: 0.6, season: 'summer' },
          { type: 'rain', frequency: 0.3, season: 'spring' },
          { type: 'snow', frequency: 0.4, season: 'winter' }
        ]
      },
      events: [],
      connections: []
    };
  }

  /**
   * Update world state from chapter
   */
  async updateFromChapter(
    chapter: Chapter,
    storyState: StoryState,
    options: StoryGenerationOptions
  ): Promise<WorldEvent[]> {
    this.currentChapter = chapter.chapterNumber;

    // Extract world information from chapter
    const worldInfo = this.extractWorldInformation(chapter.content);

    // Update time
    this.updateTime(worldInfo);

    // Update location
    this.updateLocation(worldInfo);

    // Update environment
    this.updateEnvironment(worldInfo);

    // Update atmosphere
    this.updateAtmosphere(worldInfo, options);

    // Update population
    this.updatePopulation(worldInfo);

    // Update resources
    this.updateResources(worldInfo);

    // Update politics
    this.updatePolitics(worldInfo);

    // Update economy
    this.updateEconomy(worldInfo);

    // Update magic
    this.updateMagic(worldInfo);

    // Update technology
    this.updateTechnology(worldInfo);

    // Update weather
    this.updateWeather(worldInfo);

    // Generate world events based on changes
    const newEvents = this.generateWorldEvents(worldInfo);

    // Process cause-effect chains
    this.processCauseEffectChains(newEvents);

    return newEvents;
  }

  /**
   * Extract world information from chapter content
   */
  private extractWorldInformation(content: string): {
    time: string[];
    location: string[];
    environment: string[];
    population: string[];
    events: string[];
    weather: string[];
    magic: string[];
  } {
    return {
      time: this.extractKeywords(content, ['morning', 'afternoon', 'evening', 'night', 'dawn', 'dusk', 'day', 'night', 'hours', 'minutes']),
      location: this.extractKeywords(content, ['in', 'at', 'near', 'forest', 'castle', 'town', 'city', 'mountain', 'river', 'sea', 'castle']),
      environment: this.extractKeywords(content, ['cold', 'hot', 'warm', 'dry', 'humid', 'windy', 'still', 'dark', 'bright', 'sunny', 'cloudy']),
      population: this.extractKeywords(content, ['people', 'citizens', 'army', 'faction', 'rebel', 'king', 'queen', 'soldier', 'merchant', 'farmer']),
      events: this.extractKeywords(content, ['war', 'battle', 'festival', 'ceremony', 'celebration', 'riot', 'protest', 'revolution', 'crisis']),
      weather: this.extractKeywords(content, ['rain', 'snow', 'wind', 'storm', 'clear', 'cloudy', 'fog', 'mist', 'sunny']),
      magic: this.extractKeywords(content, ['magic', 'spell', 'enchantment', 'curse', 'ritual', 'summon', 'conjure', 'magical'])
    };
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(content: string, keywords: string[]): string[] {
    const found: string[] = [];
    const lowerContent = content.toLowerCase();

    for (const keyword of keywords) {
      if (lowerContent.includes(keyword)) {
        found.push(keyword);
      }
    }

    return found;
  }

  /**
   * Update world time
   */
  private updateTime(worldInfo: { time: string[] }): void {
    // Progress time based on chapter content
    if (worldInfo.time.includes('morning')) {
      this.worldState.time.timeOfDay = 'morning';
    } else if (worldInfo.time.includes('afternoon')) {
      this.worldState.time.timeOfDay = 'afternoon';
    } else if (worldInfo.time.includes('evening') || worldInfo.time.includes('dusk')) {
      this.worldState.time.timeOfDay = 'evening';
    } else if (worldInfo.time.includes('night') || worldInfo.time.includes('dawn')) {
      this.worldState.time.timeOfDay = 'night';
    }

    // Advance day based on time progression
    this.worldState.time.timeProgression += 0.1;
    if (this.worldState.time.timeProgression >= 1) {
      this.worldState.time.day++;
      this.worldState.time.timeProgression = 0;

      // Update season
      const seasonDays = 30;
      const seasonIndex = Math.floor((this.worldState.time.day - 1) / seasonDays) % 4;
      const seasons: WorldTime['season'][] = ['spring', 'summer', 'fall', 'winter'];
      this.worldState.time.season = seasons[seasonIndex];
    }

    // Update environment light based on time of day
    const lightLevels: Record<WorldTime['timeOfDay'], number> = {
      dawn: 0.3,
      morning: 0.7,
      noon: 1,
      afternoon: 0.8,
      dusk: 0.4,
      night: 0.1,
      midnight: 0
    };
    this.worldState.environment.light = lightLevels[this.worldState.time.timeOfDay];
  }

  /**
   * Update location
   */
  private updateLocation(worldInfo: { location: string[] }): void {
    // Detect location changes
    for (const loc of worldInfo.location) {
      if (!this.worldState.location.visited.includes(loc)) {
        this.worldState.location.discovered.push(loc);
        this.worldState.location.visited.push(loc);
      }
      this.worldState.location.current = loc;
    }
  }

  /**
   * Update environment
   */
  private updateEnvironment(worldInfo: { environment: string[] }): void {
    // Update temperature based on keywords
    if (worldInfo.environment.includes('cold') || worldInfo.environment.includes('winter')) {
      this.worldState.environment.temperature -= 2;
    } else if (worldInfo.environment.includes('hot') || worldInfo.environment.includes('summer')) {
      this.worldState.environment.temperature += 2;
    }

    // Update humidity
    if (worldInfo.environment.includes('humid') || worldInfo.environment.includes('rain')) {
      this.worldState.environment.humidity += 5;
    } else if (worldInfo.environment.includes('dry')) {
      this.worldState.environment.humidity -= 5;
    }

    // Clamp values
    this.worldState.environment.temperature = Math.max(-20, Math.min(50, this.worldState.environment.temperature));
    this.worldState.environment.humidity = Math.max(0, Math.min(100, this.worldState.environment.humidity));
  }

  /**
   * Update atmosphere
   */
  private updateAtmosphere(
    worldInfo: { population: string[]; events: string[] },
    options: StoryGenerationOptions
  ): void {
    // Update tension based on events
    if (worldInfo.events.includes('war') || worldInfo.events.includes('battle')) {
      this.worldState.atmosphere.tension = Math.min(1, this.worldState.atmosphere.tension + 0.2);
    } else if (worldInfo.events.includes('festival') || worldInfo.events.includes('celebration')) {
      this.worldState.atmosphere.tension = Math.max(0, this.worldState.atmosphere.tension - 0.1);
    }

    // Apply tension from story options
    if (options.tension) {
      this.worldState.atmosphere.tension = options.tension;
    }

    // Update mood
    if (this.worldState.atmosphere.tension > 0.7) {
      this.worldState.atmosphere.mood = 'tense';
    } else if (this.worldState.atmosphere.tension < 0.3) {
      this.worldState.atmosphere.mood = 'peaceful';
    } else {
      this.worldState.atmosphere.mood = 'balanced';
    }

    // Update dread based on atmosphere
    this.worldState.atmosphere.dread = Math.min(1, this.worldState.atmosphere.dread + (this.worldState.atmosphere.tension - 0.5) * 0.1);
  }

  /**
   * Update population
   */
  private updatePopulation(worldInfo: { population: string[] }): void {
    // Detect factions
    const factionKeywords: Record<string, string> = {
      'army': 'military',
      'rebel': 'rebels',
      'merchant': 'merchants',
      'king': 'royalty',
      'queen': 'royalty'
    };

    for (const [keyword, factionType] of Object.entries(factionKeywords)) {
      if (worldInfo.population.includes(keyword)) {
        const faction = this.worldState.population.factions.get(factionType);
        if (!faction) {
          this.worldState.population.factions.set(factionType, {
            id: factionType,
            name: keyword.charAt(0).toUpperCase() + keyword.slice(1),
            power: 50,
            influence: 50,
            resources: 50,
            territory: [],
            allies: [],
            enemies: [],
            goals: [],
            currentStatus: 'active'
          });
        }
      }
    }
  }

  /**
   * Update resources
   */
  private updateResources(worldInfo: { events: string[] }): void {
    // Resource consumption from events
    if (worldInfo.events.includes('war') || worldInfo.events.includes('battle')) {
      this.worldState.resources.food -= 10;
      this.worldState.resources.materials -= 15;
      this.worldState.resources.energy -= 10;
    }

    // Resource regeneration over time
    this.worldState.resources.food = Math.min(100, this.worldState.resources.food + 2);
    this.worldState.resources.water = Math.min(100, this.worldState.resources.water + 3);

    // Update scarcity and abundance
    this.worldState.resources.scarcity = Object.entries(this.worldState.resources)
      .filter(([key, value]) => typeof value === 'number' && value < 30)
      .map(([key]) => key);

    this.worldState.resources.abundance = Object.entries(this.worldState.resources)
      .filter(([key, value]) => typeof value === 'number' && value > 70)
      .map(([key]) => key);
  }

  /**
   * Update politics
   */
  private updatePolitics(worldInfo: { events: string[]; population: string[] }): void {
    // Political stability from events
    if (worldInfo.events.includes('riot') || worldInfo.events.includes('protest')) {
      this.worldState.politics.stability -= 0.1;
      this.worldState.population.demographics.unrest += 0.2;
    } else if (worldInfo.events.includes('festival') || worldInfo.events.includes('celebration')) {
      this.worldState.politics.stability += 0.05;
      this.worldState.population.demographics.unrest -= 0.1;
    }

    // Create conflicts
    if (worldInfo.events.includes('war')) {
      const conflict: Conflict = {
        id: `conflict_${Date.now()}`,
        parties: ['government', 'rebels'],
        type: 'war',
        severity: 0.8,
        status: 'active',
        affectedAreas: [this.worldState.location.current]
      };
      this.worldState.politics.conflicts.push(conflict);
    }

    // Clamp stability
    this.worldState.politics.stability = Math.max(0, Math.min(1, this.worldState.politics.stability));
    this.worldState.population.demographics.unrest = Math.max(0, Math.min(1, this.worldState.population.demographics.unrest));
  }

  /**
   * Update economy
   */
  private updateEconomy(worldInfo: { events: string[] }): void {
    // Economic impact from events
    if (worldInfo.events.includes('war')) {
      this.worldState.economy.prosperity -= 0.1;
      this.worldState.economy.inflation += 0.05;
      this.worldState.economy.marketTrend = 'declining';
    } else if (worldInfo.events.includes('festival') || worldInfo.events.includes('celebration')) {
      this.worldState.economy.prosperity += 0.05;
      this.worldState.economy.marketTrend = 'growing';
    }

    // Clamp values
    this.worldState.economy.prosperity = Math.max(0, Math.min(1, this.worldState.economy.prosperity));
    this.worldState.economy.inflation = Math.max(0, Math.min(0.5, this.worldState.economy.inflation));
  }

  /**
   * Update magic
   */
  private updateMagic(worldInfo: { magic: string[] }): void {
    // Magic activity
    if (worldInfo.magic.length > 0) {
      this.worldState.magic.availability += 0.1;
      this.worldState.magic.stability -= 0.05;

      // Potential magic disturbances
      if (this.worldState.magic.stability < 0.5 && Math.random() < 0.3) {
        this.worldState.magic.disturbances.push({
          id: `disturbance_${Date.now()}`,
          type: 'mana_surge',
          location: this.worldState.location.current,
          severity: Math.random() * 0.5 + 0.3,
          effects: ['unpredictable magic', 'enchantment fluctuations']
        });
      }
    } else {
      // Magic recovery
      this.worldState.magic.stability = Math.min(1, this.worldState.magic.stability + 0.05);
    }

    // Clamp values
    this.worldState.magic.availability = Math.max(0, Math.min(1, this.worldState.magic.availability));
    this.worldState.magic.stability = Math.max(0, Math.min(1, this.worldState.magic.stability));
  }

  /**
   * Update technology
   */
  private updateTechnology(worldInfo: { population: string[] }): void {
    // Technology progress from interactions
    if (worldInfo.population.includes('merchant') || worldInfo.population.includes('craftsman')) {
      const industries = Object.keys(this.worldState.technology.development);
      const randomIndustry = industries[Math.floor(Math.random() * industries.length)];
      this.worldState.technology.development.set(
        randomIndustry,
        Math.min(100, this.worldState.technology.development.get(randomIndustry)! + 1)
      );
    }
  }

  /**
   * Update weather
   */
  private updateWeather(worldInfo: { weather: string[] }): void {
    // Weather from content
    if (worldInfo.weather.length > 0) {
      this.worldState.weather.current = worldInfo.weather[0];
    } else {
      // Random weather based on seasonal patterns
      const seasonalPatterns = this.worldState.weather.patterns.filter(p => p.season === this.worldState.time.season);
      const pattern = seasonalPatterns[Math.floor(Math.random() * seasonalPatterns.length)];

      if (Math.random() < pattern.frequency) {
        this.worldState.weather.current = pattern.type;
      }
    }

    // Update forecast
    this.worldState.weather.forecast = [this.worldState.weather.current];
    for (let i = 0; i < 3; i++) {
      const seasonalPatterns = this.worldState.weather.patterns.filter(p => p.season === this.worldState.time.season);
      const pattern = seasonalPatterns[Math.floor(Math.random() * seasonalPatterns.length)];
      if (Math.random() < pattern.frequency) {
        this.worldState.weather.forecast.push(pattern.type);
      }
    }
  }

  /**
   * Generate world events based on changes
   */
  private generateWorldEvents(worldInfo: any): WorldEvent[] {
    const events: WorldEvent[] = [];

    // Natural events based on weather
    if (this.worldState.weather.current === 'storm' && Math.random() < 0.3) {
      events.push({
        id: `storm_${Date.now()}`,
        type: 'natural',
        description: 'A severe storm sweeps through the region',
        location: this.worldState.location.current,
        time: { ...this.worldState.time },
        impact: 0.6,
        affectedSystems: ['environment', 'economy', 'population'],
        consequences: ['Damage to structures', 'Travel disruption', 'Resource loss'],
        duration: 2
      });
    }

    // Social events based on population
    if (this.worldState.population.demographics.unrest > 0.7 && Math.random() < 0.4) {
      events.push({
        id: `unrest_${Date.now()}`,
        type: 'social',
        description: 'Civil unrest spreads through the population',
        location: this.worldState.location.current,
        time: { ...this.worldState.time },
        impact: 0.7,
        affectedSystems: ['politics', 'population', 'economy'],
        consequences: ['Political instability', 'Economic disruption', 'Social upheaval'],
        duration: 5
      });
    }

    // Economic events
    if (this.worldState.economy.prosperity < 0.3 && Math.random() < 0.3) {
      this.worldState.economy.crisis = 'economic_downturn';
      events.push({
        id: `crisis_${Date.now()}`,
        type: 'economic',
        description: 'Economic downturn affects the region',
        location: this.worldState.location.current,
        time: { ...this.worldState.time },
        impact: 0.5,
        affectedSystems: ['economy', 'population', 'politics'],
        consequences: ['Poverty increases', 'Trade decreases', 'Social tension rises'],
        duration: 10
      });
    }

    // Magical events
    if (this.worldState.magic.disturbances.length > 3) {
      events.push({
        id: `magic_crisis_${Date.now()}`,
        type: 'magical',
        description: 'Magical disturbances reach critical levels',
        location: this.worldState.location.current,
        time: { ...this.worldState.time },
        impact: 0.8,
        affectedSystems: ['magic', 'environment', 'population'],
        consequences: ['Magic becomes unstable', 'Environment affected', 'Population concerned'],
        duration: 7
      });
    }

    this.worldState.events.push(...events);
    return events;
  }

  /**
   * Process cause-effect chains
   */
  private processCauseEffectChains(newEvents: WorldEvent[]): void {
    for (const event of newEvents) {
      // Find related events
      const relatedEvents = this.eventHistory.filter(e => 
        e.location === event.location && 
        e.type === event.type &&
        Math.abs(this.calculateEventDistance(e, event)) < 10
      );

      for (const related of relatedEvents) {
        // Determine if this is a consequence
        const probability = this.calculateCauseProbability(related, event);
        if (probability > 0.5) {
          this.causeEffectChains.push({
            cause: related,
            effect: event,
            probability,
            delay: event.id.split('_')[1].localeCompare(related.id.split('_')[1]),
            chain: [related, event]
          });
        }
      }
    }

    this.eventHistory.push(...newEvents);
  }

  /**
   * Calculate distance between events
   */
  private calculateEventDistance(e1: WorldEvent, e2: WorldEvent): number {
    const timeDiff = (e2.time.day - e1.time.day) * 24 + (this.getTimeOfDayValue(e2.time.timeOfDay) - this.getTimeOfDayValue(e1.time.timeOfDay));
    return Math.abs(timeDiff);
  }

  /**
   * Get numeric value for time of day
   */
  private getTimeOfDayValue(time: WorldTime['timeOfDay']): number {
    const values: Record<WorldTime['timeOfDay'], number> = {
      dawn: 6,
      morning: 9,
      noon: 12,
      afternoon: 15,
      dusk: 18,
      night: 21,
      midnight: 0
    };
    return values[time];
  }

  /**
   * Calculate probability of cause-effect relationship
   */
  private calculateCauseProbability(cause: WorldEvent, effect: WorldEvent): number {
    let probability = 0.5;

    // Same type increases probability
    if (cause.type === effect.type) {
      probability += 0.2;
    }

    // High impact causes have higher probability
    if (cause.impact > 0.7) {
      probability += 0.2;
    }

    // Overlapping affected systems increase probability
    const overlap = cause.affectedSystems.filter(s => effect.affectedSystems.includes(s)).length;
    probability += overlap * 0.1;

    return Math.min(probability, 1);
  }

  /**
   * Get current world state
   */
  getWorldState(): WorldState {
    return { ...this.worldState };
  }

  /**
   * Get world time
   */
  getWorldTime(): WorldTime {
    return { ...this.worldState.time };
  }

  /**
   * Get atmosphere
   */
  getAtmosphere(): AtmosphereState {
    return { ...this.worldState.atmosphere };
  }

  /**
   * Get environment state
   */
  getEnvironment(): EnvironmentState {
    return { ...this.worldState.environment };
  }

  /**
   * Get population state
   */
  getPopulation(): PopulationState {
    return { ...this.worldState.population };
  }

  /**
   * Get political state
   */
  getPolitics(): PoliticalState {
    return { ...this.worldState.politics };
  }

  /**
   * Get economic state
   */
  getEconomy(): EconomicState {
    return { ...this.worldState.economy };
  }

  /**
   * Get magic state
   */
  getMagic(): MagicState {
    return { ...this.worldState.magic };
  }

  /**
   * Get weather state
   */
  getWeather(): WeatherState {
    return { ...this.worldState.weather };
  }

  /**
   * Get recent events
   */
  getRecentEvents(count: number = 10): WorldEvent[] {
    return this.worldState.events.slice(-count);
  }

  /**
   * Get cause-effect chains
   */
  getCauseEffectChains(): CauseEffectRelation[] {
    return [...this.causeEffectChains];
  }

  /**
   * Export world state
   */
  exportState(): WorldState {
    return JSON.parse(JSON.stringify(this.worldState));
  }

  /**
   * Import world state
   */
  importState(state: WorldState): void {
    this.worldState = JSON.parse(JSON.stringify(state));
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.worldState = this.initializeWorld();
    this.eventHistory = [];
    this.causeEffectChains = [];
    this.currentChapter = 0;
  }
}