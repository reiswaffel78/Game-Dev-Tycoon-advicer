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
    } else {
      console.log("Database already seeded, skipping...");
    }
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
