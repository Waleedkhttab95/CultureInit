// Page copy shared by the React page AND the server (server/seo.ts renders it
// into the HTML so crawlers see real content). Edit text here, not in the page.
export const COPY = {
  ar: {
    badge: "المسارات الرئيسية",
    heading: "ثلاثة مسارات متكاملة لتطوير الإدارة الثقافية",
    intro: "نقدم محتوى متنوعًا ومتخصصًا يلبي احتياجات الفاعلين بالقطاع الثقافي",
    explore: (title: string) => `استكشف ${title}`,
    articles: {
      title: "المقالات",
      description:
        "مقالات تعريفية وتحليلية عن مفاهيم الإدارة الثقافية، وتجارب عربية وعالمية في إدارة البرامج الثقافية.",
    },
    resources: {
      title: "الموارد",
      description:
        "أدلة تطبيقية وكتيبات مهنية في الإدارة الثقافية، وأدوات عملية لتصميم البرامج الثقافية.",
    },
    programs: {
      title: "البرامج",
      description:
        "ورش عمل تدريبية قصيرة، وبرامج تأهيلية، وحوارات إثرائية في موضوعات الإدارة الثقافية.",
    },
  },
  en: {
    badge: "Core tracks",
    heading: "Three integrated tracks to advance cultural management",
    intro: "Diverse, specialized content that meets the needs of professionals across the cultural sector.",
    explore: (title: string) => `Explore ${title}`,
    articles: {
      title: "Articles",
      description:
        "Introductory and analytical articles on cultural management concepts, plus Arab and international experiences in running cultural programs.",
    },
    resources: {
      title: "Resources",
      description:
        "Practical guides and professional handbooks in cultural management, with hands-on tools for designing cultural programs.",
    },
    programs: {
      title: "Programs",
      description:
        "Short training workshops, qualification programs and enriching dialogues on cultural management topics.",
    },
  },
};
