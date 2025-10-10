import { LongArrowUpLeft, Prohibition, WhiteFlag } from "iconoir-react-native";
import React from "react";
import { View, Text, TouchableOpacity, Share, StyleSheet } from "react-native";
import { Toast } from "react-native-toast-notifications";

type ProfileDropdownMenuProps = {
  name: string;
  userId: string;
};

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  name,
  userId,
}) => {
  const sharePost = async (
    message = `Hey, check out ${name} profile https://unibuzz.app/${userId}`
  ) => {
    try {
      await Share.share({ message });
    } catch (error: any) {
      Toast.show(error || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => sharePost()}
        style={styles.textContainer}
      >
        <LongArrowUpLeft height={16} width={16} color={"#242526"} />
        <Text className="text-neutral-700"> Share Profile</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.textContainer}>
        <Prohibition height={16} width={16} color={"#242526"} />
        <Text className="text-neutral-700 font-medium text-2xs">
          {" "}
          Block User
        </Text>
      </TouchableOpacity> */}
      {/* <TouchableOpacity style={styles.textContainer}>
        <WhiteFlag height={16} width={16} color={"#242526"} />
        <Text className="text-neutral-700"> Report this post</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileDropdownMenu;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    width: 144,
    height: 40,
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
