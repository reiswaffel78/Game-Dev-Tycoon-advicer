import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  getRecommendationsByTopic,
  getRecommendationsByGenre,
  getRecommendationsByPlatform,
  getSliderPresets,
  generatePlannerRecommendations,
  getTopCombinations,
} from "./recommendation-engine";
import { z } from "zod";

const plannerSchema = z.object({
  year: z.number().min(1).max(50),
  month: z.number().min(1).max(12),
  week: z.number().min(1).max(4),
  cash: z.number().min(0),
  fans: z.number().min(0),
  unlockedOnly: z.boolean(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
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

  // Slider presets
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

      const { year, month, cash, fans, unlockedOnly } = parsed.data;
      const recommendations = await generatePlannerRecommendations(
        year,
        month,
        cash,
        fans,
        unlockedOnly
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

  return httpServer;
}
