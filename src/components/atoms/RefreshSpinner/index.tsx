import { ActivityIndicator, View } from "react-native";

export const Refresh = () => {
  return (
    <View className="flex-1 bg-white flex justify-center items-center">
      <ActivityIndicator />
    </View>
  );
};
