// Page copy shared by the React page AND the server (server/seo.ts renders it
// into the HTML so crawlers see real content). Edit text here, not in the page.
import { PAGES } from "../seo";

export const COPY = {
  ar: {
    h1: "منصة الإدارة الثقافية — منصة معرفية متخصصة في الإدارة الثقافية",
    logoAlt: "منصة الإدارة الثقافية",
    description: PAGES.home.meta.ar.description,
    scroll: "انتقل إلى المحتوى",
  },
  en: {
    h1: "Cultural Management Platform — a specialist knowledge platform for cultural management",
    logoAlt: "Cultural Management Platform",
    description: PAGES.home.meta.en.description,
    scroll: "Scroll to content",
  },
};
