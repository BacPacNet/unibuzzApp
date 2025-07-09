import { useMutation } from "@tanstack/react-query";

import { MESSAGES } from "@/content/constant";
import { Toast } from "react-native-toast-notifications";
import { client } from "./api-client";

export interface CreateBugReport {
  description: string;
  steps?: string | undefined;
  email?: string | undefined;
  screenshot?: any;
}

const reportBugAPI = async (data: FormData) => {
  const response = await client(`/report-bug`, {
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const useCreateReportBug = () => {
  return useMutation({
    mutationFn: (data: FormData) => reportBugAPI(data),
    onSuccess: (response: any) => {
      Toast.show(response.message, { type: "success", placement: "top" });
    },
    onError: (error: any) => {
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG, {
        type: "danger",
        placement: "top",
      });
    },
  });
};
