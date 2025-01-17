import { useMutation } from "@tanstack/react-query";
import { client } from "./api-client";
import { RegisterForm, LoginForm, UserResponseType } from "@/models/auth";
import { storeUser, storeUserProfile } from "@/storage/user";
import { storeToken } from "@/storage/token";
import { useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { removeRegisterData } from "@/storage/register";

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>("auth/login", {
    data,
  });
  return result;
};

const register = async (
  data: Omit<RegisterForm, "confirmPassword" | "tnc">,
): Promise<UserResponseType> => {
  const result = await client<
    UserResponseType,
    Omit<RegisterForm, "confirmPassword" | "tnc">
  >("auth/register", { data });
  return result;
};

export const useHandleLogin = (isRemove: boolean = false) => {
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
      if (isRemove) {
        removeRegisterData();
      }
      //  setRefreshCookieValue(
      //    response.tokens.refresh.token,
      //    response.tokens.refresh.expires
      //  );
    },
    onError: async (error: any) => {
      console.log(error.name, "error");
    },
  });
};

export const useHandleRegister = () => {
  return useMutation({
    mutationFn: (data: Omit<RegisterForm, "confirmPassword" | "tnc">) =>
      register(data),
    // onSuccess: async (response: any) => {
    //   await storeToken(response.tokens.access.token);
    //   await storeUser(response.user);
    //   await storeUserProfile(response.userProfile);
    //   //  setRefreshCookieValue(
    //   //    response.tokens.refresh.token,
    //   //    response.tokens.refresh.expires
    //   //  );
    // },
    onError(error: any) {
      console.log("Axios error:", error.response?.data.message);
    },
  });
};

//user name and email check start

async function userNameAndEmailAvailability(data: {
  email: string;
  userName: string;
}) {
  const response: { isAvailable: boolean } = await client(
    `/users/checkAvailability`,
    { method: "POST", data },
  );
  return response;
}

export const useHandleUserEmailAndUserNameAvailability = () => {
  return useMutation({
    mutationFn: (data: { email: string; userName: string }) =>
      userNameAndEmailAvailability(data),
  });
};
//user name and email check end

// user email otp generate start

async function loginEmailVerificationCodeGenerate(data: { email: string }) {
  const response: any = await client(`/useremailverification`, {
    method: "POST",
    data,
  });
  return response;
}

export const useHandleLoginEmailVerificationGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      loginEmailVerificationCodeGenerate(data),
  });
};
// user email otp generate end

//user email  verification check start

async function loginEmailVerification(data: {
  email: string;
  verificationOtp: string;
}) {
  const response: { isAvailable: boolean } = await client(
    `/useremailverification`,
    { method: "PUT", data },
  );
  return response;
}

export const useHandleLoginEmailVerification = () => {
  return useMutation({
    mutationFn: (data: { email: string; verificationOtp: string }) =>
      loginEmailVerification(data),
  });
};

//user email  verification check end

// university email otp generate start
async function universityEmailVerificationCodeGenerate(data: {
  email: string;
}) {
  const response: any = await client(`/universityemailverification`, {
    method: "POST",
    data,
  });
  return response;
}

export const useHandleUniversityEmailVerificationGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      universityEmailVerificationCodeGenerate(data),
  });
};
// university email otp generate end

//university email  verification check start

async function universityEmailVerification(data: {
  universityEmail: string;
  UniversityOtp: string;
}) {
  const response: { isAvailable: boolean } = await client(
    `/universityemailverification`,
    { method: "PUT", data },
  );
  return response;
}

export const useHandleUniversityEmailVerification = () => {
  return useMutation({
    mutationFn: (data: { universityEmail: string; UniversityOtp: string }) =>
      universityEmailVerification(data),
  });
};

//university email  verification check end
