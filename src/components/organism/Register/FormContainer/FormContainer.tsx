import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AccountCreationForm from "../Forms/AccountCreationFrom";
import {
  getRegisterData,
  storeRegisterData,
  removeRegisterData,
  userTypeEnum,
} from "@/storage/register";
import { storeLoginData } from "@/storage/login";
import { FormDataType, userCheckError } from "@/types/register";
import ProfileSetupForm from "../Forms/ProfileSetupForm";
import LoginVerificationForm from "../Forms/LoginVerificationForm";
import SelectUniversitiesForm from "../Forms/SelectUniversitiesForm";
import {
  useHandleLoginEmailVerification,
  useHandleRegister_v2,
  useHandleUserEmailAndUserNameAvailability,
} from "@/services/auth";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TRACK_EVENT } from "@/content/constant";

interface Props {
  step: number;
  setStep: (value: number) => void;
}

const FormContainer = ({ step, setStep }: Props) => {
  const [registerData, setRegisterData] = useState<FormDataType | null>(null);
  const { mutateAsync: handleUserCheck, isPending: handleUserCheckIsPending } =
    useHandleUserEmailAndUserNameAvailability();
  const {
    mutateAsync: handleUserLoginEmailVerification,
    isSuccess: userLoginEmailVerificationSuccess,
    isPending: userLoginEmailVerificationIsPending,
  } = useHandleLoginEmailVerification();
  const {
    mutateAsync: HandleRegister,
    isPending: registerIsPending,
    data: registeredData,
  } = useHandleRegister_v2();

  const methods = useForm<FormDataType>({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmpassword: "",
      birthDate: "",
      gender: "",
      userType: userTypeEnum.Applicant,
      firstName: "",
      lastName: "",
      verificationEmail: "",
      verificationOtp: "",
      universityName: "",
      universityLogo: "",
      universityDomain: [],
      universityId: "",
      UniversityOtp: "",
      UniversityOtpOK: "",
      referralCode: "",
      isJoinUniversity: true,
      isEmailVerified: false,
      selectedUniversityIds: [],
    },
  });

  useEffect(() => {
    const loadRegisterData = async () => {
      try {
        const storedData = await getRegisterData();
        if (storedData) {
          setRegisterData(storedData);
        } else {
          setRegisterData({});
        }
      } catch (error) {
        console.error("Error loading register data:", error);
      }
    };
    loadRegisterData();
  }, []);

  useEffect(() => {
    if (registerData) {
      methods.reset({
        email: registerData?.email || "",
        userName: registerData?.userName || "",
        password: registerData?.password || "",
        confirmpassword: registerData?.confirmpassword || "",
        birthDate: registerData?.birthDate || "",
        gender: registerData?.gender || "",
        userType: userTypeEnum.Applicant,
        firstName: registerData?.firstName || "",
        lastName: registerData?.lastName || "",
        verificationEmail: registerData?.verificationEmail || "",
        universityId: registerData?.universityId || "",
        verificationOtp: registerData?.verificationOtp || "",
        universityName: registerData?.universityName || "",
        universityLogo: registerData?.universityLogo || "",
        universityDomain: registerData?.universityDomain || [],
        UniversityOtp: registerData?.UniversityOtp || "",
        referralCode: registerData?.referralCode || "",
        isJoinUniversity: registerData?.isJoinUniversity ?? true,
        isEmailVerified: registerData?.isEmailVerified ?? false,
        selectedUniversityIds: registerData?.selectedUniversityIds || [],
      });
    }
  }, [registerData, methods]);

  const currEmail = methods.watch("email");

  useTimeTracking(TRACK_EVENT.REGISTER_PAGE_VIEW_DURATION, {
    isRegistrationCompleted: registeredData?.isRegistered || false,
    email: currEmail || "",
    referralCode: "",
  });

  const userCheck = async (data: { email: string; userName: string }) => {
    try {
      const isAvailable = await handleUserCheck({
        email: data.email,
        userName: data.userName,
      });
      return isAvailable;
    } catch (error: any) {
      const message = error.response?.data?.message;
      if (message === userCheckError.emailNotAvailable) {
        methods.setError("email", { message });
      } else if (message === userCheckError.userNameNotAvailable) {
        methods.setError("userName", { message });
      } else {
        methods.setError("email", { message });
      }
    }
  };

  const userLoginEmailVerification = async (data: {
    email: string;
    verificationOtp: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  }) => {
    try {
      const isAvailable = await handleUserLoginEmailVerification({
        email: data.email,
        verificationOtp: data.verificationOtp,
        universityId: registerData?.universityId || methods.getValues("universityId"),
        name: data.firstName,
        dob: data.birthDate,
      });
      if (isAvailable?.isAvailable) {
        methods.setValue("isEmailVerified", true);
      }
      return isAvailable;
    } catch (error: any) {
      methods.setError("verificationOtp", {
        message: error.response?.data?.message,
      });
      methods.setValue("verificationOtp", "");
    }
  };

  const handleNext = () => setStep(step + 1);

  const handlePrev = () => {
    if (step === 0) return;
    setStep(Math.max(0, step - 1));
  };

  const onSubmit = async (data: FormDataType) => {
    const saveToStorage = (nextStep: number) => {
      storeRegisterData({
        ...methods.getValues(),
        ...data,
        step: nextStep,
        userType: userTypeEnum.Applicant,
        referralCode: data.referralCode || "",
      });
    };

    if (step === 0) {
      if (!data.selectedUniversityIds?.length) {
        methods.setError("selectedUniversityIds", {
          message: "Please select at least one university.",
        });
        return;
      }
      handleNext();
      saveToStorage(1);
      return;
    }

    if (step === 1) {
      const isAvailable = await userCheck(data);
      if (isAvailable?.isAvailable) {
        handleNext();
        saveToStorage(2);
      }
      return;
    }

    if (step === 2) {
      handleNext();
      saveToStorage(3);
      return;
    }

    if (step === 3) {
      const isAvailable = await userLoginEmailVerification(data);
      if (!isAvailable?.isAvailable) return;

      const isEmailVerified = methods.getValues("isEmailVerified");
      const res = await HandleRegister({
        ...data,
        isEmailVerified,
        userType: userTypeEnum.Applicant,
      } as FormDataType);

      if (res?.isRegistered) {
        storeLoginData({
          email: data.email,
          password: data.password,
        });
        removeRegisterData();
        setStep(4);
      }
      return;
    }
  };

  const renderStep = () => {
    if (step === 0) {
      return <SelectUniversitiesForm onSubmit={onSubmit} />;
    }
    if (step === 1) {
      return (
        <AccountCreationForm
          isPending={handleUserCheckIsPending}
          onSubmit={onSubmit}
          handlePrev={handlePrev}
        />
      );
    }
    if (step === 2) {
      return (
        <ProfileSetupForm onSubmit={onSubmit} handlePrev={handlePrev} />
      );
    }
    if (step === 3) {
      return (
        <LoginVerificationForm
          onSubmit={onSubmit}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={
            userLoginEmailVerificationIsPending || registerIsPending
          }
          handlePrev={handlePrev}
        />
      );
    }
    return null;
  };

  return (
    <FormProvider {...methods}>
      <View className="flex-1 w-full h-full items-center">{renderStep()}</View>
    </FormProvider>
  );
};

export default FormContainer;
