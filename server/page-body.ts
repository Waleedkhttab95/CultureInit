import { COPY as HERO } from "@shared/copy/home-hero";
import { COPY as ABOUT } from "@shared/copy/home-about";
import { COPY as TRACKS } from "@shared/copy/home-tracks";
import { COPY as ARTICLES_COPY } from "@shared/copy/articles";
import { COPY as RESOURCES_COPY } from "@shared/copy/resources";
import { COPY as SERVICES } from "@shared/copy/services";
import { COPY as PROGRAMS } from "@shared/copy/programs";
import { COPY as POLICY } from "@shared/copy/publishing-policy";
import { COPY as PUBLISH } from "@shared/copy/publish-with-us";
import type { Locale, PageKey } from "@shared/seo";

// Server-rendered page body. The React app mounts into the same #root and
// replaces this markup on load; until then — and for crawlers that never run
// JavaScript — this is the page's real content (headings, copy, lists).
// The copy objects live in shared/copy so the page and this renderer can't drift.

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const p = (text: string) => `<p>${esc(text)}</p>`;
const ul = (items: string[]) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

export function staticBody(key: PageKey, locale: Locale): string | undefined {
  const l = locale;
  switch (key) {
    case "home": {
      const h = HERO[l];
      const a = ABOUT[l];
      const t = TRACKS[l];
      return [
        `<h1>${esc(h.h1)}</h1>`,
        p(h.description),
        `<section><h2>${esc(a.heading)}</h2>${p(a.intro)}`,
        `<h3>${esc(a.vision)}</h3>${p(a.visionText)}`,
        `<h3>${esc(a.mission)}</h3>${p(a.missionText)}</section>`,
        `<section><h2>${esc(t.heading)}</h2>${p(t.intro)}`,
        ...[t.articles, t.resources, t.programs].map((x) => `<h3>${esc(x.title)}</h3>${p(x.description)}`),
        `</section>`,
      ].join("");
    }
    case "articles": {
      const c = ARTICLES_COPY[l];
      return `<h1>${esc(c.title)}</h1>${p(c.intro)}`;
    }
    case "resources": {
      const c = RESOURCES_COPY[l];
      return `<h1>${esc(c.title)}</h1>${p(c.intro)}${c.arabicNote ? p(c.arabicNote) : ""}`;
    }
    case "services": {
      const c = SERVICES[l];
      const pillar = (title: string, n: string, body: string, items: string[]) =>
        `<section><h2>${esc(title)}</h2><p>${esc(c.serviceN(n))}</p>${p(body)}<h3>${esc(c.includes)}</h3>${ul(items)}</section>`;
      return [
        `<h1>${esc(c.heading)}</h1>`,
        p(c.heroSub),
        pillar(c.pillars.content, "01", c.pContent, c.contentItems),
        pillar(c.pillars.design, "02", c.pDesign, c.designItems),
        pillar(c.pillars.education, "03", c.pEdu, c.educationItems),
        `<section><h2>${esc(c.formHeading)}</h2>${p(c.formIntro)}</section>`,
      ].join("");
    }
    case "programs": {
      const c = PROGRAMS[l];
      return [
        `<h1>${esc(c.programName)}</h1>`,
        p(c.heroSub),
        ul(c.bullets),
        `<section><h2>${esc(c.whyH)}</h2>${p(c.quote)}${p(c.why1)}${p(`${c.why2a}${c.why2b}${c.why2c}`)}</section>`,
        `<section><h2>${esc(c.whoH)}</h2>${p(c.whoSub)}${ul(c.audience)}</section>`,
        `<section><h2>${esc(c.learnH)}</h2>${p(c.learnSub)}`,
        ...c.courses.map((course) => `<h3>${esc(course.title)}</h3>${p(course.description)}`),
        `</section>`,
        `<section><h2>${esc(c.gradH)}</h2>${p(c.gradP)}</section>`,
        `<section><h2>${esc(c.toolsH)}</h2>${p(c.toolsSub)}${ul(c.tools)}</section>`,
        `<section><h2>${esc(c.timeH)}</h2>${ul(c.timeline.map((s) => `${s.phase}: ${s.date}`))}</section>`,
        `<section><h2>${esc(c.accH)}</h2>${p(c.accP)}</section>`,
        `<section><h2>${esc(c.ctaH)}</h2>${p(c.ctaP)}</section>`,
      ].join("");
    }
    case "publishingPolicy": {
      const c = POLICY[l];
      return [
        `<h1>${esc(c.title)}</h1>`,
        ul(c.items.map((i) => `${i.label} ${i.text}`)),
        `<h2>${esc(c.stepsHeading)}</h2>`,
        `<ol>${c.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`,
      ].join("");
    }
    case "publishWithUs": {
      const c = PUBLISH[l];
      // The first requirements from the publishing policy, so the form page
      // tells visitors what to prepare before they submit.
      const requirements = POLICY[l].items.slice(0, 4).map((i) => `${i.label} ${i.text}`);
      return `<h1>${esc(c.heading)}</h1>${p(c.intro)}${ul(requirements)}`;
    }
    default:
      return undefined;
  }
}
