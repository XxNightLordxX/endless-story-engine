/**
 * CinematicEnhancer - Enhances narrative with cinematic descriptions
 * 
 * Adds spatial awareness, environmental evolution, visual contrasts,
 * and dynamic motion cues to create immersive, movie-like prose.
 */

export interface SpatialContext {
  characters: SpatialCharacter[];
  environment: EnvironmentState;
  lighting: LightingState;
  soundscape: SoundscapeState;
  atmosphere: string;
}

export interface SpatialCharacter {
  name: string;
  position: { x: number; y: number; z: number };
  posture: string;
  facing: string;
  distance: number; // from POV character
  visibility: 'clear' | 'obscured' | 'partial';
}

export interface EnvironmentState {
  location: string;
  timeOfDay: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'evening' | 'night' | 'unknown';
  weather: string;
  features: string[];
  ambientDetails: string[];
}

export interface LightingState {
  type: 'natural' | 'artificial' | 'mixed';
  direction: string;
  intensity: 'dim' | 'soft' | 'moderate' | 'bright' | 'harsh';
  color: string;
  shadows: string;
  moving: boolean;
}

export interface SoundscapeState {
  ambient: string[];
  specific: string[];
  distance: 'near' | 'medium' | 'far' | 'mixed';
  mood: 'calm' | 'tense' | 'chaotic' | 'mysterious';
}

export interface CinematicShot {
  type: 'wide' | 'medium' | 'close-up' | 'extreme-close' | 'over-shoulder' | 'pov' | 'pan' | 'tracking';
  subject: string;
  movement?: string;
  description: string;
  duration: string;
}

export interface VisualContrast {
  type: 'light-dark' | 'color' | 'scale' | 'motion-stillness' | 'sound-silence';
  description: string;
  purpose: string;
}

export class CinematicEnhancer {
  private spatialState: Map<string, SpatialContext> = new Map();
  private currentLocation: string = 'unknown';
  private shotHistory: CinematicShot[] = [];
  private lastEnhancement: number = 0;

  // Pre-defined cinematic templates
  private shotTemplates: Record<string, CinematicShot[]> = {
    introduction: [
      { type: 'wide', subject: 'environment', description: 'Establishing shot of the scene', duration: '3 seconds' },
      { type: 'medium', subject: 'character', description: 'Character introduction', duration: '2 seconds' },
      { type: 'close-up', subject: 'face', description: 'Character reaction', duration: '1.5 seconds' },
    ],
    tension: [
      { type: 'close-up', subject: 'face', description: 'Tension builds on character face', duration: '2 seconds' },
      { type: 'extreme-close', subject: 'eyes', description: 'Focus on eyes revealing emotion', duration: '1 second' },
      { type: 'medium', subject: 'hands', description: 'Subtle movement reveals anxiety', duration: '1.5 seconds' },
    ],
    action: [
      { type: 'tracking', subject: 'movement', movement: 'follow', description: 'Following the action', duration: '2 seconds' },
      { type: 'close-up', subject: 'impact', description: 'Impact moment', duration: '0.5 seconds' },
      { type: 'wide', subject: 'environment', description: 'Full scope of action', duration: '1.5 seconds' },
    ],
    revelation: [
      { type: 'medium', subject: 'character', description: 'Character processes information', duration: '2 seconds' },
      { type: 'over-shoulder', subject: 'object', description: 'Reveal of the key element', duration: '1.5 seconds' },
      { type: 'close-up', subject: 'face', description: 'Reaction shot', duration: '1 second' },
    ],
    emotional: [
      { type: 'close-up', subject: 'face', description: 'Emotional expression', duration: '2 seconds' },
      { type: 'pov', subject: 'scene', description: 'Seeing through their eyes', duration: '1.5 seconds' },
      { type: 'medium', subject: 'character', movement: 'pull-back', description: 'Pulling back to context', duration: '2 seconds' },
    ],
  };

  // Environmental evolution templates
  private environmentalShifts: Record<string, string[]> = {
    dawn_to_morning: [
      'The first rays of sunlight pierce through the darkness',
      'Shadows retreat as the world wakes',
      'The grey of dawn gives way to golden morning light',
    ],
    dusk_to_night: [
      'The last light of day fades into purple darkness',
      'Stars begin to prick through the deepening blue',
      'The boundary between worlds grows thin',
    ],
    calm_to_tension: [
      'The air grows still, heavy with anticipation',
      'Silence falls like a held breath',
      'The environment seems to contract around them',
    ],
    tension_to_action: [
      'Time seems to slow before chaos erupts',
      'The world snaps into sharp focus',
      'Everything accelerates in a rush of motion',
    ],
    natural_to_supernatural: [
      'Reality seems to waver at the edges',
      'The familiar world takes on an otherworldly quality',
      'Light bends in impossible ways',
    ],
  };

  // Sensory detail templates
  private sensoryTemplates = {
    sight: [
      'Light {action} across {surface}',
      'Colors {shift} in the {condition} light',
      'The {element} catches the eye',
    ],
    sound: [
      '{sound} {distance} {context}',
      'The echo of {source} {quality}',
      'Amidst the {condition}, {sound} can be heard',
    ],
    touch: [
      'The air {sensation} against skin',
      '{temperature} radiates from {source}',
      'The ground {quality} beneath each step',
    ],
    smell: [
      '{scent} hangs in the air',
      'The smell of {source} {distance}',
      'A {quality} scent {action}',
    ],
  };

  constructor() {
    this.initializeSpatialContexts();
  }

  /**
   * Initialize spatial contexts for key locations
   */
  private initializeSpatialContexts(): void {
    // Hospital Room (Real World)
    this.spatialState.set('hospital_room', {
      characters: [],
      environment: {
        location: 'Hospital Room',
        timeOfDay: 'afternoon',
        weather: 'clear',
        features: ['hospital bed', 'medical equipment', 'window', 'chair'],
        ambientDetails: ['beeping monitors', 'distant footsteps', 'hum of machinery'],
      },
      lighting: {
        type: 'mixed',
        direction: 'window-left',
        intensity: 'soft',
        color: 'pale blue',
        shadows: 'soft',
        moving: false,
      },
      soundscape: {
        ambient: ['medical equipment beeping', 'distant voices'],
        specific: [],
        distance: 'far',
        mood: 'calm',
      },
      atmosphere: 'Clinical sterility with underlying tension',
    });

    // VR Zone - Crimson Valley
    this.spatialState.set('crimson_valley', {
      characters: [],
      environment: {
        location: 'Crimson Valley',
        timeOfDay: 'dusk',
        weather: 'misty',
        features: ['towering red rock formations', 'deep chasms', 'ancient ruins'],
        ambientDetails: ['swirling mist', 'distant creature calls', 'wind through canyons'],
      },
      lighting: {
        type: 'natural',
        direction: 'low-angle',
        intensity: 'dim',
        color: 'crimson and amber',
        shadows: 'long and deep',
        moving: true,
      },
      soundscape: {
        ambient: ['wind through canyons', 'distant water'],
        specific: ['creature calls'],
        distance: 'mixed',
        mood: 'mysterious',
      },
      atmosphere: 'Ancient and foreboding',
    });

    // VR Zone - Shadow Haven
    this.spatialState.set('shadow_haven', {
      characters: [],
      environment: {
        location: 'Shadow Haven',
        timeOfDay: 'night',
        weather: 'clear',
        features: ['gothic architecture', 'dark alleys', 'glowing signs'],
        ambientDetails: ['distant music', 'shadowy figures', 'flickering lights'],
      },
      lighting: {
        type: 'artificial',
        direction: 'overhead',
        intensity: 'moderate',
        color: 'purple and blue',
        shadows: 'deep and sharp',
        moving: true,
      },
      soundscape: {
        ambient: ['urban activity', 'distant conversations'],
        specific: ['footsteps', 'clinking glasses'],
        distance: 'medium',
        mood: 'chaotic',
      },
      atmosphere: 'Vibrant danger lurks beneath the surface',
    });
  }

  /**
   * Generate cinematic shot sequence for a scene
   */
  generateShotSequence(sceneType: 'introduction' | 'tension' | 'action' | 'revelation' | 'emotional'): CinematicShot[] {
    const templates = this.shotTemplates[sceneType] || this.shotTemplates.introduction;
    return templates.map((shot) => ({ ...shot }));
  }

  /**
   * Apply cinematic shot description to content
   */
  applyShotToContent(shot: CinematicShot, context: { characterName?: string; location?: string }): string {
    const { type, subject, movement, description } = shot;

    const shotDescriptions: Record<string, string[]> = {
      wide: [
        `The scene opens wide, taking in the full scope of ${context.location || 'the area'}.`,
        `A panoramic view reveals ${context.location || 'the surroundings'}, setting the stage.`,
      ],
      medium: [
        `${context.characterName || 'The figure'} stands framed in the scene.`,
        `The camera settles at medium distance, capturing both character and context.`,
      ],
      'close-up': [
        `Focus tightens on ${subject}, every detail sharp and meaningful.`,
        `The lens draws close, revealing what might otherwise go unnoticed.`,
      ],
      'extreme-close': [
        `Everything else falls away as the focus narrows to just ${subject}.`,
        `A microscopic view that speaks volumes about the whole.`,
      ],
      'over-shoulder': [
        `Looking past ${context.characterName || 'the observer'}, we see what draws their attention.`,
        `From this angle, we share their perspective.`,
      ],
      pov: [
        `We see through ${context.characterName || 'their'} eyes, experiencing this moment directly.`,
        `First-person perspective immerses us in the experience.`,
      ],
      pan: [
        `The view sweeps across the scene, revealing layers of detail.`,
        `A deliberate pan draws the eye from one point to another.`,
      ],
      tracking: [
        `Following the movement, the camera stays with ${context.characterName || 'the subject'}.`,
        `Motion flows seamlessly as we track along.`,
      ],
    };

    const options = shotDescriptions[type] || shotDescriptions.medium;
    let result = options[Math.floor(Math.random() * options.length)];

    if (movement) {
      const movementDescriptions: Record<string, string> = {
        'follow': 'The camera moves fluidly, maintaining perfect framing.',
        'pull-back': 'Slowly pulling back reveals more context.',
        'push-in': 'The lens pushes in, heightening the intimacy.',
        'crane': 'The angle shifts dramatically, changing perspective.',
      };
      result += ` ${movementDescriptions[movement] || ''}`;
    }

    return result;
  }

  /**
   * Generate environmental evolution
   */
  generateEnvironmentalEvolution(shiftType: string): string {
    const shifts = this.environmentalShifts[shiftType];
    if (!shifts || shifts.length === 0) {
      return 'The environment shifts subtly.';
    }
    return shifts[Math.floor(Math.random() * shifts.length)];
  }

  /**
   * Generate visual contrast description
   */
  generateVisualContrast(context: {
    type: 'light-dark' | 'color' | 'scale' | 'motion-stillness' | 'sound-silence';
    elements: string[];
    purpose: string;
  }): VisualContrast {
    const contrastDescriptions: Record<string, string[]> = {
      'light-dark': [
        'Deep shadows play against harsh light',
        'Bright illumination cuts through darkness',
        'The interplay of light and shadow creates depth',
      ],
      'color': [
        'Vibrant colors clash with muted tones',
        'A splash of color breaks the monotony',
        'Color contrast draws immediate attention',
      ],
      'scale': [
        'The massive looms over the miniscule',
        'Vast space dwarfs the figures within',
        'Small details reveal the larger truth',
      ],
      'motion-stillness': [
        'Chaos surrounds a moment of perfect stillness',
        'Movement freezes in a single suspended moment',
        'The still point in a turning world',
      ],
      'sound-silence': [
        'Silence speaks louder than any noise',
        'Sound fades into meaningful quiet',
        'The absence of sound amplifies the impact',
      ],
    };

    const descriptions = contrastDescriptions[context.type] || contrastDescriptions['light-dark'];

    return {
      type: context.type,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      purpose: context.purpose,
    };
  }

  /**
   * Generate spatial awareness description
   */
  generateSpatialDescription(characters: SpatialCharacter[], location: string): string {
    const context = this.spatialState.get(location);
    if (!context) {
      return `In the ${location}, positions shift strategically.`;
    }

    const descriptions: string[] = [];

    // Describe character positions
    characters.forEach((char) => {
      const distanceDesc = this.getDistanceDescription(char.distance);
      const postureDesc = char.posture || 'standing';
      const visibilityDesc = char.visibility === 'clear' ? '' : `, ${char.visibility} from view`;

      descriptions.push(`${char.name} is ${postureDesc} ${distanceDesc}${visibilityDesc}`);
    });

    // Add environmental context
    if (context.environment.features.length > 0) {
      const feature = context.environment.features[Math.floor(Math.random() * context.environment.features.length)];
      descriptions.push(`${feature} defines the space`);
    }

    // Add lighting
    if (context.lighting.moving) {
      descriptions.push(`the ${context.lighting.color} light shifts dynamically`);
    }

    return descriptions.join('. ') + '.';
  }

  /**
   * Get distance description
   */
  private getDistanceDescription(distance: number): string {
    if (distance < 2) return 'immediately close';
    if (distance < 5) return 'within arm\'s reach';
    if (distance < 10) return 'a few paces away';
    if (distance < 20) return 'across the space';
    return 'distant';
  }

  /**
   * Generate sensory enhancement
   */
  generateSensoryEnhancement(sense: 'sight' | 'sound' | 'touch' | 'smell', context: {
    action: string;
    surface?: string;
    condition?: string;
    element?: string;
    sound?: string;
    distance?: string;
    context?: string;
    source?: string;
    quality?: string;
    sensation?: string;
    temperature?: string;
    scent?: string;
  }): string {
    const templates = this.sensoryTemplates[sense];
    if (!templates || templates.length === 0) {
      return '';
    }

    const template = templates[Math.floor(Math.random() * templates.length)];

    return template
      .replace('{action}', context.action || 'plays')
      .replace('{surface}', context.surface || 'surfaces')
      .replace('{shift}', context.action || 'shift')
      .replace('{condition}', context.condition || 'changing')
      .replace('{element}', context.element || 'light')
      .replace('{sound}', context.sound || 'sound')
      .replace('{distance}', context.distance || 'echoes')
      .replace('{context}', context.context || 'in the air')
      .replace('{source}', context.source || 'something')
      .replace('{quality}', context.quality || 'faint')
      .replace('{sensation}', context.sensation || 'moves')
      .replace('{temperature}', context.temperature || 'warmth')
      .replace('{scent}', context.scent || 'scent');
  }

  /**
   * Enhance a paragraph with cinematic elements
   */
  enhanceParagraph(paragraph: string, enhancementType: 'spatial' | 'sensory' | 'contrast' | 'motion'): string {
    let enhancement = '';

    switch (enhancementType) {
      case 'spatial':
        enhancement = this.generateSpatialDescription([], this.currentLocation);
        break;
      case 'sensory':
        enhancement = this.generateSensoryEnhancement('sight', {
          action: 'plays',
          surface: 'surfaces',
          condition: 'ambient',
        });
        break;
      case 'contrast':
        const contrast = this.generateVisualContrast({
          type: 'light-dark',
          elements: [],
          purpose: 'add depth',
        });
        enhancement = contrast.description;
        break;
      case 'motion':
        const shots = this.generateShotSequence('tension');
        enhancement = this.applyShotToContent(shots[0], {});
        break;
    }

    if (enhancement) {
      return `${paragraph} ${enhancement}`;
    }
    return paragraph;
  }

  /**
   * Get spatial context for a location
   */
  getSpatialContext(location: string): SpatialContext | undefined {
    return this.spatialState.get(location);
  }

  /**
   * Set current location
   */
  setCurrentLocation(location: string): void {
    this.currentLocation = location;
  }

  /**
   * Update character position
   */
  updateCharacterPosition(
    location: string,
    character: SpatialCharacter
  ): void {
    const context = this.spatialState.get(location);
    if (context) {
      const existingIndex = context.characters.findIndex((c) => c.name === character.name);
      if (existingIndex >= 0) {
        context.characters[existingIndex] = character;
      } else {
        context.characters.push(character);
      }
    }
  }

  /**
   * Export state
   */
  exportState(): any {
    return {
      spatialState: Array.from(this.spatialState.entries()),
      currentLocation: this.currentLocation,
      shotHistory: this.shotHistory,
    };
  }

  /**
   * Import state
   */
  importState(state: any): void {
    if (state.spatialState) {
      this.spatialState = new Map(state.spatialState);
    }
    if (state.currentLocation) {
      this.currentLocation = state.currentLocation;
    }
    if (state.shotHistory) {
      this.shotHistory = state.shotHistory;
    }
  }
}

export default CinematicEnhancer;