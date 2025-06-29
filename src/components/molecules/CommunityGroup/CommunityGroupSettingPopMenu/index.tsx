import {
  Edit,
  LogIn,
  LongArrowUpLeft,
  Prohibition,
  WarningCircleSolid,
  WhiteFlag,
} from "iconoir-react-native";
import React from "react";
import { View, Text, TouchableOpacity, Share, StyleSheet } from "react-native";
import { Toast } from "react-native-toast-notifications";

type CommunityGroupSettingPopMenuProps = {
  isPending: boolean;
  isGroupAdmin: boolean;
  leaveCommunityGroup: () => void;
  handleNavigateToEditCommunityGroupScreen: () => void;
};

const CommunityGroupSettingPopMenu: React.FC<
  CommunityGroupSettingPopMenuProps
> = ({
  isPending,
  isGroupAdmin,
  leaveCommunityGroup,
  handleNavigateToEditCommunityGroupScreen,
}) => {
  return (
    <View style={styles.container}>
      {isGroupAdmin && (
        <TouchableOpacity
          style={styles.textContainer}
          onPress={handleNavigateToEditCommunityGroupScreen}
        >
          <Edit height={16} width={16} color={"#6744FF"} />
          <Text className="text-neutral-700"> Edit Group</Text>
          {isPending && (
            <WarningCircleSolid width={16} height={16} color="#F59E0B" />
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={leaveCommunityGroup}
        style={styles.textContainer}
      >
        <LogIn height={16} width={16} color={"#EF4444"} />
        <Text className="text-neutral-700"> Leave</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CommunityGroupSettingPopMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
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
});
