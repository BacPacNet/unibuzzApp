import React, { useCallback, useEffect, useRef } from "react";
import { Alert, AppState, Linking, Platform, type AppStateStatus } from "react-native";

type ForceUpdateModalProps = {
  visible: boolean;
  currentVersion: string;
  minRequiredVersion: string;
};

export default function ForceUpdateModal({
  visible,
  currentVersion,
  minRequiredVersion,
}: ForceUpdateModalProps) {
  const lastShownAtRef = useRef<number>(0);

  const handleUpdate = () => {
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/us/app/unibuzz-app/id6751199821");
    } else {
      Linking.openURL("https://play.google.com/store/apps/details?id=com.unibuzzapp&hl=en-US");
    }
  };

  const showAlert = useCallback(() => {
    if (!visible) return;

    const now = Date.now();
    if (now - lastShownAtRef.current < 800) return;
    lastShownAtRef.current = now;

    Alert.alert(
      "Update required",
      `Your app version (${currentVersion}) is no longer supported. Please update to at least ${minRequiredVersion} to continue.`,
      [
        {
          text: "Update",
          onPress: () => {
            handleUpdate();
            setTimeout(() => {
              showAlert();
            }, 800);
          },
        },
      ],
      { cancelable: false },
    );
  }, [visible, currentVersion, minRequiredVersion]);

  useEffect(() => {
    if (!visible) return;
    showAlert();
  }, [visible, showAlert]);

  useEffect(() => {
    const onChange = (state: AppStateStatus) => {
      if (state === "active") showAlert();
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [showAlert]);

  return null;
}
