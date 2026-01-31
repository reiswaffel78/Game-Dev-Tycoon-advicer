import { storage } from "./storage";
import type {
  Topic,
  Genre,
  Platform,
  Audience,
  TopicGenreFit,
  PlatformGenreFit,
  PlatformAudienceFit,
  RecommendationResult,
  SliderPreset,
  PlannerRecommendation,
} from "@shared/schema";

// Score formula weights
const WEIGHTS = {
  topicGenreFit: 0.40,
  platformGenreFit: 0.25,
  platformAudienceFit: 0.20,
  unlockBonus: 0.10,
  costPenalty: 0.05,
};

// Filter threshold: exclude if platform-genre fit <= -2
const PLATFORM_GENRE_FIT_THRESHOLD = -2;

function calculateCostPenalty(platform: Platform): number {
  const licenseCost = platform.licenseCost ?? 0;
  const devCost = platform.devCost ?? 0;
  const totalCost = licenseCost + devCost;
  
  // Normalize cost penalty: higher costs = more negative penalty
  // Max penalty of -1 for very expensive platforms
  if (totalCost >= 500000) return -1;
  if (totalCost >= 200000) return -0.7;
  if (totalCost >= 100000) return -0.4;
  if (totalCost >= 50000) return -0.2;
  return 0;
}

function calculateUnlockBonus(
  topic: Topic,
  genre: Genre,
  platform: Platform,
  currentYear: number = 1
): number {
  // Bonus for items that are unlocked/available
  let bonus = 0;
  
  // Platform availability bonus
  if (platform.releaseYear && platform.releaseYear <= currentYear) {
    bonus += 0.5;
  }
  
  // Topic unlock bonus
  if (topic.unlockYear && topic.unlockYear <= currentYear) {
    bonus += 0.25;
  }
  
  // Genre unlock bonus
  if (genre.unlockYear && genre.unlockYear <= currentYear) {
    bonus += 0.25;
  }
  
  return bonus;
}

function createCitations(
  topicGenreFit: TopicGenreFit | undefined,
  platformGenreFit: PlatformGenreFit | undefined,
  platformAudienceFit: PlatformAudienceFit | undefined
): RecommendationResult["citations"] {
  const citations: RecommendationResult["citations"] = [];
  
  if (topicGenreFit) {
    citations.push({
      component: "Topic-Genre Fit",
      sourceNames: topicGenreFit.sourceIds ?? ["Fandom Wiki"],
      confidence: topicGenreFit.confidence ?? 1.0,
    });
  }
  
  if (platformGenreFit) {
    citations.push({
      component: "Platform-Genre Fit",
      sourceNames: platformGenreFit.sourceIds ?? ["Greenheart Forum"],
      confidence: platformGenreFit.confidence ?? 1.0,
    });
  }
  
  if (platformAudienceFit) {
    citations.push({
      component: "Platform-Audience Fit",
      sourceNames: platformAudienceFit.sourceIds ?? ["Community Wiki"],
      confidence: platformAudienceFit.confidence ?? 1.0,
    });
  }
  
  return citations;
}

export async function getRecommendationsByTopic(
  topicId: string
): Promise<RecommendationResult[]> {
  const topic = await storage.getTopicById(topicId);
  if (!topic) return [];

  const allGenres = await storage.getAllGenres();
  const allPlatforms = await storage.getAllPlatforms();
  const allAudiences = await storage.getAllAudiences();
  const topicGenreFits = await storage.getTopicGenreFitsByTopic(topicId);
  const platformGenreFits = await storage.getPlatformGenreFits();
  const platformAudienceFits = await storage.getPlatformAudienceFits();

  const results: RecommendationResult[] = [];

  for (const genre of allGenres) {
    const tgFit = topicGenreFits.find((f) => f.genreId === genre.id);
    const topicGenreScore = tgFit?.fitValue ?? 0;

    for (const platform of allPlatforms) {
      const pgFit = platformGenreFits.find(
        (f) => f.platformId === platform.id && f.genreId === genre.id
      );
      const platformGenreScore = pgFit?.fitValue ?? 0;

      // Filter out bad platform-genre fits
      if (platformGenreScore <= PLATFORM_GENRE_FIT_THRESHOLD) continue;

      for (const audience of allAudiences) {
        const paFit = platformAudienceFits.find(
          (f) => f.platformId === platform.id && f.audienceId === audience.id
        );
        const platformAudienceScore = paFit?.fitValue ?? 0;

        const unlockBonus = calculateUnlockBonus(topic, genre, platform);
        const costPenalty = calculateCostPenalty(platform);

        const totalScore =
          WEIGHTS.topicGenreFit * topicGenreScore +
          WEIGHTS.platformGenreFit * platformGenreScore +
          WEIGHTS.platformAudienceFit * platformAudienceScore +
          WEIGHTS.unlockBonus * unlockBonus +
          WEIGHTS.costPenalty * costPenalty;

        results.push({
          rank: 0,
          topic,
          genre,
          platform,
          audience,
          scores: {
            topicGenreFit: topicGenreScore,
            platformGenreFit: platformGenreScore,
            platformAudienceFit: platformAudienceScore,
            unlockBonus,
            costPenalty,
            total: totalScore,
          },
          citations: createCitations(tgFit, pgFit, paFit),
        });
      }
    }
  }

  // Sort by total score and take top 3
  results.sort((a, b) => b.scores.total - a.scores.total);
  return results.slice(0, 3).map((r, i) => ({ ...r, rank: i + 1 }));
}

export async function getRecommendationsByGenre(
  genreId: string
): Promise<RecommendationResult[]> {
  const genre = await storage.getGenreById(genreId);
  if (!genre) return [];

  const allTopics = await storage.getAllTopics();
  const allPlatforms = await storage.getAllPlatforms();
  const allAudiences = await storage.getAllAudiences();
  const topicGenreFits = await storage.getTopicGenreFitsByGenre(genreId);
  const platformGenreFits = await storage.getPlatformGenreFitsByGenre(genreId);
  const platformAudienceFits = await storage.getPlatformAudienceFits();

  const results: RecommendationResult[] = [];

  for (const topic of allTopics) {
    const tgFit = topicGenreFits.find((f) => f.topicId === topic.id);
    const topicGenreScore = tgFit?.fitValue ?? 0;

    for (const platform of allPlatforms) {
      const pgFit = platformGenreFits.find((f) => f.platformId === platform.id);
      const platformGenreScore = pgFit?.fitValue ?? 0;

      if (platformGenreScore <= PLATFORM_GENRE_FIT_THRESHOLD) continue;

      for (const audience of allAudiences) {
        const paFit = platformAudienceFits.find(
          (f) => f.platformId === platform.id && f.audienceId === audience.id
        );
        const platformAudienceScore = paFit?.fitValue ?? 0;

        const unlockBonus = calculateUnlockBonus(topic, genre, platform);
        const costPenalty = calculateCostPenalty(platform);

        const totalScore =
          WEIGHTS.topicGenreFit * topicGenreScore +
          WEIGHTS.platformGenreFit * platformGenreScore +
          WEIGHTS.platformAudienceFit * platformAudienceScore +
          WEIGHTS.unlockBonus * unlockBonus +
          WEIGHTS.costPenalty * costPenalty;

        results.push({
          rank: 0,
          topic,
          genre,
          platform,
          audience,
          scores: {
            topicGenreFit: topicGenreScore,
            platformGenreFit: platformGenreScore,
            platformAudienceFit: platformAudienceScore,
            unlockBonus,
            costPenalty,
            total: totalScore,
          },
          citations: createCitations(tgFit, pgFit, paFit),
        });
      }
    }
  }

  results.sort((a, b) => b.scores.total - a.scores.total);
  return results.slice(0, 3).map((r, i) => ({ ...r, rank: i + 1 }));
}

export async function getRecommendationsByPlatform(
  platformId: string
): Promise<RecommendationResult[]> {
  const platform = await storage.getPlatformById(platformId);
  if (!platform) return [];

  const allTopics = await storage.getAllTopics();
  const allGenres = await storage.getAllGenres();
  const allAudiences = await storage.getAllAudiences();
  const topicGenreFits = await storage.getTopicGenreFits();
  const platformGenreFits = await storage.getPlatformGenreFitsByPlatform(platformId);
  const platformAudienceFits = await storage.getPlatformAudienceFitsByPlatform(platformId);

  const results: RecommendationResult[] = [];

  for (const topic of allTopics) {
    for (const genre of allGenres) {
      const tgFit = topicGenreFits.find(
        (f) => f.topicId === topic.id && f.genreId === genre.id
      );
      const topicGenreScore = tgFit?.fitValue ?? 0;

      const pgFit = platformGenreFits.find((f) => f.genreId === genre.id);
      const platformGenreScore = pgFit?.fitValue ?? 0;

      if (platformGenreScore <= PLATFORM_GENRE_FIT_THRESHOLD) continue;

      for (const audience of allAudiences) {
        const paFit = platformAudienceFits.find(
          (f) => f.audienceId === audience.id
        );
        const platformAudienceScore = paFit?.fitValue ?? 0;

        const unlockBonus = calculateUnlockBonus(topic, genre, platform);
        const costPenalty = calculateCostPenalty(platform);

        const totalScore =
          WEIGHTS.topicGenreFit * topicGenreScore +
          WEIGHTS.platformGenreFit * platformGenreScore +
          WEIGHTS.platformAudienceFit * platformAudienceScore +
          WEIGHTS.unlockBonus * unlockBonus +
          WEIGHTS.costPenalty * costPenalty;

        results.push({
          rank: 0,
          topic,
          genre,
          platform,
          audience,
          scores: {
            topicGenreFit: topicGenreScore,
            platformGenreFit: platformGenreScore,
            platformAudienceFit: platformAudienceScore,
            unlockBonus,
            costPenalty,
            total: totalScore,
          },
          citations: createCitations(tgFit, pgFit, paFit),
        });
      }
    }
  }

  results.sort((a, b) => b.scores.total - a.scores.total);
  return results.slice(0, 3).map((r, i) => ({ ...r, rank: i + 1 }));
}

export async function getSliderPresets(genreId: string): Promise<SliderPreset[]> {
  const devWeights = await storage.getGenreDevWeightsByGenre(genreId);
  
  if (devWeights.length === 0) {
    // Return default presets if no data
    return [1, 2, 3].map((stage) => createDefaultPreset(stage));
  }

  return devWeights.map((weight) => {
    const sliders = [
      { name: "Engine", value: weight.engine, importance: getImportance(weight.engine) },
      { name: "Gameplay", value: weight.gameplay, importance: getImportance(weight.gameplay) },
      { name: "Story/Quests", value: weight.storyQuests, importance: getImportance(weight.storyQuests) },
      { name: "Dialogues", value: weight.dialogues, importance: getImportance(weight.dialogues) },
      { name: "Level Design", value: weight.levelDesign, importance: getImportance(weight.levelDesign) },
      { name: "AI", value: weight.ai, importance: getImportance(weight.ai) },
      { name: "World Design", value: weight.worldDesign, importance: getImportance(weight.worldDesign) },
      { name: "Graphics", value: weight.graphics, importance: getImportance(weight.graphics) },
      { name: "Sound", value: weight.sound, importance: getImportance(weight.sound) },
    ].map((s) => ({
      name: s.name,
      value: applyGuardrails(Math.round(s.value * 100), s.importance),
      importance: s.importance,
    }));

    return {
      stage: weight.stage,
      sliders,
      explanation: generateExplanation(weight.stage, sliders),
    };
  });
}

function getImportance(value: number): "high" | "medium" | "low" {
  if (value >= 0.4) return "high";
  if (value >= 0.2) return "medium";
  return "low";
}

function applyGuardrails(value: number, importance: "high" | "medium" | "low"): number {
  // Apply guardrails based on importance
  if (importance === "high") {
    return Math.max(40, Math.min(100, value));
  } else if (importance === "low") {
    return Math.min(20, Math.max(5, value));
  }
  return Math.max(5, Math.min(100, value));
}

function generateExplanation(stage: number, sliders: SliderPreset["sliders"]): string {
  const highSliders = sliders.filter((s) => s.importance === "high").map((s) => s.name);
  const lowSliders = sliders.filter((s) => s.importance === "low").map((s) => s.name);

  const stageDesc = stage === 1 ? "early" : stage === 2 ? "middle" : "final";
  
  let explanation = `In the ${stageDesc} development stage, focus on ${highSliders.slice(0, 2).join(" and ")}.`;
  
  if (lowSliders.length > 0) {
    explanation += ` Keep ${lowSliders.slice(0, 2).join(" and ")} minimal.`;
  }
  
  return explanation;
}

function createDefaultPreset(stage: number): SliderPreset {
  const baseSliders = [
    { name: "Engine", value: 30, importance: "medium" as const },
    { name: "Gameplay", value: 50, importance: "high" as const },
    { name: "Story/Quests", value: 25, importance: "medium" as const },
    { name: "Dialogues", value: 15, importance: "low" as const },
    { name: "Level Design", value: 35, importance: "medium" as const },
    { name: "AI", value: 20, importance: "low" as const },
    { name: "World Design", value: 30, importance: "medium" as const },
    { name: "Graphics", value: 45, importance: "high" as const },
    { name: "Sound", value: 25, importance: "medium" as const },
  ];

  return {
    stage,
    sliders: baseSliders,
    explanation: `Stage ${stage} default preset. Adjust based on your specific genre.`,
  };
}

export async function generatePlannerRecommendations(
  year: number,
  month: number,
  cash: number,
  fans: number,
  unlockedOnly: boolean
): Promise<PlannerRecommendation> {
  const allTopics = await storage.getAllTopics();
  const allGenres = await storage.getAllGenres();
  const allPlatforms = await storage.getAllPlatforms();
  const allAudiences = await storage.getAllAudiences();
  const topicGenreFits = await storage.getTopicGenreFits();
  const platformGenreFits = await storage.getPlatformGenreFits();
  const platformAudienceFits = await storage.getPlatformAudienceFits();

  // Filter platforms by availability
  const availablePlatforms = allPlatforms.filter((p) => {
    if (!p.releaseYear) return true;
    return p.releaseYear <= year;
  });

  // Generate top release combinations
  const combinations: {
    topic: Topic;
    genre: Genre;
    platform: Platform;
    audience: Audience;
    score: number;
  }[] = [];

  for (const topic of allTopics) {
    if (unlockedOnly && topic.unlockYear && topic.unlockYear > year) continue;

    for (const genre of allGenres) {
      if (unlockedOnly && genre.unlockYear && genre.unlockYear > year) continue;

      const tgFit = topicGenreFits.find(
        (f) => f.topicId === topic.id && f.genreId === genre.id
      );
      const topicGenreScore = tgFit?.fitValue ?? 0;

      for (const platform of availablePlatforms) {
        // Check cost constraints
        if (platform.licenseCost && platform.licenseCost > cash) continue;

        const pgFit = platformGenreFits.find(
          (f) => f.platformId === platform.id && f.genreId === genre.id
        );
        const platformGenreScore = pgFit?.fitValue ?? 0;

        if (platformGenreScore <= PLATFORM_GENRE_FIT_THRESHOLD) continue;

        for (const audience of allAudiences) {
          const paFit = platformAudienceFits.find(
            (f) => f.platformId === platform.id && f.audienceId === audience.id
          );
          const platformAudienceScore = paFit?.fitValue ?? 0;

          const score = topicGenreScore + platformGenreScore + platformAudienceScore;

          combinations.push({
            topic,
            genre,
            platform,
            audience,
            score,
          });
        }
      }
    }
  }

  // Sort and take top 10
  combinations.sort((a, b) => b.score - a.score);
  const topCombos = combinations.slice(0, 10);

  // Determine game size based on fans/cash
  const getSize = (index: number): "small" | "medium" | "large" | "aaa" => {
    if (fans < 10000 || cash < 50000) return "small";
    if (fans < 100000 || cash < 200000) return index < 3 ? "medium" : "small";
    if (fans < 500000 || cash < 500000) return index < 2 ? "large" : index < 5 ? "medium" : "small";
    return index < 1 ? "aaa" : index < 3 ? "large" : "medium";
  };

  const releases: PlannerRecommendation["releases"] = topCombos.map((combo, i) => ({
    order: i + 1,
    topic: combo.topic,
    genre: combo.genre,
    platform: combo.platform,
    audience: combo.audience,
    size: getSize(i),
    rationale: `Strong ${combo.genre.name}/${combo.topic.name} combination with good platform fit (Score: ${combo.score > 0 ? "+" : ""}${combo.score}).`,
  }));

  // Research recommendations
  const researchItems: PlannerRecommendation["researchItems"] = [];
  
  // Recommend unlocking high-value topics
  const lockedTopics = allTopics
    .filter((t) => t.unlockYear && t.unlockYear > year && t.researchCost)
    .sort((a, b) => (a.unlockYear ?? 99) - (b.unlockYear ?? 99))
    .slice(0, 2);

  lockedTopics.forEach((topic, i) => {
    researchItems.push({
      order: i + 1,
      name: topic.name,
      type: "topic",
      cost: topic.researchCost ?? 1000,
      rationale: `Unlock ${topic.name} to expand your game portfolio.`,
    });
  });

  // Recommend unlocking genres
  const lockedGenres = allGenres
    .filter((g) => g.unlockYear && g.unlockYear > year && g.researchCost)
    .sort((a, b) => (a.unlockYear ?? 99) - (b.unlockYear ?? 99))
    .slice(0, 2);

  lockedGenres.forEach((genre, i) => {
    researchItems.push({
      order: researchItems.length + 1,
      name: genre.name,
      type: "genre",
      cost: genre.researchCost ?? 1500,
      rationale: `Unlock ${genre.name} genre for new game opportunities.`,
    });
  });

  // Add a feature recommendation
  researchItems.push({
    order: researchItems.length + 1,
    name: "3D Graphics V2",
    type: "feature",
    cost: 50000,
    rationale: "Improves graphics quality for future AAA titles.",
  });

  return {
    releases,
    researchItems: researchItems.slice(0, 5),
  };
}

export async function getTopCombinations(): Promise<
  { topic: Topic; genre: Genre; score: number }[]
> {
  const allTopics = await storage.getAllTopics();
  const allGenres = await storage.getAllGenres();
  const topicGenreFits = await storage.getTopicGenreFits();

  const combinations: { topic: Topic; genre: Genre; score: number }[] = [];

  for (const topic of allTopics) {
    for (const genre of allGenres) {
      const fit = topicGenreFits.find(
        (f) => f.topicId === topic.id && f.genreId === genre.id
      );
      if (fit && fit.fitValue >= 2) {
        combinations.push({
          topic,
          genre,
          score: fit.fitValue,
        });
      }
    }
  }

  combinations.sort((a, b) => b.score - a.score);
  return combinations.slice(0, 5);
}
