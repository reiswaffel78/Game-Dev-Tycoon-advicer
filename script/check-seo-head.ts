import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../client/src/entry-server";
import {
  BASE_URL,
  OG_LOCALES,
  getCanonicalUrl,
  getXDefaultHref,
  type PageKey,
} from "../client/src/seo/seo";
import {
  SUPPORTED_LOCALES,
  buildLocalizedPath,
  type Locale,
} from "../client/src/lib/locale";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, "../client/index.html");
const template = readFileSync(templatePath, "utf-8");

const cases: Array<{
  url: string;
  locale: Locale;
  pageKey: PageKey;
  dynamicSlug?: string;
}> = [
  // Existing static-page cases (must remain unaffected)
  { url: "/checklist", locale: "en", pageKey: "checklist" },
  { url: "/checklist/de/", locale: "de", pageKey: "checklist" },
  { url: "/checklist/fr/", locale: "fr", pageKey: "checklist" },
  // Dynamic detail pages
  {
    url: "/recommend/topic/aliens",
    locale: "en",
    pageKey: "topicRecommender",
    dynamicSlug: "aliens",
  },
  {
    url: "/recommend/topic/aliens/de/",
    locale: "de",
    pageKey: "topicRecommender",
    dynamicSlug: "aliens",
  },
  {
    url: "/recommend/platform/pc/ja/",
    locale: "ja",
    pageKey: "platformRecommender",
    dynamicSlug: "pc",
  },
  {
    url: "/sliders/action/fr/",
    locale: "fr",
    pageKey: "sliders",
    dynamicSlug: "action",
  },
];

function buildHtml({
  appHtml,
  helmet,
}: {
  appHtml: string;
  helmet: {
    title?: { toString(): string };
    meta?: { toString(): string };
    link?: { toString(): string };
    script?: { toString(): string };
    htmlAttributes?: { toString(): string };
    bodyAttributes?: { toString(): string };
  };
}) {
  const helmetHead = [
    helmet?.title?.toString() || "",
    helmet?.meta?.toString() || "",
    helmet?.link?.toString() || "",
    helmet?.script?.toString() || "",
  ]
    .filter(Boolean)
    .join("\n");

  let finalHtml = template;

  const htmlAttrs = helmet?.htmlAttributes?.toString() || "";
  if (htmlAttrs) {
    finalHtml = finalHtml.replace("<html", `<html ${htmlAttrs}`);
  }

  const bodyAttrs = helmet?.bodyAttributes?.toString() || "";
  if (bodyAttrs) {
    finalHtml = finalHtml.replace("<body", `<body ${bodyAttrs}`);
  }

  finalHtml = finalHtml.replace("</head>", `${helmetHead}\n</head>`);
  finalHtml = finalHtml.replace(
    `<div id="root"></div>`,
    `<div id="root">${appHtml}</div>`,
  );

  return finalHtml;
}

function extractHead(html: string): string {
  const match = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  assert.ok(match, "Expected <head> tag");
  return match[1];
}

function extractHtmlLang(html: string): string | undefined {
  const match = html.match(/<html[^>]*\blang=["']([^"']+)["'][^>]*>/i);
  return match?.[1];
}

function countMatches(source: string, regex: RegExp): number {
  return source.match(regex)?.length ?? 0;
}

function extractAttr(tag: string, attr: string): string | undefined {
  const match = tag.match(new RegExp(`${attr}=["']([^"']+)["']`, "i"));
  return match?.[1];
}

function findTag(source: string, regex: RegExp): string | undefined {
  const match = source.match(regex);
  return match?.[0];
}

function extractScriptContents(source: string, regex: RegExp): string[] {
  const matches = source.matchAll(regex);
  return Array.from(matches, (match) => match[1]);
}

/** Extract all hreflang alternate links as a map of { hreflang → href }. */
function extractHreflangMap(head: string): Map<string, string> {
  const map = new Map<string, string>();
  const allTags = head.matchAll(
    /<link\b[^>]*\brel=["']alternate["'][^>]*\bhreflang=["']([^"']+)["'][^>]*>/gi,
  );
  for (const match of allTags) {
    const tag = match[0];
    const lang = match[1];
    const href = extractAttr(tag, "href") ?? "";
    map.set(lang, href);
  }
  return map;
}

await Promise.all(
  cases.map(async ({ url, locale, pageKey, dynamicSlug }) => {
    const { html: appHtml, helmet } = await render(url);
    const html = buildHtml({ appHtml, helmet });
    const head = extractHead(html);
    const canonical = getCanonicalUrl(pageKey, locale, dynamicSlug);

    // ── Structural counts ──────────────────────────────────────────────────
    assert.equal(
      // Allow for optional attributes on <title> (e.g. data-rh="true")
      countMatches(head, /<title\b[^>]*>[\s\S]*?<\/title>/gi),
      1,
      `${url}: expected 1 <title>`,
    );
    assert.equal(
      countMatches(head, /<meta\b[^>]*\bname=["']description["'][^>]*>/gi),
      1,
      `${url}: expected 1 meta description`,
    );
    assert.equal(
      countMatches(head, /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi),
      1,
      `${url}: expected 1 canonical`,
    );
    assert.equal(
      countMatches(
        head,
        /<link\b[^>]*\brel=["']alternate["'][^>]*\bhreflang=["'][^"']+["'][^>]*>/gi,
      ),
      SUPPORTED_LOCALES.length + 1,
      `${url}: expected ${SUPPORTED_LOCALES.length + 1} hreflang links`,
    );

    // ── HTML lang attribute ────────────────────────────────────────────────
    assert.equal(
      extractHtmlLang(html),
      locale,
      `${url}: expected html lang=${locale}`,
    );

    // ── Canonical URL ──────────────────────────────────────────────────────
    const canonicalTag = findTag(
      head,
      /<link\b[^>]*\brel=["']canonical["'][^>]*>/i,
    );
    assert.equal(
      canonicalTag ? extractAttr(canonicalTag, "href") : undefined,
      canonical,
      `${url}: canonical mismatch`,
    );

    // ── OG tags ───────────────────────────────────────────────────────────
    const ogUrlTag = findTag(
      head,
      /<meta\b[^>]*\bproperty=["']og:url["'][^>]*>/i,
    );
    assert.equal(
      ogUrlTag ? extractAttr(ogUrlTag, "content") : undefined,
      canonical,
      `${url}: og:url mismatch`,
    );
    const ogLocaleTag = findTag(
      head,
      /<meta\b[^>]*\bproperty=["']og:locale["'][^>]*>/i,
    );
    assert.equal(
      ogLocaleTag ? extractAttr(ogLocaleTag, "content") : undefined,
      OG_LOCALES[locale],
      `${url}: og:locale mismatch`,
    );

    // ── JSON-LD: find the page's main schema object (has inLanguage) ───────
    const jsonLdScripts = extractScriptContents(
      head,
      /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    );
    assert.ok(
      jsonLdScripts.length >= 1,
      `${url}: expected at least 1 JSON-LD script, got ${jsonLdScripts.length}`,
    );
    // The main page schema is the script that carries `inLanguage`.
    const mainJsonLd = jsonLdScripts
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch {
          return null;
        }
      })
      .find((obj) => obj && "inLanguage" in obj);
    assert.ok(mainJsonLd, `${url}: no JSON-LD script with inLanguage found`);
    assert.equal(
      mainJsonLd.inLanguage,
      locale,
      `${url}: JSON-LD inLanguage mismatch`,
    );
    assert.equal(mainJsonLd.url, canonical, `${url}: JSON-LD url mismatch`);

    // ── Dynamic detail pages: verify per-locale hreflang hrefs ────────────
    if (dynamicSlug) {
      const hreflangMap = extractHreflangMap(head);
      const pageBasePaths: Record<PageKey, string> = {
        topicRecommender: "/recommend/topic",
        genreRecommender: "/recommend/genre",
        platformRecommender: "/recommend/platform",
        sliders: "/sliders",
        // The remaining page keys are not used for dynamic slugs; include
        // them to satisfy the Record<PageKey, string> type.
        dashboard: "/",
        guide: "/game-dev-tycoon-guide",
        bestCombos: "/game-dev-tycoon-best-combos",
        slidersExplained: "/game-dev-tycoon-sliders",
        researchOrder: "/game-dev-tycoon-research-order",
        planner: "/planner",
        research: "/research",
        staff: "/staff",
        timeline: "/timeline",
        checklist: "/checklist",
        faq: "/faq",
        handbuch: "/handbuch",
        appGuide: "/app-guide",
        privacy: "/privacy",
        sources: "/sources",
      };
      const basePath = `${pageBasePaths[pageKey]}/${dynamicSlug}`;

      // All 19 locale hreflang links must point to the detail URL.
      for (const supportedLocale of SUPPORTED_LOCALES) {
        const expected = `${BASE_URL}${buildLocalizedPath(basePath, supportedLocale)}`;
        assert.equal(
          hreflangMap.get(supportedLocale),
          expected,
          `${url}: hreflang[${supportedLocale}] mismatch — expected ${expected}`,
        );
      }

      // x-default must point to the English detail URL.
      const xDefault = getXDefaultHref(pageKey, dynamicSlug);
      assert.equal(
        hreflangMap.get("x-default"),
        xDefault,
        `${url}: hreflang[x-default] mismatch — expected ${xDefault}`,
      );
    }
  }),
);

console.log("SEO head checks passed.");
