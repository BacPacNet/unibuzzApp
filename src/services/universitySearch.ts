import { useQuery } from "@tanstack/react-query";
import { client } from "./api-client";
import useDebounce from "@/hooks/useDebounce";

export async function getUniversitySearch(searchTerm: string): Promise<any[]> {
  if (!searchTerm) return [];

  // Fetch university data based on the search term
  const response = await client(
    `/university/searched?searchTerm=${encodeURIComponent(searchTerm)}`,
  );

  // TypeScript assumes `response` is of type `University[]`
  return response;
}

export function useUniversitySearch(searchTerm: string) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return useQuery<any, Error>({
    queryKey: ["universitySearch", debouncedSearchTerm],
    queryFn: () => getUniversitySearch(debouncedSearchTerm),
    enabled: Boolean(debouncedSearchTerm), // Only run if there's a search term
    staleTime: 1000 * 60 * 5, // Optional: Cache data for 5 minutes
    retry: false, // Optional: Prevent retries on failure
  });
}
