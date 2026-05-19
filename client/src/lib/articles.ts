// Public (read-only) article API. Content is server-sanitized HTML.

export interface PublicArticle {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
}

export async function fetchArticles(): Promise<PublicArticle[]> {
  const res = await fetch("/api/articles");
  if (!res.ok) throw new Error("Failed to load articles");
  return res.json();
}

export async function fetchArticle(slug: string): Promise<PublicArticle> {
  const res = await fetch(`/api/articles/${encodeURIComponent(slug)}`);
  if (res.status === 404) throw new Error("not-found");
  if (!res.ok) throw new Error("Failed to load article");
  return res.json();
}
