import { useGetAppUpdateStatus } from "@/services/app-version";
import { useEffect } from "react";
import { BackHandler } from "react-native";
import DeviceInfo from "react-native-device-info";

export function useForceUpdate() {
  const { data, isLoading } = useGetAppUpdateStatus();
  const currentVersion = DeviceInfo.getVersion();
  const shouldUpdate = data?.shouldUpdate ?? false;
  const message = data?.message ?? "Please update your app to continue.";
  useEffect(() => {
    if (!shouldUpdate) return;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );

    return () => subscription.remove();
  }, [shouldUpdate]);

  return {
    shouldUpdate,
    currentVersion,
    isLoading,
    message,
  };
}
