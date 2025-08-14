import { useHeader } from "@/context/HeaderProvider/Header";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export const useTabBarVisibility = (
  navigation: any,
  toCall: boolean = true
) => {
  const { isTabBarVisible, setIsTabBarVisible } = useHeader();

  useFocusEffect(
    useCallback(() => {
      setIsTabBarVisible(false);

      return () => {
        setIsTabBarVisible(true);
      };
    }, [navigation, toCall])
  );

  return isTabBarVisible;
};
