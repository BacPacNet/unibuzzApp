import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import FullScreenLoader from "@/components/atoms/FullScreenLoader";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useChangeUserName } from "@/services/user";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed, NavArrowLeft } from "iconoir-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";

type Props = {};

const UserNameChangeScreen = (props: Props) => {
  const { goBack } = useNavigation();
  const { changeHeaderShownStatus } = useHeader();
  const {
    mutate,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
  } = useChangeUserName();
  const user = getUserStore();
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const {
    formState: { errors },
    control,
    handleSubmit,
    reset,
  } = useForm();

  //   useFocusEffect(
  //     useCallback(() => {
  //       changeHeaderShownStatus(false);

  //       return () => {
  //         changeHeaderShownStatus(true);
  //       };
  //     }, []),
  //   );

  const onSubmit = (data: any) => {
    setShowLoader(true);
    mutate(
      {
        userName: user?.userName || "",
        newUserName: data.newUserName,
        password: data.password,
      },
      {
        onSuccess: () => {
          reset();
          setShowLoader(false);
          Toast.show("Username changed successfully");
        },
        onError: () => {
          setShowLoader(false);
        },
      },
    );
  };

  if (showLoader) {
    return <FullScreenLoader message="Changing Username..." />;
  }

  return (
    <SafeAreaView style={styles.containerMain}>
      {/* Header */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackHeader label="Settings" onPress={() => goBack()} />
          <View style={styles.paddingContainer} className="flex   ">
            <Text style={styles.title}>Change Username</Text>
            <Text style={styles.desc}>
              Your username can be used to login and be identified by others.
            </Text>

            <View style={styles.inputContainer}>
              <FormInput
                label="Current Username"
                placeholder="Current Username"
                //   required
                name="userName"
                control={control}
                isError={!!errors.userName}
                disabled={true}
                errorMessage={
                  errors.userName
                    ? errors.userName.message?.toString()
                    : "Please enter your username!"
                }
                currentValue={user?.userName}
              />
              <FormInput
                label="New Username"
                placeholder="New Username"
                //   required
                name="newUserName"
                control={control}
                isError={!!errors.newUserName}
                errorMessage={
                  errors.newUserName
                    ? errors.newUserName.message?.toString()
                    : "Please enter your username!"
                }
                rules={{ required: "Please enter your username." }}
              />

              {/* password  */}
              <View>
                <FormInputPassword
                  isPasswordStrengthVisible={false}
                  label="Password"
                  placeholder="Password"
                  name="password"
                  control={control}
                  isError={!!errors.password}
                  errorMessage={errors.password?.message?.toString()}
                  rules={{ required: "Password is required!" }}
                />
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleSubmit(onSubmit)}
              buttonText="Change Username"
              variant="primary"
              height="large"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserNameChangeScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#3A3B3C",
    marginBottom: 4,
  },
  desc: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: 500,

    color: "#6744FF",
  },
  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },

  buttonContainer: {
    paddingTop: 64,
    paddingBottom: "8%",
    paddingHorizontal: 16,
  },
});
