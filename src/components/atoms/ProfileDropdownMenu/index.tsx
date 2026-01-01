import BlockUserBottomSheet from "@/components/molecules/Profile/BlockUserBottomSheet";
import { useBlockUser } from "@/services/user-Profile";
import { defaultBottomSheetSnapPoints } from "@/types/constant";
import { LongArrowUpLeft, Prohibition, WhiteFlag } from "iconoir-react-native";
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Share, StyleSheet } from "react-native";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-notifications";

type ProfileDropdownMenuProps = {
  name: string;
  userId: string;
};

const ProfileDropdownMenu: React.FC<ProfileDropdownMenuProps> = ({
  name,
  userId,
}) => {
  const { mutateAsync: mutateBlockUser, isPending } = useBlockUser();
  const insets = useSafeAreaInsets();
  const userActionSheetRef = useRef<ActionSheetRef>(null);
  const sharePost = async (
    message = `Hey, check out ${name} profile https://unibuzz.app/${userId}`
  ) => {
    try {
      await Share.share({ message });
    } catch (error: any) {
      Toast.show(error || "Something went wrong");
    }
  };

  const handleBlockUserConfirm = () => {
    mutateBlockUser(userId, {
      onSuccess: () => {
        //   setIsBlocked(!isBlocked)
        userActionSheetRef.current?.hide();
      },
    });
  };

  const handleBlockUser = () => {
    userActionSheetRef.current?.show();
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
      <TouchableOpacity onPress={handleBlockUser} style={styles.textContainer}>
        <Prohibition height={16} width={16} color={"#242526"} />
        <Text className="text-neutral-700 font-medium text-2xs">
          {" "}
          Block User
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.textContainer}>
        <WhiteFlag height={16} width={16} color={"#242526"} />
        <Text className="text-neutral-700"> Report this post</Text>
      </TouchableOpacity> */}

      <ActionSheet
        ref={userActionSheetRef}
        gestureEnabled={true}
        safeAreaInsets={insets}
      >
        <BlockUserBottomSheet
          closeBottomSheet={() => userActionSheetRef.current?.hide()}
          onConfirm={handleBlockUserConfirm}
          pending={isPending}
        />
      </ActionSheet>
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
    height: "auto",
  },
  textContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
