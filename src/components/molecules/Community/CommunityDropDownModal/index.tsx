import { FONTS } from "@/constants/fonts";
import { LogIn } from "iconoir-react-native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import LeaveCommunityBottomSheet from "../LeaveCommunityBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef } from "react";

export const CommunityDropDownModal = ({
  leaveCommunity,
  communityLogoUrl,
  communityName,
}: {
  leaveCommunity: () => void;
  communityLogoUrl: string;
  communityName: string;
}) => {
  const leaveCommunityBottomSheet = useRef<ActionSheetRef>(null);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => leaveCommunityBottomSheet.current?.show()}
        style={styles.textContainer}
      >
        <LogIn height={16} width={16} color={"#EF4444"} />
        <Text style={styles.text}> Leave</Text>
      </TouchableOpacity>

      <ActionSheet
        useBottomSafeAreaPadding
        ref={leaveCommunityBottomSheet}
        gestureEnabled={true}
        safeAreaInsets={insets}
        // snapPoints={[70, 100]}
        containerStyle={{
          paddingTop: 10,
          
        }}
      >
        <LeaveCommunityBottomSheet
          leaveCommunity={leaveCommunity}
          leaveCommunityBottomSheet={leaveCommunityBottomSheet}
          communityLogoUrl={communityLogoUrl}
          communityName={communityName}
        />
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 144,
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  text: {
    color: "#3A3B3C",
    fontFamily: FONTS.inter.medium,
    fontSize: 12,
  },
});
