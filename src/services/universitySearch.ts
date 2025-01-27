import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

type universitySearch = {
  Universities: any;
  currentPage: number;
  totalPages: number;
  totalNotifications: number;
};

export async function getFilteredUniversity(
  page: number,
  limit: number,
  searchQuery: string,
) {
  const response: universitySearch = await client(
    `/university?page=${page}&limit=${limit}&searchQuery=${searchQuery}`,
  );
  return response;
}

export function useGetFilteredUniversity(limit: number, query: string = "") {
  return useInfiniteQuery({
    queryKey: ["university", { query, limit }],
    queryFn: ({ pageParam = 1 }) =>
      getFilteredUniversity(pageParam, limit, query),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
