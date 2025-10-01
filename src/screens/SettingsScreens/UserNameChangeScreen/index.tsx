import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import FullScreenLoader from "@/components/atoms/FullScreenLoader";
import ReusableButton from "@/components/atoms/ReusableButton";
import { FONTS } from "@/constants/fonts";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useChangeUserName } from "@/services/user";
import { getUserStore } from "@/storage/user";
import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Toast } from "react-native-toast-notifications";

type Props = {};

type NavigationProp = StackNavigationProp<RootStackParamList, "Settings">;
const UserNameChangeScreen = (props: Props) => {
  const { goBack, navigate } = useNavigation<NavigationProp>();
  const { changeHeaderShownStatus } = useHeader();
  const {
    mutate,
    error,
    isPending: isPendingChangeApi,
    isSuccess,
  } = useChangeUserName();
  const user = getUserStore();
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
    if (data.newUserName === user?.userName) {
      Toast.hideAll();
      Toast.show("New username cannot be the same as the current username", {
        type: "danger",
        placement: "top",
      });
      return;
    }

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
          Toast.hideAll();
          Toast.show("Username changed successfully");
        },
        onError: () => {
          setShowLoader(false);
        },
      }
    );
  };

  if (showLoader) {
    return <FullScreenLoader message="Changing Username..." />;
  }

  return (
    <View style={styles.containerMain}>
      {/* Header */}

      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
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
              <TouchableOpacity
                onPress={() =>
                  navigate("ForgetPassword", {
                    backTo: "UserNameChangeScreen",
                  })
                }
              >
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
      </KeyboardAwareScrollView>
    </View>
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
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontFamily: FONTS.poppins.bold,
    color: "#3A3B3C",
  },
  desc: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    marginTop: 8,
    color: "#6B7280",
  },
  forgotPassword: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
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
