/**
 * CinematicChoreographyEngine
 * 
 * Manages visual pacing, scene composition, camera angles, and cinematic
 * techniques for immersive narrative delivery.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface CinematicScene {
  id: string;
  chapterId: string;
  sequence: number;
  shotType: ShotType;
  cameraAngle: CameraAngle;
  cameraMovement: CameraMovement;
  lighting: LightingSetup;
  colorGrade: ColorGrade;
  focus: FocusSetup;
  duration: number; // in narrative beats
  transition: TransitionType;
  audioLayer: AudioLayer;
  visualEffects: VisualEffect[];
  atmosphere: SceneAtmosphere;
}

export type ShotType = 
  | 'extreme_wide' // Establishing shots
  | 'wide'         // Full scene context
  | 'medium_wide'  // Group shots
  | 'medium'       // Character interaction
  | 'medium_close' // Emotional beats
  | 'close_up'     // Intimate moments
  | 'extreme_close' // Detail emphasis
  | 'insert'       // Object focus
  | 'pov'          // Character perspective
  | 'over_shoulder' // Dialogue scenes
  | 'two_shot'     // Dual character
  | 'master'       // Full coverage
  | 'low_angle'    // Added for compatibility
  | 'high_angle';  // Added for compatibility

export type CameraAngle = 
  | 'eye_level'    // Neutral
  | 'low_angle'    // Power, dominance
  | 'high_angle'   // Vulnerability
  | 'dutch_angle'  // Tension, unease
  | 'birds_eye'    // Omniscient view
  | 'worms_eye'    // Dramatic impact
  | 'canted'       // Disorientation
  | 'natural'      // Added for compatibility
  | 'warm'         // Added for compatibility
  | 'crane';       // Epic reveal

export type CameraMovement = 
  | 'static'
  | 'pan_left'
  | 'pan_right'
  | 'tilt_up'
  | 'tilt_down'
  | 'dolly_in'
  | 'dolly_out'
  | 'tracking'
  | 'crane_up'
  | 'crane_down'
  | 'handheld'
  | 'steadicam'
  | 'zoom_in'
  | 'zoom_out'
  | 'whip_pan'
  | 'dolly_zoom';

export type TransitionType = 
  | 'cut'
  | 'fade_in'
  | 'fade_out'
  | 'dissolve'
  | 'wipe'
  | 'iris'
  | 'match_cut'
  | 'jump_cut'
  | 'cross_fade'
  | 'smash_cut'
  | 'l_cut'
  | 'j_cut';

export interface LightingSetup {
  type: LightingType;
  intensity: number; // 0-1
  direction: LightDirection;
  color: ColorTemperature;
  contrast: number; // 0-1
  shadows: ShadowType;
  practicalLights: PracticalLight[];
}

export type LightingType = 
  | 'natural'
  | 'artificial'
  | 'mixed'
  | 'dramatic'
  | 'high_key'
  | 'low_key'
  | 'chiaroscuro'
  | 'silhouette'
  | 'rim'
  | 'motivated';

export type LightDirection = 
  | 'front'
  | 'side'
  | 'back'
  | 'top'
  | 'under'
  | 'three_quarter'
  | 'rembrandt';

export type ColorTemperature = 
  | 'warm'      // Orange/amber tones
  | 'cool'      // Blue tones
  | 'neutral'   // White balanced
  | 'mixed'     // Color contrast
  | 'saturated' // Vibrant
  | 'desaturated'; // Muted

export type ShadowType = 
  | 'hard'
  | 'soft'
  | 'sharp'
  | 'diffused'
  | 'absent';

export interface PracticalLight {
  source: string;
  color: string;
  intensity: number;
  flickering: boolean;
}

export interface ColorGrade {
  palette: ColorPalette;
  saturation: number;
  contrast: number;
  highlights: number;
  shadows: number;
  midtones: number;
  tint: string;
  look: ColorLook;
}

export type ColorPalette = 
  | 'earth_tones'
  | 'pastel'
  | 'noir'
  | 'warm_summer'
  | 'cold_winter'
  | 'vibrant'
  | 'muted'
  | 'monochromatic'
  | 'complementary'
  | 'analogous'
  | 'natural'
  | 'warm';

export type ColorLook = 
  | 'natural'
  | 'cinematic'
  | 'vintage'
  | 'bleach_bypass'
  | 'day_for_night'
  | 'sepia'
  | 'cross_processed'
  | 'teal_orange';

export interface FocusSetup {
  type: FocusType;
  depth: number;
  rackPoints: RackFocusPoint[];
  subject: string;
}

export type FocusType = 
  | 'deep_focus'
  | 'shallow_focus'
  | 'soft_focus'
  | 'split_diopter'
  | 'tilt_shift';

export interface RackFocusPoint {
  timestamp: number;
  from: string;
  to: string;
  duration: number;
}

export interface AudioLayer {
  ambient: AmbientSound[];
  music: MusicCue[];
  dialogue: DialogueMix;
  soundEffects: SoundEffect[];
  silence: SilenceCue[];
}

export interface AmbientSound {
  type: string;
  volume: number;
  spatial: SpatialPosition;
  loop: boolean;
}

export interface MusicCue {
  piece: string;
  mood: string;
  volume: number;
  timing: 'start' | 'end' | 'throughout';
  fadeDuration: number;
}

export interface DialogueMix {
  clarity: number;
  presence: number;
  reverb: number;
  spatialPosition: SpatialPosition;
}

export interface SoundEffect {
  name: string;
  type: 'hard' | 'soft';
  volume: number;
  timing: number;
  spatial: SpatialPosition;
}

export interface SilenceCue {
  duration: number;
  type: 'complete' | 'ambient_only' | 'tension';
  purpose: string;
}

export interface SpatialPosition {
  pan: number; // -1 (left) to 1 (right)
  depth: number; // 0 (close) to 1 (far)
  height: number; // -1 (below) to 1 (above)
}

export interface VisualEffect {
  type: VFXType;
  intensity: number;
  duration: number;
  parameters: Record<string, any>;
}

export type VFXType = 
  | 'particle'
  | 'weather'
  | 'magic'
  | 'explosion'
  | 'creature'
  | 'environment'
  | 'time'
  | 'memory'
  | 'dream'
  | 'transition';

export interface SceneAtmosphere {
  mood: MoodType;
  tension: number;
  intimacy: number;
  scale: ScaleType;
  pacing: PacingType;
  energy: number;
}

export type MoodType = 
  | 'tense'
  | 'peaceful'
  | 'mysterious'
  | 'joyful'
  | 'melancholic'
  | 'romantic'
  | 'frightening'
  | 'epic'
  | 'intimate'
  | 'surreal';

export type ScaleType = 
  | 'intimate'
  | 'personal'
  | 'local'
  | 'regional'
  | 'global'
  | 'cosmic'
  | 'epic';

export type PacingType = 
  | 'glacial'
  | 'slow'
  | 'moderate'
  | 'brisk'
  | 'rapid'
  | 'frantic';

// ============================================================================
// SEQUENCE STRUCTURE
// ============================================================================

export interface CinematicSequence {
  id: string;
  name: string;
  scenes: CinematicScene[];
  totalDuration: number;
  rhythm: SequenceRhythm;
  arc: SequenceArc;
}

export interface SequenceRhythm {
  pattern: RhythmPattern;
  beatsPerMinute: number;
  acceleration: number;
  syncopation: number;
}

export type RhythmPattern = 
  | 'steady'
  | 'building'
  | 'diminishing'
  | 'wave'
  | 'staccato'
  | 'legato'
  | 'free';

export interface SequenceArc {
  startingEnergy: number;
  peakEnergy: number;
  endingEnergy: number;
  turningPoint: number; // scene index
}

// ============================================================================
// CINEMATIC RULES
// ============================================================================

export interface CinematicRule {
  name: string;
  condition: (context: SceneContext) => boolean;
  shotType: ShotType;
  angle: CameraAngle;
  rationale: string;
}

export interface SceneContext {
  emotionalBeat: string;
  characterCount: number;
  locationType: 'interior' | 'exterior' | 'liminal';
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night' | 'unknown';
  weatherCondition: string;
  actionIntensity: number;
  dialoguePresent: boolean;
  revelationLevel: number;
  previousShot: ShotType;
  previousAngle: CameraAngle;
  sceneHistory?: CinematicScene[];
}

// ============================================================================
// MAIN ENGINE CLASS
// ============================================================================

export class CinematicChoreographyEngine {
  private scenes: Map<string, CinematicScene> = new Map();
  private sequences: Map<string, CinematicSequence> = new Map();
  private rules: CinematicRule[] = [];
  private sceneHistory: CinematicScene[] = [];
  private rhythmState: SequenceRhythm;
  
  constructor() {
    this.initializeDefaultRules();
    this.rhythmState = {
      pattern: 'steady',
      beatsPerMinute: 120,
      acceleration: 0,
      syncopation: 0
    };
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeDefaultRules(): void {
    // Emotional intimacy rules
    this.rules.push({
      name: 'intimate_moment',
      condition: (ctx) => ctx.emotionalBeat === 'intimate' && ctx.characterCount <= 2,
      shotType: 'close_up',
      angle: 'eye_level',
      rationale: 'Close-ups create intimacy for emotional beats'
    });

    // Power dynamics
    this.rules.push({
      name: 'dominance_portrayal',
      condition: (ctx) => ctx.emotionalBeat === 'dominance',
      shotType: 'low_angle',
      angle: 'low_angle',
      rationale: 'Low angles convey power and dominance'
    });

    // Vulnerability
    this.rules.push({
      name: 'vulnerability_portrayal',
      condition: (ctx) => ctx.emotionalBeat === 'vulnerability',
      shotType: 'high_angle',
      angle: 'high_angle',
      rationale: 'High angles emphasize vulnerability'
    });

    // Action sequences
    this.rules.push({
      name: 'action_intensity',
      condition: (ctx) => ctx.actionIntensity > 0.7,
      shotType: 'medium',
      angle: 'eye_level',
      rationale: 'Medium shots allow clarity in action'
    });

    // Revelation
    this.rules.push({
      name: 'revelation_beat',
      condition: (ctx) => ctx.revelationLevel > 0.8,
      shotType: 'extreme_close',
      angle: 'eye_level',
      rationale: 'Extreme close-ups emphasize revelation'
    });

    // Dialogue scenes
    this.rules.push({
      name: 'dialogue_coverage',
      condition: (ctx) => ctx.dialoguePresent && ctx.characterCount === 2,
      shotType: 'over_shoulder',
      angle: 'eye_level',
      rationale: 'Over-shoulder provides natural dialogue coverage'
    });

    // Group scenes
    this.rules.push({
      name: 'group_coverage',
      condition: (ctx) => ctx.characterCount >= 3 && ctx.characterCount <= 5,
      shotType: 'medium_wide',
      angle: 'eye_level',
      rationale: 'Medium wide captures group dynamics'
    });

    // Establishing
    this.rules.push({
      name: 'location_establish',
      condition: (ctx) => ctx.previousShot === 'extreme_wide' || ctx.sceneHistory?.length === 0,
      shotType: 'extreme_wide',
      angle: 'eye_level',
      rationale: 'Wide shots establish location'
    });

    // Tension building
    this.rules.push({
      name: 'tension_dutch',
      condition: (ctx) => ctx.emotionalBeat === 'tension' || ctx.emotionalBeat === 'unease',
      shotType: 'medium_close',
      angle: 'dutch_angle',
      rationale: 'Dutch angles create visual unease'
    });

    // Mystery
    this.rules.push({
      name: 'mystery_shadow',
      condition: (ctx) => ctx.emotionalBeat === 'mystery',
      shotType: 'medium',
      angle: 'low_angle',
      rationale: 'Shadowy angles enhance mystery'
    });
  }

  // ==========================================================================
  // SCENE CREATION
  // ==========================================================================

  async createScene(
    chapterId: string,
    context: SceneContext,
    sequence?: number
  ): Promise<CinematicScene> {
    const applicableRules = this.rules.filter(rule => rule.condition(context));
    
    let shotType: ShotType = 'medium';
    let angle: CameraAngle = 'eye_level';
    
    if (applicableRules.length > 0) {
      // Use the most specific rule (last matching)
      const selectedRule = applicableRules[applicableRules.length - 1];
      shotType = selectedRule.shotType;
      angle = selectedRule.angle;
    }

    // Apply 180-degree rule and continuity
    if (this.sceneHistory.length > 0) {
      const lastScene = this.sceneHistory[this.sceneHistory.length - 1];
      angle = this.applyContinuityRules(angle, lastScene.cameraAngle);
    }

    const scene: CinematicScene = {
      id: `scene-${chapterId}-${Date.now()}`,
      chapterId,
      sequence: sequence ?? this.sceneHistory.length,
      shotType,
      cameraAngle: angle,
      cameraMovement: this.determineMovement(context),
      lighting: await this.designLighting(context),
      colorGrade: this.determineColorGrade(context),
      focus: this.determineFocus(context, shotType),
      duration: this.calculateDuration(context),
      transition: this.determineTransition(context),
      audioLayer: await this.designAudioLayer(context),
      visualEffects: this.determineVFX(context),
      atmosphere: this.determineAtmosphere(context)
    };

    this.scenes.set(scene.id, scene);
    this.sceneHistory.push(scene);

    return scene;
  }

  private applyContinuityRules(
    newAngle: CameraAngle,
    previousAngle: CameraAngle
  ): CameraAngle {
    // Maintain screen direction consistency
    const opposingAngles: Record<CameraAngle, CameraAngle[]> = {
      'eye_level': [],
      'low_angle': ['high_angle'],
      'high_angle': ['low_angle'],
      'dutch_angle': [],
      'birds_eye': ['worms_eye'],
      'worms_eye': ['birds_eye'],
      'canted': [],
      'crane': [],
      'natural': [],
      'warm': []
    };

    const opposing = opposingAngles[newAngle] || [];
    if (opposing.includes(previousAngle)) {
      // Maintain angle for continuity
      return previousAngle;
    }

    return newAngle;
  }

  private determineMovement(context: SceneContext): CameraMovement {
    if (context.actionIntensity > 0.8) {
      return 'handheld';
    }
    if (context.emotionalBeat === 'following') {
      return 'tracking';
    }
    if (context.revelationLevel > 0.7) {
      return 'dolly_in';
    }
    if (context.emotionalBeat === 'contemplation') {
      return 'steadicam';
    }
    return 'static';
  }

  private async designLighting(context: SceneContext): Promise<LightingSetup> {
    const lighting: LightingSetup = {
      type: this.determineLightingType(context),
      intensity: 0.7,
      direction: 'three_quarter',
      color: this.determineColorTemperature(context),
      contrast: this.calculateContrast(context),
      shadows: this.determineShadows(context),
      practicalLights: []
    };

    // Add practical lights for interior scenes
    if (context.locationType === 'interior') {
      if (context.timeOfDay === 'night') {
        lighting.practicalLights.push({
          source: 'candle',
          color: 'warm_orange',
          intensity: 0.4,
          flickering: true
        });
      } else {
        lighting.practicalLights.push({
          source: 'window',
          color: 'natural',
          intensity: 0.6,
          flickering: false
        });
      }
    }

    return lighting;
  }

  private determineLightingType(context: SceneContext): LightingType {
    if (context.emotionalBeat === 'mystery' || context.emotionalBeat === 'tension') {
      return 'low_key';
    }
    if (context.emotionalBeat === 'joy' || context.emotionalBeat === 'peace') {
      return 'high_key';
    }
    if (context.emotionalBeat === 'drama') {
      return 'chiaroscuro';
    }
    return 'natural';
  }

  private determineColorTemperature(context: SceneContext): ColorTemperature {
    if (context.timeOfDay === 'dawn' || context.timeOfDay === 'dusk') {
      return 'warm';
    }
    if (context.timeOfDay === 'night') {
      return 'cool';
    }
    if (context.emotionalBeat === 'cold' || context.emotionalBeat === 'isolation') {
      return 'cool';
    }
    if (context.emotionalBeat === 'warmth' || context.emotionalBeat === 'love') {
      return 'warm';
    }
    return 'neutral';
  }

  private calculateContrast(context: SceneContext): number {
    if (context.emotionalBeat === 'conflict' || context.emotionalBeat === 'tension') {
      return 0.8;
    }
    if (context.emotionalBeat === 'peace' || context.emotionalBeat === 'calm') {
      return 0.3;
    }
    return 0.5;
  }

  private determineShadows(context: SceneContext): ShadowType {
    if (context.emotionalBeat === 'mystery' || context.emotionalBeat === 'noir') {
      return 'hard';
    }
    if (context.emotionalBeat === 'romance' || context.emotionalBeat === 'dream') {
      return 'soft';
    }
    return 'diffused';
  }

  private determineColorGrade(context: SceneContext): ColorGrade {
    let palette: ColorPalette = 'natural';
    let look: ColorLook = 'natural';

    if (context.emotionalBeat === 'nostalgia' || context.emotionalBeat === 'memory') {
      palette = 'warm';
      look = 'vintage';
    } else if (context.emotionalBeat === 'mystery' || context.emotionalBeat === 'tension') {
      palette = 'noir';
      look = 'cinematic';
    } else if (context.emotionalBeat === 'epic' || context.actionIntensity > 0.7) {
      palette = 'vibrant';
      look = 'teal_orange';
    } else if (context.emotionalBeat === 'melancholy') {
      palette = 'muted';
      look = 'bleach_bypass';
    }

    return {
      palette,
      saturation: 0.7,
      contrast: 0.5,
      highlights: 0.5,
      shadows: 0.5,
      midtones: 0.5,
      tint: 'neutral',
      look
    };
  }

  private determineFocus(context: SceneContext, shotType: ShotType): FocusSetup {
    const focus: FocusSetup = {
      type: 'shallow_focus',
      depth: 0.5,
      rackPoints: [],
      subject: 'primary_character'
    };

    // Deep focus for wide shots
    if (shotType === 'extreme_wide' || shotType === 'wide') {
      focus.type = 'deep_focus';
      focus.depth = 1.0;
    }

    // Rack focus for revelations
    if (context.revelationLevel > 0.7) {
      focus.rackPoints.push({
        timestamp: 0.5,
        from: 'background',
        to: 'foreground',
        duration: 0.3
      });
    }

    return focus;
  }

  private calculateDuration(context: SceneContext): number {
    // Base duration in narrative beats
    let duration = 3;

    if (context.emotionalBeat === 'action' || context.actionIntensity > 0.7) {
      duration = 2; // Faster cuts for action
    }
    if (context.emotionalBeat === 'contemplation' || context.emotionalBeat === 'intimate') {
      duration = 5; // Longer holds for emotion
    }
    if (context.revelationLevel > 0.8) {
      duration = 4; // Hold on revelations
    }

    return duration;
  }

  private determineTransition(context: SceneContext): TransitionType {
    const previousScene = this.sceneHistory[this.sceneHistory.length - 1];
    
    if (!previousScene) {
      return 'fade_in';
    }

    // Match cuts for thematic connections
    if (context.emotionalBeat === previousScene.atmosphere.mood) {
      return 'match_cut';
    }

    // Dissolves for time passage
    if (context.emotionalBeat === 'transition' || context.emotionalBeat === 'memory') {
      return 'dissolve';
    }

    // Jump cuts for urgency
    if (context.actionIntensity > 0.8) {
      return 'jump_cut';
    }

    // L-cuts for dialogue scenes
    if (context.dialoguePresent) {
      return 'l_cut';
    }

    return 'cut';
  }

  private async designAudioLayer(context: SceneContext): Promise<AudioLayer> {
    const ambient = this.createAmbientSounds(context);
    const music = this.createMusicCues(context);

    return {
      ambient,
      music,
      dialogue: {
        clarity: 0.9,
        presence: 0.8,
        reverb: context.locationType === 'interior' ? 0.3 : 0.1,
        spatialPosition: { pan: 0, depth: 0.3, height: 0 }
      },
      soundEffects: [],
      silence: this.createSilenceCues(context)
    };
  }

  private createAmbientSounds(context: SceneContext): AmbientSound[] {
    const sounds: AmbientSound[] = [];

    if (context.locationType === 'exterior') {
      sounds.push({
        type: 'wind',
        volume: 0.2,
        spatial: { pan: 0, depth: 0.8, height: 0 },
        loop: true
      });
    }

    if (context.timeOfDay === 'night') {
      sounds.push({
        type: 'crickets',
        volume: 0.1,
        spatial: { pan: 0.3, depth: 0.7, height: 0 },
        loop: true
      });
    }

    if (context.weatherCondition === 'rain') {
      sounds.push({
        type: 'rain',
        volume: 0.4,
        spatial: { pan: 0, depth: 0.9, height: 0.5 },
        loop: true
      });
    }

    return sounds;
  }

  private createMusicCues(context: SceneContext): MusicCue[] {
    const cues: MusicCue[] = [];

    if (context.emotionalBeat === 'tension') {
      cues.push({
        piece: 'tension_strings',
        mood: 'suspense',
        volume: 0.3,
        timing: 'throughout',
        fadeDuration: 2
      });
    } else if (context.emotionalBeat === 'romance') {
      cues.push({
        piece: 'romantic_piano',
        mood: 'intimate',
        volume: 0.25,
        timing: 'throughout',
        fadeDuration: 3
      });
    } else if (context.emotionalBeat === 'epic') {
      cues.push({
        piece: 'epic_orchestra',
        mood: 'grand',
        volume: 0.5,
        timing: 'throughout',
        fadeDuration: 1
      });
    }

    return cues;
  }

  private createSilenceCues(context: SceneContext): SilenceCue[] {
    const cues: SilenceCue[] = [];

    // Strategic silence for dramatic moments
    if (context.revelationLevel > 0.9 || context.emotionalBeat === 'shock') {
      cues.push({
        duration: 2,
        type: 'complete',
        purpose: 'dramatic_emphasis'
      });
    }

    if (context.emotionalBeat === 'contemplation') {
      cues.push({
        duration: 3,
        type: 'ambient_only',
        purpose: 'reflection_space'
      });
    }

    return cues;
  }

  private determineVFX(context: SceneContext): VisualEffect[] {
    const effects: VisualEffect[] = [];

    if (context.weatherCondition === 'storm') {
      effects.push({
        type: 'weather',
        intensity: 0.8,
        duration: 1,
        parameters: { precipitation: 'heavy', lightning: true }
      });
    }

    if (context.emotionalBeat === 'dream' || context.emotionalBeat === 'memory') {
      effects.push({
        type: 'memory',
        intensity: 0.5,
        duration: 1,
        parameters: { desaturation: 0.3, vignette: 0.4 }
      });
    }

    return effects;
  }

  private determineAtmosphere(context: SceneContext): SceneAtmosphere {
    const moodMap: Record<string, MoodType> = {
      'joy': 'joyful',
      'sadness': 'melancholic',
      'fear': 'frightening',
      'love': 'romantic',
      'mystery': 'mysterious',
      'tension': 'tense',
      'peace': 'peaceful',
      'epic': 'epic',
      'intimate': 'intimate',
      'surreal': 'surreal'
    };

    const atmosphere: SceneAtmosphere = {
      mood: moodMap[context.emotionalBeat] || 'mysterious',
      tension: context.actionIntensity > 0.5 ? context.actionIntensity : 0.3,
      intimacy: context.characterCount <= 2 ? 0.7 : 0.3,
      scale: context.characterCount > 10 ? 'epic' : context.characterCount > 5 ? 'regional' : 'personal',
      pacing: this.calculatePacing(context),
      energy: context.actionIntensity
    };

    return atmosphere;
  }

  private calculatePacing(context: SceneContext): PacingType {
    if (context.actionIntensity > 0.8) return 'frantic';
    if (context.actionIntensity > 0.6) return 'rapid';
    if (context.actionIntensity > 0.4) return 'brisk';
    if (context.actionIntensity > 0.2) return 'moderate';
    if (context.actionIntensity > 0.1) return 'slow';
    return 'glacial';
  }

  // ==========================================================================
  // SEQUENCE MANAGEMENT
  // ==========================================================================

  async createSequence(
    name: string,
    chapterId: string,
    sceneContexts: SceneContext[]
  ): Promise<CinematicSequence> {
    const scenes: CinematicScene[] = [];

    for (let i = 0; i < sceneContexts.length; i++) {
      const scene = await this.createScene(chapterId, sceneContexts[i], i);
      scenes.push(scene);
    }

    const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

    const sequence: CinematicSequence = {
      id: `seq-${chapterId}-${Date.now()}`,
      name,
      scenes,
      totalDuration,
      rhythm: { ...this.rhythmState },
      arc: this.calculateSequenceArc(scenes)
    };

    this.sequences.set(sequence.id, sequence);
    return sequence;
  }

  private calculateSequenceArc(scenes: CinematicScene[]): SequenceArc {
    if (scenes.length === 0) {
      return {
        startingEnergy: 0.5,
        peakEnergy: 0.5,
        endingEnergy: 0.5,
        turningPoint: 0
      };
    }

    const energies = scenes.map(s => s.atmosphere.energy);
    const startingEnergy = energies[0];
    const peakEnergy = Math.max(...energies);
    const endingEnergy = energies[energies.length - 1];
    const turningPoint = energies.indexOf(peakEnergy);

    return {
      startingEnergy,
      peakEnergy,
      endingEnergy,
      turningPoint
    };
  }

  // ==========================================================================
  // RHYTHM CONTROL
  // ==========================================================================

  setRhythm(rhythm: Partial<SequenceRhythm>): void {
    this.rhythmState = { ...this.rhythmState, ...rhythm };
  }

  accelerate(factor: number): void {
    this.rhythmState.beatsPerMinute *= factor;
    this.rhythmState.acceleration = factor;
  }

  // ==========================================================================
  // ANALYSIS
  // ==========================================================================

  analyzeSequence(sequenceId: string): CinematicAnalysis {
    const sequence = this.sequences.get(sequenceId);
    if (!sequence) {
      return {
        shotVariety: 0,
        angleVariety: 0,
        averageDuration: 0,
        rhythmConsistency: 0,
        recommendations: []
      };
    }

    const shotTypes = new Set(sequence.scenes.map(s => s.shotType));
    const angles = new Set(sequence.scenes.map(s => s.cameraAngle));
    const durations = sequence.scenes.map(s => s.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;

    const recommendations: string[] = [];
    if (shotTypes.size < 3) {
      recommendations.push('Consider adding more shot variety');
    }
    if (angles.size < 3) {
      recommendations.push('Consider varying camera angles');
    }
    if (avgDuration < 2) {
      recommendations.push('Scenes may be cutting too quickly');
    }
    if (avgDuration > 6) {
      recommendations.push('Consider faster pacing for engagement');
    }

    return {
      shotVariety: shotTypes.size / 12, // 12 total shot types
      angleVariety: angles.size / 8,    // 8 total angles
      averageDuration: avgDuration,
      rhythmConsistency: this.calculateRhythmConsistency(durations),
      recommendations
    };
  }

  private calculateRhythmConsistency(durations: number[]): number {
    if (durations.length < 2) return 1;
    
    const mean = durations.reduce((a, b) => a + b, 0) / durations.length;
    const variance = durations.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / durations.length;
    const stdDev = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 1 - stdDev / mean);
  }

  // ==========================================================================
  // EXPORT / IMPORT
  // ==========================================================================

  exportState(): CinematicEngineState {
    return {
      scenes: Array.from(this.scenes.entries()),
      sequences: Array.from(this.sequences.entries()),
      rhythmState: this.rhythmState,
      sceneHistory: this.sceneHistory.slice(-100) // Keep last 100
    };
  }

  importState(state: CinematicEngineState): void {
    this.scenes = new Map(state.scenes);
    this.sequences = new Map(state.sequences);
    this.rhythmState = state.rhythmState;
    this.sceneHistory = state.sceneHistory;
  }

  reset(): void {
    this.scenes.clear();
    this.sequences.clear();
    this.sceneHistory = [];
    this.rhythmState = {
      pattern: 'steady',
      beatsPerMinute: 120,
      acceleration: 0,
      syncopation: 0
    };
  }
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

export interface CinematicAnalysis {
  shotVariety: number;
  angleVariety: number;
  averageDuration: number;
  rhythmConsistency: number;
  recommendations: string[];
}

export interface CinematicEngineState {
  scenes: [string, CinematicScene][];
  sequences: [string, CinematicSequence][];
  rhythmState: SequenceRhythm;
  sceneHistory: CinematicScene[];
}

export default CinematicChoreographyEngine;