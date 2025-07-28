import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: admin, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
  };
}