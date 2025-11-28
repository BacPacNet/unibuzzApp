import { useEffect, useRef, useCallback } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getMixpanel } from "@/context/MixPanelProvider/MixPanelProvidex";

export const useTimeTracking = (
  eventName: string,
  properties: Record<string, any> = {}
) => {
  const hasTrackedRef = useRef(false);
  const propsRef = useRef(properties);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    propsRef.current = properties;
  }, [properties]);

  useFocusEffect(
    useCallback(() => {
      const mixpanel = getMixpanel();
      if (!mixpanel) return;

      // Reset tracking state when screen comes into focus
      hasTrackedRef.current = false;

      // Begin timing
      mixpanel.timeEvent(eventName);

      const trackTimeSpent = () => {
        if (hasTrackedRef.current) {
          return;
        }
        hasTrackedRef.current = true;

        mixpanel.track(eventName, propsRef.current);
      };

      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        // When app goes to background, track time
        if (
          appStateRef.current.match(/active|foreground/) &&
          nextAppState.match(/inactive|background/)
        ) {
          trackTimeSpent();
        }
        // When app comes back to foreground, start new timing session
        if (
          appStateRef.current.match(/inactive|background/) &&
          nextAppState.match(/active|foreground/)
        ) {
          // Reset tracking flag and start new timing session
          hasTrackedRef.current = false;
          mixpanel.timeEvent(eventName);
        }
        appStateRef.current = nextAppState;
      };

      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );

      // Cleanup when screen goes out of focus
      return () => {
        trackTimeSpent(); // Track time spent when screen loses focus
        subscription.remove();
      };
    }, [eventName])
  );
};
