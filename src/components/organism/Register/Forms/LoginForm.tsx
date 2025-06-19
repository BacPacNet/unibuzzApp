import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Logo from "@/assets/onboarding/Unibuzz_Logo.svg";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import { useHandleLogin } from "@/services/auth";

import { removeRegisterData } from "@/storage/register";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const LoginForm = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isCounting, setIsCounting] = useState(true);
  const [loginEmail, setLoginEmail] = useState(email);
  const [loginPassword, setLoginPassword] = useState(password);
  const {
    mutate: mutateLogin,

    isSuccess,
  } = useHandleLogin();

  useEffect(() => {
    setLoginEmail(loginEmail);
    setLoginPassword(loginPassword);
  }, [loginEmail, loginPassword]);

  useEffect(() => {
    removeRegisterData();
  }, [isSuccess]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCounting(false);
      const data = { email: loginEmail, password: loginPassword };
      mutateLogin(data);
    }
    return () => clearTimeout(timer);
  }, [countdown, isCounting]);

  const onSubmit = () => {
    const data = { email: loginEmail, password: loginPassword };
    mutateLogin(data);
  };
  return (
    <View className="flex w-full justify-center items-center px-4 bg-white h-full">
      <View className=" w-full flex items-center justify-center ">
        {/* <LogoCircle className="w-14 h-14 " /> */}
        <Logo style={styles.logo} width={112} height={26} />
        <Title className="text-center mb-2">Congratulations</Title>
        <SupportingText className="text-center test-xs text-neutral-500">
          Account Creation Complete
        </SupportingText>
      </View>

      <View
        style={styles.progressContainer}
        className="w-full  flex items-center justify-center"
      >
        <AnimatedCircularProgress
          size={80}
          width={10}
          fill={100}
          tintColor="#6744FF"
          backgroundColor="#F3F2FF"
          padding={10}
          duration={5000}
          prefill={0}
        />
        <Text className="text-sm text-neutral-700">Logging you in...</Text>
      </View>
      <TouchableOpacity
        disabled={true}
        onPress={onSubmit}
        className="text-primary-500 underline text-lg"
      >
        <Text> Not Redirected? Click here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    marginBottom: 32,
  },
  progressContainer: {
    marginTop: 64,
    marginBottom: 12,
  },
});

export default LoginForm;
