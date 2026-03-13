import Anthropic from '@anthropic-ai/sdk';
import type { StoredChapter, StoryConfig } from './storage.js';

interface GenerateOptions {
  chapterNumber: number;
  world: 'real' | 'vr';
  previousChapter: StoredChapter | null;
  allChapters: StoredChapter[];
  storyConfig: StoryConfig;
}

const STORY_BIBLE = `
You are the narrative engine for "Endless Story Engine" — an infinite, serialized dark fantasy / LitRPG web novel.

CORE STORY:
- Protagonist: Kael, a young man whose sister Yuna lies in a coma after a mysterious accident
- Kael receives a VR headset and logs into "Eclipsis Online," the world's most popular VRMMORPG
- The system assigns him a forbidden class: Vampire Progenitor — a remnant of an abandoned expansion that shouldn't exist
- As Kael progresses in the VR world, his in-game powers begin bleeding into reality (stat-merging)
- His agility increases, senses sharpen, eyes adjust to darkness. Skills learned in-game affect his real body
- The line between the VR world and reality thins over time

KEY CHARACTERS:
- Kael: Protagonist. Carries grief and determination. Becomes increasingly powerful but haunted
- Yuna: Kael's sister, in a coma. May have a deeper connection to Eclipsis Online than anyone knows
- Alex: Kael's best friend, supportive but growing worried about changes in Kael
- NPCs in Eclipsis Online: Various guild leaders, merchants, quest givers, rivals, and mysterious figures

DUAL-WORLD STRUCTURE:
- Chapters alternate between "real" world (Kael's apartment, hospital, city) and "vr" world (Eclipsis Online)
- Real world chapters: Focus on Kael's daily life, hospital visits, relationships, and the growing reality bleed
- VR world chapters: Focus on quests, combat, leveling up, discovering lore, meeting NPCs, dungeon crawling
- The worlds should gradually feel more connected as the story progresses

TONE: Dark, atmospheric, emotionally grounded. Moments of hope cut with tension. The VR world feels vivid and dangerous. The real world feels lonely and desperate.

LITRPG ELEMENTS (VR chapters):
- Include system notifications, stat changes, skill unlocks, and level-ups naturally woven into the narrative
- Format system messages in **bold** or with [System] tags
- Show Kael discovering new abilities and their costs (blood essence, mana, etc.)
- Include quest updates and progression

WRITING STYLE:
- Third person limited (Kael's perspective)
- Vivid sensory details
- Short, punchy dialogue mixed with internal reflection
- End each chapter with a hook or cliffhanger
- Each chapter should feel complete yet leave the reader wanting more
`;

export class AIChapterGenerator {
  private client: Anthropic | null = null;

  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic();
    }
  }

  updateApiKey(key: string) {
    process.env.ANTHROPIC_API_KEY = key;
    this.client = new Anthropic({ apiKey: key });
  }

  async generateChapter(options: GenerateOptions): Promise<StoredChapter> {
    const { chapterNumber, world, previousChapter, allChapters, storyConfig } = options;

    if (!this.client) {
      throw new Error(
        'Anthropic API key not configured. Set ANTHROPIC_API_KEY environment variable or use the admin panel.'
      );
    }

    const lengthGuide = {
      short: '800-1000 words',
      medium: '1200-1800 words',
      long: '2000-3000 words',
    };

    // Build context from previous chapters (last 3 summaries + full previous chapter)
    let contextBlock = '';
    if (allChapters.length > 0) {
      const recentSummaries = allChapters
        .slice(-5)
        .map((ch) => `Chapter ${ch.chapterNumber} (${ch.world}): ${ch.summary}`)
        .join('\n');

      contextBlock = `
PREVIOUS CHAPTER SUMMARIES:
${recentSummaries}

MOST RECENT CHAPTER (Chapter ${previousChapter?.chapterNumber}):
Title: ${previousChapter?.title}
World: ${previousChapter?.world}
Content (last 500 chars): ...${previousChapter?.content.slice(-500)}
Characters: ${previousChapter?.characters.join(', ')}
Locations: ${previousChapter?.locations.join(', ')}
`;
    }

    const toneMap = {
      dark: 'Dark, gritty, and atmospheric. Emphasize tension and emotional weight.',
      neutral: 'Balanced between light and dark. Mix hope with challenge.',
      light: 'More hopeful and adventurous, though still grounded in the story stakes.',
    };

    const prompt = `Write Chapter ${chapterNumber} of the story.

WORLD: ${world === 'vr' ? 'VR World (Eclipsis Online)' : 'Real World'}
TARGET LENGTH: ${lengthGuide[storyConfig.chapterLength]}
TONE: ${toneMap[storyConfig.tone]}
PACING: ${storyConfig.pacing}/10 (${storyConfig.pacing <= 3 ? 'slow, contemplative' : storyConfig.pacing <= 6 ? 'moderate, building' : 'fast-paced, action-driven'})
TENSION: ${storyConfig.tension}/10 (${storyConfig.tension <= 3 ? 'low, slice-of-life' : storyConfig.tension <= 6 ? 'moderate, something brewing' : 'high, critical events'})

${storyConfig.storyPrompt ? `ADMIN STORY DIRECTION: ${storyConfig.storyPrompt}` : ''}

${contextBlock}

REQUIREMENTS:
1. Write ONLY the chapter content — no meta-commentary
2. Title the chapter as "Chapter ${chapterNumber}: [Your Title]"
3. ${world === 'vr' ? 'Include LitRPG system messages naturally in the narrative (stats, skills, notifications)' : 'Focus on real-world consequences and character development'}
4. End with a hook or cliffhanger
5. Maintain continuity with previous chapters
6. Advance the plot meaningfully

Respond in this exact JSON format:
{
  "title": "Chapter ${chapterNumber}: [Title]",
  "content": "[Full chapter content with proper paragraphs separated by double newlines]",
  "summary": "[2-3 sentence summary of key events]",
  "characters": ["list", "of", "characters", "appearing"],
  "locations": ["list", "of", "locations"]
}`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: STORY_BIBLE + '\n\n' + prompt,
        },
      ],
    });

    // Extract the text content
    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from AI');
    }

    // Parse JSON from response
    let parsed: {
      title: string;
      content: string;
      summary: string;
      characters: string[];
      locations: string[];
    };

    try {
      // Try to extract JSON from the response (it might be wrapped in markdown code blocks)
      let jsonStr = textBlock.text;
      const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      // Also try to find raw JSON object
      const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, use the raw text as content
      parsed = {
        title: `Chapter ${chapterNumber}: Untitled`,
        content: textBlock.text,
        summary: 'Chapter generated by AI.',
        characters: previousChapter?.characters || ['Kael'],
        locations: previousChapter?.locations || [],
      };
    }

    return {
      id: `ch-${chapterNumber}`,
      chapterNumber,
      title: parsed.title,
      content: parsed.content,
      wordCount: parsed.content.split(/\s+/).length,
      world,
      summary: parsed.summary,
      characters: parsed.characters,
      locations: parsed.locations,
      createdAt: new Date().toISOString(),
    };
  }
}
