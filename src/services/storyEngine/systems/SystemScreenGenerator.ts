/**
 * SystemScreenGenerator
 * 
 * Generates litRPG-style system screens, stats, notifications, and UI elements
 * for the story protagonist. Provides game-like progression elements.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface CharacterStats {
  level: number;
  experience: number;
  experienceToNext: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  stamina: number;
  maxStamina: number;
}

export interface CharacterAttributes {
  strength: number;
  agility: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  luck: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  description: string;
  passive: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'main' | 'side' | 'daily' | 'hidden';
  status: 'available' | 'active' | 'completed' | 'failed';
  objectives: QuestObjective[];
  rewards: QuestReward[];
  timeLimit?: number;
  difficulty: number;
}

export interface QuestObjective {
  id: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
}

export interface QuestReward {
  type: 'experience' | 'gold' | 'item' | 'skill' | 'attribute';
  amount: number;
  description: string;
}

export interface SystemNotification {
  id: string;
  timestamp: number;
  type: 'info' | 'warning' | 'success' | 'error' | 'quest';
  title: string;
  message: string;
  icon?: string;
  priority: number;
  read: boolean;
}

export interface SystemScreen {
  stats: CharacterStats;
  attributes: CharacterAttributes;
  skills: Skill[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  inventory: InventoryItem[];
  notifications: SystemNotification[];
  title: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'material';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  stats?: Record<string, number>;
  usable: boolean;
}

export interface StoryContext {
  chapterNumber: number;
  characterName: string;
  setting: string;
  currentEvent: string;
  emotionalState: {
    primary: string;
    intensity: number;
  };
  previousChapter: any;
  worldState: any;
  themes?: string[];
  recentEvents?: any[];
}

// ============================================================================
// MAIN GENERATOR CLASS
// ============================================================================

export class SystemScreenGenerator {
  private characterStats: CharacterStats | null = null;
  private characterAttributes: CharacterAttributes | null = null;
  private skills: Map<string, Skill> = new Map();
  private quests: Map<string, Quest> = new Map();
  private inventory: Map<string, InventoryItem> = new Map();
  private notifications: SystemNotification[] = [];
  private chapterProgression: Map<number, string[]> = new Map();
  
  // Skill trees and progression
  private skillTree: Map<string, string[]> = new Map();
  private unlockedFeatures: Set<string> = new Set();
  
  // Cross-system references
  private storyEngine?: any;
  private characterGenome?: any;

  constructor(characterName: string = "Protagonist") {
    this.initializeCharacter(characterName);
    this.initializeSkillTree();
  }

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================

  private initializeCharacter(name: string): void {
    this.characterStats = {
      level: 1,
      experience: 0,
      experienceToNext: 100,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      stamina: 100,
      maxStamina: 100
    };

    this.characterAttributes = {
      strength: 10,
      agility: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      luck: 10
    };

    // Initialize basic skills
    this.addSkill('basic_attack', 'Basic Attack', 1, 0, 100, 'A simple melee attack', false);
    this.addSkill('observe', 'Observe', 1, 0, 100, 'Examine surroundings for details', true);
    
    // Add starting quest
    this.addQuest({
      id: 'main_intro',
      title: 'Begin Your Journey',
      description: 'Explore your new surroundings and understand this world.',
      type: 'main',
      status: 'active',
      objectives: [
        { id: 'explore', description: 'Explore the starting area', progress: 0, target: 1, completed: false }
      ],
      rewards: [
        { type: 'experience', amount: 100, description: 'Experience Points' },
        { type: 'item', amount: 1, description: 'Starting Equipment' }
      ],
      difficulty: 1
    });

    // Add starting inventory
    this.addItem('starter_sword', 'Rusty Sword', 'An old but reliable weapon', 'weapon', 'common', 1, {
      attack: 5
    });
  }

  private initializeSkillTree(): void {
    // Combat skills
    this.skillTree.set('basic_attack', ['power_strike', 'swift_strike']);
    this.skillTree.set('power_strike', ['cleave', 'crushing_blow']);
    this.skillTree.set('swift_strike', ['dual_strike', 'evade']);
    
    // Magic skills
    this.skillTree.set('fireball', ['inferno', 'meteor']);
    this.skillTree.set('heal', ['greater_heal', 'regeneration']);
    
    // Utility skills
    this.skillTree.set('observe', ['analyze', 'detect']);
    this.skillTree.set('sneak', ['stealth', 'assassinate']);
  }

  // ==========================================================================
  // SKILL MANAGEMENT
  // ==========================================================================

  addSkill(id: string, name: string, level: number, experience: number, 
           maxExperience: number, description: string, passive: boolean): void {
    const skill: Skill = {
      id,
      name,
      level,
      experience,
      maxExperience,
      description,
      passive
    };
    this.skills.set(id, skill);
  }

  gainSkillExperience(skillId: string, amount: number): void {
    const skill = this.skills.get(skillId);
    if (!skill) return;

    skill.experience += amount;
    
    // Check for level up
    if (skill.experience >= skill.maxExperience) {
      skill.level++;
      skill.experience = skill.experience - skill.maxExperience;
      skill.maxExperience = Math.floor(skill.maxExperience * 1.5);
      
      this.addNotification({
        id: `skill_up_${skillId}_${Date.now()}`,
        timestamp: Date.now(),
        type: 'success',
        title: `Skill Level Up!`,
        message: `${skill.name} increased to Level ${skill.level}!`,
        priority: 3,
        read: false
      });

      // Unlock dependent skills
      const dependencies = this.skillTree.get(skillId);
      if (dependencies && skill.level >= 5) {
        dependencies.forEach(depId => {
          if (!this.skills.has(depId)) {
            const depSkill = this.getSkillInfo(depId);
            if (depSkill) {
              this.addSkill(depId, depSkill.name, 1, 0, 100, depSkill.description, false);
              this.addNotification({
                id: `skill_unlock_${depId}_${Date.now()}`,
                timestamp: Date.now(),
                type: 'info',
                title: `New Skill Unlocked!`,
                message: `You've unlocked ${depSkill.name}!`,
                priority: 2,
                read: false
              });
            }
          }
        });
      }
    }
  }

  private getSkillInfo(skillId: string): { name: string; description: string } | null {
    const skillInfo: Record<string, { name: string; description: string }> = {
      'power_strike': { name: 'Power Strike', description: 'A powerful blow that deals extra damage' },
      'swift_strike': { name: 'Swift Strike', description: 'Quick attack with increased critical chance' },
      'cleave': { name: 'Cleave', description: 'Strike multiple enemies in front of you' },
      'crushing_blow': { name: 'Crushing Blow', description: 'Devastating attack that ignores armor' },
      'dual_strike': { name: 'Dual Strike', description: 'Attack twice in rapid succession' },
      'evade': { name: 'Evade', description: 'Dodge enemy attacks' },
      'inferno': { name: 'Inferno', description: 'Create a devastating firestorm' },
      'meteor': { name: 'Meteor', description: 'Call down a meteor from the sky' },
      'greater_heal': { name: 'Greater Heal', description: 'Restore large amount of health' },
      'regeneration': { name: 'Regeneration', description: 'Passive health regeneration' },
      'analyze': { name: 'Analyze', description: 'Detailed examination of targets' },
      'detect': { name: 'Detect', description: 'Sense hidden enemies and traps' },
      'stealth': { name: 'Stealth', description: 'Become invisible to enemies' },
      'assassinate': { name: 'Assassinate', description: 'Critical strike from stealth' }
    };
    return skillInfo[skillId] || null;
  }

  // ==========================================================================
  // QUEST MANAGEMENT
  // ==========================================================================

  addQuest(quest: Quest): void {
    this.quests.set(quest.id, quest);
  }

  updateQuestObjective(questId: string, objectiveId: string, progress: number): void {
    const quest = this.quests.get(questId);
    if (!quest) return;

    const objective = quest.objectives.find(obj => obj.id === objectiveId);
    if (!objective) return;

    objective.progress = Math.min(progress, objective.target);
    objective.completed = objective.progress >= objective.target;

    // Check if all objectives are completed
    const allCompleted = quest.objectives.every(obj => obj.completed);
    if (allCompleted && quest.status === 'active') {
      quest.status = 'completed';
      this.completeQuest(questId);
    }
  }

  completeQuest(questId: string): void {
    const quest = this.quests.get(questId);
    if (!quest || quest.status !== 'completed') return;

    // Grant rewards
    quest.rewards.forEach(reward => {
      switch (reward.type) {
        case 'experience':
          this.gainExperience(reward.amount);
          break;
        case 'gold':
          // Add gold to inventory
          break;
        case 'item':
          // Add item to inventory
          break;
        case 'skill':
          // Unlock skill
          break;
        case 'attribute':
          // Increase attribute
          break;
      }
    });

    this.addNotification({
      id: `quest_complete_${questId}_${Date.now()}`,
      timestamp: Date.now(),
      type: 'quest',
      title: `Quest Complete!`,
      message: `${quest.title} completed!`,
      priority: 3,
      read: false
    });

    // Check for dependent quests
    this.checkForNewQuests(questId);
  }

  private checkForNewQuests(completedQuestId: string): void {
    // Generate follow-up quests based on completed quest
    if (completedQuestId === 'main_intro') {
      this.addQuest({
        id: 'main_2',
        title: 'First Challenge',
        description: 'Face your first real challenge and prove your worth.',
        type: 'main',
        status: 'active',
        objectives: [
          { id: 'defeat_enemy', description: 'Defeat the first enemy', progress: 0, target: 1, completed: false }
        ],
        rewards: [
          { type: 'experience', amount: 200, description: 'Experience Points' },
          { type: 'item', amount: 1, description: 'Skill Book' }
        ],
        difficulty: 2
      });
    }
  }

  // ==========================================================================
  // INVENTORY MANAGEMENT
  // ==========================================================================

  addItem(id: string, name: string, description: string, type: InventoryItem['type'], 
          rarity: InventoryItem['rarity'], quantity: number, stats?: Record<string, number>): void {
    const existing = this.inventory.get(id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      const item: InventoryItem = {
        id,
        name,
        description,
        type,
        rarity,
        quantity,
        stats,
        usable: type === 'consumable'
      };
      this.inventory.set(id, item);
    }
  }

  // ==========================================================================
  // EXPERIENCE AND LEVELING
  // ==========================================================================

  gainExperience(amount: number): void {
    if (!this.characterStats || !this.characterAttributes) {
      this.initializeCharacter('Player');
    }
    
    const stats = this.characterStats!;
    const attrs = this.characterAttributes!;
    
    stats.experience += amount;

    // Check for level up
    while (stats.experience >= stats.experienceToNext) {
      stats.experience -= stats.experienceToNext;
      stats.level++;
      stats.experienceToNext = Math.floor(stats.experienceToNext * 1.5);
      
      // Increase stats on level up
      stats.maxHealth += 10;
      stats.health = stats.maxHealth;
      stats.maxMana += 5;
      stats.mana = stats.maxMana;
      stats.maxStamina += 5;
      stats.stamina = stats.maxStamina;

      // Increase attributes
      const attributePoints = 5;
      attrs.strength += attributePoints;
      attrs.agility += attributePoints;
      attrs.intelligence += attributePoints;
      attrs.wisdom += attributePoints;

      this.addNotification({
        id: `level_up_${stats.level}_${Date.now()}`,
        timestamp: Date.now(),
        type: 'success',
        title: `Level Up!`,
        message: `You reached Level ${stats.level}!`,
        priority: 4,
        read: false
      });
    }
  }

  // ==========================================================================
  // NOTIFICATIONS
  // ==========================================================================

  addNotification(notification: SystemNotification): void {
    notification.id = notification.id || `notif_${Date.now()}_${Math.random()}`;
    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  // ==========================================================================
  // SYSTEM SCREEN GENERATION
  // ==========================================================================

  generateSystemScreen(context: StoryContext): SystemScreen {
    // Initialize stats if not set
    if (!this.characterStats || !this.characterAttributes) {
      this.initializeCharacter(context.characterName || 'Player');
    }
    
    // Update progression based on chapter
    this.updateProgression(context);
    
    // Generate relevant notifications based on context
    this.generateContextNotifications(context);

    return {
      stats: { ...this.characterStats! },
      attributes: { ...this.characterAttributes! },
      skills: Array.from(this.skills.values()),
      activeQuests: Array.from(this.quests.values()).filter(q => q.status === 'active'),
      completedQuests: Array.from(this.quests.values()).filter(q => q.status === 'completed'),
      inventory: Array.from(this.inventory.values()),
      notifications: this.notifications.filter(n => !n.read),
      title: 'System Interface',
      description: 'Game System - litRPG Interface'
    };
  }

  private updateProgression(context: StoryContext): void {
    // Award experience for chapter completion
    const baseExperience = 50 + (context.chapterNumber * 10);
    this.gainExperience(baseExperience);

    // Gain skill experience based on chapter content
    const relevantSkills = ['basic_attack', 'observe'];
    relevantSkills.forEach(skillId => {
      this.gainSkillExperience(skillId, 20 + context.chapterNumber * 5);
    });

    // Track chapter progression
    this.chapterProgression.set(context.chapterNumber, [
      `Completed chapter ${context.chapterNumber}`,
      `Explored: ${context.setting}`,
      `Event: ${context.currentEvent}`
    ]);
  }

  private generateContextNotifications(context: StoryContext): void {
    // Generate notifications based on story events
    if (context.chapterNumber % 5 === 0) {
      this.addNotification({
        id: `milestone_${context.chapterNumber}_${Date.now()}`,
        timestamp: Date.now(),
        type: 'info',
        title: 'Milestone Reached!',
        message: `You've reached chapter ${context.chapterNumber}!`,
        priority: 2,
        read: false
      });
    }

    // Quest progression notifications
    this.quests.forEach(quest => {
      if (quest.status === 'active') {
        const completedObjectives = quest.objectives.filter(obj => obj.completed).length;
        if (completedObjectives > 0 && completedObjectives < quest.objectives.length) {
          this.addNotification({
            id: `quest_progress_${quest.id}_${Date.now()}`,
            timestamp: Date.now(),
            type: 'quest',
            title: 'Quest Progress',
            message: `${quest.title}: ${completedObjectives}/${quest.objectives.length} objectives completed`,
            priority: 1,
            read: false
          });
        }
      }
    });
  }

  // ==========================================================================
  // FORMATTING FOR NARRATIVE
  // ==========================================================================

  formatSystemScreenForNarrative(screen: SystemScreen): string {
    let output = '';
    
    output += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    output += `【 SYSTEM INTERFACE 】\n`;
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    output += `\n`;
    
    // Stats
    output += `【 Character Information 】\n`;
    output += `Name: Protagonist\n`;
    output += `Level: ${screen.stats.level}\n`;
    output += `Experience: ${screen.stats.experience} / ${screen.stats.experienceToNext}\n`;
    output += `\n`;
    
    output += `【 Stats 】\n`;
    output += `HP: ${screen.stats.health}/${screen.stats.maxHealth}\n`;
    output += `MP: ${screen.stats.mana}/${screen.stats.maxMana}\n`;
    output += `Stamina: ${screen.stats.stamina}/${screen.stats.maxStamina}\n`;
    output += `\n`;
    
    // Attributes
    output += `【 Attributes 】\n`;
    output += `STR: ${screen.attributes.strength} | AGI: ${screen.attributes.agility}\n`;
    output += `INT: ${screen.attributes.intelligence} | WIS: ${screen.attributes.wisdom}\n`;
    output += `CHA: ${screen.attributes.charisma} | LUCK: ${screen.attributes.luck}\n`;
    output += `\n`;
    
    // Skills
    if (screen.skills.length > 0) {
      output += `【 Skills 】\n`;
      screen.skills.slice(0, 5).forEach(skill => {
        const passive = skill.passive ? '[Passive]' : '[Active]';
        output += `• ${skill.name} Lv.${skill.level} ${passive}\n`;
        output += `  ${skill.description}\n`;
      });
      output += `\n`;
    }
    
    // Active Quests
    if (screen.activeQuests.length > 0) {
      output += `【 Active Quests 】\n`;
      screen.activeQuests.forEach(quest => {
        const progress = quest.objectives.filter(o => o.completed).length;
        const total = quest.objectives.length;
        output += `► ${quest.title} [${progress}/${total}]\n`;
        output += `  ${quest.description}\n`;
        quest.objectives.forEach(obj => {
          const status = obj.completed ? '✓' : '○';
          output += `  ${status} ${obj.description} (${obj.progress}/${obj.target})\n`;
        });
        output += `\n`;
      });
    }
    
    // Notifications
    if (screen.notifications.length > 0) {
      output += `【 Notifications 】\n`;
      screen.notifications.slice(0, 3).forEach(notif => {
        output += `⚠ ${notif.title}\n`;
        output += `  ${notif.message}\n`;
      });
      output += `\n`;
    }
    
    output += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    
    return output;
  }

  generateStatIncreaseNarrative(oldStats: CharacterStats, newStats: CharacterStats): string {
    let narrative = '';
    
    if (newStats.level > oldStats.level) {
      narrative += `\nSuddenly, a surge of power coursed through my veins. The system interface flared to life before my eyes:\n\n`;
      narrative += `【 LEVEL UP! 】\n`;
      narrative += `You have reached Level ${newStats.level}!\n\n`;
      narrative += `All stats increased. Maximum HP, MP, and Stamina have been restored and upgraded.\n\n`;
    }
    
    return narrative;
  }

  // ==========================================================================
  // CROSS-SYSTEM INTEGRATION
  // ==========================================================================

  setSystems(systems: {
    storyEngine?: any;
    characterGenome?: any;
  }): void {
    this.storyEngine = systems.storyEngine;
    this.characterGenome = systems.characterGenome;
  }

  // ==========================================================================
  // SAVE/LOAD
  // ==========================================================================

  exportState(): any {
    return {
      characterStats: this.characterStats,
      characterAttributes: this.characterAttributes,
      skills: Array.from(this.skills.entries()),
      quests: Array.from(this.quests.entries()),
      inventory: Array.from(this.inventory.entries()),
      notifications: this.notifications,
      chapterProgression: Array.from(this.chapterProgression.entries()),
      unlockedFeatures: Array.from(this.unlockedFeatures)
    };
  }

  importState(state: any): void {
    this.characterStats = state.characterStats;
    this.characterAttributes = state.characterAttributes;
    this.skills = new Map(state.skills);
    this.quests = new Map(state.quests);
    this.inventory = new Map(state.inventory);
    this.notifications = state.notifications;
    this.chapterProgression = new Map(state.chapterProgression);
    this.unlockedFeatures = new Set(state.unlockedFeatures);
  }
}