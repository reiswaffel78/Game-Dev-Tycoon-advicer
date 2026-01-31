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
  researchItems,
  staffTips,
  timelineMilestones,
} from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  // Check if core data already exists
  const existingTopics = await db.select().from(topics).limit(1);
  
  if (existingTopics.length > 0) {
    // Check if slider data needs updating (separate from core data)
    const existingSliders = await db.select().from(genreDevWeights).limit(1);
    if (existingSliders.length === 0) {
      console.log("Seeding slider data...");
      await seedSliderData();
    }
    
    // Check if guide data needs seeding
    const existingResearch = await db.select().from(researchItems).limit(1);
    if (existingResearch.length === 0) {
      console.log("Seeding guide data...");
      await seedGuideData();
    }
    
    console.log("Database check complete.");
    return;
  }

  console.log("Seeding database with Game Dev Tycoon data...");

  // Seed sources
  const sourcesData = [
    { id: "greenheart-forum", name: "Greenheart Games Forum", url: "https://forum.greenheartgames.com", trustLevel: 4, isActive: true },
    { id: "fandom-wiki", name: "Game Dev Tycoon Fandom Wiki", url: "https://gamedevtycoon.fandom.com", trustLevel: 3, isActive: true },
    { id: "stackexchange", name: "Gaming Stack Exchange", url: "https://gaming.stackexchange.com", trustLevel: 2, isActive: true },
    { id: "steam-guides", name: "Steam Community Guides", url: "https://steamcommunity.com/app/239820/guides", trustLevel: 1, isActive: true },
  ];
  await db.insert(sources).values(sourcesData);

  // Seed snapshot
  await db.insert(snapshots).values({
    id: "initial-seed",
    sourceCount: 4,
    factCount: 150,
    notes: "Initial seed data from community sources",
  });

  // Seed audiences
  const audiencesData = [
    { id: "young", name: "Young", description: "Games suitable for young players (E for Everyone)" },
    { id: "everyone", name: "Everyone", description: "Games for all ages (E10+)" },
    { id: "mature", name: "Mature", description: "Games for mature audiences (M)" },
  ];
  await db.insert(audiences).values(audiencesData);

  // Seed genres
  const genresData = [
    { id: "action", name: "Action", unlockYear: 1, researchCost: 0, description: "Fast-paced gameplay with combat and reflexes" },
    { id: "adventure", name: "Adventure", unlockYear: 1, researchCost: 0, description: "Story-driven exploration games" },
    { id: "rpg", name: "RPG", unlockYear: 2, researchCost: 40000, description: "Role-playing games with character progression" },
    { id: "simulation", name: "Simulation", unlockYear: 1, researchCost: 0, description: "Real-world simulation games" },
    { id: "strategy", name: "Strategy", unlockYear: 3, researchCost: 60000, description: "Tactical and strategic gameplay" },
    { id: "casual", name: "Casual", unlockYear: 6, researchCost: 80000, description: "Easy-to-play casual games" },
  ];
  await db.insert(genres).values(genresData);

  // Seed topics
  const topicsData = [
    { id: "aliens", name: "Aliens", category: "Sci-Fi", unlockYear: 1, researchCost: 0, description: "Extraterrestrial themes" },
    { id: "fantasy", name: "Fantasy", category: "Fantasy", unlockYear: 1, researchCost: 0, description: "Magical worlds and creatures" },
    { id: "scifi", name: "Sci-Fi", category: "Sci-Fi", unlockYear: 1, researchCost: 0, description: "Science fiction themes" },
    { id: "medieval", name: "Medieval", category: "Historical", unlockYear: 2, researchCost: 20000, description: "Middle ages setting" },
    { id: "military", name: "Military", category: "Combat", unlockYear: 1, researchCost: 0, description: "Military and warfare themes" },
    { id: "pirates", name: "Pirates", category: "Adventure", unlockYear: 3, researchCost: 30000, description: "Pirate adventures and sea battles" },
    { id: "vampires", name: "Vampires", category: "Horror", unlockYear: 4, researchCost: 35000, description: "Vampire and dark themes" },
    { id: "zombies", name: "Zombies", category: "Horror", unlockYear: 5, researchCost: 40000, description: "Zombie apocalypse themes" },
    { id: "sports", name: "Sports", category: "Sports", unlockYear: 1, researchCost: 0, description: "Athletic competition themes" },
    { id: "racing", name: "Racing", category: "Sports", unlockYear: 2, researchCost: 25000, description: "Vehicle racing themes" },
    { id: "city", name: "City", category: "Management", unlockYear: 4, researchCost: 35000, description: "City building and management" },
    { id: "business", name: "Business", category: "Management", unlockYear: 5, researchCost: 40000, description: "Business simulation themes" },
    { id: "hospital", name: "Hospital", category: "Management", unlockYear: 6, researchCost: 45000, description: "Medical and hospital themes" },
    { id: "prison", name: "Prison", category: "Management", unlockYear: 8, researchCost: 60000, description: "Prison management themes" },
    { id: "space", name: "Space", category: "Sci-Fi", unlockYear: 3, researchCost: 30000, description: "Space exploration themes" },
    { id: "hunting", name: "Hunting", category: "Sports", unlockYear: 3, researchCost: 25000, description: "Hunting and wildlife themes" },
    { id: "martial-arts", name: "Martial Arts", category: "Combat", unlockYear: 2, researchCost: 20000, description: "Martial arts combat themes" },
    { id: "mystery", name: "Mystery", category: "Adventure", unlockYear: 4, researchCost: 35000, description: "Detective and mystery themes" },
    { id: "comedy", name: "Comedy", category: "Comedy", unlockYear: 5, researchCost: 40000, description: "Humorous and comedic themes" },
    { id: "dance", name: "Dance", category: "Music", unlockYear: 7, researchCost: 50000, description: "Dance and rhythm themes" },
  ];
  await db.insert(topics).values(topicsData);

  // Seed platforms
  const platformsData = [
    { id: "pc", name: "PC", company: "Various", releaseYear: 1, licenseCost: 0, devCost: 5000, maxTechLevel: 10, description: "Personal computer platform" },
    { id: "govodore-64", name: "Govodore 64", company: "Govodore", releaseYear: 1, retireYear: 8, licenseCost: 20000, devCost: 3000, maxTechLevel: 3, description: "Early home computer" },
    { id: "tes", name: "TES", company: "Ninvento", releaseYear: 2, retireYear: 10, licenseCost: 25000, devCost: 4000, maxTechLevel: 4, description: "8-bit console" },
    { id: "master-v", name: "Master V", company: "Vena", releaseYear: 3, retireYear: 11, licenseCost: 30000, devCost: 5000, maxTechLevel: 5, description: "16-bit console" },
    { id: "super-tes", name: "Super TES", company: "Ninvento", releaseYear: 5, retireYear: 15, licenseCost: 40000, devCost: 8000, maxTechLevel: 6, description: "Advanced 16-bit console" },
    { id: "genovation", name: "Genovation", company: "Vena", releaseYear: 6, retireYear: 14, licenseCost: 50000, devCost: 10000, maxTechLevel: 7, description: "CD-based console" },
    { id: "playstation", name: "Playsystem", company: "Vonny", releaseYear: 8, retireYear: 18, licenseCost: 100000, devCost: 20000, maxTechLevel: 8, description: "32-bit CD console" },
    { id: "nuu-64", name: "nuu 64", company: "Ninvento", releaseYear: 9, retireYear: 17, licenseCost: 80000, devCost: 15000, maxTechLevel: 8, description: "64-bit cartridge console" },
    { id: "dreamvast", name: "DreamVast", company: "Vena", releaseYear: 11, retireYear: 16, licenseCost: 120000, devCost: 25000, maxTechLevel: 9, description: "Internet-enabled console" },
    { id: "playsystem-2", name: "Playsystem 2", company: "Vonny", releaseYear: 12, retireYear: 22, licenseCost: 150000, devCost: 30000, maxTechLevel: 9, description: "Advanced DVD console" },
    { id: "game-sphere", name: "Game Sphere", company: "Ninvento", releaseYear: 13, retireYear: 20, licenseCost: 140000, devCost: 28000, maxTechLevel: 9, description: "Disc-based console" },
    { id: "mbox", name: "mBox", company: "Micronoft", releaseYear: 13, retireYear: 21, licenseCost: 160000, devCost: 35000, maxTechLevel: 9, description: "First mBox console" },
    { id: "playsystem-3", name: "Playsystem 3", company: "Vonny", releaseYear: 18, retireYear: 28, licenseCost: 250000, devCost: 50000, maxTechLevel: 10, description: "HD gaming console" },
    { id: "mbox-next", name: "mBox Next", company: "Micronoft", releaseYear: 19, retireYear: 29, licenseCost: 280000, devCost: 55000, maxTechLevel: 10, description: "Next-gen mBox" },
    { id: "whoops", name: "whoops", company: "Ninvento", releaseYear: 20, retireYear: 28, licenseCost: 200000, devCost: 40000, maxTechLevel: 10, description: "Motion control console" },
  ];
  await db.insert(platforms).values(platformsData);

  // Seed topic-genre fits
  const topicGenreFitsData = [
    // Action genre fits
    { id: "aliens-action", topicId: "aliens", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "fantasy-action", topicId: "fantasy", genreId: "action", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "scifi-action", topicId: "scifi", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "military-action", topicId: "military", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "zombies-action", topicId: "zombies", genreId: "action", fitValue: 3, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "martial-arts-action", topicId: "martial-arts", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "vampires-action", topicId: "vampires", genreId: "action", fitValue: 2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "pirates-action", topicId: "pirates", genreId: "action", fitValue: 2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "sports-action", topicId: "sports", genreId: "action", fitValue: -1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "business-action", topicId: "business", genreId: "action", fitValue: -3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    
    // Adventure genre fits
    { id: "fantasy-adventure", topicId: "fantasy", genreId: "adventure", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "pirates-adventure", topicId: "pirates", genreId: "adventure", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "mystery-adventure", topicId: "mystery", genreId: "adventure", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "scifi-adventure", topicId: "scifi", genreId: "adventure", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "medieval-adventure", topicId: "medieval", genreId: "adventure", fitValue: 2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "space-adventure", topicId: "space", genreId: "adventure", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "sports-adventure", topicId: "sports", genreId: "adventure", fitValue: -2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    
    // RPG genre fits
    { id: "fantasy-rpg", topicId: "fantasy", genreId: "rpg", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "medieval-rpg", topicId: "medieval", genreId: "rpg", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "scifi-rpg", topicId: "scifi", genreId: "rpg", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "vampires-rpg", topicId: "vampires", genreId: "rpg", fitValue: 2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "zombies-rpg", topicId: "zombies", genreId: "rpg", fitValue: 1, confidence: 0.8, sourceIds: ["stackexchange"] },
    { id: "sports-rpg", topicId: "sports", genreId: "rpg", fitValue: -2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "racing-rpg", topicId: "racing", genreId: "rpg", fitValue: -3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    
    // Simulation genre fits
    { id: "city-simulation", topicId: "city", genreId: "simulation", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "business-simulation", topicId: "business", genreId: "simulation", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "hospital-simulation", topicId: "hospital", genreId: "simulation", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "prison-simulation", topicId: "prison", genreId: "simulation", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "racing-simulation", topicId: "racing", genreId: "simulation", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "sports-simulation", topicId: "sports", genreId: "simulation", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "space-simulation", topicId: "space", genreId: "simulation", fitValue: 2, confidence: 0.85, sourceIds: ["stackexchange"] },
    { id: "fantasy-simulation", topicId: "fantasy", genreId: "simulation", fitValue: -2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    
    // Strategy genre fits
    { id: "military-strategy", topicId: "military", genreId: "strategy", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "medieval-strategy", topicId: "medieval", genreId: "strategy", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "scifi-strategy", topicId: "scifi", genreId: "strategy", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "space-strategy", topicId: "space", genreId: "strategy", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "fantasy-strategy", topicId: "fantasy", genreId: "strategy", fitValue: 1, confidence: 0.85, sourceIds: ["stackexchange"] },
    { id: "sports-strategy", topicId: "sports", genreId: "strategy", fitValue: -1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "comedy-strategy", topicId: "comedy", genreId: "strategy", fitValue: -2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    
    // Casual genre fits
    { id: "dance-casual", topicId: "dance", genreId: "casual", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "comedy-casual", topicId: "comedy", genreId: "casual", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "sports-casual", topicId: "sports", genreId: "casual", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "city-casual", topicId: "city", genreId: "casual", fitValue: 1, confidence: 0.8, sourceIds: ["stackexchange"] },
    { id: "military-casual", topicId: "military", genreId: "casual", fitValue: -2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "vampires-casual", topicId: "vampires", genreId: "casual", fitValue: -2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
  ];
  await db.insert(topicGenreFits).values(topicGenreFitsData);

  // Seed platform-genre fits
  const platformGenreFitsData = [
    // PC fits
    { id: "pc-action", platformId: "pc", genreId: "action", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "pc-adventure", platformId: "pc", genreId: "adventure", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "pc-rpg", platformId: "pc", genreId: "rpg", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "pc-simulation", platformId: "pc", genreId: "simulation", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "pc-strategy", platformId: "pc", genreId: "strategy", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum", "fandom-wiki"] },
    { id: "pc-casual", platformId: "pc", genreId: "casual", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    
    // Console fits (TES)
    { id: "tes-action", platformId: "tes", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "tes-adventure", platformId: "tes", genreId: "adventure", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "tes-rpg", platformId: "tes", genreId: "rpg", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "tes-simulation", platformId: "tes", genreId: "simulation", fitValue: -1, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "tes-strategy", platformId: "tes", genreId: "strategy", fitValue: -1, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    
    // Playstation fits
    { id: "playstation-action", platformId: "playstation", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "playstation-adventure", platformId: "playstation", genreId: "adventure", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "playstation-rpg", platformId: "playstation", genreId: "rpg", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "playstation-simulation", platformId: "playstation", genreId: "simulation", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "playstation-strategy", platformId: "playstation", genreId: "strategy", fitValue: 0, confidence: 0.75, sourceIds: ["fandom-wiki"] },
    { id: "playstation-casual", platformId: "playstation", genreId: "casual", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },

    // mBox fits
    { id: "mbox-action", platformId: "mbox", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "mbox-adventure", platformId: "mbox", genreId: "adventure", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "mbox-rpg", platformId: "mbox", genreId: "rpg", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "mbox-simulation", platformId: "mbox", genreId: "simulation", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "mbox-strategy", platformId: "mbox", genreId: "strategy", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "mbox-casual", platformId: "mbox", genreId: "casual", fitValue: 0, confidence: 0.75, sourceIds: ["fandom-wiki"] },

    // Ninvento consoles fits (more family-friendly)
    { id: "super-tes-action", platformId: "super-tes", genreId: "action", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "super-tes-adventure", platformId: "super-tes", genreId: "adventure", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "super-tes-rpg", platformId: "super-tes", genreId: "rpg", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "super-tes-casual", platformId: "super-tes", genreId: "casual", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    
    { id: "whoops-casual", platformId: "whoops", genreId: "casual", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum"] },
    { id: "whoops-action", platformId: "whoops", genreId: "action", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "whoops-adventure", platformId: "whoops", genreId: "adventure", fitValue: 2, confidence: 0.85, sourceIds: ["fandom-wiki"] },
  ];
  await db.insert(platformGenreFits).values(platformGenreFitsData);

  // Seed platform-audience fits
  const platformAudienceFitsData = [
    // PC - universal
    { id: "pc-young", platformId: "pc", audienceId: "young", fitValue: 1, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    { id: "pc-everyone", platformId: "pc", audienceId: "everyone", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "pc-mature", platformId: "pc", audienceId: "mature", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    
    // Ninvento consoles - family friendly
    { id: "tes-young", platformId: "tes", audienceId: "young", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    { id: "tes-everyone", platformId: "tes", audienceId: "everyone", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "tes-mature", platformId: "tes", audienceId: "mature", fitValue: -1, confidence: 0.85, sourceIds: ["fandom-wiki"] },
    
    { id: "super-tes-young", platformId: "super-tes", audienceId: "young", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "super-tes-everyone", platformId: "super-tes", audienceId: "everyone", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "super-tes-mature", platformId: "super-tes", audienceId: "mature", fitValue: 0, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    
    { id: "whoops-young", platformId: "whoops", audienceId: "young", fitValue: 3, confidence: 0.98, sourceIds: ["greenheart-forum"] },
    { id: "whoops-everyone", platformId: "whoops", audienceId: "everyone", fitValue: 3, confidence: 0.95, sourceIds: ["fandom-wiki"] },
    { id: "whoops-mature", platformId: "whoops", audienceId: "mature", fitValue: -2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    
    // Sony/MS consoles - more mature leaning
    { id: "playstation-young", platformId: "playstation", audienceId: "young", fitValue: 1, confidence: 0.8, sourceIds: ["fandom-wiki"] },
    { id: "playstation-everyone", platformId: "playstation", audienceId: "everyone", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "playstation-mature", platformId: "playstation", audienceId: "mature", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
    
    { id: "mbox-young", platformId: "mbox", audienceId: "young", fitValue: 0, confidence: 0.75, sourceIds: ["fandom-wiki"] },
    { id: "mbox-everyone", platformId: "mbox", audienceId: "everyone", fitValue: 2, confidence: 0.9, sourceIds: ["fandom-wiki"] },
    { id: "mbox-mature", platformId: "mbox", audienceId: "mature", fitValue: 3, confidence: 0.95, sourceIds: ["greenheart-forum"] },
  ];
  await db.insert(platformAudienceFits).values(platformAudienceFitsData);

  // Seed genre dev weights - CORRECT values from Game Dev Tycoon Wiki
  // Source: https://gamedevtycoon.fandom.com/wiki/Game_Development_Based_on_Source-Code/1.4.3#Slider_Allocation
  // Values: 1.0 = 100%, 0.8 = 80%, 0 = 0%
  // Stage 1 sliders: Engine, Gameplay, Story/Quest
  // Stage 2 sliders: Dialogues, Level Design, AI
  // Stage 3 sliders: World Design, Graphics, Sound
  const genreDevWeightsData = [
    // ACTION: Engine 100%, Gameplay 80%, Story 0% | Dialogues 0%, LevelDesign 80%, AI 100% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "action-s1", genreId: "action", stage: 1, engine: 1.0, gameplay: 0.8, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "action-s2", genreId: "action", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0.8, ai: 1.0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "action-s3", genreId: "action", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // ADVENTURE: Engine 0%, Gameplay 0%, Story 100% | Dialogues 100%, LevelDesign 0%, AI 0% | WorldDesign 100%, Graphics 80%, Sound 0%
    { id: "adventure-s1", genreId: "adventure", stage: 1, engine: 0, gameplay: 0, storyQuests: 1.0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "adventure-s2", genreId: "adventure", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 1.0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "adventure-s3", genreId: "adventure", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0.8, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // RPG: Engine 0%, Gameplay 80%, Story 100% | Dialogues 100%, LevelDesign 80%, AI 0% | WorldDesign 100%, Graphics 80%, Sound 0%
    { id: "rpg-s1", genreId: "rpg", stage: 1, engine: 0, gameplay: 0.8, storyQuests: 1.0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "rpg-s2", genreId: "rpg", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 1.0, levelDesign: 0.8, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "rpg-s3", genreId: "rpg", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0.8, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // SIMULATION: Engine 80%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 80%, AI 100% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "simulation-s1", genreId: "simulation", stage: 1, engine: 0.8, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "simulation-s2", genreId: "simulation", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0.8, ai: 1.0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "simulation-s3", genreId: "simulation", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // STRATEGY: Engine 80%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 100%, AI 80% | WorldDesign 100%, Graphics 0%, Sound 80%
    { id: "strategy-s1", genreId: "strategy", stage: 1, engine: 0.8, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "strategy-s2", genreId: "strategy", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 1.0, ai: 0.8, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "strategy-s3", genreId: "strategy", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // CASUAL: Engine 0%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 100%, AI 0% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "casual-s1", genreId: "casual", stage: 1, engine: 0, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "casual-s2", genreId: "casual", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 1.0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "casual-s3", genreId: "casual", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
  ];
  await db.insert(genreDevWeights).values(genreDevWeightsData);

  console.log("Database seeding completed successfully!");
}

// Separate function to seed just slider data (can be called independently)
async function seedSliderData() {
  const genreDevWeightsData = [
    // ACTION: Engine 100%, Gameplay 80%, Story 0% | Dialogues 0%, LevelDesign 80%, AI 100% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "action-s1", genreId: "action", stage: 1, engine: 1.0, gameplay: 0.8, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "action-s2", genreId: "action", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0.8, ai: 1.0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "action-s3", genreId: "action", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // ADVENTURE: Engine 0%, Gameplay 0%, Story 100% | Dialogues 100%, LevelDesign 0%, AI 0% | WorldDesign 100%, Graphics 80%, Sound 0%
    { id: "adventure-s1", genreId: "adventure", stage: 1, engine: 0, gameplay: 0, storyQuests: 1.0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "adventure-s2", genreId: "adventure", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 1.0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "adventure-s3", genreId: "adventure", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0.8, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // RPG: Engine 0%, Gameplay 80%, Story 100% | Dialogues 100%, LevelDesign 80%, AI 0% | WorldDesign 100%, Graphics 80%, Sound 0%
    { id: "rpg-s1", genreId: "rpg", stage: 1, engine: 0, gameplay: 0.8, storyQuests: 1.0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "rpg-s2", genreId: "rpg", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 1.0, levelDesign: 0.8, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "rpg-s3", genreId: "rpg", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0.8, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // SIMULATION: Engine 80%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 80%, AI 100% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "simulation-s1", genreId: "simulation", stage: 1, engine: 0.8, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "simulation-s2", genreId: "simulation", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0.8, ai: 1.0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "simulation-s3", genreId: "simulation", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // STRATEGY: Engine 80%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 100%, AI 80% | WorldDesign 100%, Graphics 0%, Sound 80%
    { id: "strategy-s1", genreId: "strategy", stage: 1, engine: 0.8, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "strategy-s2", genreId: "strategy", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 1.0, ai: 0.8, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "strategy-s3", genreId: "strategy", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 1.0, graphics: 0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    
    // CASUAL: Engine 0%, Gameplay 100%, Story 0% | Dialogues 0%, LevelDesign 100%, AI 0% | WorldDesign 0%, Graphics 100%, Sound 80%
    { id: "casual-s1", genreId: "casual", stage: 1, engine: 0, gameplay: 1.0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "casual-s2", genreId: "casual", stage: 2, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 1.0, ai: 0, worldDesign: 0, graphics: 0, sound: 0, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
    { id: "casual-s3", genreId: "casual", stage: 3, engine: 0, gameplay: 0, storyQuests: 0, dialogues: 0, levelDesign: 0, ai: 0, worldDesign: 0, graphics: 1.0, sound: 0.8, confidence: 0.98, sourceIds: ["fandom-wiki", "greenheart-forum"] },
  ];
  await db.insert(genreDevWeights).values(genreDevWeightsData);
  console.log("Slider data seeded successfully!");
}

// Seed research items, staff tips, and timeline
async function seedGuideData() {
  // Research Items - Based on Game Dev Tycoon wiki
  const researchData = [
    // Game Features - available from start
    { id: "basic-2d-graphics", name: "Basic 2D Graphics v1", category: "graphics", unlockYear: 1, researchCost: 0, researchPoints: 0, priority: 1, description: "Starting graphics technology", tip: "Available from the start" },
    { id: "basic-sound", name: "Basic Sound v1", category: "sound", unlockYear: 1, researchCost: 0, researchPoints: 0, priority: 1, description: "Starting sound technology", tip: "Available from the start" },
    
    // Early Game Research (Years 1-5)
    { id: "2d-graphics-v2", name: "2D Graphics v2", category: "graphics", unlockYear: 1, researchCost: 5000, researchPoints: 20, priority: 1, prerequisiteIds: ["basic-2d-graphics"], description: "Improved 2D graphics", tip: "Research early for better game scores" },
    { id: "sound-v2", name: "Sound v2", category: "sound", unlockYear: 1, researchCost: 5000, researchPoints: 20, priority: 2, prerequisiteIds: ["basic-sound"], description: "Improved sound design", tip: "Research after graphics improvements" },
    { id: "2d-graphics-v3", name: "2D Graphics v3", category: "graphics", unlockYear: 2, researchCost: 10000, researchPoints: 40, priority: 1, prerequisiteIds: ["2d-graphics-v2"], description: "Advanced 2D graphics", tip: "Essential before moving to first office" },
    { id: "save-game", name: "Save Game", category: "game_features", unlockYear: 2, researchCost: 8000, researchPoints: 30, priority: 1, description: "Allow players to save progress", tip: "Highly important for RPGs and Adventure games" },
    { id: "dialogue-system", name: "Dialogue System", category: "game_features", unlockYear: 2, researchCost: 10000, researchPoints: 35, priority: 2, description: "NPC dialogue options", tip: "Great for Adventure and RPG genres" },
    
    // Mid Game Research (Years 6-15)
    { id: "3d-graphics-v1", name: "3D Graphics v1", category: "graphics", unlockYear: 6, researchCost: 50000, researchPoints: 80, priority: 1, prerequisiteIds: ["2d-graphics-v3"], description: "Enter the 3D era", tip: "Essential for modern platforms. Research ASAP when available" },
    { id: "3d-graphics-v2", name: "3D Graphics v2", category: "graphics", unlockYear: 8, researchCost: 100000, researchPoints: 120, priority: 1, prerequisiteIds: ["3d-graphics-v1"], description: "Improved 3D rendering", tip: "Keep graphics tech up to date" },
    { id: "surround-sound", name: "Surround Sound", category: "sound", unlockYear: 7, researchCost: 40000, researchPoints: 60, priority: 2, description: "Immersive audio experience", tip: "Boosts quality for all genres" },
    { id: "multiplayer", name: "Multiplayer", category: "game_features", unlockYear: 8, researchCost: 80000, researchPoints: 100, priority: 2, description: "Online multiplayer support", tip: "Great for Action and Strategy games" },
    { id: "online-play", name: "Online Play", category: "game_features", unlockYear: 10, researchCost: 120000, researchPoints: 150, priority: 2, prerequisiteIds: ["multiplayer"], description: "Internet multiplayer", tip: "Research when online platforms emerge" },
    
    // Late Game Research (Years 16+)
    { id: "3d-graphics-v4", name: "3D Graphics v4", category: "graphics", unlockYear: 12, researchCost: 200000, researchPoints: 200, priority: 1, prerequisiteIds: ["3d-graphics-v2"], description: "High-end 3D graphics", tip: "Needed for AAA games" },
    { id: "hd-audio", name: "HD Audio", category: "sound", unlockYear: 14, researchCost: 150000, researchPoints: 180, priority: 2, description: "High definition audio", tip: "Standard for modern games" },
    { id: "advanced-ai", name: "Advanced AI", category: "ai", unlockYear: 10, researchCost: 100000, researchPoints: 140, priority: 2, description: "Smarter enemy behavior", tip: "Important for Strategy and Simulation" },
    { id: "open-world", name: "Open World", category: "game_features", unlockYear: 12, researchCost: 180000, researchPoints: 220, priority: 3, description: "Non-linear exploration", tip: "Great for Adventure and RPG games" },
    { id: "vr-support", name: "VR Support", category: "hardware", unlockYear: 25, researchCost: 300000, researchPoints: 300, priority: 3, description: "Virtual reality gaming", tip: "Future technology investment" },
  ];
  await db.insert(researchItems).values(researchData);

  // Staff Tips by Game Phase
  const staffData = [
    // Garage Phase (Years 1-5)
    { id: "garage-solo", gamePhase: "garage", category: "hiring", title: "Work Solo in the Garage", description: "You cannot hire staff in the garage phase. Focus on building your skills and saving money for your first office.", priority: 1, minYear: 1, maxYear: 5 },
    { id: "garage-skills", gamePhase: "garage", category: "skills", title: "Balance Your Skills", description: "Train yourself in both Design and Technology. A 700/700 split is optimal for making quality games.", priority: 1, minYear: 1, maxYear: 5 },
    { id: "garage-save", gamePhase: "garage", category: "hiring", title: "Save for First Office", description: "You need 1 million dollars to unlock the first office. Save aggressively in years 4-5.", priority: 2, minYear: 1, maxYear: 5 },
    
    // First Office Phase (Years 6-10)
    { id: "first-hire", gamePhase: "first_office", category: "hiring", title: "Hire Your First Employee", description: "Hire someone with complementary skills. If you're strong in Design, hire someone strong in Technology and vice versa.", priority: 1, minYear: 6, maxYear: 10 },
    { id: "first-training", gamePhase: "first_office", category: "training", title: "Train Immediately", description: "New hires have low stats. Use training to boost their skills quickly. Prioritize their weakest areas first.", priority: 1, minYear: 6, maxYear: 10 },
    { id: "first-specialist", gamePhase: "first_office", category: "specialists", title: "Specialists vs Generalists", description: "Early game: hire generalists who can do multiple tasks. Later: specialists for specific roles in larger teams.", priority: 2, minYear: 6, maxYear: 10 },
    { id: "first-team-size", gamePhase: "first_office", category: "hiring", title: "Team Size Tips", description: "Small games: 1-2 people. Medium games: 2-3 people. Match team size to game size for best efficiency.", priority: 2, minYear: 6, maxYear: 10 },
    
    // Second Office Phase (Years 11-20)
    { id: "second-expand", gamePhase: "second_office", category: "hiring", title: "Expand to 6 Employees", description: "The second office allows up to 6 employees. Gradually hire as your cash flow allows.", priority: 1, minYear: 11, maxYear: 20 },
    { id: "second-roles", gamePhase: "second_office", category: "skills", title: "Assign Roles", description: "Designate 2-3 employees for Design tasks (Art, Story, Sound) and 2-3 for Technology (Engine, AI, Level Design).", priority: 1, minYear: 11, maxYear: 20 },
    { id: "second-large-games", gamePhase: "second_office", category: "hiring", title: "Large Game Teams", description: "Large games need 4+ people. AAA games need 6 people. Ensure you have enough trained staff.", priority: 2, minYear: 11, maxYear: 20 },
    { id: "second-specialists", gamePhase: "second_office", category: "specialists", title: "Hire Specialists", description: "Consider Graphics Specialists, Sound Engineers, and Writers for better game quality in specific areas.", priority: 2, minYear: 11, maxYear: 20 },
    
    // R&D Lab Phase
    { id: "rd-lab-unlock", gamePhase: "rd_lab", category: "hiring", title: "R&D Lab Benefits", description: "The R&D lab allows you to research new engines and hardware. You need at least 4 employees to use it effectively.", priority: 1, minYear: 15 },
    { id: "rd-dedicated", gamePhase: "rd_lab", category: "specialists", title: "Dedicated R&D Staff", description: "Assign 1-2 employees permanently to R&D. They should have high Research speed and Technology skills.", priority: 1, minYear: 15 },
    
    // Hardware Lab Phase
    { id: "hw-lab-unlock", gamePhase: "hardware_lab", category: "hiring", title: "Hardware Lab Team", description: "Creating your own console requires a dedicated team. Assign your best Technology specialists.", priority: 1, minYear: 25 },
    { id: "hw-console-team", gamePhase: "hardware_lab", category: "specialists", title: "Console Development", description: "Building a console needs 2-3 dedicated staff for 6+ months. Plan your team capacity accordingly.", priority: 2, minYear: 25 },
  ];
  await db.insert(staffTips).values(staffData);

  // Timeline Milestones - Key events and platforms
  const timelineData = [
    // Year 1 - Start
    { id: "start-game", year: 1, month: 1, eventType: "tip", title: "Game Start", description: "You begin in your garage with $70K. Make small games to build experience.", importance: "critical", actionAdvice: "Make Action or Adventure games - they're forgiving for beginners" },
    { id: "pc-available", year: 1, month: 1, eventType: "platform_release", title: "PC Platform Available", description: "The PC is your starting platform. No license fee required.", importance: "high", relatedEntityId: "pc", actionAdvice: "Use PC for all your early games" },
    
    // Year 2-4 - Early consoles
    { id: "govodore-64", year: 2, month: 1, eventType: "platform_release", title: "Govodore 64 Released", description: "First affordable console. Good for Casual and Action games.", importance: "medium", relatedEntityId: "govodore-64", actionAdvice: "Consider getting the license if making casual games" },
    { id: "first-hit", year: 2, eventType: "tip", title: "Aim for First Hit", description: "By year 2, try to make a game that scores 7+ to build fans.", importance: "high", actionAdvice: "Focus on good topic-genre combos and proper slider settings" },
    
    // Year 5-6 - Transition
    { id: "office-goal", year: 5, eventType: "tip", title: "Save for Office", description: "You should have close to 1 million by now for your first office.", importance: "critical", actionAdvice: "If not, focus on medium-sized games with good combos" },
    { id: "tes-release", year: 6, month: 3, eventType: "platform_release", title: "TES Released", description: "Major console with large audience. Great for Action games.", importance: "high", relatedEntityId: "tes", actionAdvice: "Strong platform - get the license" },
    { id: "first-office-available", year: 6, eventType: "office_available", title: "First Office Available", description: "With 1 million cash, you can move to your first office and hire staff.", importance: "critical", actionAdvice: "Move as soon as you have the money" },
    
    // Year 8-12 - Growth
    { id: "super-tes", year: 8, month: 11, eventType: "platform_release", title: "Super TES Released", description: "16-bit era begins. Great graphics capabilities.", importance: "high", relatedEntityId: "super-tes", actionAdvice: "Upgrade from TES - this is the hot platform" },
    { id: "playsystem", year: 11, month: 12, eventType: "platform_release", title: "PlaySystem Released", description: "Revolutionary 3D console. The future of gaming.", importance: "critical", relatedEntityId: "playsystem", actionAdvice: "ESSENTIAL: Get this license and research 3D graphics" },
    { id: "3d-era", year: 11, eventType: "feature_unlock", title: "3D Graphics Era", description: "3D graphics become essential for high-scoring games.", importance: "critical", actionAdvice: "Research 3D Graphics v1 immediately when available" },
    
    // Year 13-18 - Peak
    { id: "dreamvast", year: 13, month: 11, eventType: "platform_release", title: "DreamVast Released", description: "Advanced console with online capabilities.", importance: "high", relatedEntityId: "dreamvast", actionAdvice: "Good platform for experimental games" },
    { id: "playsystem-2", year: 15, month: 10, eventType: "platform_release", title: "PlaySystem 2 Released", description: "Best-selling console ever. Massive audience.", importance: "critical", relatedEntityId: "playsystem-2", actionAdvice: "Must-have platform - huge install base" },
    { id: "second-office-time", year: 15, eventType: "tip", title: "Consider Second Office", description: "By now you should be ready to expand to a larger office.", importance: "high", actionAdvice: "Need 5 million cash for second office" },
    { id: "mbox", year: 16, month: 11, eventType: "platform_release", title: "mBox Released", description: "New competitor in the console market.", importance: "high", relatedEntityId: "mbox", actionAdvice: "Good for Western markets" },
    
    // Year 20+ - Modern era
    { id: "playsystem-3", year: 21, month: 11, eventType: "platform_release", title: "PlaySystem 3 Released", description: "HD gaming arrives. High development costs.", importance: "high", relatedEntityId: "playsystem-3", actionAdvice: "Focus on quality over quantity" },
    { id: "mbox-360", year: 20, month: 11, eventType: "platform_release", title: "mBox 360 Released", description: "Strong online features and achievement system.", importance: "high", relatedEntityId: "mbox-360", actionAdvice: "Great for multiplayer games" },
    { id: "own-console", year: 25, eventType: "feature_unlock", title: "Create Your Own Console", description: "Hardware lab allows you to design your own gaming console.", importance: "medium", actionAdvice: "Only attempt if financially stable" },
    
    // Tips throughout
    { id: "genre-combo-tip", year: 3, eventType: "tip", title: "Master Topic-Genre Combos", description: "The right topic-genre combination is crucial for success.", importance: "high", actionAdvice: "Use this guide to find optimal combinations" },
    { id: "sequel-strategy", year: 7, eventType: "tip", title: "Sequel Strategy", description: "Sequels to successful games perform better. Build franchises.", importance: "medium", actionAdvice: "Wait for a 9+ score before making sequels" },
    { id: "engine-importance", year: 10, eventType: "tip", title: "Custom Engine Benefits", description: "Building custom game engines improves game quality significantly.", importance: "high", actionAdvice: "Invest in R&D lab for engine development" },
    { id: "aaa-games", year: 18, eventType: "tip", title: "AAA Game Development", description: "Large team + Custom Engine + Proper marketing = AAA success.", importance: "high", actionAdvice: "Only attempt AAA games with experienced team" },
  ];
  await db.insert(timelineMilestones).values(timelineData);

  console.log("Guide data (research, staff, timeline) seeded successfully!");
}

// Export function to seed guide data
export async function seedGuideDataIfNeeded() {
  const existingResearch = await db.select().from(researchItems).limit(1);
  if (existingResearch.length === 0) {
    console.log("Seeding guide data...");
    await seedGuideData();
  }
}
