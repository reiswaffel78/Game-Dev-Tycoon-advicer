import { storage } from "../server/storage";
import { generatePlannerRecommendations } from "../server/recommendation-engine";

const topics = [
  { id: "t1", name: "Fantasy", unlockYear: 1, researchCost: 10, createdAt: null },
  { id: "t2", name: "Sci-Fi", unlockYear: 2, researchCost: 10, createdAt: null },
] as any;

const genres = [
  { id: "g1", name: "RPG", unlockYear: 1, researchCost: 10, createdAt: null },
] as any;

const platforms = [
  { id: "p1", name: "PC", releaseYear: 1, licenseCost: 0, genre: null, marketShare: null, createdAt: null },
] as any;

const audiences = [
  { id: "a1", name: "Everyone", createdAt: null },
] as any;

const topicGenreFits = [
  { topicId: "t1", genreId: "g1", fitValue: 3, sourceId: "s1", createdAt: null },
  { topicId: "t2", genreId: "g1", fitValue: 2, sourceId: "s1", createdAt: null },
] as any;

const platformGenreFits = [
  { platformId: "p1", genreId: "g1", fitValue: 2, sourceId: "s1", createdAt: null },
] as any;

const platformAudienceFits = [
  { platformId: "p1", audienceId: "a1", fitValue: 1, sourceId: "s1", createdAt: null },
] as any;

storage.getAllTopics = async () => topics;
storage.getAllGenres = async () => genres;
storage.getAllPlatforms = async () => platforms;
storage.getAllAudiences = async () => audiences;
storage.getTopicGenreFits = async () => topicGenreFits;
storage.getPlatformGenreFits = async () => platformGenreFits;
storage.getPlatformAudienceFits = async () => platformAudienceFits;

function signature(recs: Awaited<ReturnType<typeof generatePlannerRecommendations>>) {
  return recs.releases
    .slice(0, 5)
    .map((r) => `${r.topic.id}-${r.genre.id}-${r.platform.id}-${r.audience.id}-${r.score}`)
    .join("|");
}

async function main() {
  const base = await generatePlannerRecommendations(1, 1, 70000, 0, false);
  const filterOff = await generatePlannerRecommendations(1, 1, 70000, 0, false, false, ["t1"]);
  const filterOnEmpty = await generatePlannerRecommendations(1, 1, 70000, 0, false, true, []);

  const baseSig = signature(base);
  if (baseSig !== signature(filterOff)) {
    throw new Error("Regression: planner output changed when unlocked topics filter is OFF");
  }

  if (baseSig !== signature(filterOnEmpty)) {
    throw new Error("Regression: planner output changed when unlocked topics filter has no selected topics");
  }

  console.log("Planner filter regression check passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
