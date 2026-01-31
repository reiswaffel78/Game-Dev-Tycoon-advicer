import { TFunction } from "i18next";

export function translateGenre(t: TFunction, id: string, fallbackName: string): string {
  const key = `data.genres.${id}.name`;
  const translated = t(key);
  return translated !== key ? translated : fallbackName;
}

export function translateTopic(t: TFunction, id: string, fallbackName: string): string {
  const key = `data.topics.${id}.name`;
  const translated = t(key);
  return translated !== key ? translated : fallbackName;
}

export function translatePlatform(t: TFunction, id: string, fallbackName: string): string {
  const key = `data.platforms.${id}.name`;
  const translated = t(key);
  return translated !== key ? translated : fallbackName;
}

export function translateAudience(t: TFunction, id: string, fallbackName: string): string {
  const key = `data.audiences.${id}.name`;
  const translated = t(key);
  return translated !== key ? translated : fallbackName;
}
