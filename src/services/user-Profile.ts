import { useQuery } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";

export async function getUserProfileVerifiedUniversityEmailData(token: any) {
  const response: any = await client(`/userprofile/verifiedUniversityEmails`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export function useGetUserProfileVerifiedUniversityEmailData() {
  const cookieValue = getToken() as string;

  return useQuery({
    queryKey: ["verifiedUniversityEmails"],
    queryFn: () => getUserProfileVerifiedUniversityEmailData(cookieValue),
    enabled: !!cookieValue,
  });
}
