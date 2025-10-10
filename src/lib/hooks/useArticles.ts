import { useQuery } from "@tanstack/react-query";
import articlesService from "../services/articles";

export const ARTICLES_QUERY_KEY = ["articles"] as const;

export function useArticles(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...ARTICLES_QUERY_KEY, params ?? {}],
    queryFn: () => articlesService.fetchArticles(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export default useArticles;
