import { StatusBar, View, StyleProp, ViewStyle } from "react-native";
import type { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

function SafeScreen({
  children,
  allowTopPadding = true,
  className = "bg-white",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  allowTopPadding?: boolean;
}) {
  const { layout, variant, navigationTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        layout.flex_1,
        {
          // Paddings to handle safe area
          paddingTop: allowTopPadding ? insets.top : 0,
          paddingBottom: insets.bottom,
          //   paddingLeft: insets.left + 16,
          //   paddingRight: insets.right + 16,
        },
        style,
      ]}
      className={`${className}`}
    >
      <StatusBar
        barStyle={variant === "dark" ? "light-content" : "dark-content"}
        backgroundColor={navigationTheme.colors.background}
      />
      {children}
    </View>
  );
}

export default SafeScreen;
