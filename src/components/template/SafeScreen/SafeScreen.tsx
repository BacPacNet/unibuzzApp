import { StatusBar, View } from "react-native";
import type { PropsWithChildren } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

function SafeScreen({ children,className = "bg-white" }: {children:React.ReactNode,className?:string}) {
  const { layout, variant, navigationTheme } = useTheme();
  const insets = useSafeAreaInsets();

 
  return (
    <View
      style={[
        layout.flex_1,
        {
        
          // Paddings to handle safe area
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        //   paddingLeft: insets.left + 16,
        //   paddingRight: insets.right + 16,
        },
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
