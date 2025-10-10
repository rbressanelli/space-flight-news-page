import api from "../axios";

export type Article = {
  id: string;
  title: string;
  url: string;
  imageUrl?: string | null;
  image_url?: string | null;
  newsSite?: string | null;
  news_site?: string | null;
  summary?: string | null;
  publishedAt?: string | null;
  // extra properties from API are allowed but typed as unknown
  [key: string]: unknown;
};

export const fetchArticles = async (params?: Record<string, unknown>) => {
  // params supports pagination: limit, offset and other filters
  const res = await api.get("/articles/", { params });
  // Return the full paginated response: { count, next, previous, results }
  return res.data as {
    count: number;
    next: string | null;
    previous: string | null;
    results: Article[];
  };
};

const articlesService = { fetchArticles };
export default articlesService;
