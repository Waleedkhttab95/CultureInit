import { useQuery } from "@tanstack/react-query";
import { fetchMe, type MeResponse } from "@/lib/adminApi";

// Single source of truth for admin auth state. The query result drives the
// client-side route guard; real enforcement is server-side on every
// /api/admin/* route.
export function useAdminAuth() {
  const query = useQuery<MeResponse>({
    queryKey: ["admin", "me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 60_000,
  });

  return {
    isLoading: query.isLoading,
    isAuthenticated: query.data?.authenticated === true,
    refetch: query.refetch,
  };
}
