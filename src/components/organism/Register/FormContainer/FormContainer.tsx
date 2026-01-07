import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import AccountCreationForm from "../Forms/AccountCreationFrom";
import {
  getRegisterData,
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
  useHandleLoginEmailVerificationGenerate,
  useHandleRegister_v2,
  useHandleUniversityEmailVerification,
  useHandleUniversityEmailVerificationGenerate,
  useHandleUserEmailAndUserNameAvailability,
} from "@/services/auth";
import VerificationOption from "../Forms/VerificationOption";
import UniversityEmailOtpVerification from "../Forms/UniversityEmailOtpVerification";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { TRACK_EVENT } from "@/content/constant";

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

  const {
    mutate: generateLoginEmailOTP,
    isPending,
    isError,
  } = useHandleLoginEmailVerificationGenerate();

  const {
    mutateAsync: HandleRegister,
    isPending: registerIsPending,
    data: registeredData,
  } = useHandleRegister_v2();

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
      universityEmail: "",
      universityLogo: "",
      department: "",
      occupation: "",
      universityId: "",
      UniversityOtp: "",
      UniversityOtpOK: "",
      referralCode: "",
      isJoinUniversity: true,
      isUniversityVerified: false,
      isEmailVerified: false,
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
    // removeRegisterData();
  }, []);

  useEffect(() => {
    if (registerData) {
      methods.reset(registerData);
    }
  }, [registerData]);
  const currEmail = methods.watch("email");
  useTimeTracking(TRACK_EVENT.REGISTER_PAGE_VIEW_DURATION, {
    isRegistrationCompleted: registeredData?.isRegistered || false,
    email: currEmail || "",
  });

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
    firstName: string;
    birthDate: string;
  }) => {
    try {
      const dataToSend = {
        email: data.email,
        verificationOtp: data.verificationOtp,
        universityId: registerData?.universityId,
        name: data?.firstName,
        dob: data?.birthDate,
      };
      const isAvailable = await handleUserLoginEmailVerification(dataToSend);
      if (isAvailable?.isAvailable) {
        methods.setValue("isEmailVerified", true);
      }
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
      const dataToSend: any = {
        universityEmail: data.universityEmail,
        UniversityOtp: data.UniversityOtp,
      };
      dataToSend.isUniversityVerified = true;
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
      //   const newStep = step + 1;
      const newStep = 3;
      setStep(newStep);
      setSubStep(0);
      const data = {
        email: methods.getValues("email"),
      };
      return generateLoginEmailOTP(data);
    } else if (
      step === 3 &&
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

  const handlePrev = () => {
    if (step == 0) {
      return;
    } else if (step === 1 && subStep === 1) {
      return setSubStep(0);
    } else if (
      step === 2 &&
      subStep === 0 &&
      methods.getValues("userType") !== userTypeEnum.Applicant
    ) {
      setStep(step - 1);
      return setSubStep(1);
    } else if (step === 2 && subStep === 1) {
      setSubStep(0);
    } else if (step === 3 && subStep === 2) {
      setSubStep(1);
    } else if (step === 3) {
      // setStep(step - 1);
      setStep(1);
      setSubStep(1);
      if (methods.getValues("userType") == userTypeEnum.Applicant) {
        setSubStep(0);
      } else if (
        methods.getValues("userType") == userTypeEnum.Student ||
        methods.getValues("userType") == userTypeEnum.Faculty
      ) {
        setSubStep(1);
      }
    } else {
      setStep(step - 1);
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
    } else if (step === 3 && subStep === 0) {
      currStep = 3;
      currSubStep = 1;
    } else if (step === 3 && subStep === 1) {
      currStep = 3;
      currSubStep = 2;
    } else {
      currStep += 1;
      currSubStep = 0;
    }

    const saveToLocalStorage = () => {
      const newData = {
        ...methods.getValues(),
        step: currStep,
        subStep: currSubStep,
      };
      setRegisterData(newData);
      storeRegisterData(newData);
    };

    if (step === 0) {
      const isAvailable = await userCheck(data);
      if (isAvailable?.isAvailable) {
        handleNext();
        saveToLocalStorage();
      }
      return;
    }

    // if (step === 3) {
    //   const res: any = await HandleRegister(data);
    //     console.log("res",res);

    //   if (res?.isRegistered) {
    //     handleNext();
    //     // removeRegisterData()
    //     // saveToLocalStorage();
    //   }
    //   return;
    // }

    if (step === 3 && subStep === 0) {
      const isAvailable = await userLoginEmailVerification(data);
      if (isAvailable?.isAvailable && !isAvailable?.isUniversityDomain) {
        handleNext();
        saveToLocalStorage();
      } else if (isAvailable?.isAvailable && isAvailable?.isUniversityDomain) {
        data.isUniversityVerified = true;
        data.universityEmail = data.email;
        const isEmailVerified = methods.getValues("isEmailVerified");
        const res = await HandleRegister({
          ...data,
          isEmailVerified: isEmailVerified,
        } as FormDataType);
        if (res?.isRegistered) {
          storeRegisterData({ ...data, step: 4, subStep: 0 });
          setStep(4);
          setSubStep(0);
        }
      }

      return;
    }

    if (step === 3 && subStep === 2) {
      const isAvailable = await userUniversityEmailVerification(data);

      if (isAvailable?.isAvailable) {
        data.isUniversityVerified = true;
        const res = await HandleRegister(data);
        if (res?.isRegistered) {
          storeRegisterData({ ...data, step: 4, subStep: 0 });
          setStep(4);
          setSubStep(0);
        }
        // handleNext();
        // saveToLocalStorage();
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
      return (
        <ProfileSetupForm onSubmit={onSubmit} handlePrev={() => handlePrev()} />
      );
    } else if (step === 1 && subStep === 1) {
      return methods.getValues("userType") === "student" ? (
        <ProfileStudentForm
          onSubmit={onSubmit}
          handlePrev={() => handlePrev()}
        />
      ) : (
        <ProfileFacultyForm
          onSubmit={onSubmit}
          handlePrev={() => handlePrev()}
        />
      );
    } else if (step === 2) {
      return (
        <VerificationOption
          setStep={setStep}
          setSubStep={setSubStep}
          handlePrev={() => handlePrev()}
          email={methods.getValues("email")}
        />
      );
    } else if (step === 3 && subStep === 0) {
      return (
        <LoginVerificationForm
          onSubmit={onSubmit}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={userLoginEmailVerificationIsPending}
          handlePrev={() => handlePrev()}
        />
      );
    } else if (step === 3 && subStep === 1) {
      return (
        <UniversityVerificationForm
          onSubmit={onSubmit}
          setStep={setStep}
          setSubStep={setSubStep}
          isVerificationSuccess={userUniversityEmailVerificationSuccess}
          isPending={UniversityEmailVerificationIsPending}
          logoUrl={methods.getValues("universityLogo")}
        />
      );
    } else if (step === 3 && subStep === 2) {
      return (
        <UniversityEmailOtpVerification
          onSubmit={onSubmit}
          isVerificationSuccess={userUniversityEmailVerificationSuccess}
          isPending={UniversityEmailVerificationIsPending}
          handlePrev={() => handlePrev()}
        />
      );
    } else if (step === 3) {
      return (
        <ClaimBenefitForm onSubmit={onSubmit} isPending={registerIsPending} />
      );
    } else if (step === 4) {
      return (
        <LoginForm
          email={methods.getValues("email")}
          password={methods.getValues("password")}
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
