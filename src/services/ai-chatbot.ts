import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { NODE_ENV } from "@env";
import { Toast } from "react-native-toast-notifications";
import { useMutation } from "@tanstack/react-query";
import { getToken } from "@/storage/token";
import { storeChatBotMessages } from "@/storage/chat-bot";

interface ServerResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

const apiKey = "k31pqE4wiHaDYf2ZsrPG4ebNuXK9wf2soWj7Ps20";

export async function makeBaseApiCall<T>(
  data: any,
): Promise<ServerResponse<T>> {
  const baseURL =
    NODE_ENV === "development"
      ? "https://38l5g2xzuk.execute-api.ap-south-1.amazonaws.com/dev/chatbot"
      : "https://38l5g2xzuk.execute-api.ap-south-1.amazonaws.com/prod/chatbot";

  const config: AxiosRequestConfig = {
    method: "POST",
    url: baseURL,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    data,
  };

  try {
    const response: AxiosResponse<ServerResponse<T>> = await axios(config);
    const { data: resData } = response;
    return resData;
  } catch (err) {
    console.log(err, "errerrerrerr");
    return Promise.reject(err);
  }
}

export const useCreateChatBotMessage = () => {
  return useMutation({
    mutationFn: (data: any) => makeBaseApiCall(data),

    onSuccess: (res: any, data: any) => {
      storeChatBotMessages(data);
      storeChatBotMessages(res);
    },
    onError: (res: any) => {
 
      storeChatBotMessages({
        message: {
          prompt: "Sorry, I encountered an error. Please try again.",
          
        },
        inserted_id: "",
        isNewThread: false,
        response: "",
      });
      Toast.show(res.response?.data.message || "Something went wrong");
    },
  });
};
