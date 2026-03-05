/**
 * Item, Skill, and Ability Generation System
 * Procedurally generates game items, skills, and abilities with narrative integration
 */

import type { Item, Skill, Ability, CharacterStat } from '../../types';

export interface ItemRarity {
  tier: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique';
  bonusMultiplier: number;
  statBoost: number;
  descriptionPrefix: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  statRequirement: keyof CharacterStat;
  baseDamage: number;
  skillMultiplier: number;
}

export interface AbilityChain {
  id: string;
  name: string;
  abilities: string[];
  synergy: number; // 1-100
  ultimate: string;
}

export class ItemSystem {
  private rarityTiers: Map<string, ItemRarity>;
  private skillCategories: Map<string, SkillCategory>;
  private itemTemplates: Map<string, Item>;
  private skillTemplates: Map<string, Skill>;
  private abilityChains: AbilityChain[];
  private generatedItems: Map<string, Item>;
  private generatedSkills: Map<string, Skill>;

  constructor() {
    this.rarityTiers = this.initializeRarityTiers();
    this.skillCategories = this.initializeSkillCategories();
    this.itemTemplates = this.initializeItemTemplates();
    this.skillTemplates = this.initializeSkillTemplates();
    this.abilityChains = this.initializeAbilityChains();
    this.generatedItems = new Map();
    this.generatedSkills = new Map();
  }

  /**
   * Initialize rarity tiers
   */
  private initializeRarityTiers(): Map<string, ItemRarity> {
    const tiers = new Map();

    tiers.set('common', {
      tier: 'common',
      bonusMultiplier: 1.0,
      statBoost: 5,
      descriptionPrefix: 'A standard',
    });

    tiers.set('uncommon', {
      tier: 'uncommon',
      bonusMultiplier: 1.2,
      statBoost: 10,
      descriptionPrefix: 'An enhanced',
    });

    tiers.set('rare', {
      tier: 'rare',
      bonusMultiplier: 1.5,
      statBoost: 15,
      descriptionPrefix: 'A rare',
    });

    tiers.set('epic', {
      tier: 'epic',
      bonusMultiplier: 2.0,
      statBoost: 25,
      descriptionPrefix: 'An epic',
    });

    tiers.set('legendary', {
      tier: 'legendary',
      bonusMultiplier: 3.0,
      statBoost: 40,
      descriptionPrefix: 'A legendary',
    });

    tiers.set('unique', {
      tier: 'unique',
      bonusMultiplier: 5.0,
      statBoost: 50,
      descriptionPrefix: 'A unique',
    });

    return tiers;
  }

  /**
   * Initialize skill categories
   */
  private initializeSkillCategories(): Map<string, SkillCategory> {
    const categories = new Map();

    categories.set('combat', {
      id: 'combat',
      name: 'Combat Skills',
      description: 'Direct combat abilities',
      statRequirement: 'strength',
      baseDamage: 10,
      skillMultiplier: 1.5,
    });

    categories.set('magic', {
      id: 'magic',
      name: 'Magic Skills',
      description: 'Mystical abilities',
      statRequirement: 'intelligence',
      baseDamage: 15,
      skillMultiplier: 2.0,
    });

    categories.set('stealth', {
      id: 'stealth',
      name: 'Stealth Skills',
      description: 'Subtle actions',
      statRequirement: 'dexterity',
      baseDamage: 8,
      skillMultiplier: 1.2,
    });

    categories.set('support', {
      id: 'support',
      name: 'Support Skills',
      description: 'Buffs and healing',
      statRequirement: 'charisma',
      baseDamage: 5,
      skillMultiplier: 1.0,
    });

    return categories;
  }

  /**
   * Initialize item templates
   */
  private initializeItemTemplates(): Map<string, Item> {
    const templates = new Map();

    // Weapons
    templates.set('weapon_sword', {
      id: 'template_weapon_sword',
      name: 'Sword',
      description: 'A basic sword for combat',
      type: 'weapon',
      rarity: 'common',
      statBoosts: {
        strength: 5,
        attack: 8,
      },
      requirements: { strength: 5 },
      effects: ['standard_attack'],
    });

    templates.set('weapon_staff', {
      id: 'template_weapon_staff',
      name: 'Staff',
      description: 'A magical staff for casting spells',
      type: 'weapon',
      rarity: 'common',
      statBoosts: {
        intelligence: 5,
        magicAttack: 8,
      },
      requirements: { intelligence: 5 },
      effects: ['basic_spell'],
    });

    // Armor
    templates.set('armor_light', {
      id: 'template_armor_light',
      name: 'Light Armor',
      description: 'Light protection with good mobility',
      type: 'armor',
      rarity: 'common',
      statBoosts: {
        defense: 5,
        speed: 2,
      },
      requirements: { level: 1 },
      effects: ['light_protection'],
    });

    templates.set('armor_heavy', {
      id: 'template_armor_heavy',
      name: 'Heavy Armor',
      description: 'Strong protection but reduces mobility',
      type: 'armor',
      rarity: 'uncommon',
      statBoosts: {
        defense: 15,
        speed: -5,
      },
      requirements: { strength: 10, level: 5 },
      effects: ['heavy_protection'],
    });

    // Accessories
    templates.set('accessory_ring', {
      id: 'template_accessory_ring',
      name: 'Ring',
      description: 'A ring with minor enchantments',
      type: 'accessory',
      rarity: 'common',
      statBoosts: {
        maxHP: 10,
      },
      requirements: { level: 1 },
      effects: ['small_health_boost'],
    });

    templates.set('accessory_necklace', {
      id: 'template_accessory_necklace',
      name: 'Necklace',
      description: 'A necklace with magical properties',
      type: 'accessory',
      rarity: 'uncommon',
      statBoosts: {
        maxMP: 15,
        magicAttack: 5,
      },
      requirements: { intelligence: 5, level: 3 },
      effects: ['magic_amplification'],
    });

    // Consumables
    templates.set('consumable_potion', {
      id: 'template_consumable_potion',
      name: 'Health Potion',
      description: 'Restores health',
      type: 'consumable',
      rarity: 'common',
      statBoosts: {},
      requirements: {},
      effects: ['heal_50_hp'],
    });

    return templates;
  }

  /**
   * Initialize skill templates
   */
  private initializeSkillTemplates(): Map<string, Skill> {
    const templates = new Map();

    // Combat skills
    templates.set('combat_slash', {
      id: 'template_combat_slash',
      name: 'Slash',
      description: 'A basic sword attack',
      type: 'combat',
      level: 1,
      damage: 10,
      cooldown: 1,
      manaCost: 0,
      effects: ['physical_damage'],
      requirements: { strength: 5 },
    });

    templates.set('combat_power_strike', {
      id: 'template_combat_power_strike',
      name: 'Power Strike',
      description: 'A powerful blow with added force',
      type: 'combat',
      level: 5,
      damage: 25,
      cooldown: 3,
      manaCost: 10,
      effects: ['high_damage', 'knockback'],
      requirements: { strength: 15, level: 5 },
    });

    templates.set('combat_blade_dance', {
      id: 'template_combat_blade_dance',
      name: 'Blade Dance',
      description: 'Rapid consecutive strikes',
      type: 'combat',
      level: 15,
      damage: 40,
      cooldown: 5,
      manaCost: 20,
      effects: ['multi_hit', 'bleed'],
      requirements: { strength: 25, dexterity: 20, level: 15 },
    });

    // Magic skills
    templates.set('magic_fireball', {
      id: 'template_magic_fireball',
      name: 'Fireball',
      description: 'Launches a ball of fire',
      type: 'magic',
      level: 3,
      damage: 20,
      cooldown: 2,
      manaCost: 15,
      effects: ['fire_damage', 'area_effect'],
      requirements: { intelligence: 10 },
    });

    templates.set('magic_ice_shard', {
      id: 'template_magic_ice_shard',
      name: 'Ice Shard',
      description: 'Shoots sharp ice crystals',
      type: 'magic',
      level: 5,
      damage: 25,
      cooldown: 2,
      manaCost: 15,
      effects: ['ice_damage', 'slow'],
      requirements: { intelligence: 12 },
    });

    templates.set('magic_lightning', {
      id: 'template_magic_lightning',
      name: 'Lightning Bolt',
      description: 'Strikes with lightning',
      type: 'magic',
      level: 10,
      damage: 35,
      cooldown: 4,
      manaCost: 25,
      effects: ['lightning_damage', 'stun'],
      requirements: { intelligence: 20, level: 10 },
    });

    // Stealth skills
    templates.set('stealth_sneak', {
      id: 'template_stealth_sneak',
      name: 'Sneak',
      description: 'Move silently',
      type: 'stealth',
      level: 1,
      damage: 0,
      cooldown: 0,
      manaCost: 5,
      effects: ['invisibility', 'stealth'],
      requirements: { dexterity: 5 },
    });

    templates.set('stealth_backstab', {
      id: 'template_stealth_backstab',
      name: 'Backstab',
      description: 'Critical hit from behind',
      type: 'stealth',
      level: 7,
      damage: 50,
      cooldown: 5,
      manaCost: 20,
      effects: ['critical_damage', 'stealth_break'],
      requirements: { dexterity: 25, level: 7 },
    });

    // Support skills
    templates.set('support_heal', {
      id: 'template_support_heal',
      name: 'Heal',
      description: 'Restores health to ally',
      type: 'support',
      level: 1,
      damage: 0,
      cooldown: 3,
      manaCost: 15,
      effects: ['heal_ally', 'restore_health'],
      requirements: { charisma: 5 },
    });

    templates.set('support_buff', {
      id: 'template_support_buff',
      name: 'Blessing',
      description: 'Increases ally stats',
      type: 'support',
      level: 5,
      damage: 0,
      cooldown: 10,
      manaCost: 30,
      effects: ['stat_boost', 'duration_30s'],
      requirements: { charisma: 15, level: 5 },
    });

    return templates;
  }

  /**
   * Initialize ability chains
   */
  private initializeAbilityChains(): AbilityChain[] {
    return [
      {
        id: 'warrior_chain',
        name: 'Warrior Path',
        abilities: ['combat_slash', 'combat_power_strike', 'combat_blade_dance'],
        synergy: 80,
        ultimate: 'warrior_fury',
      },
      {
        id: 'mage_chain',
        name: 'Mage Path',
        abilities: ['magic_fireball', 'magic_ice_shard', 'magic_lightning'],
        synergy: 85,
        ultimate: 'arcane_explosion',
      },
      {
        id: 'rogue_chain',
        name: 'Rogue Path',
        abilities: ['stealth_sneak', 'stealth_backstab'],
        synergy: 75,
        ultimate: 'assassinate',
      },
      {
        id: 'healer_chain',
        name: 'Healer Path',
        abilities: ['support_heal', 'support_buff'],
        synergy: 90,
        ultimate: 'divine_protection',
      },
    ];
  }

  /**
   * Generate a random item with specified parameters
   */
  generateItem(type?: string, minRarity?: string): Item {
    const rarityKey = this.selectRarity(minRarity);
    const rarity = this.rarityTiers.get(rarityKey)!;
    
    // Select template based on type
    let templateKey: string;
    const templateKeys = Array.from(this.itemTemplates.keys());
    
    if (type) {
      const typeTemplates = templateKeys.filter(k => this.itemTemplates.get(k)!.type === type);
      templateKey = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
    } else {
      templateKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
    }

    const template = this.itemTemplates.get(templateKey)!;
    const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Apply rarity modifiers
    const statBoosts: CharacterStat = { ...template.statBoosts };
    const statKeys = Object.keys(statBoosts) as (keyof CharacterStat)[];
    for (const stat of statKeys) {
      const value = statBoosts[stat];
      if (typeof value === 'number') {
        statBoosts[stat] = Math.round(value * rarity.bonusMultiplier) as any;
      }
    }

    const item: Item = {
      id: itemId,
      name: `${rarity.descriptionPrefix} ${template.name}`,
      description: `${rarity.descriptionPrefix} version of ${template.name} with enhanced properties.`,
      type: template.type,
      rarity: rarity.tier as any,
      world: 'vr',
      canExtract: true,
      statBoosts,
      requirements: { ...template.requirements },
      effects: [...(template.effects || [])],
    };

    this.generatedItems.set(itemId, item);
    return item;
  }

  /**
   * Generate a random skill
   */
  generateSkill(category?: string, minLevel?: number): Skill {
    const templateKeys = Array.from(this.skillTemplates.keys());
    let templateKey: string;

    if (category) {
      const categoryTemplates = templateKeys.filter(k => this.skillTemplates.get(k)!.type === category);
      templateKey = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
    } else {
      templateKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
    }

    const template = this.skillTemplates.get(templateKey)!;
    const skillId = `skill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Apply level modifier if specified
    let skill = { ...template };
    if (minLevel && skill.level < minLevel) {
      skill.level = minLevel;
      skill.damage = Math.round((skill.damage || 0) * (1 + (minLevel - template.level) * 0.1));
      skill.manaCost = Math.round((skill.manaCost || 0) * (1 + (minLevel - template.level) * 0.05));
    }

    skill.id = skillId;
    this.generatedSkills.set(skillId, skill);
    return skill;
  }

  /**
   * Generate a unique legendary item
   */
  generateLegendaryItem(baseType: string): Item {
    const itemId = `legendary_${Date.now()}`;
    const template = this.itemTemplates.get(baseType);
    
    if (!template) {
      return this.generateItem(baseType, 'legendary');
    }

    const legendaryNames = [
      'Excalibur', 'Frostmourne', 'Stormbringer', 'Shadowbane',
      'Lightbringer', 'Doombringer', 'Soulkeeper', 'Voidwalker',
    ];

    const templateStatBoosts = template.statBoosts || {};
    const item: Item = {
      id: itemId,
      name: legendaryNames[Math.floor(Math.random() * legendaryNames.length)],
      description: `A legendary ${template.type} of immense power. Only the worthy may wield it.`,
      type: template.type,
      rarity: 'legendary',
      world: 'vr',
      canExtract: true,
      statBoosts: {
        ...templateStatBoosts,
        strength: (templateStatBoosts.strength || 0) + 30,
        intelligence: (templateStatBoosts.intelligence || 0) + 30,
        dexterity: (templateStatBoosts.dexterity || 0) + 30,
        constitution: (templateStatBoosts.constitution || 0) + 30,
        attack: (templateStatBoosts.attack || 0) + 50,
        magicAttack: (templateStatBoosts.magicAttack || 0) + 50,
        defense: (templateStatBoosts.defense || 0) + 40,
      },
      requirements: {
        level: 20,
        ...template.requirements,
      },
      effects: [...(template.effects || []), 'legendary_aura', 'special_ability'],
    };

    this.generatedItems.set(itemId, item);
    return item;
  }

  /**
   * Select rarity based on minimum tier
   */
  private selectRarity(minRarity?: string): string {
    const tiers = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'unique'];
    const minIndex = minRarity ? tiers.indexOf(minRarity) : 0;
    
    // Weighted random selection
    const weights = [60, 25, 10, 4, 0.9, 0.1];
    const availableWeights = weights.slice(minIndex);
    const totalWeight = availableWeights.reduce((a, b) => a + b, 0);
    
    let random = Math.random() * totalWeight;
    let selectedIndex = minIndex;
    
    for (let i = minIndex; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }
    
    return tiers[selectedIndex];
  }

  /**
   * Get generated item by ID
   */
  getItem(itemId: string): Item | null {
    return this.generatedItems.get(itemId) || null;
  }

  /**
   * Get generated skill by ID
   */
  getSkill(skillId: string): Skill | null {
    return this.generatedSkills.get(skillId) || null;
  }

  /**
   * Get all generated items
   */
  getAllItems(): Item[] {
    return Array.from(this.generatedItems.values());
  }

  /**
   * Get all generated skills
   */
  getAllSkills(): Skill[] {
    return Array.from(this.generatedSkills.values());
  }

  /**
   * Generate ability chain progression
   */
  generateAbilityChain(chainId: string): { skills: Skill[]; ultimate: Ability } {
    const chain = this.abilityChains.find(c => c.id === chainId);
    if (!chain) {
      return { skills: [], ultimate: { id: '', name: '', description: '', type: 'active', unlockLevel: 0 } };
    }

    const skills = chain.abilities.map(abilityId => {
      const template = this.skillTemplates.get(abilityId);
      if (template) {
        return this.generateSkill(template.category, template.level);
      }
      return null;
    }).filter(s => s !== null) as Skill[];

    const ultimate: Ability = {
      id: `ultimate_${chainId}`,
      name: chain.ultimate.replace('_', ' ').toUpperCase(),
      description: `The ultimate ability of the ${chain.name}, devastatingly powerful.`,
      type: 'active',
      unlockLevel: 20,
      effects: ['massive_damage', 'special_effect', 'cooldown_60s'],
    };

    return { skills, ultimate };
  }
}

export default ItemSystem;