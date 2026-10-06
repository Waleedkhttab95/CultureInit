// Page copy shared by the React page AND the server (server/seo.ts renders it
// into the HTML so crawlers see real content). Edit text here, not in the page.
import { PAGES } from "../seo";

export const COPY = {
  ar: {
    title: "المقالات",
    intro: PAGES.articles.meta.ar.description,
    loading: "جارٍ التحميل...",
    error: "تعذّر تحميل المقالات. حاول لاحقًا.",
    empty: "لا توجد مقالات منشورة حاليًا.",
    readMore: "اقرأ المزيد",
  },
  en: {
    title: "Articles",
    intro: PAGES.articles.meta.en.description,
    loading: "Loading...",
    error: "We couldn't load the articles. Please try again later.",
    empty: "No articles have been published yet.",
    readMore: "Read more",
  },
};
