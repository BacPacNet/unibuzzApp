import React, { useEffect } from "react";
import { Mixpanel } from "mixpanel-react-native";
import { NEXT_PUBLIC_MIXPANEL_TOKEN } from "@env";
interface MixPanelProviderProps {
  children: React.ReactNode;
}


const MIXPANEL_TOKEN = NEXT_PUBLIC_MIXPANEL_TOKEN;
const isDevelopment = __DEV__;

let mixpanel: Mixpanel | null = null;

const initMixpanel = () => {
  if (!MIXPANEL_TOKEN) {
    if (isDevelopment) {
      console.warn(
        "Mixpanel token is missing. Analytics will not be initialized."
      );
    }
    return;
  }

  try {
    const trackAutomaticEvents = false;
    mixpanel = new Mixpanel(MIXPANEL_TOKEN, trackAutomaticEvents);
    mixpanel.init();

    if (isDevelopment) {
      console.log("Mixpanel initialized");
    }
  } catch (error) {
    if (isDevelopment) {
      console.error("Failed to initialize Mixpanel:", error);
    }
  }
};

export const getMixpanel = () => mixpanel;

export default function MixPanelProvider({ children }: MixPanelProviderProps) {
  useEffect(() => {
    initMixpanel();
  }, []);

  return <>{children}</>;
}
