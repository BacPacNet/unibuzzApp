/* eslint-disable import/no-unresolved */
import { RequestData, ServerResponse } from "@/models/api-client";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { NEXT_PUBLIC_CUSTOM_BASE_URL, NEXT_PUBLIC_API_BASE_URL } from "@env";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { forceDeauthenticate } from "@/hooks/Auth/forceDeautenticate";

const api = axios.create({
  baseURL: NEXT_PUBLIC_API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.data?.message === "jwt expired" ||
      error.response?.data?.message == "jwt malformed"
    ) {
      return forceDeauthenticate();
    }
    return Promise.reject(error);
  }
);

/**
 * Handle Network Requests.
 * @param {string} endpoint - Api path.
 * @param {object} [config={}] - Config object.
 * @param {string} config.method - Method.
 * @param {object} config.data - Body for POST calls.
 * @param {string} config.token - To̦ken for authenticated calls.
 * @param {object} config.headers - Additional headers
 */

const client = async <T, U>(
  endpoint: string,
  {
    id,
    page,
    size,
    data,
    headers,
    method,
    transform = true,
    customBaseUrl = false,
    userCode,
    email,
    ...rest
  }: RequestData<U> = {}
): Promise<ServerResponse<T>> => {
  const config: AxiosRequestConfig = {
    url: customBaseUrl
      ? `${NEXT_PUBLIC_CUSTOM_BASE_URL}/${endpoint}`
      : `${NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
    method: method || (data ? "POST" : "GET"),
    data: data ? JSON.stringify(data) : undefined,
    headers: { ...headers, "Content-Type": "application/json" },
    params: {
      id,
      page,
      size,
      userCode,
      email,
    },
    transformResponse: [].concat(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      axios.defaults.transformResponse,
      (resp: ServerResponse<T>) => {
        if (transform && resp.items) {
          return resp.items;
        }
        return resp;
      }
    ),
    ...rest,
  };

  try {
    console.log("config", config);
    const response: AxiosResponse<ServerResponse<T>> = await api(config);
    const { data: resData } = response;
    return resData;
  } catch (err: any) {
    console.log(err.response.data.message === "jwt expired");

    return Promise.reject(err);
  }
};

export { client };
