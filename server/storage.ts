import { eq, and, desc } from "drizzle-orm";
import { db } from "./db";
import {
  topics,
  genres,
  platforms,
  audiences,
  topicGenreFits,
  platformGenreFits,
  platformAudienceFits,
  genreDevWeights,
  sources,
  snapshots,
  userSaveStates,
  type Topic,
  type Genre,
  type Platform,
  type Audience,
  type TopicGenreFit,
  type PlatformGenreFit,
  type PlatformAudienceFit,
  type GenreDevWeight,
  type Source,
  type Snapshot,
  type UserSaveState,
  type InsertTopic,
  type InsertGenre,
  type InsertPlatform,
  type InsertAudience,
  type InsertTopicGenreFit,
  type InsertPlatformGenreFit,
  type InsertPlatformAudienceFit,
  type InsertGenreDevWeight,
  type InsertSource,
  type InsertSnapshot,
  type InsertUserSaveState,
} from "@shared/schema";

export interface IStorage {
  // Topics
  getAllTopics(): Promise<Topic[]>;
  getTopicById(id: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  
  // Genres
  getAllGenres(): Promise<Genre[]>;
  getGenreById(id: string): Promise<Genre | undefined>;
  createGenre(genre: InsertGenre): Promise<Genre>;
  
  // Platforms
  getAllPlatforms(): Promise<Platform[]>;
  getPlatformById(id: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  
  // Audiences
  getAllAudiences(): Promise<Audience[]>;
  getAudienceById(id: string): Promise<Audience | undefined>;
  createAudience(audience: InsertAudience): Promise<Audience>;
  
  // Topic-Genre Fits
  getTopicGenreFits(): Promise<TopicGenreFit[]>;
  getTopicGenreFitsByTopic(topicId: string): Promise<TopicGenreFit[]>;
  getTopicGenreFitsByGenre(genreId: string): Promise<TopicGenreFit[]>;
  createTopicGenreFit(fit: InsertTopicGenreFit): Promise<TopicGenreFit>;
  
  // Platform-Genre Fits
  getPlatformGenreFits(): Promise<PlatformGenreFit[]>;
  getPlatformGenreFitsByPlatform(platformId: string): Promise<PlatformGenreFit[]>;
  getPlatformGenreFitsByGenre(genreId: string): Promise<PlatformGenreFit[]>;
  createPlatformGenreFit(fit: InsertPlatformGenreFit): Promise<PlatformGenreFit>;
  
  // Platform-Audience Fits
  getPlatformAudienceFits(): Promise<PlatformAudienceFit[]>;
  getPlatformAudienceFitsByPlatform(platformId: string): Promise<PlatformAudienceFit[]>;
  createPlatformAudienceFit(fit: InsertPlatformAudienceFit): Promise<PlatformAudienceFit>;
  
  // Genre Dev Weights
  getGenreDevWeights(): Promise<GenreDevWeight[]>;
  getGenreDevWeightsByGenre(genreId: string): Promise<GenreDevWeight[]>;
  createGenreDevWeight(weight: InsertGenreDevWeight): Promise<GenreDevWeight>;
  
  // Sources
  getAllSources(): Promise<Source[]>;
  getSourceById(id: string): Promise<Source | undefined>;
  createSource(source: InsertSource): Promise<Source>;
  
  // Snapshots
  getAllSnapshots(): Promise<Snapshot[]>;
  getLatestSnapshot(): Promise<Snapshot | undefined>;
  createSnapshot(snapshot: InsertSnapshot): Promise<Snapshot>;
  
  // User Save States
  getUserSaveStates(): Promise<UserSaveState[]>;
  getUserSaveStateById(id: string): Promise<UserSaveState | undefined>;
  createUserSaveState(state: InsertUserSaveState): Promise<UserSaveState>;
  
  // Stats
  getStats(): Promise<{ topics: number; genres: number; platforms: number; lastUpdate: string }>;
}

export class DatabaseStorage implements IStorage {
  // Topics
  async getAllTopics(): Promise<Topic[]> {
    return db.select().from(topics).orderBy(topics.name);
  }

  async getTopicById(id: string): Promise<Topic | undefined> {
    const result = await db.select().from(topics).where(eq(topics.id, id));
    return result[0];
  }

  async createTopic(topic: InsertTopic): Promise<Topic> {
    const result = await db.insert(topics).values(topic).returning();
    return result[0];
  }

  // Genres
  async getAllGenres(): Promise<Genre[]> {
    return db.select().from(genres).orderBy(genres.name);
  }

  async getGenreById(id: string): Promise<Genre | undefined> {
    const result = await db.select().from(genres).where(eq(genres.id, id));
    return result[0];
  }

  async createGenre(genre: InsertGenre): Promise<Genre> {
    const result = await db.insert(genres).values(genre).returning();
    return result[0];
  }

  // Platforms
  async getAllPlatforms(): Promise<Platform[]> {
    return db.select().from(platforms).orderBy(platforms.releaseYear, platforms.name);
  }

  async getPlatformById(id: string): Promise<Platform | undefined> {
    const result = await db.select().from(platforms).where(eq(platforms.id, id));
    return result[0];
  }

  async createPlatform(platform: InsertPlatform): Promise<Platform> {
    const result = await db.insert(platforms).values(platform).returning();
    return result[0];
  }

  // Audiences
  async getAllAudiences(): Promise<Audience[]> {
    return db.select().from(audiences).orderBy(audiences.name);
  }

  async getAudienceById(id: string): Promise<Audience | undefined> {
    const result = await db.select().from(audiences).where(eq(audiences.id, id));
    return result[0];
  }

  async createAudience(audience: InsertAudience): Promise<Audience> {
    const result = await db.insert(audiences).values(audience).returning();
    return result[0];
  }

  // Topic-Genre Fits
  async getTopicGenreFits(): Promise<TopicGenreFit[]> {
    return db.select().from(topicGenreFits);
  }

  async getTopicGenreFitsByTopic(topicId: string): Promise<TopicGenreFit[]> {
    return db.select().from(topicGenreFits).where(eq(topicGenreFits.topicId, topicId));
  }

  async getTopicGenreFitsByGenre(genreId: string): Promise<TopicGenreFit[]> {
    return db.select().from(topicGenreFits).where(eq(topicGenreFits.genreId, genreId));
  }

  async createTopicGenreFit(fit: InsertTopicGenreFit): Promise<TopicGenreFit> {
    const result = await db.insert(topicGenreFits).values(fit).returning();
    return result[0];
  }

  // Platform-Genre Fits
  async getPlatformGenreFits(): Promise<PlatformGenreFit[]> {
    return db.select().from(platformGenreFits);
  }

  async getPlatformGenreFitsByPlatform(platformId: string): Promise<PlatformGenreFit[]> {
    return db.select().from(platformGenreFits).where(eq(platformGenreFits.platformId, platformId));
  }

  async getPlatformGenreFitsByGenre(genreId: string): Promise<PlatformGenreFit[]> {
    return db.select().from(platformGenreFits).where(eq(platformGenreFits.genreId, genreId));
  }

  async createPlatformGenreFit(fit: InsertPlatformGenreFit): Promise<PlatformGenreFit> {
    const result = await db.insert(platformGenreFits).values(fit).returning();
    return result[0];
  }

  // Platform-Audience Fits
  async getPlatformAudienceFits(): Promise<PlatformAudienceFit[]> {
    return db.select().from(platformAudienceFits);
  }

  async getPlatformAudienceFitsByPlatform(platformId: string): Promise<PlatformAudienceFit[]> {
    return db.select().from(platformAudienceFits).where(eq(platformAudienceFits.platformId, platformId));
  }

  async createPlatformAudienceFit(fit: InsertPlatformAudienceFit): Promise<PlatformAudienceFit> {
    const result = await db.insert(platformAudienceFits).values(fit).returning();
    return result[0];
  }

  // Genre Dev Weights
  async getGenreDevWeights(): Promise<GenreDevWeight[]> {
    return db.select().from(genreDevWeights);
  }

  async getGenreDevWeightsByGenre(genreId: string): Promise<GenreDevWeight[]> {
    return db.select().from(genreDevWeights).where(eq(genreDevWeights.genreId, genreId)).orderBy(genreDevWeights.stage);
  }

  async createGenreDevWeight(weight: InsertGenreDevWeight): Promise<GenreDevWeight> {
    const result = await db.insert(genreDevWeights).values(weight).returning();
    return result[0];
  }

  // Sources
  async getAllSources(): Promise<Source[]> {
    return db.select().from(sources).orderBy(desc(sources.trustLevel));
  }

  async getSourceById(id: string): Promise<Source | undefined> {
    const result = await db.select().from(sources).where(eq(sources.id, id));
    return result[0];
  }

  async createSource(source: InsertSource): Promise<Source> {
    const result = await db.insert(sources).values(source).returning();
    return result[0];
  }

  // Snapshots
  async getAllSnapshots(): Promise<Snapshot[]> {
    return db.select().from(snapshots).orderBy(desc(snapshots.createdAt));
  }

  async getLatestSnapshot(): Promise<Snapshot | undefined> {
    const result = await db.select().from(snapshots).orderBy(desc(snapshots.createdAt)).limit(1);
    return result[0];
  }

  async createSnapshot(snapshot: InsertSnapshot): Promise<Snapshot> {
    const result = await db.insert(snapshots).values(snapshot).returning();
    return result[0];
  }

  // User Save States
  async getUserSaveStates(): Promise<UserSaveState[]> {
    return db.select().from(userSaveStates).orderBy(desc(userSaveStates.createdAt));
  }

  async getUserSaveStateById(id: string): Promise<UserSaveState | undefined> {
    const result = await db.select().from(userSaveStates).where(eq(userSaveStates.id, id));
    return result[0];
  }

  async createUserSaveState(state: InsertUserSaveState): Promise<UserSaveState> {
    const result = await db.insert(userSaveStates).values(state).returning();
    return result[0];
  }

  // Stats
  async getStats(): Promise<{ topics: number; genres: number; platforms: number; lastUpdate: string }> {
    const [topicCount] = await db.select().from(topics);
    const [genreCount] = await db.select().from(genres);
    const [platformCount] = await db.select().from(platforms);
    const latestSnapshot = await this.getLatestSnapshot();

    const allTopics = await this.getAllTopics();
    const allGenres = await this.getAllGenres();
    const allPlatforms = await this.getAllPlatforms();

    return {
      topics: allTopics.length,
      genres: allGenres.length,
      platforms: allPlatforms.length,
      lastUpdate: latestSnapshot?.createdAt
        ? new Date(latestSnapshot.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : "Never",
    };
  }
}

export const storage = new DatabaseStorage();
