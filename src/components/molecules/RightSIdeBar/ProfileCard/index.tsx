import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Share,
} from "react-native";
import Ava from "@/assets/avatar.svg";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import {
  ChatBubble,
  ChatBubbleSolid,
  EditPencil,
  MoreHoriz,
  UserPlus,
} from "iconoir-react-native";
import { RootStackParamList } from "@/types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useToggleFollow } from "@/services/connection";
import DropdownWrapper from "../../SelectDropDownWrapper";
import { Toast } from "react-native-toast-notifications";
import { useCreateUserChat } from "@/services/Messages";
import ProfileDropdownMenu from "@/components/atoms/ProfileDropdownMenu";
import ReusableButton from "@/components/atoms/ReusableButton";

type Props = {
  name?: string;
  avatarUrl?: string;
  university?: string;
  year?: string;
  degree?: string;
  isSelfProfile?: boolean;
  toShow: boolean;
  isStudent: boolean;
  occupation?: string;
  major?: string;
  affiliation?: string;
  isSideBar?: boolean;
  userId?: string;
  ProfileSize?: "small" | "large";
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Profile">;

const ProfileCard = ({
  name,
  avatarUrl,
  degree,
  university,
  year,
  isSelfProfile,
  toShow = false,
  isStudent,
  major,
  occupation,
  affiliation,
  isSideBar = false,
  userId,
  ProfileSize = "small",
}: Props) => {
  const user = getUserStore();
  const userProfile = getUserProfileStore();
  const userFollowingIDs =
    userProfile && userProfile?.following?.map((following) => following.userId);
  const { navigate } = useNavigation<NavigationProp>();
  const { mutate: toggleFollow, isPending } = useToggleFollow(
    userFollowingIDs?.includes(userId as string) || false,
    true
  );
  const { mutateAsync: mutateCreateUserChat, isPending: userChatPending } =
    useCreateUserChat();

  const handleMessage = async () => {
    const createChatResponse: any = await mutateCreateUserChat({
      userId: userId,
    });

    navigate("Messages", {
      screen: "Messages",
      params: { selectedUserId: createChatResponse._id },
    });
  };

  const first =
    isSideBar && isStudent
      ? userProfile?.study_year
      : isStudent
        ? year
        : userProfile?.occupation || occupation;

  const second =
    isSideBar && isStudent
      ? userProfile?.major
      : isStudent && !isSideBar
        ? major
        : !isStudent && !isSideBar
          ? affiliation
          : !isStudent && isSideBar
            ? userProfile?.affiliation
            : affiliation;

  const sharePost = async (
    message = `Hey, check out ${name} profile ${NEXT_PUBLIC_API_BASE_URL}/${userId}`
  ) => {
    try {
      await Share.share({ message });
    } catch (error: any) {
      Toast.hideAll();
      Toast.show(error || "Something went wrong");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        {isSelfProfile && toShow ? (
          <ReusableButton
            buttonContent={
              <View className="flex-row items-center justify-center gap-1">
                <Text className="text-[#6744FF]">Edit Profile</Text>
                <EditPencil
                  width={22}
                  height={22}
                  color="#ffff"
                  fill={"#6744FF"}
                />
              </View>
            }
            variant={"shade"}
            onPress={() => navigate("ProfileEdit")}
            height="small"
            isRounded={true}
            size={115}
          />
        ) : !isSelfProfile && toShow ? (
          <View className="flex flex-row gap-2">
            <DropdownWrapper
              position="bottom"
              renderDropdown={() => (
                <ProfileDropdownMenu
                  name={name || user?.firstName + " " + user?.lastName}
                  userId={userId as string}
                />
              )}
            >
              <TouchableOpacity style={styles.editButton}>
                <MoreHoriz height={20} width={20} color={"#6744FF"} />
              </TouchableOpacity>
            </DropdownWrapper>
            <TouchableOpacity onPress={handleMessage} style={styles.editButton}>
              <ChatBubbleSolid height={20} width={20} color={"#6744FF"} />
            </TouchableOpacity>
            <ReusableButton
              buttonContent={
                userFollowingIDs?.includes(userId as string) ? (
                  <Text className="text-primary font-bold text-2xs">
                    Following
                  </Text>
                ) : (
                  <View className="flex-row items-center justify-center gap-1">
                    <Text className="text-white font-bold text-2xs">
                      Follow
                    </Text>
                    <UserPlus height={16} width={16} color={"white"} />
                  </View>
                )
              }
              variant={
                userFollowingIDs?.includes(userId as string)
                  ? "border_primary"
                  : "primary"
              }
              onPress={() => toggleFollow(userId as string)}
              isLoading={isPending}
              activityIndicatorColor={
                userFollowingIDs?.includes(userId as string)
                  ? "#6744FF"
                  : "white"
              }
              disabled={isPending}
              height="small"
              isRounded={true}
              size="small"
            />
          </View>
        ) : null}
      </View>

      <View style={styles.card}>
        <View style={styles.profilePicWrapper}>
          {(isSideBar && !userProfile?.profile_dp?.imageUrl) ||
          (!isSideBar && !avatarUrl) ? (
            <Ava
              width={ProfileSize === "large" ? 80 : 48}
              height={ProfileSize === "large" ? 80 : 48}
            />
          ) : (
            <Image
              source={
                isSideBar
                  ? { uri: userProfile?.profile_dp?.imageUrl }
                  : { uri: avatarUrl }
              }
              style={[
                styles.profilePic,
                {
                  width: ProfileSize === "large" ? 80 : 48,
                  height: ProfileSize === "large" ? 80 : 48,
                },
              ]}
            />
          )}
          {/* <Image
            source={
              isSideBar
                ? {  uri: userProfile?.profile_dp?.imageUrl }
                : avatarUrl
                  ? { uri: avatarUrl }
                  : avatar
            }
            style={styles.profilePic}
          /> */}
        </View>
        <View style={styles.info}>
          <View className="flex   justify-between">
            <Text
              style={[
                styles.name,
                { fontSize: ProfileSize === "large" ? 16 : 12 },
              ]}
            >
              {name ? name : user?.firstName + " " + user?.lastName}
            </Text>
            <View style={styles.universityContainer}>
              <Text
                style={[
                  styles.year,
                  { fontSize: ProfileSize === "large" ? 14 : 10 },
                ]}
              >
                {first}
              </Text>
              <Text
                style={[
                  styles.year,
                  { fontSize: ProfileSize === "large" ? 14 : 10 },
                ]}
              >
                {second}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 16,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicWrapper: {
    borderRadius: 50,
    padding: 3,
  },
  profilePic: {
    // width: 48,
    // height: 48,
    borderRadius: 200,
  },
  info: {
    marginLeft: 8,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 12,
    fontWeight: "semibold",
    color: "#3A3B3C",
  },
  university: {
    color: "#555",
    flex: 1,
    width: "100%",
  },
  universityContainer: {
    display: "flex",
    flex: 1,
    gap: 1,
    alignItems: "flex-start",
    width: "100%",
  },

  badgeWrapper: {
    marginTop: 2,
  },
  badge: {
    backgroundColor: "#ff5c5c",
    color: "#fff",
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 12,
    fontWeight: "bold",
  },
  year: {
    color: "#6B7280",
    fontSize: 10,
  },

  editButton: {
    backgroundColor: "#F3F2FF",

    borderRadius: 200,
    width: 32,
    height: 32,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonPrimary: {
    backgroundColor: "#6744FF",

    borderRadius: 200,
    width: 32,
    height: 32,
    display: "flex",
    flexDirection: "row",
    gap: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileCard;
