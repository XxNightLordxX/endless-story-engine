/**
 * SystemScreenGenerator - Generates system interface elements
 * 
 * Creates HUD overlays, system messages, notifications, and Progenitor Protocol reveals.
 * Provides visual and textual system feedback that enhances the VR immersion.
 */

export interface SystemMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'progenitor';
  priority: number; // 1-10, higher = more important
  title: string;
  content: string;
  timestamp: string;
  duration?: number; // How long to display (ms)
  category: string;
  source: 'system' | 'hud' | 'progenitor' | 'environment';
}

export interface HUDOverlay {
  type: 'stat' | 'notification' | 'warning' | 'quest' | 'combat';
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  content: string;
  icon?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  duration: number; // milliseconds
}

export interface ProgenitorReveal {
  id: string;
  tier: number; // 1-10, higher = more advanced
  title: string;
  description: string;
  abilities: string[];
  restrictions: string[];
  unlockRequirements: string[];
  hasBeenRevealed: boolean;
  chapterRevealed?: number;
}

export interface SystemScreen {
  messages: SystemMessage[];
  hudOverlays: HUDOverlay[];
  progenitorReveals: ProgenitorReveal[];
  activeAlerts: string[];
}

export class SystemScreenGenerator {
  private systemScreens: Map<number, SystemScreen> = new Map();
  private currentChapter: number = 1;
  private messageQueue: SystemMessage[] = [];
  private progenitorTier: number = 1;

  // Pre-defined system templates
  private messageTemplates: Record<string, string[]> = {
    stat_change: [
      'Stat adjusted: {stat} {direction} by {amount}',
      '{stat} has been modified',
      'System adjustment: {stat} {direction}',
    ],
    sync_warning: [
      'Sync level elevated: {level}%. Caution advised.',
      'Reality breach imminent. Sync: {level}%',
      'Warning: High sync detected - {level}%',
    ],
    threat_alert: [
      'Hostile entity detected in proximity',
      'Threat analysis: Level {level} enemy identified',
      'Combat mode available - Target acquired',
    ],
    zone_transition: [
      'Zone transition initiated...',
      'Loading new environment: {zone}',
      'Boundary crossed. Entering {zone}',
    ],
    achievement: [
      'Achievement Unlocked: {achievement}',
      'Milestone reached: {achievement}',
      'Progress acknowledged: {achievement}',
    ],
    quest_update: [
      'Quest updated: {quest}',
      'New objective available: {quest}',
      'Story progression: {quest}',
    ],
  };

  private progenitorReveals: ProgenitorReveal[] = [
    {
      id: 'progenitor_bloodline',
      tier: 1,
      title: 'Progenitor Bloodline',
      description: 'Your blood carries the essence of the original architects of Eclipsis. This grants unique abilities but also attracts attention.',
      abilities: ['Enhanced stat growth', 'Reality bleed resistance', 'Dual world awareness'],
      restrictions: ['Cannot fully disclose identity to non-Progenitors', 'Sync level affects abilities'],
      unlockRequirements: ['Reach VR level 5', 'First reality bleed event'],
      hasBeenRevealed: false,
    },
    {
      id: 'reality_manipulation',
      tier: 3,
      title: 'Reality Manipulation',
      description: 'At higher tiers, Progenitors can subtly influence both VR and reality. This power comes with great responsibility.',
      abilities: ['Minor reality edits', 'Stat synchronization improvements', 'Enhanced system access'],
      restrictions: ['High sync required', 'Energy consumption', 'Potential system backlash'],
      unlockRequirements: ['Reach VR level 15', 'Sync level > 60%', 'Complete 3 Progenitor quests'],
      hasBeenRevealed: false,
    },
    {
      id: 'world_creation',
      tier: 5,
      title: 'World Creation',
      description: 'The ultimate Progenitor ability - creating and modifying zones within Eclipsis. This is the power that built the world.',
      abilities: ['Create new zones', 'Modify existing zones', 'Spawn unique entities'],
      restrictions: ['Requires tier 5', 'Massive energy cost', 'System approval required'],
      unlockRequirements: ['Reach VR level 30', 'Sync level > 80%', 'Complete main storyline'],
      hasBeenRevealed: false,
    },
    {
      id: 'system_override',
      tier: 7,
      title: 'System Override',
      description: 'The ability to temporarily override system restrictions and rules. Use with extreme caution.',
      abilities: ['Bypass system restrictions', 'Modify game rules', 'Access admin functions'],
      restrictions: ['Requires tier 7', 'Cooldown period', 'System monitoring'],
      unlockRequirements: ['Reach VR level 50', 'Unlock all previous tiers', 'Pass system trials'],
      hasBeenRevealed: false,
    },
    {
      id: 'reality_transcendence',
      tier: 10,
      title: 'Reality Transcendence',
      description: 'The ultimate Progenitor power - the ability to exist in both worlds simultaneously without separation.',
      abilities: ['Perfect dual existence', 'Unlimited stat merging', 'Reality-level control'],
      restrictions: ['Requires tier 10', 'Permanent existence change', 'Unknown consequences'],
      unlockRequirements: ['Reach VR level 100', 'Max sync level', 'Complete all trials'],
      hasBeenRevealed: false,
    },
  ];

  constructor() {
    this.initializeSystemScreens();
  }

  /**
   * Initialize system screens for chapters
   */
  private initializeSystemScreens(): void {
    for (let i = 1; i <= 10; i++) {
      this.systemScreens.set(i, {
        messages: [],
        hudOverlays: [],
        progenitorReveals: [],
        activeAlerts: [],
      });
    }
  }

  /**
   * Generate system messages for a chapter
   */
  generateSystemMessages(context: {
    chapterNumber: number;
    world: 'real' | 'vr';
    syncLevel: number;
    events: Array<{ type: string; data: any }>;
  }): SystemMessage[] {
    const messages: SystemMessage[] = [];

    // Process events
    context.events.forEach((event, index) => {
      const message = this.createMessageFromEvent(event, context.chapterNumber, index);
      if (message) {
        messages.push(message);
      }
    });

    // Add sync warning if high
    if (context.syncLevel > 70 && context.world === 'vr') {
      messages.push(this.createSyncWarning(context.syncLevel));
    }

    // Add world-specific messages
    if (context.world === 'vr') {
      messages.push(this.createVRSystemMessage(context.chapterNumber));
    } else {
      messages.push(this.createRealWorldSystemMessage(context.chapterNumber));
    }

    return messages;
  }

  /**
   * Create a message from an event
   */
  private createMessageFromEvent(
    event: { type: string; data: any },
    chapterNumber: number,
    index: number
  ): SystemMessage | null {
    const timestamp = new Date().toISOString();
    let message: SystemMessage | null = null;

    switch (event.type) {
      case 'stat_change':
        const template = this.getRandomTemplate('stat_change');
        message = {
          id: `stat_${chapterNumber}_${index}`,
          type: 'info',
          priority: 3,
          title: 'System Update',
          content: template
            .replace('{stat}', event.data.stat || 'Stat')
            .replace('{direction}', event.data.direction || 'changed')
            .replace('{amount}', event.data.amount || ''),
          timestamp,
          duration: 3000,
          category: 'stats',
          source: 'hud',
        };
        break;

      case 'threat_detected':
        message = {
          id: `threat_${chapterNumber}_${index}`,
          type: 'warning',
          priority: 8,
          title: 'Threat Alert',
          content: this.getRandomTemplate('threat_alert')
            .replace('{level}', event.data.level || 'unknown'),
          timestamp,
          duration: 5000,
          category: 'combat',
          source: 'hud',
        };
        break;

      case 'achievement':
        message = {
          id: `achieve_${chapterNumber}_${index}`,
          type: 'success',
          priority: 6,
          title: 'Achievement Unlocked',
          content: this.getRandomTemplate('achievement')
            .replace('{achievement}', event.data.achievement || 'Achievement'),
          timestamp,
          duration: 4000,
          category: 'progress',
          source: 'system',
        };
        break;

      case 'quest_update':
        message = {
          id: `quest_${chapterNumber}_${index}`,
          type: 'info',
          priority: 5,
          title: 'Quest Updated',
          content: this.getRandomTemplate('quest_update')
            .replace('{quest}', event.data.quest || 'Quest'),
          timestamp,
          duration: 3500,
          category: 'story',
          source: 'system',
        };
        break;
    }

    return message;
  }

  /**
   * Create a sync warning message
   */
  private createSyncWarning(syncLevel: number): SystemMessage {
    return {
      id: `sync_warning_${Date.now()}`,
      type: 'warning',
      priority: syncLevel > 85 ? 10 : 7,
      title: 'Sync Level Warning',
      content: this.getRandomTemplate('sync_warning').replace('{level}', syncLevel.toString()),
      timestamp: new Date().toISOString(),
      duration: syncLevel > 85 ? 8000 : 5000,
      category: 'system',
      source: 'system',
    };
  }

  /**
   * Create VR system message
   */
  private createVRSystemMessage(chapterNumber: number): SystemMessage {
    const messages = [
      'VR system online. Environment stable.',
      'Welcome to Eclipsis. Progenitor protocols active.',
      'Virtual environment synchronized.',
      'VR connection established. Progenitor bloodline detected.',
    ];

    return {
      id: `vr_sys_${chapterNumber}`,
      type: 'info',
      priority: 2,
      title: 'System Status',
      content: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toISOString(),
      duration: 2000,
      category: 'system',
      source: 'system',
    };
  }

  /**
   * Create real world system message
   */
  private createRealWorldSystemMessage(chapterNumber: number): SystemMessage {
    const messages = [
      'Disconnected from VR. System standby.',
      'Returning to reality. Monitoring sync levels.',
      'VR session terminated. Data saved.',
    ];

    return {
      id: `real_sys_${chapterNumber}`,
      type: 'info',
      priority: 2,
      title: 'System Status',
      content: messages[Math.floor(Math.random() * messages.length)],
      timestamp: new Date().toISOString(),
      duration: 2000,
      category: 'system',
      source: 'system',
    };
  }

  /**
   * Generate HUD overlay
   */
  generateHUDOverlay(type: 'stat' | 'notification' | 'warning' | 'quest' | 'combat', context: {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    content: string;
  }): HUDOverlay {
    const positions: Record<string, string> = {
      stat: 'top-left',
      notification: 'bottom-right',
      warning: 'center',
      quest: 'bottom-left',
      combat: 'top-right',
    };

    return {
      type,
      position: positions[type] as any,
      content: context.content,
      urgency: context.urgency,
      duration: this.getDurationForUrgency(context.urgency),
    };
  }

  /**
   * Get duration based on urgency
   */
  private getDurationForUrgency(urgency: string): number {
    const durations: Record<string, number> = {
      low: 2000,
      medium: 4000,
      high: 6000,
      critical: 10000,
    };
    return durations[urgency] || 4000;
  }

  /**
   * Check for Progenitor reveal
   */
  checkProgenitorReveal(context: {
    vrLevel: number;
    syncLevel: number;
    chapterNumber: number;
  }): ProgenitorReveal | null {
    const available = this.progenitorReveals.find(
      (reveal) =>
        !reveal.hasBeenRevealed &&
        context.vrLevel >= parseInt(reveal.unlockRequirements[0]?.match(/\d+/)?.[0] || '0') &&
        reveal.tier <= this.progenitorTier + 2
    );

    if (available) {
      available.hasBeenRevealed = true;
      available.chapterRevealed = context.chapterNumber;
      return available;
    }

    return null;
  }

  /**
   * Unlock next Progenitor tier
   */
  unlockNextTier(): ProgenitorReveal | null {
    const nextTier = this.progenitorReveals.find((r) => r.tier === this.progenitorTier + 1);
    if (nextTier) {
      this.progenitorTier++;
      return nextTier;
    }
    return null;
  }

  /**
   * Get random template
   */
  private getRandomTemplate(category: string): string {
    const templates = this.messageTemplates[category] || [];
    return templates[Math.floor(Math.random() * templates.length)];
  }

  /**
   * Generate system description for narrative
   */
  generateSystemNarrative(messages: SystemMessage[]): string {
    if (messages.length === 0) return '';

    const importantMessages = messages.filter((m) => m.priority >= 5);
    if (importantMessages.length === 0) return '';

    const descriptions = importantMessages.map((msg) => {
      const typePrefix = {
        info: 'A system notification appears',
        warning: 'A warning flashes',
        error: 'An error message displays',
        success: 'A success notification',
        progenitor: 'A Progenitor message reveals',
      };

      return `${typePrefix[msg.type]}: "${msg.content}"`;
    });

    return descriptions.join('. ');
  }

  /**
   * Get current system screen for chapter
   */
  getSystemScreen(chapterNumber: number): SystemScreen {
    return (
      this.systemScreens.get(chapterNumber) || {
        messages: [],
        hudOverlays: [],
        progenitorReveals: [],
        activeAlerts: [],
      }
    );
  }

  /**
   * Export system state
   */
  exportState(): any {
    return {
      systemScreens: Array.from(this.systemScreens.entries()),
      progenitorTier: this.progenitorTier,
      progenitorReveals: this.progenitorReveals,
    };
  }

  /**
   * Import system state
   */
  importState(state: any): void {
    if (state.systemScreens) {
      this.systemScreens = new Map(state.systemScreens);
    }
    if (state.progenitorTier !== undefined) {
      this.progenitorTier = state.progenitorTier;
    }
    if (state.progenitorReveals) {
      this.progenitorReveals = state.progenitorReveals;
    }
  }
}

export default SystemScreenGenerator;