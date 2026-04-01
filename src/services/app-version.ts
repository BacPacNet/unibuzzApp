import { useQuery } from "@tanstack/react-query";
import { client } from "./api-client";

export async function getAppUpdateStatus() {
  const response: {
    shouldUpdate: boolean;
    message: string;
  } = await client(`/app-version/required`);

  return response;
}

export function useGetAppUpdateStatus() {
  return useQuery({
    queryKey: ["appUpdateStatus"],
    queryFn: getAppUpdateStatus,
  });
}
