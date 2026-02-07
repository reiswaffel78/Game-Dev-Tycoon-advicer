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

// ==================== Research Technologies ====================

export const researchItems = pgTable("research_items", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'game_features', 'graphics', 'sound', 'ai', 'hardware', 'other'
  unlockYear: integer("unlock_year").notNull(),
  unlockMonth: integer("unlock_month"),
  researchCost: integer("research_cost").notNull(),
  researchPoints: integer("research_points"), // RP needed
  prerequisiteIds: text("prerequisite_ids").array(), // IDs of required prior research
  description: text("description"),
  priority: integer("priority").default(3), // 1=essential, 2=recommended, 3=optional
  tip: text("tip"), // Strategy tip for this research
});

// ==================== Staff Management Guide ====================

export const staffTips = pgTable("staff_tips", {
  id: varchar("id", { length: 64 }).primaryKey(),
  gamePhase: text("game_phase").notNull(), // 'garage', 'first_office', 'second_office', 'rd_lab', 'hardware_lab'
  category: text("category").notNull(), // 'hiring', 'training', 'skills', 'specialists'
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: integer("priority").default(2), // 1=critical, 2=important, 3=nice-to-have
  minYear: integer("min_year"),
  maxYear: integer("max_year"),
});

// ==================== Timeline Milestones ====================

export const timelineMilestones = pgTable("timeline_milestones", {
  id: varchar("id", { length: 64 }).primaryKey(),
  year: integer("year").notNull(),
  month: integer("month"),
  week: integer("week"),
  eventType: text("event_type").notNull(), // 'platform_release', 'platform_retire', 'office_available', 'feature_unlock', 'tip'
  title: text("title").notNull(),
  description: text("description"),
  relatedEntityId: varchar("related_entity_id", { length: 64 }), // platform/topic/genre ID
  importance: text("importance").default("medium"), // 'critical', 'high', 'medium', 'low'
  actionAdvice: text("action_advice"), // What player should do
});

// ==================== User Checklist Progress ====================

export const userChecklistItems = pgTable("user_checklist_items", {
  id: varchar("id", { length: 64 }).primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id", { length: 64 }).notNull(), // Browser session ID
  milestoneId: varchar("milestone_id", { length: 64 }).references(() => timelineMilestones.id),
  customText: text("custom_text"), // For user-added items
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
export const insertResearchItemSchema = createInsertSchema(researchItems).omit({ });
export const insertStaffTipSchema = createInsertSchema(staffTips).omit({ });
export const insertTimelineMilestoneSchema = createInsertSchema(timelineMilestones).omit({ });
export const insertUserChecklistItemSchema = createInsertSchema(userChecklistItems).omit({ id: true, createdAt: true });

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

export type ResearchItem = typeof researchItems.$inferSelect;
export type InsertResearchItem = z.infer<typeof insertResearchItemSchema>;

export type StaffTip = typeof staffTips.$inferSelect;
export type InsertStaffTip = z.infer<typeof insertStaffTipSchema>;

export type TimelineMilestone = typeof timelineMilestones.$inferSelect;
export type InsertTimelineMilestone = z.infer<typeof insertTimelineMilestoneSchema>;

export type UserChecklistItem = typeof userChecklistItems.$inferSelect;
export type InsertUserChecklistItem = z.infer<typeof insertUserChecklistItemSchema>;

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
    score?: number;
    rationale: string;
  }[];
  researchItems: {
    order: number;
    name: string;
    entityId?: string;
    type: 'topic' | 'genre' | 'feature';
    cost: number;
    rationale: string;
  }[];
}
