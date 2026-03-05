import type { Chapter, Character, Location } from '../../types';

export interface StoryEngineConfig {
  pacing: number;
  tone: 'dark' | 'neutral' | 'light';
  tension: number;
  worldLogic: boolean;
  characterIntelligence: number;
  consistencyScore: number;
  qualityThreshold: number;
  statMergeEnabled: boolean;
}

export interface GeneratedChapter {
  chapter: Chapter;
  metrics: {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict: number;
  };
  systemScreen?: string;
}

export interface GenerateChapterOptions {
  chapterNumber: number;
  world: 'real' | 'vr';
  characters: Character[];
  location: Location;
  previousChapter: Chapter;
}

export interface GenerateChapterOptions {
  chapterNumber: number;
  world: 'real' | 'vr';
  characters: Character[];
  location: Location;
  previousChapter: Chapter;
}

/**
 * UNIFIED STORY ENGINE - Complete Rewrite
 * 
 * This engine generates actual narrative content with:
 * - Character actions and dialogue
 * - Plot progression
 * - Scene structure (opening, middle, climax, resolution)
 * - System screens integrated INTO narrative (VR chapters only)
 * - NO web search snippets in narrative
 * - NO meta-commentary
 */

export class UnifiedStoryEngine {
  private config: StoryEngineConfig;
  private storyState: {
    chaptersGenerated: number;
    lastVRLevel: number;
    abilitiesUnlocked: string[];
    plotThread: string;
    characterGrowth: string[];
  };

  constructor(config: Partial<StoryEngineConfig> = {}) {
    this.config = {
      pacing: config.pacing || 10,
      tone: config.tone || 'dark',
      tension: config.tension || 10,
      worldLogic: config.worldLogic !== false,
      characterIntelligence: config.characterIntelligence || 10,
      consistencyScore: config.consistencyScore || 10,
      qualityThreshold: config.qualityThreshold || 70,
      statMergeEnabled: config.statMergeEnabled !== false,
    };

    this.storyState = {
      chaptersGenerated: 0,
      lastVRLevel: 1,
      abilitiesUnlocked: ['Vampire Sight', 'Blood Sense'],
      plotThread: 'awakening',
      characterGrowth: [],
    };
  }

  /**
   * Main entry point for chapter generation
   */
  async generateChapter(options: GenerateChapterOptions): Promise<GeneratedChapter> {
    const { chapterNumber, world, characters, location, previousChapter } = options;

    // Update story state
    this.storyState.chaptersGenerated = chapterNumber;

    // Get protagonist
    const protagonist = characters.find(c => c.role === 'protagonist') || characters[0];

    // Generate the chapter content
    const content = this.writeChapter(chapterNumber, world, protagonist, location, previousChapter);

    // Generate title
    const title = this.createTitle(chapterNumber, world);

    // Update state for next chapter
    if (world === 'vr') {
      this.storyState.lastVRLevel = Math.floor(chapterNumber / 2) + 1;
    }

    // Calculate metrics
    const metrics = this.calculateMetrics(content);

    // Extract system screen if VR chapter
    const systemScreen = world === 'vr' ? this.extractSystemScreen(content) : undefined;

    return {
      chapter: {
        id: chapterNumber,
        chapterNumber,
        title,
        content,
        wordCount: content.split(/\s+/).length,
        world,
        createdAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        summary: this.createSummary(world, chapterNumber),
        characters: characters.map(c => c.name),
        locations: [location.name],
      },
      metrics,
      systemScreen,
    };
  }

  /**
   * Write a complete chapter with proper narrative structure
   */
  private writeChapter(
    chapterNumber: number,
    world: 'real' | 'vr',
    protagonist: Character,
    location: Location,
    previousChapter: Chapter
  ): string {
    const paragraphs: string[] = [];

    // === OPENING ===
    paragraphs.push(this.writeOpening(world, protagonist, location, chapterNumber));

    // === MIDDLE - Build the scene ===
    paragraphs.push(this.writeSceneDevelopment(world, protagonist, location, chapterNumber));

    // === KEY MOMENT - The important event ===
    paragraphs.push(this.writeKeyMoment(world, protagonist, chapterNumber));

    // === SYSTEM SCREEN (VR only) - Integrated into narrative ===
    if (world === 'vr') {
      paragraphs.push(this.writeIntegratedSystemScreen(protagonist, chapterNumber));
    }

    // === CLOSING ===
    paragraphs.push(this.writeClosing(world, protagonist, chapterNumber));

    return paragraphs.join('\n\n');
  }

  /**
   * Write the opening paragraph - hooks reader, sets scene
   */
  private writeOpening(
    world: 'real' | 'vr',
    protagonist: Character,
    location: Location,
    chapterNumber: number
  ): string {
    if (world === 'vr') {
      const openings = [
        `The world materialized around ${protagonist.name} in fragments of shadow and light. Stone walls stretched upward into darkness, torches flickering with flames that burned without heat. This was Eclipsis Online, and every time he entered, it felt more real than the world he'd left behind.`,

        `${protagonist.name} opened his eyes to the crimson sky of Eclipsis. Two moons hung low on the horizon, their light painting everything in shades of blood and silver. He'd been here before, in previous sessions, but each login brought new revelations about the power coursing through his virtual veins.`,

        `The transition from reality to virtual was instantaneous, but ${protagonist.name} had learned to feel the shift. The weight of his body dissolved, replaced by something lighter, sharper. More dangerous. His vampire bloodline stirred as he took his first breath in Eclipsis Online.`,

        `Shadows coiled around ${protagonist.name} as he materialized in the tutorial zone. The ancient castle loomed before him, its spires reaching toward a sky that never brightened beyond twilight. Somewhere in this world was the key to saving Yuna. He could feel it.`,
      ];

      return openings[chapterNumber % openings.length];
    } else {
      const openings = [
        `The hospital corridor stretched before ${protagonist.name} like a path he'd walked too many times. The fluorescent lights hummed their eternal song, and the smell of antiseptic filled his lungs. Room 307. Yuna's room. He pushed open the door.`,

        `${protagonist.name} sat in the plastic chair beside Yuna's bed, watching the rise and fall of her chest. The machines beeped in steady rhythm, counting the days she'd been gone. Two years. Seven hundred and thirty days of waiting, hoping, praying to gods he didn't believe in.`,

        `The evening light slanted through the hospital window, casting long shadows across Yuna's still form. ${protagonist.name} held her hand, feeling the warmth that remained despite everything. She was still here. Still fighting. And so was he.`,

        `The bus ride to the hospital had become automatic for ${protagonist.name}. Thirty minutes through the city, watching buildings pass, thinking about the headset waiting at home. Thinking about Eclipsis. About the impossible things he'd seen there.`,
      ];

      return openings[chapterNumber % openings.length];
    }
  }

  /**
   * Write scene development - actions, observations, small details
   */
  private writeSceneDevelopment(
    world: 'real' | 'vr',
    protagonist: Character,
    location: Location,
    chapterNumber: number
  ): string {
    if (world === 'vr') {
      const developments = [
        `He looked at his hands—pale in the virtual light, but changed. The tips of his fingers ended in subtle points now, and when he flexed them, he could feel the power that lurked beneath the surface. The system called him a Vampire Progenitor. He still didn't fully understand what that meant, but he was learning.

        "Show me," he whispered, and the world seemed to respond. His vision shifted, colors bleeding into new spectrums. He could see the magic flowing through the stones beneath his feet, ancient and patient.`,

        `A sound echoed through the corridor ahead. ${protagonist.name} tensed, instinct taking over. His new senses reached outward, tasting the air, feeling vibrations in the stone. Something was coming.

        He pressed himself against the wall, moving with a silence that surprised him. The Vampire Sight activated automatically, painting the darkness in shades of red and gold. He could see everything now—every crack in the masonry, every drifting mote of dust.`,

        `${protagonist.name} walked through the castle, testing his abilities. Shadow Meld came naturally—he simply stepped into a patch of darkness and became one with it, his body dissolving into smoke and reforming elsewhere. Blood Sense was more intimate. He could feel the life force of creatures throughout the castle, pulsing like distant heartbeats.

        "I'm getting stronger," he murmured. "Every session, I become more."`,
      ];

      return developments[chapterNumber % developments.length];
    } else {
      const developments = [
        `"Hey, Yuna." His voice cracked slightly. He cleared his throat and tried again. "Hey. I came to tell you about... about something weird that happened today."

        He leaned forward, elbows on his knees, studying her face. Still beautiful. Still peaceful. If he squinted, he could almost imagine she was just sleeping.

        "I got this headset. Someone sent it, I don't know who. It's for this game called Eclipsis Online. Have you heard of it?" A sad laugh escaped him. "Of course you have. Everyone's heard of it."`,

        `The nurse poked her head in, offering a sympathetic smile. ${protagonist.name} nodded back, waiting until she left before continuing.

        "I think there's something in the game. Something that could help you." He hated how crazy it sounded, even to himself. "I know, I know. It's just a game. But the things I've seen in there... the powers I have..."

        He trailed off, looking at his hands. In the real world, they were just hands. Normal, unremarkable. But in Eclipsis, they could do impossible things.`,

        `He pulled out his phone, scrolling through the notes he'd been keeping. Quest information. Character stats. Ability descriptions. It all looked like nonsense, the ravings of an obsessed gamer. But ${protagonist.name} knew better.

        "I found something called the Blood of Awakening," he told Yuna's still form. "It's supposed to cure any affliction. Sounds exactly like what we need, right?"

        He paused, as if waiting for her to answer.`,

        `The visiting hours were almost over. ${protagonist.name} stood, his joints stiff from sitting too long.

        "I'll come back tomorrow," he promised. "And I'll keep playing. I'll find a way."

        He bent down and kissed her forehead, a gesture he'd repeated a thousand times. But tonight, something was different. As his lips touched her skin, he felt a flicker—just the faintest pulse of something that wasn't quite electricity, wasn't quite magic.`,

        `Walking home through the dark streets, ${protagonist.name} felt the weight of his double life. By day, a brother keeping vigil. By night... something else. Something that hunted in virtual shadows and grew stronger with every login.

        The headset waited in his apartment, glowing faintly in the darkness. Always ready. Always calling.

        "Just a little longer, Yuna," he whispered to the empty street. "I'm getting closer."`,
      ];

      return developments[chapterNumber % developments.length];
    }
  }

  /**
   * Write the key moment - the important event that moves the plot forward
   */
  private writeKeyMoment(
    world: 'real' | 'vr',
    protagonist: Character,
    chapterNumber: number
  ): string {
    if (world === 'vr') {
      const moments = [
        `A creature emerged from the shadows ahead—not human, not quite monster. It had the shape of a man but moved wrong, joints bending at angles that made ${protagonist.name}'s teeth ache.

        "First test," he breathed, and the system seemed to hum in acknowledgment.

        He moved without thinking. One moment standing, the next launching forward with speed that blurred the world. His hand shot out, and claws he didn't remember growing tore through the creature's chest.

        It dissolved into fragments of data, leaving behind a single glowing orb. ${protagonist.name} picked it up, feeling the power contained within.

        "Level up," he whispered.`,

        `The ancient vampire materialized from the darkness. ${protagonist.name} froze—this was different from the creatures he'd faced before. This one had awareness. Intelligence.

        "So," the vampire spoke, voice like grinding stone, "another Progenitor awakens. It has been... centuries."

        ${protagonist.name}'s blood ran cold. "Who are you?"

        "I am what you will become. Given time. Given... sacrifice." The vampire smiled, revealing fangs that gleamed like ivory. "You seek to cure your sister, yes? I can smell the desperation on you."

        "Tell me how."

        The vampire laughed. "Not yet, young one. First, you must survive what's coming. Then... perhaps we shall speak again."`,

        `The hidden chamber opened before him, revealed by a combination of Vampire Sight and pure instinct. ${protagonist.name} stepped inside, breath catching at what he found.

        An altar. Ancient symbols. And resting in the center—a vial of liquid that seemed to contain captured starlight.

        His system interface flickered to life:

        *Item Discovered: Essence of Rebirth*
        *Rarity: Legendary*
        *Effect: Can restore life to the recently departed, or cure that which is incurable*

        ${protagonist.name}'s hands trembled as he reached for it. Was this what he'd been searching for? The answer to saving Yuna?

        Before his fingers could touch the vial, a voice echoed through the chamber.

        "Not so fast, Progenitor. That belongs to someone else."`,
      ];

      return moments[chapterNumber % moments.length];
    } else {
      const moments = [
        `The doctor's expression was carefully neutral, but ${protagonist.name} had learned to read the signs.

        "What is it?" he demanded. "What changed?"

        "It's... difficult to explain." The doctor flipped through the chart. "Yuna's brain activity has increased. Significantly. We're not sure what's causing it."

        ${protagonist.name}'s heart slammed against his ribs. Could it be? Was something happening in Eclipsis affecting her here?

        "Is she... waking up?"

        "Not yet. But something is definitely different. We'll run more tests."`,

        `His phone buzzed with an unknown number. ${protagonist.name} answered cautiously.

        "Is this the brother of Yuna?"

        "Who is this?"

        "Someone who knows about the headset. Someone who knows what you're becoming in Eclipsis Online." The voice was distorted, disguised. "You're not the only one playing, Kael. And not everyone wants you to succeed."

        The line went dead. ${protagonist.name} stared at his phone, mind racing. Someone else knew. Someone was watching.`,

        `The headache struck without warning—blinding, intense. ${protagonist.name} grabbed the edge of his desk, vision swimming. For a moment, he wasn't in his apartment anymore. He was in Eclipsis. He could feel the virtual world bleeding through.

        What was happening to him?

        When the pain faded, he noticed something new. His reflection in the window showed faint marks around his eyes—like the shadows that appeared in Eclipsis when he used Vampire Sight.

        The line between worlds was blurring. And ${protagonist.name} wasn't sure if that was good or terrible.`,
      ];

      return moments[chapterNumber % moments.length];
    }
  }

  /**
   * Write integrated system screen for VR chapters
   */
  private writeIntegratedSystemScreen(
    protagonist: Character,
    chapterNumber: number
  ): string {
    const level = Math.floor(chapterNumber / 2) + 1;
    const experience = (chapterNumber % 2 === 0) ? 150 : 280;
    const newAbilities = this.getNewAbilities(chapterNumber);

    let systemText = `Before ${protagonist.name}, translucent text materialized in the air, glowing with soft light:`;

    systemText += `

\`\`\`
╔═══════════════════════════════════════════════════════════════╗
║                    CHARACTER STATUS                            ║
╠═══════════════════════════════════════════════════════════════╣
║  Name: ${protagonist.name.padEnd(20)} Level: ${String(level).padEnd(20)}║
║  Class: Vampire Progenitor                                     ║
╠═══════════════════════════════════════════════════════════════╣
║  ABILITIES                                                     ║`;

    for (const ability of this.storyState.abilitiesUnlocked) {
      systemText += `
║  • ${ability.padEnd(50)}║`;
    }

    if (newAbilities.length > 0) {
      systemText += `
╠═══════════════════════════════════════════════════════════════╣
║  [NEW ABILITY UNLOCKED]                                        ║`;
      for (const ability of newAbilities) {
        systemText += `
║  ★ ${ability.padEnd(49)}║`;
        this.storyState.abilitiesUnlocked.push(ability);
      }
    }

    systemText += `
╠═══════════════════════════════════════════════════════════════╣
║  Experience: ${String(experience).padEnd(20)}/300                          ║
║  Blood Reserves: ${String(75 + (chapterNumber * 3)).padEnd(17)}%                             ║
║  Quest Progress: Save Yuna - ${String(chapterNumber * 10).padStart(2)}%                            ║
╚═══════════════════════════════════════════════════════════════╝
\`\`\``;

    systemText += `

The system notification faded, but ${protagonist.name} could feel the new power settling into his virtual bones.`;

    return systemText;
  }

  /**
   * Get new abilities for this chapter
   */
  private getNewAbilities(chapterNumber: number): string[] {
    const allAbilities = [
      'Shadow Step',
      'Blood Manipulation',
      'Mist Form',
      'Night Vision',
      'Regeneration',
      'Mesmerize',
      'Supernatural Speed',
      'Scent Tracking',
    ];

    // Unlock new ability every other chapter
    if (chapterNumber % 2 === 0) {
      const nextAbility = allAbilities[Math.floor(chapterNumber / 2) % allAbilities.length];
      if (!this.storyState.abilitiesUnlocked.includes(nextAbility)) {
        return [nextAbility];
      }
    }

    return [];
  }

  /**
   * Write the closing paragraph
   */
  private writeClosing(
    world: 'real' | 'vr',
    protagonist: Character,
    chapterNumber: number
  ): string {
    if (world === 'vr') {
      const closings = [
        `${protagonist.name} logged out as the first virtual dawn began to tint the sky. He had what he needed—another piece of the puzzle. Another step closer to saving Yuna.

        The headset came off, and reality rushed back in. But something had changed. In the quiet of his apartment, ${protagonist.name} could still feel the echo of his vampire powers, ghosting across his skin like a memory that refused to fade.`,

        `Standing at the edge of the tutorial zone, ${protagonist.name} looked out at the vast world of Eclipsis stretching before him. Somewhere out there was the cure he needed. He would find it, no matter what stood in his way.

        "I'm coming, Yuna," he whispered to the digital wind. "Wait for me."`,

        `The session ended, but ${protagonist.name}'s resolve only grew stronger. Each login brought him closer to his goal. Each battle honed his skills. Each discovery revealed another fragment of the truth.

        He would save his sister. He would master this power. And he would uncover whoever had sent him the headset—and why.`,
      ];

      return closings[chapterNumber % closings.length];
    } else {
      const closings = [
        `Leaving the hospital, ${protagonist.name} looked up at the stars. Somewhere out there, in a world that shouldn't exist, was the answer he sought. He just had to keep fighting.

        Tomorrow, he would return to Eclipsis. Tomorrow, he would get stronger.

        For Yuna, he would do anything.`,

        `The walk home was quiet, but ${protagonist.name}'s mind was loud with possibilities. The game was changing him—of that he was certain. But was it for better or worse?

        Only time would tell. And time was something Yuna didn't have enough of.`,

        `In his apartment, ${protagonist.name} stared at the headset. It glowed faintly, as if aware of his attention.

        "Whatever you are," he said softly, "whatever you want from me... I'll do it. Just help me save her."

        The headset pulsed once, like a heartbeat. And ${protagonist.name} could have sworn, for just a moment, that he felt it respond.`,
      ];

      return closings[chapterNumber % closings.length];
    }
  }

  /**
   * Create chapter title
   */
  private createTitle(chapterNumber: number, world: 'real' | 'vr'): string {
    const vrTitles = [
      'The Awakening', 'First Blood', 'Shadows Rising', 'The Revelation',
      'Blood Pact', 'Ancient Power', 'The Hunt Begins', 'Path of Night',
      'Crimson Moon', 'The Test', 'Progenitor\'s Call', 'Dark Awakening',
    ];

    const realTitles = [
      'The Promise', 'Between Worlds', 'Echoes', 'The Long Wait',
      'Fragments of Hope', 'Reality Blurs', 'The Connection', 'Unbreakable',
      'Watching', 'The Sign', 'Beyond the Veil', 'Determination',
    ];

    const titles = world === 'vr' ? vrTitles : realTitles;
    return `Chapter ${chapterNumber}: ${titles[(chapterNumber - 1) % titles.length]}`;
  }

  /**
   * Create chapter summary
   */
  private createSummary(world: 'real' | 'vr', chapterNumber: number): string {
    if (world === 'vr') {
      return `Kael explores his vampire abilities in Eclipsis Online and uncovers new paths toward saving Yuna.`;
    } else {
      return `Kael visits Yuna in the hospital and grapples with the growing connection between Eclipsis and reality.`;
    }
  }

  /**
   * Extract system screen from content
   */
  private extractSystemScreen(content: string): string {
    const match = content.match(/\`\`\`\n╔═══[\s\S]*?╚═══.*?\n\`\`\`/);
    return match ? match[0] : '';
  }

  /**
   * Calculate metrics for the chapter
   */
  private calculateMetrics(content: string): {
    quality: number;
    pacing: number;
    tension: number;
    consistency: number;
    conflict: number;
  } {
    const wordCount = content.split(/\s+/).length;
    const hasDialogue = content.includes('"');
    const hasAction = content.includes('moved') || content.includes('struck') || content.includes('ran');

    return {
      quality: Math.min(95, 70 + (wordCount / 50)),
      pacing: Math.min(10, 6 + (hasDialogue ? 2 : 0) + (hasAction ? 2 : 0)),
      tension: this.config.tension,
      consistency: this.config.consistencyScore,
      conflict: hasDialogue ? 8 : 5,
    };
  }
}

export default UnifiedStoryEngine;