import { useMutation } from "@tanstack/react-query";
import { client } from "./api-client";
import { MESSAGES } from "@/content/constant";
import { Toast } from "react-native-toast-notifications";

interface data {
  email?: string;
  firstName: string;
  lastName: string;
  message: string;
  university?: string;
}

async function contact(data: data) {
  const response: { isRegistered: boolean } = await client(`/contact`, {
    method: "POST",
    data,
  });
  return response;
}

export const useSendContactMessage = () => {
  return useMutation({
    mutationFn: (data: data) => contact(data),
    onSuccess: () => {
      Toast.show(
        "Your form has been submitted. We will get back to you as soon as we can!",
        { type: "success", placement: "top" },
      );
    },
    onError: (error: any) => {
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG, {
        type: "danger",
        placement: "top",
      });
    },
  });
};
