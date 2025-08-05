import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet, FlatList } from "react-native";

import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";
import MembersUserCard from "@/components/molecules/MembersUserCard";
import { getUserProfileStore, getUserStore } from "@/storage/user";
import { useRemoveGroupChatMember } from "@/services/Messages";
import { useState } from "react";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "ChatMembersScreen"
>;

const ChatMembersScreen = ({ route }: any) => {
  const navigate = useNavigation<NavigationProp>();
  const users = route?.params?.users ?? [];
  const chatId = route?.params?.chatId ?? "";
  const groupAdmin = route?.params?.groupAdmin ?? "";
  const [removing, setRemoving] = useState("");
  const [usersList, setUsersList] = useState(users || []);
  const userProfileData = getUserProfileStore();
  
  
  const { mutateAsync, isPending } = useRemoveGroupChatMember(chatId);
  const handleRemoveUser = async (userIdToRemove: string) => {
    setRemoving(userIdToRemove);
    const res: any = await mutateAsync({ userToToggleId: userIdToRemove });
    if (res?.id) {
      const newUserList = usersList.filter(
        (user: any) => user.userId._id !== res?.id,
      );
      setUsersList(newUserList);
    }
    setRemoving("");
  };
  const handleBack = () => {
    // navigate.navigate("CommunityGroup", {
    //   communityId: communityId._id,
    //   communityGroupId: communityGroupId,
    // });
    navigate.goBack();
  };

  return (
    <View style={styles.container}>
      <BackHeader label="Members" onPress={() => handleBack()} />
      <View style={styles.paddingContainer} className="   ">
        <FlatList
          data={usersList}
          keyExtractor={(item) => item.userId._id}
          renderItem={({ item }) => (
            <MembersUserCard
              _id={item.userId._id}
              firstName={item.userId.firstName}
              lastName={item.userId.lastName}
              isFollowing={false}
              isSelfProfile={userProfileData?.users_id === item.userId._id}
              isViewerAdmin={false}
              isGroupAdmin={groupAdmin === item.userId._id}
              currentUserId={userProfileData?.users_id || ""}
              role={item.userId.role}
              isChat={true}
              profile_dp_imageUrl={item.userId.profileDp}
              study_year={item.userId.studyYear || ""}
              isRemoving={removing === item.userId._id}
              disabled={isPending}
              major={item.userId.major || ""}
              occupation={item.userId.occupation || ""}
              affiliation={item.userId.affiliation || ""}
              handleRemoveClick={(id: string) => handleRemoveUser(id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

export default ChatMembersScreen;

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  paddingContainer: {
    flex: 1,
    padding: 16,
  },
  listContainer: { paddingBottom: 20 },
  emptyList: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
});
