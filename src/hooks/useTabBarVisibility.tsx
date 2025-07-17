import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export const useTabBarVisibility = (navigation: any) => {
  useFocusEffect(
    useCallback(() => {
      navigation?.getParent()?.setOptions({
        tabBarStyle: { display: "none" },
      });

      return () => {
        navigation?.getParent()?.setOptions({
          tabBarStyle: {
            backgroundColor: "white",
            height: 80,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 0,
            gap: 8,
            borderTopWidth: 1,
          },
        });
      };
    }, [navigation]),
  );
};
