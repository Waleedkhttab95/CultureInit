# CultureInit (مبادرة الإدارة الثقافية)

Arabic (RTL) cultural-management initiative: a content platform (articles, resources, programs) with a CMS. React + Vite client, Express server, Drizzle/Neon Postgres. Deployed on Render. CMS serves two sites (cultural + write-community) via the `articles.site` column.

## Design Context

### Users
Arabic-speaking (RTL) audience: academics, university students, and culturally-interested general readers. They read articles, browse resources, discover programs, and register/publish. Reading-heavy sessions across desktop and mobile.

### Brand Personality
Warm and inviting above all — approachable and human, encouraging broad participation while remaining credible. Three words: **warm, cultural, welcoming**. A first-time visitor should feel invited in, not lectured at. Arabic cultural identity is central; typography and RTL correctness carry the brand.

### Aesthetic Direction
Reference-based, from leading Arabic cultural-initiative sites. Identity palette:
- Primary orange `25 86% 54%` (#FF971A)
- Cultural green `174 65% 33%` (#1C937F)
- Knowledge blue `193 88% 58%` (#3BCDF4)
- Creative pink `338 63% 40%` (#AA2451)
- Dark slate `200 20% 20%` (#26373F)

Soft orange→green hero gradients; calm tinted backgrounds from the identity; strong Arabic-text contrast. Typeface is **Greta Arabic** (self-hosted, weights 300/400/500/700). Both **light and dark** themes are first-class and equally polished. Anti-reference: generic AI-slop (cyan-on-dark, purple gradients, glassmorphism, identical card grids) and anything cold/corporate.

### Design Principles
1. **Warmth first** — inviting color, generous breathing room, human copy. Never cold or clinical.
2. **Arabic is the system** — flawless RTL, Greta Arabic everywhere, type hierarchy tuned for Arabic reading.
3. **Identity-driven color** — use the five identity colors via design tokens; no hard-coded hexes; tint neutrals toward the brand.
4. **Calm, purposeful motion** — gentle staggered fade-ins and soft hover; no bounce, no excess; respect reduced-motion.
5. **Both themes, equally cared for** — every surface must read clearly and warmly in light and dark, meeting WCAG AA (4.5:1 text).
