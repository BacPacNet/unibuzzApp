import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "../api-client";
import useDebounce from "@/hooks/useDebounce";
import { getToken } from "@/storage/token";
import { ProfileConnection } from "@/types/connections";

export async function getAllUsersForConnections(
  token: string,
  page: number,
  limit: number,
  name: string,
  universityName: string,
  studyYear: string[],
  major: string[],
  occupation: string[],
  affiliation: string[],
): Promise<ProfileConnection> {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));
  if (name) params.append("name", name);
  if (universityName) params.append("universityName", universityName);
  if (studyYear?.length) params.append("studyYear", studyYear.join(","));
  if (major?.length) params.append("major", major.join(","));
  if (occupation?.length) params.append("occupation", occupation.join(","));
  if (affiliation?.length) params.append("affiliation", affiliation.join(","));

  return await client(`/users/connections?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function useUsersProfileForConnections(
  name: string,
  limit: number,
  enabled: boolean,
  universityName: string = "",
  studyYear?: string[],
  major?: string[],
  occupation?: string[],
  affiliation?: string[],
) {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(name, 1000);

  return useInfiniteQuery({
    queryKey: ["usersProfileForConnections", debouncedSearchTerm],
    queryFn: ({ pageParam = 1 }) =>
      getAllUsersForConnections(
        cookieValue,
        pageParam,
        limit,
        debouncedSearchTerm,
        universityName,
        studyYear || [],
        major || [],
        occupation || [],
        affiliation || [],
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!cookieValue && enabled,
  });
}
