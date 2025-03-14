import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { useHeader } from "@/context/HeaderProvider/Header";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Eye, EyeClosed, NavArrowLeft } from "iconoir-react-native";
import React, { useCallback, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {};

const UserNameChangeScreen = (props: Props) => {
  const { goBack } = useNavigation();
  const { changeHeaderShownStatus } = useHeader();
  const [showPassword, setShowPassword] = useState(false);
  const {
    formState: { errors },
    control,
    handleSubmit,
  } = useForm();

  useFocusEffect(
    useCallback(() => {
      changeHeaderShownStatus(false);

      return () => {
        changeHeaderShownStatus(true);
      };
    }, [])
  );

  const onSubmit = (data: any) => {
    console.log("data", data);
    // mutate(data)
  };

  return (
    <SafeAreaView style={styles.containerMain}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()} style={styles.backButton}>
          <NavArrowLeft width={24} height={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.paddingContainer} className="flex   ">
            {/* <Title>University Verification</Title> */}
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
                errorMessage={
                  errors.userName
                    ? errors.userName.message?.toString()
                    : "Please enter your username!"
                }
                rules={{ required: "Please enter your username." }}
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
              <View className="relative">
                <Text style={styles.label}>Password</Text>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="*********"
                      secureTextEntry={!showPassword}
                      className={`border    rounded-lg  ${errors.password ? "border-red-500" : "border-neutral-300"}`}
                      onBlur={onBlur}
                      onChangeText={(value) => onChange(value)}
                      value={value}
                      style={{
                        padding: 12,
                        fontSize: 14,
                        height: 40,
                        paddingEnd: 50,
                      }}
                    />
                  )}
                  name="password"
                  rules={{
                    required: "Password is required!",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                      message:
                        "Password must contain uppercase, lowercase, number, and special character",
                    },
                  }}
                />

                <TouchableOpacity
                  style={styles.passwordIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <Eye height={30} width={30} color={"#d4d4d4"} />
                  ) : (
                    <EyeClosed height={30} width={30} color={"#d4d4d4"} />
                  )}
                </TouchableOpacity>
                {errors.password && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.password.message?.toString()}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <ReusableButton
            onPress={handleSubmit(onSubmit)}
            buttonText="Push Changes"
            variant="primary"
          />
        </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  passwordIcon: {
    position: "absolute",
    top: 35,
    zIndex: 40,
    right: 12,
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
  },

  inputContainer: {
    marginTop: 16,
    display: "flex",
    gap: 8,
  },

  buttonContainer: {
    paddingTop: 20,
    paddingBottom: 4,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D1D5DB",
  },
});
