// Admin API helpers. All requests are same-origin with the session cookie;
// state-changing requests must echo the session CSRF token in a header.

export type ArticleSite = "cultural" | "write-community";

export interface AdminArticle {
  id: string;
  site: ArticleSite;
  slug: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  category: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleInput {
  site?: ArticleSite;
  slug?: string;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  image: string;
  content: string;
  category?: string | null;
  published: boolean;
}

let csrfToken: string | null = null;
export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

async function parseError(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.message || body.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

async function adminFetch(
  method: string,
  url: string,
  data?: unknown,
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (data !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET" && csrfToken) headers["X-CSRF-Token"] = csrfToken;

  const res = await fetch(url, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await parseError(res));
  return res;
}

export interface MeResponse {
  authenticated: boolean;
  csrfToken?: string;
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await fetch("/api/admin/me", { credentials: "include" });
  if (res.status === 401) {
    setCsrfToken(null);
    return { authenticated: false };
  }
  if (!res.ok) throw new Error(await parseError(res));
  const body = (await res.json()) as MeResponse;
  if (body.csrfToken) setCsrfToken(body.csrfToken);
  return body;
}

export async function login(username: string, password: string) {
  const res = await adminFetch("POST", "/api/admin/login", {
    username,
    password,
  });
  const body = (await res.json()) as MeResponse;
  if (body.csrfToken) setCsrfToken(body.csrfToken);
  return body;
}

export async function logout() {
  await adminFetch("POST", "/api/admin/logout");
  setCsrfToken(null);
}

export async function listArticles(
  site: ArticleSite = "cultural",
): Promise<AdminArticle[]> {
  return (
    await adminFetch(
      "GET",
      `/api/admin/articles?site=${encodeURIComponent(site)}`,
    )
  ).json();
}

export async function getArticle(id: string): Promise<AdminArticle> {
  return (await adminFetch("GET", `/api/admin/articles/${id}`)).json();
}

export async function createArticle(input: ArticleInput): Promise<AdminArticle> {
  return (await adminFetch("POST", "/api/admin/articles", input)).json();
}

export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>,
): Promise<AdminArticle> {
  return (await adminFetch("PUT", `/api/admin/articles/${id}`, input)).json();
}

export async function deleteArticle(id: string): Promise<void> {
  await adminFetch("DELETE", `/api/admin/articles/${id}`);
}

export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const headers: Record<string, string> = {};
  if (csrfToken) headers["X-CSRF-Token"] = csrfToken;
  const res = await fetch("/api/admin/images", {
    method: "POST",
    headers,
    body: form,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()).url as string;
}
