import { useMutation } from "@tanstack/react-query";
import { client } from "./api-client";
import { RegisterForm, LoginForm, UserResponseType } from "@/models/auth";
import { storeUser, storeUserProfile } from "@/storage/user";
import { storeToken } from "@/storage/token";
import { Toast, useToast } from "react-native-toast-notifications";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/context/AuthProvider/AuthContext";
import { removeRegisterData } from "@/storage/register";
import { MESSAGES } from "@/content/constant";
import { useUserPasswordReset } from "@/context/UserPasswordResetProvider/UserPasswordResetProvider";

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
      removeRegisterData();
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
  const toast = useToast();
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
      Toast.hideAll();
      toast.show(error.response?.data.message || "Something went wrong");
    },
  });
};

interface data {
  email: string;
  userName: string;
  password: string;
  confirmpassword: string;
  birthDate: string;
  gender: string;
  country: string;
  firstName: string;
  lastName: string;
  verificationEmail: string;
  verificationOtp: string;
  universityEmail: string;
  UniversityOtp: string;
  UniversityOtpOK: string;
  referralCode: string;
}

async function register_v2(data: data) {
  const response: { isRegistered: boolean } = await client(`/auth/register`, {
    method: "POST",
    data,
  });
  return response;
}

export const useHandleRegister_v2 = () => {
  return useMutation({
    mutationFn: (data: data) => register_v2(data),
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG);
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
    { method: "POST", data }
  );
  return response;
}
async function emailAvailability(data: { email: string }) {
  const response: { isAvailable: boolean } = await client(
    `/users/check-email-availability`,
    { method: "POST", data }
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

// user email availability check start

export const useHandleUserEmailAvailability = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => emailAvailability(data),
  });
};

// user email availability check end

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
    { method: "PUT", data }
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
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG, {
        type: "warning",
        placement: "top",
      });
    },
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
    { method: "PUT", data }
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

// reset password

async function resetPasswordCodeGenerate(data: { email: string }) {
  const response: any = await client(
    `/auth/send-reset-password-otp?email=${data.email}`,
    { method: "POST", data }
  );
  return response;
}

export const useResetPasswordCodeGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => resetPasswordCodeGenerate(data),
    onSuccess: () => {
      Toast.hideAll();
      Toast.show("OTP sent successfully");
    },
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG);
    },
  });
};

async function verifyResetPasswordOtp(data: { email: string }) {
  const response: any = await client(`/auth/verify-reset-password-otp`, {
    method: "POST",
    data,
  });
  return response;
}

export const useVerifyResetPasswordOtp = () => {
  //   const { setResetPasswordToken } = useUniStore()
  const { setResetPasswordToken } = useUserPasswordReset();
  return useMutation({
    mutationFn: (data: { email: string }) => verifyResetPasswordOtp(data),
    onSuccess: (res: any) => {
      setResetPasswordToken(res.resetToken);
    },
    onError: (error: any) => {
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG);
    },
  });
};

async function resetPassword(data: any) {
  const response: any = await client(`/auth/reset-password`, {
    method: "POST",
    data,
  });
  return response;
}

export const useResetPassword = () => {
  const { resetPasswordResetData } = useUserPasswordReset();
  return useMutation({
    mutationFn: (data: any) => resetPassword(data),
    onSuccess: () => {
      Toast.hideAll();
      Toast.show("Password has been reset");
      resetPasswordResetData();
    },
    onError: (error: any) => {
      if (error.response.data.message == "Password reset failed") {
        resetPasswordResetData();
      }
      Toast.hideAll();
      Toast.show(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG);
    },
  });
};
