import BackHeader from "@/components/atoms/BackHeader";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FONTS } from "@/constants/fonts";
import { useBlockUser, useGetUserBlockedList } from "@/services/user-Profile";
import { useQueryClient } from "@tanstack/react-query";
import SettingsUnblockUserListItem from "@/components/molecules/Settings/SettingsUnblockUserListItem";

const BlockUsersScreen = () => {
  const { goBack, navigate } = useNavigation<any>();
  const { data, isLoading, error } = useGetUserBlockedList();
  const { mutateAsync: mutateBlockUser, isPending } = useBlockUser();
  const queryClient = useQueryClient();

  const handleUnblockUser = async (userId: string) => {
    await mutateBlockUser(userId);
    queryClient.invalidateQueries({ queryKey: ["getUserBlockedList"] });
  };
  return (
    <View style={styles.containerMain}>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <BackHeader label="Settings" onPress={() => goBack()} />
        <View style={styles.paddingContainer} className="flex   ">
          {/* Info */}
          <View style={styles.section}>
            <Text style={styles.title}>Blocked Users</Text>
            <Text style={styles.description}>
              These are your blocked users. They cannot post, message, invite,
              or search for you. You can unblock them anytime here.
            </Text>
          </View>
          <View>
            {isLoading ? (
              <View className="flex justify-center items-center h-full min-h-[300px]">
                <ActivityIndicator />
              </View>
            ) : data?.blockedUsers?.length > 0 ? (
              data?.blockedUsers?.map((user: any) => (
                <SettingsUnblockUserListItem
                  key={user._id}
                  firstName={user.firstName}
                  lastName={user.lastName}
                  id={user._id}
                  university={user.university}
                  study_year={user.study_year}
                  degree={user.degree}
                  major={user.major}
                  occupation={user.occupation}
                  imageUrl={user.imageUrl}
                  type={user.type}
                  role={user.role}
                  affiliation={user.affiliation}
                  handleRemoveClick={() => handleUnblockUser(user.id)}
                  isRemovePending={isPending}
                />
              ))
            ) : (
              <Text className="text-neutral-500 text-sm">
                No blocked users found
              </Text>
            )}
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default BlockUsersScreen;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  container: {
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  paddingContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    color: "#374151",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    marginTop: 32,
    display: "flex",
    gap: 16,
  },
  info: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#6B7280",
    marginBottom: 16,
  },

  checkText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: "#404040",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  checkedBox: {
    width: 10,
    height: 10,
    backgroundColor: "#0066CC",
  },

  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  buttonContainer: {
    marginTop: 64,
    paddingBottom: 36,
    paddingHorizontal: 16,
  },
});
