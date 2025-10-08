import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserProfileStore } from "@/storage/user";
import UniversityVerificationInfo from "@/components/organism/Settings/UniversityCurrentJoined";
import { useForm } from "react-hook-form";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import UniversitySelect from "@/components/organism/Settings/UniversitySelect";
import UniversityOtpVerification from "@/components/organism/Settings/UniversityOtpVerification";
import { useAddUniversityEmail } from "@/services/edit-Profile";
import { SafeScreen } from "@/components/template";
import FullScreenLoader from "@/components/atoms/FullScreenLoader";

type FormDataType = {
  UniversityOtp: string;
  universityEmail: string;
  universityName: string;
};

export enum universitySettingsScreen {
  currentJoined,
  addUniversity,
  otpVerification,
}
type ScreenNavigationProp = StackNavigationProp<RootStackParamList, "Settings">;

const UniversityVerificationScreen = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm();
  const userProfileData = getUserProfileStore();
  const email: any = userProfileData?.email || [];
  const [currScreen, setCurrScreen] = useState(
    universitySettingsScreen.currentJoined
  );
  const [showLoader, setShowLoader] = useState(false);
  const {
    mutateAsync: mutateAddUniversity,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
  } = useAddUniversityEmail(true);

  const logoUrl = watch("logoUrl");
  const universityName = watch("universityName");
  const otp = watch("otp");
  const universityEmail = watch("email");

  const onSubmit = () => {
    const data: FormDataType = {
      universityEmail: universityEmail,
      UniversityOtp: otp,
      universityName: universityName,
    };
    setShowLoader(true);
    mutateAddUniversity(data, {
      onSuccess: () => {
        reset();
        setCurrScreen(universitySettingsScreen.currentJoined);
        setShowLoader(false);
      },
      onError: () => {
        setShowLoader(false);
      },
    });
  };

  if (showLoader) {
    return <FullScreenLoader message="Verifying University..." />;
  }

  return (
    <View style={styles.containerMain}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {currScreen == universitySettingsScreen.currentJoined ? (
          <UniversityVerificationInfo
            goBack={() => navigation.goBack()}
            control={control}
            email={email}
            setCurrScreen={setCurrScreen}
          />
        ) : currScreen == universitySettingsScreen.addUniversity ? (
          <UniversitySelect
            logoUrl={logoUrl}
            universityName={universityName}
            handleSubmit={handleSubmit}
            errors={errors}
            onValidSubmit={() => {
              setCurrScreen(universitySettingsScreen.otpVerification);
            }}
            goBack={() => setCurrScreen(universitySettingsScreen.currentJoined)}
            control={control}
            setValue={setValue}
          />
        ) : (
          <UniversityOtpVerification
            control={control}
            setError={setError}
            email={universityEmail}
            otp={otp}
            onOtpChange={(otp: any) => setValue("otp", otp)}
            handleSubmit={handleSubmit}
            onPrev={() => setCurrScreen(universitySettingsScreen.addUniversity)}
            errors={errors}
            isPending={isPendingChangeApi}
            onValidSubmit={() => {
              onSubmit();
            }}
            goBack={() => setCurrScreen(universitySettingsScreen.addUniversity)}
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default UniversityVerificationScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
    // padding: 16,
  },
  paddingContainer: {
    padding: 16,
  },
});
