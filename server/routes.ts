import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  getRecommendationsByTopic,
  getRecommendationsByGenre,
  getRecommendationsByPlatform,
  getSliderPresets,
  getMultiGenreSliderPresets,
  generatePlannerRecommendations,
  getTopCombinations,
} from "./recommendation-engine";
import { z } from "zod";

function readLastCodeUpdate(): string {
  return new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const CODE_LAST_UPDATE = readLastCodeUpdate();

const plannerSchema = z.object({
  year: z.number().min(1).max(50),
  month: z.number().min(1).max(12),
  week: z.number().min(1).max(4),
  cash: z.number().min(0),
  fans: z.number().min(0),
  unlockedOnly: z.boolean(),
  useUnlockedTopicsFilter: z.boolean().optional().default(false),
  unlockedTopicIds: z.array(z.string()).optional().default([]),
});

const createChecklistItemSchema = z.object({
  sessionId: z.string().min(1),
  milestoneId: z.string().optional(),
  customText: z.string().optional(),
});

const updateChecklistItemSchema = z.object({
  isCompleted: z.boolean(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json({ ...stats, lastUpdate: CODE_LAST_UPDATE });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Top combinations for dashboard
  app.get("/api/top-combos", async (req, res) => {
    try {
      const combos = await getTopCombinations();
      res.json(combos);
    } catch (error) {
      console.error("Error fetching top combos:", error);
      res.status(500).json({ error: "Failed to fetch top combinations" });
    }
  });

  // Topics CRUD
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getAllTopics();
      res.json(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
      res.status(500).json({ error: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topic = await storage.getTopicById(req.params.id);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      console.error("Error fetching topic:", error);
      res.status(500).json({ error: "Failed to fetch topic" });
    }
  });

  // Genres CRUD
  app.get("/api/genres", async (req, res) => {
    try {
      const genres = await storage.getAllGenres();
      res.json(genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  app.get("/api/genres/:id", async (req, res) => {
    try {
      const genre = await storage.getGenreById(req.params.id);
      if (!genre) {
        return res.status(404).json({ error: "Genre not found" });
      }
      res.json(genre);
    } catch (error) {
      console.error("Error fetching genre:", error);
      res.status(500).json({ error: "Failed to fetch genre" });
    }
  });

  // Platforms CRUD
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getAllPlatforms();
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ error: "Failed to fetch platforms" });
    }
  });

  app.get("/api/platforms/:id", async (req, res) => {
    try {
      const platform = await storage.getPlatformById(req.params.id);
      if (!platform) {
        return res.status(404).json({ error: "Platform not found" });
      }
      res.json(platform);
    } catch (error) {
      console.error("Error fetching platform:", error);
      res.status(500).json({ error: "Failed to fetch platform" });
    }
  });

  // Sources
  app.get("/api/sources", async (req, res) => {
    try {
      const sources = await storage.getAllSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching sources:", error);
      res.status(500).json({ error: "Failed to fetch sources" });
    }
  });

  // Recommendations by topic
  app.get("/api/recommend/topic/:topicId", async (req, res) => {
    try {
      const recommendations = await getRecommendationsByTopic(req.params.topicId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Recommendations by genre
  app.get("/api/recommend/genre/:genreId", async (req, res) => {
    try {
      const recommendations = await getRecommendationsByGenre(req.params.genreId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Recommendations by platform
  app.get("/api/recommend/platform/:platformId", async (req, res) => {
    try {
      const recommendations = await getRecommendationsByPlatform(req.params.platformId);
      res.json(recommendations);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Multi-genre slider presets: (primary × 2 + secondary) / 3
  // Must be registered before the single-genre route to avoid matching "multi" as a genreId
  app.get("/api/sliders/multi/:primaryGenreId/:secondaryGenreId", async (req, res) => {
    try {
      const presets = await getMultiGenreSliderPresets(
        req.params.primaryGenreId,
        req.params.secondaryGenreId
      );
      res.json(presets);
    } catch (error) {
      console.error("Error getting multi-genre slider presets:", error);
      res.status(500).json({ error: "Failed to get multi-genre slider presets" });
    }
  });

  // Slider presets (single genre)
  app.get("/api/sliders/:genreId", async (req, res) => {
    try {
      const presets = await getSliderPresets(req.params.genreId);
      res.json(presets);
    } catch (error) {
      console.error("Error getting slider presets:", error);
      res.status(500).json({ error: "Failed to get slider presets" });
    }
  });

  // Planner
  app.post("/api/planner", async (req, res) => {
    try {
      const parsed = plannerSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", details: parsed.error });
      }

      const { year, month, cash, fans, unlockedOnly, useUnlockedTopicsFilter, unlockedTopicIds } = parsed.data;
      const recommendations = await generatePlannerRecommendations(
        year,
        month,
        cash,
        fans,
        unlockedOnly,
        useUnlockedTopicsFilter,
        unlockedTopicIds
      );
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating planner recommendations:", error);
      res.status(500).json({ error: "Failed to generate planner recommendations" });
    }
  });

  // Also support GET for planner (for react-query)
  app.get("/api/planner", async (req, res) => {
    try {
      // Default values for initial load
      const recommendations = await generatePlannerRecommendations(1, 1, 70000, 0, false);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating planner recommendations:", error);
      res.status(500).json({ error: "Failed to generate planner recommendations" });
    }
  });

  // ==================== Research Guide Routes ====================
  app.get("/api/research", async (req, res) => {
    try {
      const items = await storage.getAllResearchItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching research items:", error);
      res.status(500).json({ error: "Failed to fetch research items" });
    }
  });

  app.get("/api/research/category/:category", async (req, res) => {
    try {
      const items = await storage.getResearchItemsByCategory(req.params.category);
      res.json(items);
    } catch (error) {
      console.error("Error fetching research items:", error);
      res.status(500).json({ error: "Failed to fetch research items" });
    }
  });

  // ==================== Staff Guide Routes ====================
  app.get("/api/staff-tips", async (req, res) => {
    try {
      const tips = await storage.getAllStaffTips();
      res.json(tips);
    } catch (error) {
      console.error("Error fetching staff tips:", error);
      res.status(500).json({ error: "Failed to fetch staff tips" });
    }
  });

  app.get("/api/staff-tips/phase/:phase", async (req, res) => {
    try {
      const tips = await storage.getStaffTipsByPhase(req.params.phase);
      res.json(tips);
    } catch (error) {
      console.error("Error fetching staff tips:", error);
      res.status(500).json({ error: "Failed to fetch staff tips" });
    }
  });

  // ==================== Timeline Routes ====================
  app.get("/api/timeline", async (req, res) => {
    try {
      const milestones = await storage.getAllTimelineMilestones();
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  app.get("/api/timeline/year/:year", async (req, res) => {
    try {
      const year = parseInt(req.params.year, 10);
      const milestones = await storage.getTimelineMilestonesByYear(year);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching timeline:", error);
      res.status(500).json({ error: "Failed to fetch timeline" });
    }
  });

  // ==================== Checklist Routes ====================
  app.get("/api/checklist/:sessionId", async (req, res) => {
    try {
      const items = await storage.getUserChecklistItems(req.params.sessionId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      res.status(500).json({ error: "Failed to fetch checklist" });
    }
  });

  app.post("/api/checklist", async (req, res) => {
    try {
      const parsed = createChecklistItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", details: parsed.error });
      }
      const item = await storage.createUserChecklistItem(parsed.data);
      res.json(item);
    } catch (error) {
      console.error("Error creating checklist item:", error);
      res.status(500).json({ error: "Failed to create checklist item" });
    }
  });

  app.patch("/api/checklist/:id", async (req, res) => {
    try {
      const parsed = updateChecklistItemSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request body", details: parsed.error });
      }
      const item = await storage.updateUserChecklistItem(req.params.id, parsed.data.isCompleted);
      if (!item) {
        return res.status(404).json({ error: "Checklist item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating checklist item:", error);
      res.status(500).json({ error: "Failed to update checklist item" });
    }
  });

  app.delete("/api/checklist/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUserChecklistItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Checklist item not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting checklist item:", error);
      res.status(500).json({ error: "Failed to delete checklist item" });
    }
  });

  return httpServer;
}
