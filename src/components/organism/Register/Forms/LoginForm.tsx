import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";

import LogoCircle from "@/assets/LogoCircle.svg";
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
    <View className="flex w-full justify-center items-center px-4 bg-white">
      <View className="my-4 w-full flex items-center gap-2">
        <LogoCircle className="w-14 h-14 " />
        <Title className="text-center">Congratulations</Title>
        <SupportingText className="text-center text-gray-600">
          You have successfully created an account
        </SupportingText>
      </View>

      <View className="w-full my-4 flex items-center justify-center">
        <AnimatedCircularProgress
          size={120}
          width={15}
          fill={100}
          tintColor="#6744FF"
          backgroundColor="#F3F2FF"
          padding={10}
          duration={5000}
          prefill={0}
        />
        <Text className="text-xl">Login you in...</Text>
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

export default LoginForm;
