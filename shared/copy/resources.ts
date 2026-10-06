// Page copy shared by the React page AND the server (server/seo.ts renders it
// into the HTML so crawlers see real content). Edit text here, not in the page.
import { PAGES } from "../seo";

export const COPY = {
  ar: {
    title: "الموارد",
    intro: PAGES.resources.meta.ar.description,
    arabicNote: "",
    download: "تحميل الدليل",
  },
  en: {
    title: "Resources",
    intro: PAGES.resources.meta.en.description,
    arabicNote: "Our guides are published in Arabic.",
    download: "Download the guide",
  },
};
