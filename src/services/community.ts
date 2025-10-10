import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import useDebounce from "@/hooks/useDebounce";
import { userProfileType } from "@/types/users";
import { getToken } from "@/storage/token";
import { client } from "./api-client";

interface CommunityUsersReponse {
  success: boolean;
  data: userProfileType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetchCommunityUsers = async (
  communityId: string,
  token: string,
  isVerified: boolean = false,
  searchQuery: string = "",
  page: number = 1,
  limit: number = 20
): Promise<any> => {
  const params = new URLSearchParams();

  if (isVerified) params.append("isVerified", "true");
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (searchQuery.trim() !== "")
    params.append("searchQuery", searchQuery.trim());

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await client(`/community/${communityId}/users${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
};

export const useCommunityUsers = (
  communityId: string,
  isVerified: boolean = false,
  searchQuery: string = "",
  page: number = 1,
  limit: number = 10
) => {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);

  return useInfiniteQuery<CommunityUsersReponse>({
    queryKey: [
      "community-users",
      communityId,
      isVerified,
      page,
      limit,
      debouncedSearchTerm,
    ],
    queryFn: () =>
      fetchCommunityUsers(
        communityId,
        cookieValue,
        isVerified,
        debouncedSearchTerm,
        page,
        limit
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!communityId && !!cookieValue,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const fetchCommunityFilteredUsers = async (
  communityId: string,
  token: string,
  isVerified: boolean = false,
  searchQuery: string = "",
  communityGroupId: string = "",
  page: number = 1,
  limit: number = 20
): Promise<any> => {
  const params = new URLSearchParams();

  if (isVerified) params.append("isVerified", "true");
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (searchQuery.trim() !== "")
    params.append("searchQuery", searchQuery.trim());
  if (communityGroupId) params.append("communityGroupId", communityGroupId);

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await client(
    `/community/${communityId}/filteredusers${query}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response;
};

export const useCommunityFilteredUsers = (
  communityId: string,
  isVerified: boolean = false,
  searchQuery: string = "",
  communityGroupId: string = "",
  limit: number = 10
) => {
  const cookieValue = getToken() as string;
  const debouncedSearchTerm = useDebounce(searchQuery, 1000);

  return useInfiniteQuery<CommunityUsersReponse>({
    queryKey: [
      "community-filtered-users",
      communityId,
      isVerified,
      communityGroupId,
      limit,
      debouncedSearchTerm,
    ],
    queryFn: ({ pageParam }) =>
      fetchCommunityFilteredUsers(
        communityId,
        cookieValue,
        isVerified,
        debouncedSearchTerm,
        communityGroupId,
        pageParam as number,
        limit
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!communityId && !!cookieValue,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
