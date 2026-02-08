import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../client/src/entry-server";
import {
  OG_LOCALES,
  getCanonicalUrl,
  type PageKey,
} from "../client/src/seo/seo";
import { SUPPORTED_LOCALES, type Locale } from "../client/src/lib/locale";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.resolve(__dirname, "../client/index.html");
const template = readFileSync(templatePath, "utf-8");

const cases: Array<{ url: string; locale: Locale; pageKey: PageKey }> = [
  { url: "/checklist", locale: "en", pageKey: "checklist" },
  { url: "/checklist/de/", locale: "de", pageKey: "checklist" },
  { url: "/checklist/fr/", locale: "fr", pageKey: "checklist" },
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

await Promise.all(
  cases.map(async ({ url, locale, pageKey }) => {
    const { html: appHtml, helmet } = await render(url);
    const html = buildHtml({ appHtml, helmet });
    const head = extractHead(html);
    const canonical = getCanonicalUrl(pageKey, locale);

    assert.equal(
      countMatches(head, /<title>[\s\S]*?<\/title>/gi),
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

    assert.equal(
      extractHtmlLang(html),
      locale,
      `${url}: expected html lang=${locale}`,
    );
    const canonicalTag = findTag(
      head,
      /<link\b[^>]*\brel=["']canonical["'][^>]*>/i,
    );
    assert.equal(
      canonicalTag ? extractAttr(canonicalTag, "href") : undefined,
      canonical,
      `${url}: canonical mismatch`,
    );
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

    const jsonLdScripts = extractScriptContents(
      head,
      /<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    );
    assert.equal(
      jsonLdScripts.length,
      1,
      `${url}: expected 1 JSON-LD script`,
    );
    const jsonLd = JSON.parse(jsonLdScripts[0]);
    assert.equal(
      jsonLd.inLanguage,
      locale,
      `${url}: JSON-LD inLanguage mismatch`,
    );
    assert.equal(jsonLd.url, canonical, `${url}: JSON-LD url mismatch`);
  }),
);

console.log("SEO head checks passed.");
