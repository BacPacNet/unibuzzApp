import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Logo from "@/assets/onboarding/Unibuzz_Logo.svg";
import Title from "@/components/atoms/Title";
import SupportingText from "@/components/atoms/SupportingText";
import { useHandleLogin } from "@/services/auth";
import { removeRegisterData } from "@/storage/register";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { trackMixpanel } from "@/mixpanel/track";
import { TRACK_EVENT } from "@/content/constant";

// Constants
const COUNTDOWN_DURATION = 5;
const PROGRESS_DURATION = 5000;
const PROGRESS_SIZE = 80;
const PROGRESS_WIDTH = 10;

// Types
interface LoginData {
  email: string;
  password: string;
}

const LoginForm: React.FC<LoginData> = ({ email, password }) => {
  // State
  const [countdown, setCountdown] = useState(COUNTDOWN_DURATION);
  const [isCounting, setIsCounting] = useState(true);
  const [hasTriggeredLogin, setHasTriggeredLogin] = useState(false);

  // Hooks
  const { mutate: mutateLogin, isSuccess } = useHandleLogin();

  // Memoized login data
  const loginData = useCallback(
    (): LoginData => ({
      email,
      password,
    }),
    [email, password],
  );

  // Cleanup register data on successful login
  //   useEffect(() => {
  //     if (isSuccess) {
  //       removeRegisterData();
  //     }
  //   }, [isSuccess]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !hasTriggeredLogin) {
      handleLogin();
    }

    return () => clearTimeout(timer);
  }, [countdown, isCounting, hasTriggeredLogin]);

  // Login handler
  const handleLogin = useCallback(() => {
    if (!hasTriggeredLogin) {
      setHasTriggeredLogin(true);
      setIsCounting(false);
      mutateLogin(loginData());
      trackMixpanel(TRACK_EVENT.REGISTRATION_COMPLETE, {
        email: loginData()?.email,
      });
    }
  }, [hasTriggeredLogin, mutateLogin, loginData]);

  // Manual login handler
  const handleManualLogin = useCallback(() => {
    handleLogin();
  }, [handleLogin]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Logo style={styles.logo} width={112} height={26} />
        <Title style={styles.title}>Congratulations</Title>
        <SupportingText style={styles.subtitle}>
          Account Creation Complete
        </SupportingText>
      </View>

      {/* Progress Section */}
      <View style={styles.progressContainer}>
        <AnimatedCircularProgress
          size={PROGRESS_SIZE}
          width={PROGRESS_WIDTH}
          fill={100}
          tintColor="#6744FF"
          backgroundColor="#F3F2FF"
          padding={10}
          duration={PROGRESS_DURATION}
          prefill={0}
        />
        <Text style={styles.progressText}>Logging you in...</Text>
      </View>

      {/* Manual Login Button */}
      <TouchableOpacity
        disabled={hasTriggeredLogin}
        onPress={handleManualLogin}
        style={[
          styles.manualLoginButton,
          hasTriggeredLogin && styles.disabledButton,
        ]}
      >
        <Text style={styles.manualLoginText}>Not Redirected? Click here.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  header: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    marginBottom: 32,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280", // neutral-500 equivalent
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 64,
    marginBottom: 12,
  },
  progressText: {
    fontSize: 14,
    color: "#374151", // neutral-700 equivalent
    marginTop: 8,
  },
  manualLoginButton: {
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  manualLoginText: {
    color: "#6366F1", // primary-500 equivalent
    textDecorationLine: "underline",
    fontSize: 18,
  },
});

export default LoginForm;
