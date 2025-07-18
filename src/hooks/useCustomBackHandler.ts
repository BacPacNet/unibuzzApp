import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { useCallback } from "react";

/**
 * useCustomBackHandler
 * Reusable hook to handle hardware back button with custom logic.
 *
 * @param onBackPress - Function to call when back button is pressed.
 */
export default function useCustomBackHandler(onBackPress: () => void) {
  useFocusEffect(
    useCallback(() => {
      const handler = () => {
        onBackPress();
        return true; 
      };

      BackHandler.addEventListener("hardwareBackPress", handler);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handler);
    }, [onBackPress])
  );
}
