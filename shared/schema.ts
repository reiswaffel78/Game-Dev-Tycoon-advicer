import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== Core Entities ====================

export const topics = pgTable("topics", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  unlockYear: integer("unlock_year"),
  unlockMonth: integer("unlock_month"),
  researchCost: integer("research_cost"),
  description: text("description"),
});

export const genres = pgTable("genres", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  unlockYear: integer("unlock_year"),
  unlockMonth: integer("unlock_month"),
  researchCost: integer("research_cost"),
  description: text("description"),
});

export const platforms = pgTable("platforms", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  releaseYear: integer("release_year"),
  releaseMonth: integer("release_month"),
  retireYear: integer("retire_year"),
  retireMonth: integer("retire_month"),
  licenseCost: integer("license_cost"),
  devCost: integer("dev_cost"),
  maxTechLevel: integer("max_tech_level"),
  description: text("description"),
});

export const audiences = pgTable("audiences", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// ==================== Fit/Relationship Tables ====================

// Topic-Genre fit: how well a topic matches with a genre
// Values range from -3 (---) to +3 (+++)
export const topicGenreFits = pgTable("topic_genre_fits", {
  id: varchar("id", { length: 128 }).primaryKey(),
  topicId: varchar("topic_id", { length: 64 }).notNull().references(() => topics.id),
  genreId: varchar("genre_id", { length: 64 }).notNull().references(() => genres.id),
  fitValue: integer("fit_value").notNull(), // -3 to +3
  confidence: real("confidence").default(1.0),
  sourceIds: text("source_ids").array(),
});

// Platform-Genre fit: how well a platform matches with a genre
export const platformGenreFits = pgTable("platform_genre_fits", {
  id: varchar("id", { length: 128 }).primaryKey(),
  platformId: varchar("platform_id", { length: 64 }).notNull().references(() => platforms.id),
  genreId: varchar("genre_id", { length: 64 }).notNull().references(() => genres.id),
  fitValue: integer("fit_value").notNull(), // -3 to +3
  confidence: real("confidence").default(1.0),
  sourceIds: text("source_ids").array(),
});

// Platform-Audience fit: how well a platform matches with an audience
export const platformAudienceFits = pgTable("platform_audience_fits", {
  id: varchar("id", { length: 128 }).primaryKey(),
  platformId: varchar("platform_id", { length: 64 }).notNull().references(() => platforms.id),
  audienceId: varchar("audience_id", { length: 64 }).notNull().references(() => audiences.id),
  fitValue: integer("fit_value").notNull(), // -3 to +3
  confidence: real("confidence").default(1.0),
  sourceIds: text("source_ids").array(),
});

// Genre development weights per stage
export const genreDevWeights = pgTable("genre_dev_weights", {
  id: varchar("id", { length: 128 }).primaryKey(),
  genreId: varchar("genre_id", { length: 64 }).notNull().references(() => genres.id),
  stage: integer("stage").notNull(), // 1, 2, or 3
  engine: real("engine").notNull(),
  gameplay: real("gameplay").notNull(),
  storyQuests: real("story_quests").notNull(),
  dialogues: real("dialogues").notNull(),
  levelDesign: real("level_design").notNull(),
  ai: real("ai").notNull(),
  worldDesign: real("world_design").notNull(),
  graphics: real("graphics").notNull(),
  sound: real("sound").notNull(),
  confidence: real("confidence").default(1.0),
  sourceIds: text("source_ids").array(),
});

// ==================== Data Sources ====================

export const sources = pgTable("sources", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  url: text("url"),
  trustLevel: integer("trust_level").notNull(), // 1-4, higher = more trusted
  lastFetchedAt: timestamp("last_fetched_at"),
  isActive: boolean("is_active").default(true),
});

export const snapshots = pgTable("snapshots", {
  id: varchar("id", { length: 64 }).primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  sourceCount: integer("source_count"),
  factCount: integer("fact_count"),
  notes: text("notes"),
});

// ==================== User Save State for Planner ====================

export const userSaveStates = pgTable("user_save_states", {
  id: varchar("id", { length: 64 }).primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  week: integer("week").notNull(),
  cash: integer("cash").notNull(),
  fans: integer("fans").notNull(),
  ownedPlatforms: text("owned_platforms").array(),
  unlockedTopics: text("unlocked_topics").array(),
  unlockedGenres: text("unlocked_genres").array(),
  researchedItems: text("researched_items").array(),
  teamSkills: jsonb("team_skills"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==================== Insert Schemas ====================

export const insertTopicSchema = createInsertSchema(topics).omit({ });
export const insertGenreSchema = createInsertSchema(genres).omit({ });
export const insertPlatformSchema = createInsertSchema(platforms).omit({ });
export const insertAudienceSchema = createInsertSchema(audiences).omit({ });
export const insertTopicGenreFitSchema = createInsertSchema(topicGenreFits).omit({ });
export const insertPlatformGenreFitSchema = createInsertSchema(platformGenreFits).omit({ });
export const insertPlatformAudienceFitSchema = createInsertSchema(platformAudienceFits).omit({ });
export const insertGenreDevWeightSchema = createInsertSchema(genreDevWeights).omit({ });
export const insertSourceSchema = createInsertSchema(sources).omit({ });
export const insertSnapshotSchema = createInsertSchema(snapshots).omit({ });
export const insertUserSaveStateSchema = createInsertSchema(userSaveStates).omit({ id: true, createdAt: true });

// ==================== Types ====================

export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;

export type Genre = typeof genres.$inferSelect;
export type InsertGenre = z.infer<typeof insertGenreSchema>;

export type Platform = typeof platforms.$inferSelect;
export type InsertPlatform = z.infer<typeof insertPlatformSchema>;

export type Audience = typeof audiences.$inferSelect;
export type InsertAudience = z.infer<typeof insertAudienceSchema>;

export type TopicGenreFit = typeof topicGenreFits.$inferSelect;
export type InsertTopicGenreFit = z.infer<typeof insertTopicGenreFitSchema>;

export type PlatformGenreFit = typeof platformGenreFits.$inferSelect;
export type InsertPlatformGenreFit = z.infer<typeof insertPlatformGenreFitSchema>;

export type PlatformAudienceFit = typeof platformAudienceFits.$inferSelect;
export type InsertPlatformAudienceFit = z.infer<typeof insertPlatformAudienceFitSchema>;

export type GenreDevWeight = typeof genreDevWeights.$inferSelect;
export type InsertGenreDevWeight = z.infer<typeof insertGenreDevWeightSchema>;

export type Source = typeof sources.$inferSelect;
export type InsertSource = z.infer<typeof insertSourceSchema>;

export type Snapshot = typeof snapshots.$inferSelect;
export type InsertSnapshot = z.infer<typeof insertSnapshotSchema>;

export type UserSaveState = typeof userSaveStates.$inferSelect;
export type InsertUserSaveState = z.infer<typeof insertUserSaveStateSchema>;

// ==================== API Response Types ====================

export interface RecommendationResult {
  rank: number;
  topic: Topic;
  genre: Genre;
  platform: Platform;
  audience: Audience;
  scores: {
    topicGenreFit: number;
    platformGenreFit: number;
    platformAudienceFit: number;
    unlockBonus: number;
    costPenalty: number;
    total: number;
  };
  citations: {
    component: string;
    sourceNames: string[];
    confidence: number;
  }[];
}

export interface SliderPreset {
  stage: number;
  sliders: {
    name: string;
    value: number;
    importance: 'high' | 'medium' | 'low';
  }[];
  explanation: string;
}

export interface PlannerRecommendation {
  releases: {
    order: number;
    topic: Topic;
    genre: Genre;
    platform: Platform;
    audience: Audience;
    size: 'small' | 'medium' | 'large' | 'aaa';
    rationale: string;
  }[];
  researchItems: {
    order: number;
    name: string;
    type: 'topic' | 'genre' | 'feature';
    cost: number;
    rationale: string;
  }[];
}
