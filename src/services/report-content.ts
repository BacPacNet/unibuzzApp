import { useMutation } from "@tanstack/react-query";

import { MESSAGES } from "@/content/constant";
import { getToken } from "@/storage/token";
import { Toast } from "react-native-toast-notifications";
import { client } from "./api-client";

export async function reportContentAPI(token: string, data: any) {
  const response = await client(`/report-content`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "POST",
    data,
  });
  return response;
}

export const useCreateReportContent = () => {
  const cookieValue = getToken() as string;
  return useMutation({
    mutationFn: (data: any) => reportContentAPI(cookieValue, data),
    onSuccess: (response: any) => {
      Toast.hideAll();
      Toast.show(response.message, {
        placement: "top",
        type: "success",
      });
    },
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG, {
        placement: "top",
        type: "danger",
      });
    },
  });
};
