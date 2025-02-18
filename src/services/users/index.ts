import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "../api-client";
import useDebounce from "@/hooks/useDebounce";
import { getToken } from "@/storage/token";
import { ProfileConnection } from "@/types/connections";

export async function getAllUsersForConnections(
  token: string,
  page: number,
  limit: number,
  name: string
): Promise<ProfileConnection> {
  return await client(
    `/users/connections?page=${page}&limit=${limit}&name=${name}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function useUsersProfileForConnections(
  name: string,
  limit: number,
  enabled: boolean
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
        debouncedSearchTerm
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
