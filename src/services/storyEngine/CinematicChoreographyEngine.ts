import { v4 as uuidv4 } from 'uuid';
import { webSearchIntegration } from './WebSearchIntegration';
import type { WebSearchResult, TechnicalSearchResult } from './WebSearchIntegration';

/**
 * Cinematic Choreography Engine
 * 
 * This system provides cinematic direction and visual pacing for narrative content.
 * It analyzes scenes for cinematic potential and suggests visual choreography.
 * 
 * Enhanced with real-time web search for cinematic techniques,
 * visual storytelling methods, and scene composition principles.
 * 
 * Core Responsibilities:
 * - Analyze scenes for cinematic potential and visual composition
 * - Suggest camera angles, movements, and transitions
 * - Manage visual pacing and rhythm
 * - Coordinate action sequences and dramatic moments
 * - Provide lighting, sound, and atmosphere direction
 * - Track visual motifs and imagery
 */

// ===== TYPES & INTERFACES =====

export interface CinematicScene {
  id: string;
  chapter: number;
  sceneNumber: number;
  duration: number; // in seconds (estimated reading time)
  visualComposition: VisualComposition;
  cameraWork: CameraWork;
  lighting: LightingDesign;
  soundDesign: SoundDesign;
  actionChoreography: ActionChoreography | null;
  emotionalArc: EmotionalBeat[];
  visualMotifs: VisualMotif[];
  transitions: SceneTransition[];
  pacing: PacingProfile;
  atmosphere: AtmosphereProfile;
}

export interface VisualComposition {
  framing: FramingType;
  depth: DepthLevel;
  focalPoint: string;
  backgroundElements: string[];
  foregroundElements: string[];
  visualBalance: number; // 0-1
  ruleOfThirds: boolean;
  leadingLines: string[];
  visualTension: number; // 0-1
}

export type FramingType = 
  | 'extreme-wide' | 'wide' | 'full' | 'medium' | 'medium-close'
  | 'close-up' | 'extreme-close' | 'insert' | 'cutaway' | 'pov';

export type DepthLevel = 'shallow' | 'medium' | 'deep' | 'rack-focus';

export interface CameraWork {
  angle: CameraAngle;
  movement: CameraMovement;
  speed: MovementSpeed;
  stability: StabilityType;
  perspective: PerspectiveType;
  lens: LensType;
  suggestedShots: CameraShot[];
}

export interface CameraAngle {
  type: 'low' | 'eye-level' | 'high' | 'birds-eye' | 'dutch';
  degrees: number; // from horizontal
  effect: string;
}

export interface CameraMovement {
  type: 'static' | 'pan' | 'tilt' | 'dolly' | 'truck' | 'crane' | 'steadicam' | 'handheld' | 'crane' | 'zoom';
  direction: string;
  duration: number;
  motivation: string;
}

export type MovementSpeed = 'slow' | 'medium' | 'fast' | 'variable';
export type StabilityType = 'tripod' | 'steadicam' | 'handheld' | 'drone';
export type PerspectiveType = 'objective' | 'subjective' | 'omniscient';
export type LensType = 'wide' | 'normal' | 'telephoto' | 'macro' | 'fisheye';

export interface CameraShot {
  id: string;
  type: string;
  duration: number;
  description: string;
  purpose: string;
  precedingShot?: string;
  followingShot?: string;
}

export interface LightingDesign {
  keyLight: LightSource;
  fillLight: LightSource | null;
  backLight: LightSource | null;
  ambientLight: AmbientLight;
  colorTemperature: ColorTemperature;
  contrast: ContrastType;
  mood: LightingMood;
  practicalLights: PracticalLight[];
  shadows: ShadowDesign;
}

export interface LightSource {
  type: 'natural' | 'artificial' | 'mixed';
  direction: string;
  intensity: number; // 0-1
  color: string;
  hardness: 'hard' | 'soft' | 'diffused';
  motivation: string; // in-story source
}

export interface AmbientLight {
  level: number; // 0-1
  color: string;
  source: string;
}

export type ColorTemperature = 'warm' | 'neutral' | 'cool' | 'mixed';
export type ContrastType = 'low' | 'medium' | 'high' | 'chiaroscuro';
export type LightingMood = 'natural' | 'dramatic' | 'romantic' | 'mysterious' | 'horror' | 'ethereal';

export interface PracticalLight {
  type: string; // lamp, candle, fire, screen, etc.
  position: string;
  color: string;
  flickering: boolean;
}

export interface ShadowDesign {
  type: 'soft' | 'hard' | 'cast' | 'ambient';
  direction: string;
  depth: number; // 0-1
}

export interface SoundDesign {
  ambientSounds: AmbientSound[];
  dialogue: DialogueProfile;
  music: MusicCue[];
  soundEffects: SoundEffect[];
  silence: SilenceCue[];
  soundscape: SoundscapeProfile;
}

export interface AmbientSound {
  type: string;
  volume: number; // 0-1
  stereo: StereoPosition;
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
}

export interface DialogueProfile {
  clarity: number; // 0-1
  reverb: number; // 0-1
  intimacy: number; // 0-1
  overlapping: boolean;
  offScreen: boolean;
}

export interface MusicCue {
  id: string;
  type: 'score' | 'source' | 'diegetic';
  mood: string;
  tempo: number; // BPM
  instruments: string[];
  volume: number; // 0-1
  fadeIn: number;
  fadeOut: number;
  synchronisation: string; // what it syncs to
}

export interface SoundEffect {
  type: string;
  timing: 'sync' | 'off-screen' | 'anticipatory' | 'aftermath';
  volume: number;
  impact: number; // 1-10
  layering: string[];
}

export interface SilenceCue {
  duration: number;
  type: 'absolute' | 'ambient' | 'dramatic';
  purpose: string;
}

export interface SoundscapeProfile {
  overallMood: string;
  density: number; // 0-1
  layering: number; // 0-1
  spatial: SpatialProfile;
}

export interface SpatialProfile {
  width: StereoPosition;
  depth: number; // 0-1
  height: number; // 0-1
}

export type StereoPosition = 'left' | 'center' | 'right' | 'wide' | 'surround';

export interface ActionChoreography {
  sequence: ActionBeat[];
  participants: ActionParticipant[];
  environment: EnvironmentInteraction[];
  pacing: ActionPacing;
  safetyConsiderations: string[];
  vfxRequirements: VFXRequirement[];
}

export interface ActionBeat {
  id: string;
  order: number;
  type: 'movement' | 'strike' | 'reaction' | 'block' | 'environment' | 'vfx';
  duration: number;
  description: string;
  camera: CameraShot;
  participants: string[];
  impact: number; // 1-10
  aftermath: string;
}

export interface ActionParticipant {
  characterId: string;
  role: 'primary' | 'secondary' | 'group';
  position: string;
  movement: string;
  intensity: number; // 1-10
}

export interface EnvironmentInteraction {
  element: string;
  action: string;
  consequence: string;
  vfxRequired: boolean;
}

export interface ActionPacing {
  rhythm: 'slow' | 'building' | 'intense' | 'climactic' | 'resolving';
  acceleration: number; // 0-1
  pauses: number[];
  crescendo: number; // beat number
}

export interface VFXRequirement {
  type: string;
  description: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'extensive';
  integrationPoint: string;
}

export interface EmotionalBeat {
  id: string;
  type: 'setup' | 'build' | 'peak' | 'release' | 'linger';
  emotion: string;
  intensity: number; // 1-10
  duration: number;
  visualCorrelation: string;
  soundCorrelation: string;
}

export interface VisualMotif {
  id: string;
  name: string;
  description: string;
  instances: MotifInstance[];
  evolution: MotifEvolution[];
}

export interface MotifInstance {
  chapter: number;
  scene: number;
  variation: string;
  meaning: string;
}

export interface MotifEvolution {
  chapter: number;
  oldMeaning: string;
  newMeaning: string;
  trigger: string;
}

export interface SceneTransition {
  type: TransitionType;
  duration: number;
  motivation: string;
  visualEffect: string;
  soundBridge: boolean;
}

export type TransitionType = 
  | 'cut' | 'fade' | 'dissolve' | 'wipe' | 'iris' | 'match-cut' 
  | 'jump-cut' | 'smash-cut' | 'cross-fade' | 'wipe' | 'morph';

export interface PacingProfile {
  overallRhythm: RhythmType;
  tensionCurve: number[]; // per beat
  breathingRoom: number; // 0-1
  peaks: number[]; // beat numbers
  valleys: number[]; // beat numbers
  momentum: number; // 0-1
  urgency: number; // 0-1
}

export type RhythmType = 'flowing' | 'staccato' | 'accelerating' | 'decelerating' | 'variable';

export interface AtmosphereProfile {
  primary: AtmosphereType;
  secondary: AtmosphereType[];
  intensity: number; // 0-1
  texture: AtmosphereTexture;
  environmentalFactors: string[];
}

export type AtmosphereType = 
  | 'tense' | 'peaceful' | 'mysterious' | 'romantic' | 'dangerous'
  | 'melancholy' | 'hopeful' | 'chaotic' | 'intimate' | 'epic';

export type AtmosphereTexture = 'smooth' | 'grainy' | 'harsh' | 'soft' | 'layered';

export interface CinematicAnalysis {
  sceneId: string;
  overallQuality: number; // 0-1
  visualCoherence: number; // 0-1
  pacingScore: number; // 0-1
  emotionalImpact: number; // 0-1
  technicalComplexity: number; // 0-1
  suggestions: CinematicSuggestion[];
  strengths: string[];
  weaknesses: string[];
}

export interface CinematicSuggestion {
  type: 'camera' | 'lighting' | 'sound' | 'pacing' | 'action' | 'transition';
  priority: 'low' | 'medium' | 'high';
  description: string;
  implementation: string;
  expectedImpact: string;
}

// ===== CLASS DEFINITION =====

export class CinematicChoreographyEngine {
  private scenes: Map<string, CinematicScene> = new Map();
  private visualMotifs: Map<string, VisualMotif> = new Map();
  private analysisHistory: CinematicAnalysis[] = [];
  private currentChapter: number = 0;
  private sceneCount: number = 0;
  
  // Web search integration
  private cinematicTechniquesCache: Map<string, WebSearchResult[]> = new Map();
  private visualStorytellingCache: Map<string, TechnicalSearchResult[]> = new Map();
  private sceneCompositionCache: Map<string, WebSearchResult[]> = new Map();

  constructor() {}

  // ===== WEB SEARCH INTEGRATION =====

  /**
   * Search for cinematic techniques
   */
  async searchCinematicTechniques(
    technique: string,
    scene?: string
  ): Promise<WebSearchResult[]> {
    const key = `${technique}-${scene || 'general'}`;
    if (this.cinematicTechniquesCache.has(key)) {
      return this.cinematicTechniquesCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchCinematicTechniques(
      technique,
      scene
    );
    this.cinematicTechniquesCache.set(key, results);
    return results;
  }

  /**
   * Research visual storytelling methods
   */
  async searchVisualStorytelling(
    style: string,
    genre: string
  ): Promise<TechnicalSearchResult[]> {
    const key = `${style}-${genre}`;
    if (this.visualStorytellingCache.has(key)) {
      return this.visualStorytellingCache.get(key)!;
    }
    
    const results = await webSearchIntegration.searchWritingBestPractices(
      `${style} visual storytelling ${genre}`
    );
    this.visualStorytellingCache.set(key, results);
    return results;
  }

  /**
   * Look up scene composition principles
   */
  async searchSceneComposition(
    composition: string,
    mood: string
  ): Promise<WebSearchResult[]> {
    const key = `${composition}-${mood}`;
    if (this.sceneCompositionCache.has(key)) {
      return this.sceneCompositionCache.get(key)!;
    }
    
    const results = await webSearchIntegration.search(
      `${composition} scene composition ${mood} filmmaking`
    );
    this.sceneCompositionCache.set(key, results);
    return results;
  }

  /**
   * Clear web search cache
   */
  clearWebSearchCache(): void {
    this.cinematicTechniquesCache.clear();
    this.visualStorytellingCache.clear();
    this.sceneCompositionCache.clear();
  }

  // ===== CORE FUNCTIONALITY =====

  /**
   * Analyze a scene for cinematic potential
   */
  public analyzeScene(sceneContent: string, chapter: number, sceneNumber: number): CinematicScene {
    const scene: CinematicScene = {
      id: uuidv4(),
      chapter,
      sceneNumber,
      duration: this.estimateDuration(sceneContent),
      visualComposition: this.analyzeVisualComposition(sceneContent),
      cameraWork: this.designCameraWork(sceneContent),
      lighting: this.designLighting(sceneContent),
      soundDesign: this.designSound(sceneContent),
      actionChoreography: this.choreographAction(sceneContent),
      emotionalArc: this.analyzeEmotionalArc(sceneContent),
      visualMotifs: this.identifyVisualMotifs(sceneContent, chapter, sceneNumber),
      transitions: this.designTransitions(sceneContent),
      pacing: this.analyzePacing(sceneContent),
      atmosphere: this.analyzeAtmosphere(sceneContent)
    };
    
    this.scenes.set(scene.id, scene);
    this.currentChapter = chapter;
    this.sceneCount++;
    
    return scene;
  }

  /**
   * Estimate scene duration
   */
  private estimateDuration(content: string): number {
    const words = content.split(/\s+/).length;
    return Math.ceil(words / 150) * 60; // 150 words per minute
  }

  /**
   * Analyze visual composition
   */
  private analyzeVisualComposition(content: string): VisualComposition {
    const framing = this.determineFraming(content);
    const focalPoint = this.identifyFocalPoint(content);
    
    return {
      framing,
      depth: this.determineDepth(content),
      focalPoint,
      backgroundElements: this.extractBackgroundElements(content),
      foregroundElements: this.extractForegroundElements(content),
      visualBalance: this.calculateVisualBalance(content),
      ruleOfThirds: true,
      leadingLines: this.identifyLeadingLines(content),
      visualTension: this.calculateVisualTension(content)
    };
  }

  /**
   * Determine framing type
   */
  private determineFraming(content: string): FramingType {
    const hasWide = /\b(landscape|horizon|expansive|vast|distance|far)\b/i.test(content);
    const hasClose = /\b(detail|microscopic|pore|eyelash|bead of sweat)\b/i.test(content);
    const hasMedium = /\b(face|expression|eyes|hands|gesture)\b/i.test(content);
    
    if (hasClose) return 'close-up';
    if (hasWide) return 'wide';
    if (hasMedium) return 'medium';
    return 'medium';
  }

  /**
   * Determine depth level
   */
  private determineDepth(content: string): DepthLevel {
    const hasDepth = /\b(layers|depth|background|foreground|distance)\b/i.test(content);
    const hasFocus = /\b(blur|focus|sharp|crisp)\b/i.test(content);
    
    if (hasFocus) return 'rack-focus';
    if (hasDepth) return 'deep';
    return 'medium';
  }

  /**
   * Identify focal point
   */
  private identifyFocalPoint(content: string): string {
    const sentences = content.split(/[.!?]+/);
    const firstSentence = sentences[0] || '';
    
    // Extract main subject from first sentence
    const match = firstSentence.match(/^(?:The\s+)?(\w+)/i);
    return match ? match[1] : 'subject';
  }

  /**
   * Extract background elements
   */
  private extractBackgroundElements(content: string): string[] {
    const elements: string[] = [];
    const backgroundPatterns = [
      /in the (?:background|distance),?\s+(?:there\s+(?:was|were)\s+)?([^.]+)/gi,
      /behind\s+(?:them|him|her|it),?\s+(?:was\s+)?([^.]+)/gi,
      /(?:mountains|hills|buildings|trees|forest|ocean|sky)\s+(?:stretched|loomed|rose)\s+([^.]+)/gi
    ];
    
    backgroundPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) elements.push(match[1].trim());
      }
    });
    
    return elements.slice(0, 5);
  }

  /**
   * Extract foreground elements
   */
  private extractForegroundElements(content: string): string[] {
    const elements: string[] = [];
    const foregroundPatterns = [
      /in the foreground,?\s+(?:there\s+(?:was|were)\s+)?([^.]+)/gi,
      /before\s+(?:them|him|her),?\s+(?:lay|stood|sat)\s+([^.]+)/gi
    ];
    
    foregroundPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1]) elements.push(match[1].trim());
      }
    });
    
    return elements.slice(0, 3);
  }

  /**
   * Calculate visual balance
   */
  private calculateVisualBalance(content: string): number {
    const sentences = content.split(/[.!?]+/);
    const hasLeft = /\b(left|west|port)\b/i.test(content);
    const hasRight = /\b(right|east|starboard)\b/i.test(content);
    const hasCenter = /\b(center|middle|amidst)\b/i.test(content);
    
    let balance = 0.5;
    if (hasLeft && hasRight) balance += 0.3;
    if (hasCenter) balance += 0.2;
    
    return Math.min(1, balance);
  }

  /**
   * Identify leading lines
   */
  private identifyLeadingLines(content: string): string[] {
    const lines: string[] = [];
    const linePatterns = [
      /(?:path|road|river|fence|wall|corridor|hallway|bridge)\b/gi
    ];
    
    linePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        lines.push(match[0].toLowerCase());
      }
    });
    
    return [...new Set(lines)].slice(0, 5);
  }

  /**
   * Calculate visual tension
   */
  private calculateVisualTension(content: string): number {
    const tensionIndicators = /\b(tension|strain|edge|cliff|danger|threat|conflict)\b/gi;
    const matches = content.match(tensionIndicators);
    return matches ? Math.min(1, matches.length / 5) : 0.3;
  }

  /**
   * Design camera work
   */
  private designCameraWork(content: string): CameraWork {
    return {
      angle: this.determineCameraAngle(content),
      movement: this.determineCameraMovement(content),
      speed: this.determineMovementSpeed(content),
      stability: this.determineStability(content),
      perspective: this.determinePerspective(content),
      lens: this.determineLens(content),
      suggestedShots: this.generateShotList(content)
    };
  }

  /**
   * Determine camera angle
   */
  private determineCameraAngle(content: string): CameraAngle {
    const hasLow = /\b(looking up|towering|loomed above|powerful|dominant)\b/i.test(content);
    const hasHigh = /\b(looking down|sprawled below|tiny|insignificant|overwhelmed)\b/i.test(content);
    const hasDutch = /\b(disorienting|chaotic|unbalanced|spinning)\b/i.test(content);
    
    if (hasDutch) return { type: 'dutch', degrees: 15, effect: 'disorientation and unease' };
    if (hasLow) return { type: 'low', degrees: -30, effect: 'power and dominance' };
    if (hasHigh) return { type: 'high', degrees: 45, effect: 'vulnerability or overview' };
    return { type: 'eye-level', degrees: 0, effect: 'neutral observation' };
  }

  /**
   * Determine camera movement
   */
  private determineCameraMovement(content: string): CameraMovement {
    const hasMovement = /\b(walking|running|moving|following|tracking)\b/i.test(content);
    const hasPan = /\b(scanning|surveying|across|spanning)\b/i.test(content);
    const hasTilt = /\b(looked up|looked down|rose|descended)\b/i.test(content);
    const hasZoom = /\b(closer|zoom|focus on|approached)\b/i.test(content);
    
    if (hasMovement) {
      return {
        type: 'steadicam',
        direction: 'forward',
        duration: 5,
        motivation: 'following character movement'
      };
    }
    
    if (hasPan) {
      return {
        type: 'pan',
        direction: 'right',
        duration: 3,
        motivation: 'revealing the environment'
      };
    }
    
    if (hasTilt) {
      return {
        type: 'tilt',
        direction: 'up',
        duration: 2,
        motivation: 'revealing vertical space'
      };
    }
    
    return {
      type: 'static',
      direction: 'none',
      duration: 0,
      motivation: 'stable observation'
    };
  }

  /**
   * Determine movement speed
   */
  private determineMovementSpeed(content: string): MovementSpeed {
    const isFast = /\b(quick|fast|rushed|urgent|raced|sprinted)\b/i.test(content);
    const isSlow = /\b(slow|gradual|gentle|unhurried|deliberate)\b/i.test(content);
    
    if (isFast) return 'fast';
    if (isSlow) return 'slow';
    return 'medium';
  }

  /**
   * Determine stability
   */
  private determineStability(content: string): StabilityType {
    const isHandheld = /\b(shaky|chaotic|urgent|raw|documentary)\b/i.test(content);
    const isSteady = /\b(stable|smooth|calm|still|composed)\b/i.test(content);
    
    if (isHandheld) return 'handheld';
    if (isSteady) return 'tripod';
    return 'steadicam';
  }

  /**
   * Determine perspective
   */
  private determinePerspective(content: string): PerspectiveType {
    const isFirstPerson = /\b(I|me|my)\b/.test(content.substring(0, 200));
    const hasPOV = /\b(from (?:his|her|their) perspective|through (?:his|her|their) eyes)\b/i.test(content);
    
    if (isFirstPerson || hasPOV) return 'subjective';
    return 'objective';
  }

  /**
   * Determine lens type
   */
  private determineLens(content: string): LensType {
    const hasWide = /\b(expansive|wide|panoramic|sweeping)\b/i.test(content);
    const hasTelephoto = /\b(distance|far away|isolated|compressed)\b/i.test(content);
    const hasClose = /\b(detail|close|intimate|texture)\b/i.test(content);
    
    if (hasWide) return 'wide';
    if (hasTelephoto) return 'telephoto';
    if (hasClose) return 'macro';
    return 'normal';
  }

  /**
   * Generate shot list
   */
  private generateShotList(content: string): CameraShot[] {
    const shots: CameraShot[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    sentences.forEach((sentence, index) => {
      shots.push({
        id: uuidv4(),
        type: this.classifyShotType(sentence),
        duration: this.estimateShotDuration(sentence),
        description: sentence.trim().substring(0, 100),
        purpose: this.determineShotPurpose(sentence),
        precedingShot: index > 0 ? shots[index - 1].id : undefined,
        followingShot: index < sentences.length - 1 ? undefined : undefined
      });
    });
    
    return shots.slice(0, 10);
  }

  /**
   * Classify shot type
   */
  private classifyShotType(sentence: string): string {
    if (/\b(dialogue|said|replied|whispered|shouted)\b/i.test(sentence)) return 'dialogue';
    if (/\b(action|moved|struck|ran|jumped)\b/i.test(sentence)) return 'action';
    if (/\b(thought|wondered|considered|felt)\b/i.test(sentence)) return 'internal';
    return 'description';
  }

  /**
   * Estimate shot duration
   */
  private estimateShotDuration(sentence: string): number {
    const words = sentence.split(/\s+/).length;
    return Math.max(2, Math.ceil(words / 10));
  }

  /**
   * Determine shot purpose
   */
  private determineShotPurpose(sentence: string): string {
    if (/\b(said|replied|asked)\b/i.test(sentence)) return 'convey dialogue';
    if (/\b(looked|gazed|stared)\b/i.test(sentence)) return 'reveal character reaction';
    if (/\b(action|movement)\b/i.test(sentence)) return 'advance plot';
    return 'establish scene';
  }

  /**
   * Design lighting
   */
  private designLighting(content: string): LightingDesign {
    const isNight = /\b(night|dark|midnight|evening|shadow|moonlight)\b/i.test(content);
    const isDay = /\b(day|sun|bright|morning|noon|afternoon)\b/i.test(content);
    const isInterior = /\b(inside|interior|room|chamber|hall)\b/i.test(content);
    const isExterior = /\b(outside|exterior|outdoors|field|forest)\b/i.test(content);
    
    const colorTemp: ColorTemperature = isNight ? 'cool' : isDay ? 'warm' : 'neutral';
    const mood: LightingMood = this.determineLightingMood(content);
    
    return {
      keyLight: this.designKeyLight(content, isNight, isInterior, isExterior),
      fillLight: this.designFillLight(content),
      backLight: this.designBackLight(content),
      ambientLight: this.designAmbientLight(content),
      colorTemperature: colorTemp,
      contrast: this.determineContrast(content),
      mood,
      practicalLights: this.identifyPracticalLights(content),
      shadows: this.designShadows(content)
    };
  }

  /**
   * Determine lighting mood
   */
  private determineLightingMood(content: string): LightingMood {
    if (/\b(tender|romantic|intimate|gentle)\b/i.test(content)) return 'romantic';
    if (/\b(suspense|mystery|shadow|hidden|secret)\b/i.test(content)) return 'mysterious';
    if (/\b(fear|terror|horror|dread|nightmare)\b/i.test(content)) return 'horror';
    if (/\b(dramatic|intense|powerful|bold)\b/i.test(content)) return 'dramatic';
    if (/\b(dream|ethereal|magical|otherworldly)\b/i.test(content)) return 'ethereal';
    return 'natural';
  }

  /**
   * Design key light
   */
  private designKeyLight(content: string, isNight: boolean, isInterior: boolean, isExterior: boolean): LightSource {
    let type: 'natural' | 'artificial' | 'mixed' = 'natural';
    let source = 'sun';
    
    if (isNight) {
      type = isInterior ? 'artificial' : 'natural';
      source = isInterior ? 'lamp' : 'moon';
    }
    
    return {
      type,
      direction: '45 degrees from camera right',
      intensity: isNight ? 0.4 : 0.8,
      color: isNight ? 'cool blue' : 'warm white',
      hardness: 'soft',
      motivation: source
    };
  }

  /**
   * Design fill light
   */
  private designFillLight(content: string): LightSource | null {
    const needsFill = /\b(harsh|high contrast|dramatic shadow)\b/i.test(content);
    
    if (!needsFill) {
      return {
        type: 'natural',
        direction: 'opposite to key',
        intensity: 0.3,
        color: 'neutral',
        hardness: 'soft',
        motivation: 'ambient reflection'
      };
    }
    
    return null;
  }

  /**
   * Design back light
   */
  private designBackLight(content: string): LightSource | null {
    const needsRim = /\b(silhouette|outline|separation|edge)\b/i.test(content);
    
    if (needsRim) {
      return {
        type: 'artificial',
        direction: 'behind subject',
        intensity: 0.6,
        color: 'warm',
        hardness: 'hard',
        motivation: 'rim light'
      };
    }
    
    return null;
  }

  /**
   * Design ambient light
   */
  private designAmbientLight(content: string): AmbientLight {
    const isDark = /\b(dark|shadow|dim|gloomy)\b/i.test(content);
    
    return {
      level: isDark ? 0.2 : 0.5,
      color: 'neutral gray',
      source: 'environmental bounce'
    };
  }

  /**
   * Determine contrast
   */
  private determineContrast(content: string): ContrastType {
    if (/\b(high contrast|chiaroscuro|dramatic shadow)\b/i.test(content)) return 'chiaroscuro';
    if (/\b(harsh|stark|extreme)\b/i.test(content)) return 'high';
    if (/\b(soft|gentle|subtle)\b/i.test(content)) return 'low';
    return 'medium';
  }

  /**
   * Identify practical lights
   */
  private identifyPracticalLights(content: string): PracticalLight[] {
    const lights: PracticalLight[] = [];
    
    if (/\b(candle|candles)\b/i.test(content)) {
      lights.push({ type: 'candle', position: 'scene appropriate', color: 'warm orange', flickering: true });
    }
    
    if (/\b(lamp|lantern)\b/i.test(content)) {
      lights.push({ type: 'lamp', position: 'scene appropriate', color: 'warm yellow', flickering: false });
    }
    
    if (/\b(fire|fireplace|torch)\b/i.test(content)) {
      lights.push({ type: 'fire', position: 'scene appropriate', color: 'orange-red', flickering: true });
    }
    
    return lights;
  }

  /**
   * Design shadows
   */
  private designShadows(content: string): ShadowDesign {
    const hasShadows = /\b(shadow|darkness|shade)\b/i.test(content);
    
    return {
      type: hasShadows ? 'hard' : 'soft',
      direction: 'opposite to key light',
      depth: hasShadows ? 0.7 : 0.3
    };
  }

  /**
   * Design sound
   */
  private designSound(content: string): SoundDesign {
    return {
      ambientSounds: this.identifyAmbientSounds(content),
      dialogue: this.analyzeDialogue(content),
      music: this.designMusicCues(content),
      soundEffects: this.identifySoundEffects(content),
      silence: this.identifySilenceCues(content),
      soundscape: this.designSoundscape(content)
    };
  }

  /**
   * Identify ambient sounds
   */
  private identifyAmbientSounds(content: string): AmbientSound[] {
    const sounds: AmbientSound[] = [];
    
    const ambientPatterns = [
      { pattern: /\b(wind|breeze)\b/i, sound: 'wind' },
      { pattern: /\b(rain|storm|thunder)\b/i, sound: 'rain' },
      { pattern: /\b(forest|trees|leaves)\b/i, sound: 'rustling leaves' },
      { pattern: /\b(ocean|waves|sea)\b/i, sound: 'waves' },
      { pattern: /\b(city|street|traffic)\b/i, sound: 'city ambience' },
      { pattern: /\b(footsteps|steps)\b/i, sound: 'footsteps' },
      { pattern: /\b(crowd|people|chatter)\b/i, sound: 'crowd murmur' }
    ];
    
    ambientPatterns.forEach(({ pattern, sound }) => {
      if (pattern.test(content)) {
        sounds.push({
          type: sound,
          volume: 0.3,
          stereo: 'surround',
          fadeIn: 2,
          fadeOut: 2,
          loop: true
        });
      }
    });
    
    return sounds;
  }

  /**
   * Analyze dialogue
   */
  private analyzeDialogue(content: string): DialogueProfile {
    const hasDialogue = /[""''][^"'']+[."'']/.test(content);
    const isIntimate = /\b(whisper|intimate|quiet|close)\b/i.test(content);
    const hasOverlap = /\b(interrupting|overlapping|chaotic)\b/i.test(content);
    
    return {
      clarity: 0.9,
      reverb: isIntimate ? 0.1 : 0.3,
      intimacy: isIntimate ? 0.8 : 0.4,
      overlapping: hasOverlap,
      offScreen: false
    };
  }

  /**
   * Design music cues
   */
  private designMusicCues(content: string): MusicCue[] {
    const cues: MusicCue[] = [];
    const mood = this.determineMusicMood(content);
    
    cues.push({
      id: uuidv4(),
      type: 'score',
      mood,
      tempo: this.determineMusicTempo(content),
      instruments: this.determineInstruments(content),
      volume: 0.4,
      fadeIn: 3,
      fadeOut: 3,
      synchronisation: 'emotional beats'
    });
    
    return cues;
  }

  /**
   * Determine music mood
   */
  private determineMusicMood(content: string): string {
    if (/\b(tense|suspense|danger|threat)\b/i.test(content)) return 'tension';
    if (/\b(sad|grief|loss|melancholy)\b/i.test(content)) return 'melancholy';
    if (/\b(happy|joy|celebration|triumph)\b/i.test(content)) return 'uplifting';
    if (/\b(romantic|love|tender)\b/i.test(content)) return 'romantic';
    if (/\b(action|fight|battle|chase)\b/i.test(content)) return 'action';
    if (/\b(mystery|secret|hidden)\b/i.test(content)) return 'mysterious';
    return 'neutral';
  }

  /**
   * Determine music tempo
   */
  private determineMusicTempo(content: string): number {
    if (/\b(fast|quick|urgent|rush)\b/i.test(content)) return 140;
    if (/\b(slow|gentle|calm)\b/i.test(content)) return 60;
    if (/\b(moderate|steady)\b/i.test(content)) return 100;
    return 90;
  }

  /**
   * Determine instruments
   */
  private determineInstruments(content: string): string[] {
    const instruments: string[] = [];
    
    if (/\b(action|battle|war|conflict)\b/i.test(content)) {
      instruments.push('orchestral brass', 'percussion', 'strings');
    } else if (/\b(romantic|intimate|tender)\b/i.test(content)) {
      instruments.push('piano', 'strings', 'woodwinds');
    } else if (/\b(mystery|suspense)\b/i.test(content)) {
      instruments.push('strings', 'synthesizer', 'piano');
    } else {
      instruments.push('orchestra');
    }
    
    return instruments;
  }

  /**
   * Identify sound effects
   */
  private identifySoundEffects(content: string): SoundEffect[] {
    const effects: SoundEffect[] = [];
    
    const effectPatterns = [
      { pattern: /\b(explosion|blast|bang)\b/i, effect: 'explosion' },
      { pattern: /\b(glass|shatter|crash)\b/i, effect: 'glass breaking' },
      { pattern: /\b(door|slam|creak)\b/i, effect: 'door sound' },
      { pattern: /\b(scream|shout|cry)\b/i, effect: 'vocal' },
      { pattern: /\b(engine|motor|vehicle)\b/i, effect: 'engine' }
    ];
    
    effectPatterns.forEach(({ pattern, effect }) => {
      if (pattern.test(content)) {
        effects.push({
          type: effect,
          timing: 'sync',
          volume: 0.7,
          impact: 7,
          layering: []
        });
      }
    });
    
    return effects;
  }

  /**
   * Identify silence cues
   */
  private identifySilenceCues(content: string): SilenceCue[] {
    const cues: SilenceCue[] = [];
    
    if (/\b(silence|quiet|stillness)\b/i.test(content)) {
      cues.push({
        duration: 2,
        type: 'dramatic',
        purpose: 'emphasize the moment'
      });
    }
    
    return cues;
  }

  /**
   * Design soundscape
   */
  private designSoundscape(content: string): SoundscapeProfile {
    return {
      overallMood: this.determineMusicMood(content),
      density: 0.5,
      layering: 0.6,
      spatial: {
        width: 'surround',
        depth: 0.7,
        height: 0.5
      }
    };
  }

  /**
   * Choreograph action
   */
  private choreographAction(content: string): ActionChoreography | null {
    const hasAction = /\b(fight|battle|struggle|chase|combat|attack|defend)\b/i.test(content);
    
    if (!hasAction) return null;
    
    return {
      sequence: this.designActionSequence(content),
      participants: this.identifyParticipants(content),
      environment: this.identifyEnvironmentInteractions(content),
      pacing: this.designActionPacing(content),
      safetyConsiderations: ['stunt coordination required', 'safety harnesses for falls'],
      vfxRequirements: this.identifyVFXRequirements(content)
    };
  }

  /**
   * Design action sequence
   */
  private designActionSequence(content: string): ActionBeat[] {
    const beats: ActionBeat[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => /\b(strike|hit|block|dodge|move|run|jump)\b/i.test(s));
    
    sentences.forEach((sentence, index) => {
      beats.push({
        id: uuidv4(),
        order: index + 1,
        type: this.classifyActionType(sentence),
        duration: 2,
        description: sentence.trim().substring(0, 80),
        camera: this.generateActionShot(sentence),
        participants: ['protagonist', 'antagonist'],
        impact: 7,
        aftermath: 'continued action'
      });
    });
    
    return beats;
  }

  /**
   * Classify action type
   */
  private classifyActionType(sentence: string): ActionBeat['type'] {
    if (/\b(strike|hit|punch|kick|slash)\b/i.test(sentence)) return 'strike';
    if (/\b(block|parry|dodge|avoid)\b/i.test(sentence)) return 'block';
    if (/\b(move|run|jump|roll)\b/i.test(sentence)) return 'movement';
    return 'movement';
  }

  /**
   * Generate action shot
   */
  private generateActionShot(sentence: string): CameraShot {
    return {
      id: uuidv4(),
      type: 'action',
      duration: 2,
      description: sentence.trim().substring(0, 60),
      purpose: 'capture the action'
    };
  }

  /**
   * Identify participants
   */
  private identifyParticipants(content: string): ActionParticipant[] {
    return [
      {
        characterId: 'protagonist',
        role: 'primary',
        position: 'center frame',
        movement: 'dynamic',
        intensity: 8
      }
    ];
  }

  /**
   * Identify environment interactions
   */
  private identifyEnvironmentInteractions(content: string): EnvironmentInteraction[] {
    const interactions: EnvironmentInteraction[] = [];
    
    if (/\b(table|chair|wall|floor)\b/i.test(content)) {
      interactions.push({
        element: 'furniture',
        action: 'collision',
        consequence: 'destruction',
        vfxRequired: true
      });
    }
    
    return interactions;
  }

  /**
   * Design action pacing
   */
  private designActionPacing(content: string): ActionPacing {
    return {
      rhythm: 'intense',
      acceleration: 0.8,
      pauses: [],
      crescendo: 5
    };
  }

  /**
   * Identify VFX requirements
   */
  private identifyVFXRequirements(content: string): VFXRequirement[] {
    const requirements: VFXRequirement[] = [];
    
    if (/\b(magic|spell|power|energy)\b/i.test(content)) {
      requirements.push({
        type: 'magical effect',
        description: 'magical energy manifestation',
        complexity: 'moderate',
        integrationPoint: 'character hands'
      });
    }
    
    if (/\b(explosion|fire|smoke)\b/i.test(content)) {
      requirements.push({
        type: 'practical/vfx hybrid',
        description: 'explosion with fire and smoke',
        complexity: 'complex',
        integrationPoint: 'environment'
      });
    }
    
    return requirements;
  }

  /**
   * Analyze emotional arc
   */
  private analyzeEmotionalArc(content: string): EmotionalBeat[] {
    const beats: EmotionalBeat[] = [];
    const sentences = content.split(/[.!?]+/);
    
    sentences.forEach((sentence, index) => {
      const emotion = this.detectEmotion(sentence);
      if (emotion) {
        beats.push({
          id: uuidv4(),
          type: index === 0 ? 'setup' : index === sentences.length - 1 ? 'release' : 'build',
          emotion,
          intensity: this.measureEmotionalIntensity(sentence),
          duration: 2,
          visualCorrelation: 'tight framing on emotional reaction',
          soundCorrelation: 'music swell'
        });
      }
    });
    
    return beats.slice(0, 8);
  }

  /**
   * Detect emotion
   */
  private detectEmotion(sentence: string): string | null {
    const emotions = [
      { pattern: /\b(angry|furious|rage)\b/i, emotion: 'anger' },
      { pattern: /\b(sad|grief|sorrow)\b/i, emotion: 'sadness' },
      { pattern: /\b(happy|joy|elated)\b/i, emotion: 'joy' },
      { pattern: /\b(fear|afraid|terror)\b/i, emotion: 'fear' },
      { pattern: /\b(surprise|shock|amazement)\b/i, emotion: 'surprise' },
      { pattern: /\b(disgust|revulsion)\b/i, emotion: 'disgust' },
      { pattern: /\b(love|affection|tenderness)\b/i, emotion: 'love' }
    ];
    
    for (const { pattern, emotion } of emotions) {
      if (pattern.test(sentence)) return emotion;
    }
    
    return null;
  }

  /**
   * Measure emotional intensity
   */
  private measureEmotionalIntensity(sentence: string): number {
    const intensityWords = /\b(very|extremely|incredibly|utterly|absolutely)\b/gi;
    const matches = sentence.match(intensityWords);
    return matches ? Math.min(10, 5 + matches.length * 2) : 5;
  }

  /**
   * Identify visual motifs
   */
  private identifyVisualMotifs(content: string, chapter: number, sceneNumber: number): VisualMotif[] {
    const motifs: VisualMotif[] = [];
    
    // Check for recurring visual elements
    const visualElements = this.extractVisualElements(content);
    
    visualElements.forEach(element => {
      const existing = this.findOrCreateMotif(element);
      existing.instances.push({
        chapter,
        scene: sceneNumber,
        variation: 'standard',
        meaning: 'visual callback'
      });
      motifs.push(existing);
    });
    
    return motifs;
  }

  /**
   * Extract visual elements
   */
  private extractVisualElements(content: string): string[] {
    const elements: string[] = [];
    const patterns = [
      /\b(mirror|reflection)\b/gi,
      /\b(shadow|darkness)\b/gi,
      /\b(light|illumination)\b/gi,
      /\b(water|rain|ocean)\b/gi,
      /\b(fire|flame)\b/gi
    ];
    
    patterns.forEach(pattern => {
      if (pattern.test(content)) {
        const match = content.match(pattern);
        if (match) elements.push(match[0].toLowerCase());
      }
    });
    
    return [...new Set(elements)];
  }

  /**
   * Find or create motif
   */
  private findOrCreateMotif(name: string): VisualMotif {
    const existing = Array.from(this.visualMotifs.values()).find(m => m.name === name);
    
    if (existing) return existing;
    
    const motif: VisualMotif = {
      id: uuidv4(),
      name,
      description: `Visual motif of ${name}`,
      instances: [],
      evolution: []
    };
    
    this.visualMotifs.set(motif.id, motif);
    return motif;
  }

  /**
   * Design transitions
   */
  private designTransitions(content: string): SceneTransition[] {
    const transitions: SceneTransition[] = [];
    
    transitions.push({
      type: this.determineTransitionType(content),
      duration: 1,
      motivation: 'scene ending',
      visualEffect: 'standard',
      soundBridge: true
    });
    
    return transitions;
  }

  /**
   * Determine transition type
   */
  private determineTransitionType(content: string): TransitionType {
    if (/\b(suddenly|instantly|immediately)\b/i.test(content)) return 'jump-cut';
    if (/\b(dream|memory|flashback)\b/i.test(content)) return 'dissolve';
    if (/\b(later|after|time passed)\b/i.test(content)) return 'fade';
    return 'cut';
  }

  /**
   * Analyze pacing
   */
  private analyzePacing(content: string): PacingProfile {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const averageLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / sentences.length;
    
    return {
      overallRhythm: averageLength < 10 ? 'staccato' : averageLength > 20 ? 'flowing' : 'variable',
      tensionCurve: this.calculateTensionCurve(content),
      breathingRoom: this.calculateBreathingRoom(content),
      peaks: this.identifyPeaks(content),
      valleys: this.identifyValleys(content),
      momentum: this.calculateMomentum(content),
      urgency: this.calculateUrgency(content)
    };
  }

  /**
   * Calculate tension curve
   */
  private calculateTensionCurve(content: string): number[] {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map(s => {
      const hasTension = /\b(danger|threat|conflict|struggle)\b/i.test(s);
      return hasTension ? 0.8 : 0.3;
    });
  }

  /**
   * Calculate breathing room
   */
  private calculateBreathingRoom(content: string): number {
    const hasPause = /\b(moments|paused|silence|stillness)\b/i.test(content);
    return hasPause ? 0.6 : 0.3;
  }

  /**
   * Identify peaks
   */
  private identifyPeaks(content: string): number[] {
    const peaks: number[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((s, i) => {
      if (/\b(climax|peak|apex|zenith)\b/i.test(s)) {
        peaks.push(i + 1);
      }
    });
    
    return peaks.length > 0 ? peaks : [Math.floor(sentences.length / 2)];
  }

  /**
   * Identify valleys
   */
  private identifyValleys(content: string): number[] {
    const valleys: number[] = [];
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    sentences.forEach((s, i) => {
      if (/\b(calm|quiet|peaceful|still)\b/i.test(s)) {
        valleys.push(i + 1);
      }
    });
    
    return valleys;
  }

  /**
   * Calculate momentum
   */
  private calculateMomentum(content: string): number {
    const actionWords = content.match(/\b(action|move|run|strike|fight|chase)\b/gi);
    return actionWords ? Math.min(1, actionWords.length / 10) : 0.3;
  }

  /**
   * Calculate urgency
   */
  private calculateUrgency(content: string): number {
    const urgencyWords = content.match(/\b(urgent|hurry|rush|immediately|now|quickly)\b/gi);
    return urgencyWords ? Math.min(1, urgencyWords.length / 5) : 0.2;
  }

  /**
   * Analyze atmosphere
   */
  private analyzeAtmosphere(content: string): AtmosphereProfile {
    return {
      primary: this.determinePrimaryAtmosphere(content),
      secondary: this.determineSecondaryAtmospheres(content),
      intensity: this.calculateAtmosphereIntensity(content),
      texture: this.determineAtmosphereTexture(content),
      environmentalFactors: this.extractEnvironmentalFactors(content)
    };
  }

  /**
   * Determine primary atmosphere
   */
  private determinePrimaryAtmosphere(content: string): AtmosphereType {
    if (/\b(tense|tension|danger|threat)\b/i.test(content)) return 'tense';
    if (/\b(peaceful|calm|tranquil)\b/i.test(content)) return 'peaceful';
    if (/\b(mystery|secret|hidden)\b/i.test(content)) return 'mysterious';
    if (/\b(romantic|love|intimate)\b/i.test(content)) return 'romantic';
    if (/\b(battle|war|fight)\b/i.test(content)) return 'dangerous';
    if (/\b(sad|grief|loss)\b/i.test(content)) return 'melancholy';
    if (/\b(hope|future|possibility)\b/i.test(content)) return 'hopeful';
    if (/\b(chaos|disorder|mayhem)\b/i.test(content)) return 'chaotic';
    return 'peaceful';
  }

  /**
   * Determine secondary atmospheres
   */
  private determineSecondaryAtmospheres(content: string): AtmosphereType[] {
    const atmospheres: AtmosphereType[] = [];
    
    if (/\b(intimate|close|personal)\b/i.test(content)) atmospheres.push('intimate');
    if (/\b(epic|grand|sweeping)\b/i.test(content)) atmospheres.push('epic');
    
    return atmospheres.slice(0, 2);
  }

  /**
   * Calculate atmosphere intensity
   */
  private calculateAtmosphereIntensity(content: string): number {
    const atmospheres = /\b(tense|peaceful|mysterious|romantic|dangerous|melancholy|hopeful|chaotic)\b/gi;
    const matches = content.match(atmospheres);
    return matches ? Math.min(1, matches.length / 5) : 0.3;
  }

  /**
   * Determine atmosphere texture
   */
  private determineAtmosphereTexture(content: string): AtmosphereTexture {
    if (/\b(harsh|grating|abrasive)\b/i.test(content)) return 'harsh';
    if (/\b(smooth|silky|gentle)\b/i.test(content)) return 'smooth';
    if (/\b(rough|gritty|raw)\b/i.test(content)) return 'grainy';
    if (/\b(layered|complex|nuanced)\b/i.test(content)) return 'layered';
    return 'soft';
  }

  /**
   * Extract environmental factors
   */
  private extractEnvironmentalFactors(content: string): string[] {
    const factors: string[] = [];
    
    if (/\b(rain|storm|weather)\b/i.test(content)) factors.push('weather');
    if (/\b(temperature|cold|heat)\b/i.test(content)) factors.push('temperature');
    if (/\b(time|hour|minute)\b/i.test(content)) factors.push('time');
    
    return factors;
  }

  // ===== ANALYSIS & REPORTING =====

  /**
   * Generate cinematic analysis
   */
  public generateAnalysis(sceneId: string): CinematicAnalysis {
    const scene = this.scenes.get(sceneId);
    
    if (!scene) {
      return {
        sceneId,
        overallQuality: 0,
        visualCoherence: 0,
        pacingScore: 0,
        emotionalImpact: 0,
        technicalComplexity: 0,
        suggestions: [],
        strengths: [],
        weaknesses: []
      };
    }
    
    return {
      sceneId,
      overallQuality: this.calculateOverallQuality(scene),
      visualCoherence: scene.visualComposition.visualBalance,
      pacingScore: scene.pacing.momentum,
      emotionalImpact: scene.emotionalArc.length > 0 ? 0.8 : 0.3,
      technicalComplexity: this.calculateTechnicalComplexity(scene),
      suggestions: this.generateSuggestions(scene),
      strengths: this.identifyStrengths(scene),
      weaknesses: this.identifyWeaknesses(scene)
    };
  }

  /**
   * Calculate overall quality
   */
  private calculateOverallQuality(scene: CinematicScene): number {
    const scores = [
      scene.visualComposition.visualBalance,
      scene.pacing.momentum,
      scene.emotionalArc.length > 0 ? 0.8 : 0.5
    ];
    
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  }

  /**
   * Calculate technical complexity
   */
  private calculateTechnicalComplexity(scene: CinematicScene): number {
    let complexity = 0;
    
    if (scene.cameraWork.movement.type !== 'static') complexity += 0.2;
    if (scene.actionChoreography) complexity += 0.3;
    if (scene.cameraWork.suggestedShots.length > 5) complexity += 0.2;
    if (scene.soundDesign.soundEffects.length > 3) complexity += 0.2;
    
    return Math.min(1, complexity);
  }

  /**
   * Generate suggestions
   */
  private generateSuggestions(scene: CinematicScene): CinematicSuggestion[] {
    const suggestions: CinematicSuggestion[] = [];
    
    if (scene.pacing.momentum < 0.5) {
      suggestions.push({
        type: 'pacing',
        priority: 'medium',
        description: 'Consider adding more dynamic elements',
        implementation: 'Insert action beats or tension moments',
        expectedImpact: 'Increased engagement'
      });
    }
    
    return suggestions;
  }

  /**
   * Identify strengths
   */
  private identifyStrengths(scene: CinematicScene): string[] {
    const strengths: string[] = [];
    
    if (scene.visualComposition.visualBalance > 0.7) {
      strengths.push('Strong visual composition');
    }
    
    if (scene.emotionalArc.length > 3) {
      strengths.push('Rich emotional journey');
    }
    
    if (scene.soundDesign.ambientSounds.length > 2) {
      strengths.push('Layered sound design');
    }
    
    return strengths;
  }

  /**
   * Identify weaknesses
   */
  private identifyWeaknesses(scene: CinematicScene): string[] {
    const weaknesses: string[] = [];
    
    if (scene.cameraWork.suggestedShots.length < 3) {
      weaknesses.push('Limited shot variety');
    }
    
    if (scene.pacing.breathingRoom < 0.3) {
      weaknesses.push('Pacing may feel rushed');
    }
    
    return weaknesses;
  }

  // ===== PUBLIC API =====

  /**
   * Get all scenes
   */
  public getAllScenes(): CinematicScene[] {
    return Array.from(this.scenes.values());
  }

  /**
   * Get scene by ID
   */
  public getScene(id: string): CinematicScene | undefined {
    return this.scenes.get(id);
  }

  /**
   * Get visual motifs
   */
  public getVisualMotifs(): VisualMotif[] {
    return Array.from(this.visualMotifs.values());
  }

  /**
   * Get scenes by chapter
   */
  public getScenesByChapter(chapter: number): CinematicScene[] {
    return Array.from(this.scenes.values()).filter(s => s.chapter === chapter);
  }

  /**
   * Get analysis history
   */
  public getAnalysisHistory(): CinematicAnalysis[] {
    return this.analysisHistory;
  }

  /**
   * Clear all data
   */
  public clearAllData(): void {
    this.scenes.clear();
    this.visualMotifs.clear();
    this.analysisHistory = [];
  }
}