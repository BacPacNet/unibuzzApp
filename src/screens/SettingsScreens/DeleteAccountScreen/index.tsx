import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { useDeleteUserAccount } from "@/services/user";

import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-notifications";
import ReusableButton from "@/components/atoms/ReusableButton";
import { CheckSquareSolid } from "iconoir-react-native";
import { FONTS } from "@/constants/fonts";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import { getUserStore } from "@/storage/user";
import { FormInputPassword } from "@/components/atoms/FormInputPassword";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import DeActivateAccountBottomSheet from "@/components/molecules/Settings/DeActivateAccountBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHandleDeletePushNotificationToken } from "@/services/pushNotification";
import { useAuth } from "@/context/AuthProvider/AuthContext";

type FormDataType = {
  password: string;
  sure: boolean;
  email: string;
};

const DeleteAccountPage = () => {
  const user = getUserStore();
  const { goBack, navigate } = useNavigation<any>();
  const { mutateAsync, isPending } = useDeleteUserAccount();
  const deActivateAccountBottomSheet = useRef<ActionSheetRef>(null);
  const { mutateAsync: deletePushNotificationToken } =
    useHandleDeletePushNotificationToken();
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormDataType>();
  const isSelected = watch("sure");
  const onSubmit = async () => {
    const data = getValues();

    await mutateAsync(data, {
      onSuccess: async () => {
        reset();
      },
    });
  };

  const handleOpenBottomSheet = () => {
    if (!getValues("sure")) {
      return Toast.show("Please accept to continue", {
        placement: "top",
        type: "warning",
      });
    }

    if (!getValues("password")) {
      return Toast.show("Please enter your password", {
        placement: "top",
        type: "warning",
      });
    }

    deActivateAccountBottomSheet.current?.show();
  };

  return (
    <View style={styles.containerMain}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.paddingContainer} className="flex   ">
          {/* Info */}
          <View style={styles.section}>
            <Text style={styles.title}>Account Deletion</Text>
            <Text style={styles.description}>
              Deleting your Unibuzz account will remove all public and private
              information linked to your profile. Personal messages cannot be
              deleted. {"\n"}
              This action is permanent.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.inputContainer}>
            <View>
              <FormInput
                label="Email"
                placeholder="Email"
                name="email"
                control={control}
                isError={!!errors.email}
                disabled={true}
                errorMessage={
                  errors.email
                    ? errors.email.message?.toString()
                    : "Please enter your email!"
                }
                currentValue={user?.email}
              />
            </View>

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
            </View>

            <View className="flex flex-row items-center gap-2 ">
              <View className="flex justify-center items-center">
                <TouchableOpacity
                  onPress={() => setValue("sure", !isSelected)}
                  style={styles.checkboxBox}
                >
                  {isSelected && (
                    <CheckSquareSolid width={20} height={20} color="#6744FF" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.checkText}>
                I am sure I want to deactivate my Unibuzz account.
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <ReusableButton
              onPress={handleOpenBottomSheet}
              buttonText="Delete Account"
              variant="danger"
              height="large"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>

      <ActionSheet
        useBottomSafeAreaPadding
        ref={deActivateAccountBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
        }}
      >
        <DeActivateAccountBottomSheet
          deActivateAccount={onSubmit}
          cancelDeActivateAccount={() =>
            deActivateAccountBottomSheet.current?.hide()
          }
          isLoading={isPending}
        />
      </ActionSheet>
    </View>
  );
};

export default DeleteAccountPage;

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
  section: {
    marginBottom: 24,
  },
  title: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },
  info: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#6B7280",
    marginBottom: 16,
  },

  checkText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#404040",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
});
