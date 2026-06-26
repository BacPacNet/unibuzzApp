import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client } from "./api-client";
import useDebounce from "@/hooks/useDebounce";
import { getToken } from "@/storage/token";
import { showToast } from "@/utils/toastWrapper";
import { AxiosErrorType } from "@/types/constant";



export type HighlightPostType = 'CommunityPost' | 'UserPost'

export type AddUniversityHighlightPostPayload = {
  postId: string
  postType: HighlightPostType
  position: number
}

export async function getUniversitySearch(
  searchTerm: string,
  page: number,
  limit: number,
): Promise<any[]> {
  //   if (!searchTerm) return [];

  // Fetch university data based on the search term
  const response = await client(
    `/university/searched?page=${page}&limit=${limit}&searchTerm=${encodeURIComponent(searchTerm)}`,
  );

  // TypeScript assumes `response` is of type `University[]`
  return response;
}


export function useUniversitySearch(
  show: boolean,
  searchTerm: string,
  page: number,
  limit: number,
) {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return useQuery<any, Error>({
    queryKey: ["universitySearch", debouncedSearchTerm, show],
    queryFn: () => getUniversitySearch(debouncedSearchTerm, page, limit),
    enabled: show,
    retry: 2, // Optional: Prevent retries on failure
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



export async function getPartnerUniversities(): Promise<any[]> {
  const response = await client(`/university/partnered`)

  return response
}

export function useGetPartnerUniversities() {
  return useQuery<any, Error>({
    queryKey: ['partnerUniversities'],
    queryFn: () => getPartnerUniversities(),
    staleTime: 0,
    retry: false,
  })
}

export async function getUniversityByName(universityName: string) {
  if (!universityName) return null;

  const response:any = await getUniversitySearch(universityName, 1, 10);
  const universities = response?.result?.universities ?? [];

  return (
    universities.find(
      (u: { name: string }) =>
        u.name?.toLowerCase() === universityName.toLowerCase(),
    ) ?? universities[0] ?? null
  );
}

export function useUniversitySearchByName(universityName: string) {
  return useQuery<any, Error>({
    queryKey: ["universityByName", universityName],
    queryFn: () => getUniversityByName(universityName),
    enabled: !!universityName,
    staleTime: 0,
    retry: false,
  });
}



export async function getUniversitiesHighlightedPostd(universityId: string): Promise<any[]> {
  const response = await client(`/university/highlights/${universityId}`)

  return response
}

export function useGetUniversitiesHighlightedPostd(universityId: string) {
  return useQuery<any, Error>({
    queryKey: ['universitiesHighlightedPostd', universityId],
    queryFn: () => getUniversitiesHighlightedPostd(universityId),
    staleTime: 0,
    retry: false,
    enabled: !!universityId,
  })
}



export async function addUniversityHighlightPost(universityId: string, data: AddUniversityHighlightPostPayload, token: string) {
  const response = await client(`/university/highlights/${universityId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export function useAddUniversityHighlightPost(universityId: string) {
  const cookieValue = getToken() as string;
  const queryClient = useQueryClient()


  return useMutation({
    mutationFn: (data: AddUniversityHighlightPostPayload) => addUniversityHighlightPost(universityId, data, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universitiesHighlightedPostd', universityId] })
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['timelinePosts'] })
      showToast({
        message: "Post has been successfully featured in the university's discovery page.",
        type: "success",
        placement: "bottom",
      })
    },
    onError: (error: AxiosErrorType) => {
      showToast({
        message: (error.response?.data.message as string) || "Something went wrong",
        type: "danger",
        placement: "bottom",
      })
    },
  })
}