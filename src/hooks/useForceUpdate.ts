import { useEffect, useMemo, useState } from "react";
import { BackHandler, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

function compareSemver(a: string, b: string) {
  const pa = a.split(".").map((x) => Number(x));
  const pb = b.split(".").map((x) => Number(x));
  const len = Math.max(pa.length, pb.length);

  for (let i = 0; i < len; i += 1) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na > nb) return 1;
    if (na < nb) return -1;
  }

  return 0;
}

export function useForceUpdate(minRequiredVersion: string) {
  const [isOutdated, setIsOutdated] = useState(false);

  const currentVersion = useMemo(() => {
    try {
      return DeviceInfo.getVersion();
    } catch {
      return "0.0.0";
    }
  }, []);

  useEffect(() => {
    setIsOutdated(compareSemver(currentVersion, minRequiredVersion) < 0);
  }, [currentVersion, minRequiredVersion]);

  useEffect(() => {
    if (!isOutdated) return undefined;
    if (Platform.OS !== "android") return undefined;

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, [isOutdated]);

  return { isOutdated, currentVersion, minRequiredVersion };
}

