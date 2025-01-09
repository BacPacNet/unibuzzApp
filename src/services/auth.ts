import { useMutation } from "@tanstack/react-query";
import { client } from "./api-client";
import { RegisterForm, LoginForm, UserResponseType } from "@/models/auth";
import { storeUser, storeUserProfile } from "@/storage/user";
import { storeToken } from "@/storage/token";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthProvider/AuthContext";

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>("auth/login", {
    data,
  });
  return result;
};

const register = async (
  data: Omit<RegisterForm, "confirmPassword" | "tnc">
): Promise<UserResponseType> => {
  const result = await client<
    UserResponseType,
    Omit<RegisterForm, "confirmPassword" | "tnc">
  >("auth/register", { data });
  return result;
};

export const useHandleLogin = () => {
  //  const [, setRefreshCookieValue] = useCookie("uni_user_refresh_token");
  const toast = useToast();
  const { setAuthenticated } = useAuth();
  return useMutation({
    mutationFn: (data: LoginForm) => login(data),
    mutationKey: ["login"],
    onSuccess: async (response: any) => {
      await storeToken(response.tokens.access.token);
      await storeUser(response.user);
      await storeUserProfile(response.userProfile);
      setAuthenticated();
      toast.show("Login Successfull");
      //  setRefreshCookieValue(
      //    response.tokens.refresh.token,
      //    response.tokens.refresh.expires
      //  );
    },
    onError: async (error) => {
      console.log(error.name, "error");
    },
  });
};

export const useHandleRegister = () => {
  return useMutation({
    mutationFn: (data: Omit<RegisterForm, "confirmPassword" | "tnc">) =>
      register(data),
    onSuccess: async (response: any) => {
      await storeToken(response.tokens.access.token);
      await storeUser(response.user);
      await storeUserProfile(response.userProfile);
      //  setRefreshCookieValue(
      //    response.tokens.refresh.token,
      //    response.tokens.refresh.expires
      //  );
    },
  });
};
