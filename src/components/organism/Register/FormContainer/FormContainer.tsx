import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AccountCreationForm from "../Forms/AccountCreationFrom";
import {
  getRegisterData,
  removeRegisterData,
  storeRegisterData,
  userTypeEnum,
} from "@/storage/register";
import { FormDataType, userCheckError } from "@/types/register";
import ProfileSetupForm from "../Forms/ProfileSetupForm";
import ProfileStudentForm from "../Forms/ProfileStudentForm";
import ProfileFacultyForm from "../Forms/ProfileFacultyForm";
import LoginVerificationForm from "../Forms/LoginVerificationForm";
import UniversityVerificationForm from "../Forms/UniversityEmailVerificationForm";
import ClaimBenefitForm from "../Forms/ClaimBenefitForm";
import LoginForm from "../Forms/LoginForm";
import {
  useHandleLoginEmailVerification,
  useHandleRegister,
  useHandleUniversityEmailVerification,
  useHandleUserEmailAndUserNameAvailability,
} from "@/services/auth";

interface Props {
  step: number;
  setStep: (value: number) => void;
  subStep: number;
  setSubStep: (value: number) => void;
}

const FormContainer = ({ step, setStep, setSubStep, subStep }: Props) => {
  const [registerData, setRegisterData] = useState<FormDataType | any>(null);
  const { mutateAsync: handleUserCheck, isPending: handleUserCheckIsPending } =
    useHandleUserEmailAndUserNameAvailability();
  const {
    mutateAsync: handleUserLoginEmailVerification,
    isSuccess: userLoginEmailVerificationSuccess,
    isPending: userLoginEmailVerificationIsPending,
  } = useHandleLoginEmailVerification();
  const {
    mutateAsync: handleUserUniversityEmailVerification,
    isSuccess: userUniversityEmailVerificationSuccess,
    isPending: UniversityEmailVerificationIsPending,
  } = useHandleUniversityEmailVerification();

  const { mutateAsync: HandleRegister, isPending: registerIsPending } =
    useHandleRegister();

  const methods = useForm({
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      confirmpassword: "",
      birthDate: "",
      gender: "",
      userType: "",
      country: "",
      firstName: "",
      lastName: "",
      year: "",
      degree: "",
      major: "",
      verificationEmail: "",
      verificationOtp: "",
      universityName: "",
      department: "",
      occupation: "",
      universityId: "",
      UniversityOtp: "",
      UniversityOtpOK: "",
      referralCode: "",
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
      methods.reset(registerData);
    }
  }, [registerData]);

  const userCheck = async (data: { email: string; userName: string }) => {
    try {
      const dataToSend = {
        email: data.email,
        userName: data.userName,
      };
      const isAvailable = await handleUserCheck(dataToSend);
      return isAvailable;
    } catch (error: any) {
      if (error.response.data.message == userCheckError.emailNotAvailable) {
        methods.setError("email", { message: error.response.data.message });
      } else if (
        error.response.data.message == userCheckError.userNameNotAvailable
      ) {
        methods.setError("userName", { message: error.response.data.message });
      }
    }
  };

  const userLoginEmailVerification = async (data: {
    email: string;
    verificationOtp: string;
  }) => {
    try {
      const dataToSend = {
        email: data.email,
        verificationOtp: data.verificationOtp,
      };
      const isAvailable = await handleUserLoginEmailVerification(dataToSend);
      return isAvailable;
    } catch (error: any) {
      methods.setError("verificationOtp", {
        message: error.response.data.message,
      });
      methods.setValue("verificationOtp", "");
    }
  };

  const userUniversityEmailVerification = async (data: {
    universityEmail: string;
    UniversityOtp: string;
  }) => {
    try {
      const dataToSend = {
        universityEmail: data.universityEmail,
        UniversityOtp: data.UniversityOtp,
      };
      const isAvailable =
        await handleUserUniversityEmailVerification(dataToSend);

      return isAvailable;
    } catch (error: any) {
      methods.setError("UniversityOtp", {
        message: error.response.data.message,
      });
      methods.setValue("UniversityOtp", "");
    }
  };

  const handleNext = () => {
    if (
      step === 1 &&
      subStep === 0 &&
      methods.getValues("userType") == userTypeEnum.Applicant
    ) {
      const newStep = step + 1;
      setStep(newStep);
      return setSubStep(0);
    } else if (
      step === 1 &&
      subStep === 0 &&
      methods.getValues("userType") !== userTypeEnum.Applicant
    ) {
      return setSubStep(1);
    } else if (step === 1 && subStep === 1) {
      const newStep = step + 1;
      setStep(newStep);
      return setSubStep(0);
    } else if (
      step === 2 &&
      subStep === 0 &&
      methods.getValues("userType") !== userTypeEnum.Applicant
    ) {
      return setSubStep(1);
    } else {
      const newStep = step + 1;
      setStep(newStep);
      setSubStep(0);
    }
  };

  const onSubmit = async (data: FormDataType) => {
    let currStep = step;
    let currSubStep = subStep;

    if (
      step === 1 &&
      subStep === 0 &&
      methods.getValues("userType") !== userTypeEnum.Applicant
    ) {
      currSubStep += 1;
    } else if (
      step == 1 &&
      subStep == 0 &&
      methods.getValues("userType") == userTypeEnum.Applicant
    ) {
      currStep = 2;
    } else if (
      step === 2 &&
      subStep === 0 &&
      methods.getValues("userType") !== userTypeEnum.Applicant
    ) {
      currSubStep += 1;
    } else if (
      step === 2 &&
      subStep === 0 &&
      methods.getValues("userType") == userTypeEnum.Applicant
    ) {
      currStep = 3;
    } else {
      currStep += 1;
      currSubStep = 0;
    }

    const saveToLocalStorage = () => {
      storeRegisterData({ ...data, step: currStep, subStep: currSubStep });
    };

    if (step === 0) {
      const isAvailable = await userCheck(data);
      if (isAvailable?.isAvailable) {
        handleNext();
        saveToLocalStorage();
      }
      return;
    }

    if (step === 3) {
      const res: any = await HandleRegister(data);

      if (res?.isRegistered) {
        handleNext();
        // removeRegisterData()
        // saveToLocalStorage();
      }
      return;
    }

    if (step === 2 && subStep === 0) {
      const isAvailable = await userLoginEmailVerification(data);

      if (isAvailable?.isAvailable) {
        handleNext();
        saveToLocalStorage();
      }

      return;
    }

    if (step === 2 && subStep === 1) {
      const isAvailable = await userUniversityEmailVerification(data);
      if (isAvailable?.isAvailable) {
        handleNext();
        saveToLocalStorage();
      }

      return;
    }
    if (step === 1 && subStep === 0) {
      handleNext();
      saveToLocalStorage();

      return;
    }

    handleNext();
    saveToLocalStorage();
  };

  const renderStep = () => {
    if (step === 0 && subStep === 0) {
      return (
        <AccountCreationForm
          isPending={handleUserCheckIsPending}
          onSubmit={onSubmit}
        />
      );
    } else if (step === 1 && subStep === 0) {
      return <ProfileSetupForm onSubmit={onSubmit} />;
    } else if (step === 1 && subStep === 1) {
      return methods.getValues("userType") === "Student" ? (
        <ProfileStudentForm onSubmit={onSubmit} />
      ) : (
        <ProfileFacultyForm onSubmit={onSubmit} />
      );
    } else if (step === 2 && subStep === 0) {
      return (
        <LoginVerificationForm
          onSubmit={onSubmit}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={userLoginEmailVerificationIsPending}
        />
      );
    } else if (step === 2 && subStep === 1) {
      return (
        <UniversityVerificationForm
          onSubmit={onSubmit}
          setStep={setStep}
          setSubStep={setSubStep}
          isVerificationSuccess={userUniversityEmailVerificationSuccess}
          isPending={UniversityEmailVerificationIsPending}
        />
      );
    } else if (step === 3) {
      return (
        <ClaimBenefitForm onSubmit={onSubmit} isPending={registerIsPending} />
      );
    } else if (step === 4) {
      return (
        <LoginForm
          email={registerData.email}
          password={registerData.password}
        />
      );
    }
  };

  return (
    <FormProvider {...methods}>
      <View className="flex-1 w-full h-full items-center">{renderStep()}</View>
    </FormProvider>
  );
};

export default FormContainer;
