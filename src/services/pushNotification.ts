import { useMutation } from "@tanstack/react-query";
import { client } from "./api-client";
import { getToken } from "@/storage/token";

async function savePushNotificationToken(data: any, token: string) {
  const response = await client(`/push-notification`, {
    method: "POST",
    data,

    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}
async function deletePushNotificationToken( token: string) {
  const response = await client(`/push-notification`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return response;
}

export const useHandleSavePushNotificationToken = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => savePushNotificationToken(data, cookieValue),

    onError(error: any) {
      console.log("Axios error:", error.response?.data.message);
    },
  });
};
export const useHandleDeletePushNotificationToken = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: () => deletePushNotificationToken( cookieValue),

    onError(error: any) {
      console.log("Axios error:", error.response?.data.message);
    },
  });
};
