import BackHeader from "@/components/atoms/BackHeader";
import { FormInput } from "@/components/atoms/FormInput";
import ReusableButton from "@/components/atoms/ReusableButton";
import { NewGroupUserListItem } from "@/components/molecules/CreateNewGroup/UserList";
import MessageNewGroupFormContainer from "@/components/molecules/Message/MessageTopBar/MessageNewGroupFormContainer";
import { ImageAsset } from "@/hooks/useImageUpload";
import { useEditGroupChat } from "@/services/Messages";
import { useUploadToS3 } from "@/services/upload";
import { useUsersProfileForConnections } from "@/services/users";
import { getUserProfileStore } from "@/storage/user";
import { defaultBottomSheetSnapPoints } from "@/types/constant";
import { UPLOAD_CONTEXT } from "@/types/uploads";
import { User } from "iconoir-react-native";
import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import ActionSheet, {
  ActionSheetRef,
  FlatList,
} from "react-native-actions-sheet";
import { launchImageLibrary } from "react-native-image-picker";
import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = StackNavigationProp<RootStackParamList, "EditChatScreen">;

export default function EditChatScreen({ route }: any) {
  const navigate = useNavigation<NavigationProp>();
  const users = route?.params?.users ?? [];
  const chatId = route?.params?.chatId ?? "";
  const groupLogo = route?.params?.groupLogo ?? "";
  const groupCurrentName = route?.params?.groupCurrentName ?? "";
  const communitySelected = route?.params?.communitySelected ?? null;

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      groupName: groupCurrentName,
      community: communitySelected,
    },
  });
  const userProfileData = getUserProfileStore();
  const formRef = useRef<any>(null);

  const [searchInput, setSearchInput] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any>([]);

  const [imageToUpload, setImageToUpload] = useState<ImageAsset | null>(null);
  const {
    data: userProfilesData,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading: isUserProfilesLoading,
  } = useUsersProfileForConnections(searchInput, 10, true);
  const userProfiles =
    userProfilesData?.pages
      .flatMap((page) => page.users)
      .filter((user) => user._id !== userProfileData?.users_id) || [];

  const { mutateAsync: uploadToS3 } = useUploadToS3();
  const { mutateAsync: editGroup, isPending } = useEditGroupChat(chatId);

  const handleIndividualUserClick = async () => {
    const formValues = formRef.current?.getFormValues();
    const filteredFaculty = formRef.current.getFilteredFacultyUsers();
    const filteredStudents = formRef.current.getFilteredUsers();
    const individualUsers = formRef.current.getIndividualsUsers();

    let ImageData;
    if (imageToUpload) {
      const uploadPayload = {
        files: [imageToUpload],
        context: UPLOAD_CONTEXT.GROUP_DP,
      };
      const res = await uploadToS3(uploadPayload);
      ImageData = {
        groupLogo: {
          imageUrl: res.data[0]?.imageUrl,
          publicId: res.data[0]?.publicId,
        },
      };
    }

    const mergedUsers = [
      ...individualUsers.map((user: { _id: string }) => user._id),
      ...filteredStudents.map((user: { users_id: string }) => user.users_id),
      ...filteredFaculty.map((user: { users_id: string }) => user.users_id),
    ];

    const groupName = getValues("groupName");

    const dataTopush = {
      groupLogo: ImageData?.groupLogo,
      groupName: groupName,

      users: mergedUsers,
      community: formValues?.community,
    };

    await editGroup(dataTopush);

    navigate.goBack();
  };

  const userActionSheetRef = useRef<ActionSheetRef>(null);

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setImageToUpload(imageObject);
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <BackHeader label="Messages" />
      <View style={styles.bulkContainer}>
        <View>
          <View style={styles.photoSection}>
            <TouchableOpacity
              onPress={() => handleImagePick()}
              style={styles.photoUpload}
            >
              {groupLogo && !imageToUpload ? (
                <Image
                  source={{ uri: groupLogo }}
                  className="w-full h-full rounded-full absolute"
                />
              ) : imageToUpload ? (
                <Image
                  source={{ uri: imageToUpload.uri }}
                  className="w-full h-full rounded-full absolute"
                />
              ) : null}
              <User width={32} height={32} color="#9CA3AF" />
              <Text style={styles.photoUploadText}>Select Image</Text>
            </TouchableOpacity>

            <Text className="text-xs text-gray-500 ">Max file size: 5 MB</Text>
          </View>

          <Text style={styles.required}>Required Fields *</Text>

          <FormInput
            label="Group Name"
            placeholder="Enter Group Name"
            required
            rules={{ required: "Group Name is required!" }}
            name="groupName"
            control={control}
            isError={!!errors.groupName}
            errorMessage={errors.groupName ? "Group Name is required" : ""}
          />
          <MessageNewGroupFormContainer ref={formRef} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ReusableButton
          buttonText="Update Chat"
          onPress={() => handleIndividualUserClick()}
          variant="primary"
          height={"large"}
          isLoading={isPending}
        />
      </View>

      <ActionSheet
        ref={userActionSheetRef}
        gestureEnabled={true}
        snapPoints={defaultBottomSheetSnapPoints}
      >
        <View>
          <View className="w-full p-3">
            <TextInput
              style={{ paddingStart: 8 }}
              onChangeText={(text) => setSearchInput(text)}
              className="border border-neutral-200 w-full text-neutral-500  rounded-lg h-14 p-0"
              placeholderTextColor="#9CA3AF"
              placeholder="Search User..."
            />
          </View>

          <FlatList
            data={userProfiles}
            style={{ minHeight: 400 }}
            renderItem={({ item }) => (
              <View className="p-3">
                <NewGroupUserListItem
                  item={item}
                  selectedUsers={selectedUsers}
                  setSelectedUsers={setSelectedUsers}
                />
              </View>
            )}
          />
        </View>
        {/* <Text>User</Text> */}
      </ActionSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoid: {
    flex: 1,
  },

  bulkContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingTop: 32,
    marginHorizontal: 16,
    marginTop: 64,
  },
  actionSheetContainer: {
    height: "100%",
  },
  photoSection: {
    marginBottom: 32,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  photoUpload: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "#9685FF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoUploadText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
  },
  required: {
    color: "#EF4444",
    marginBottom: 16,
    fontSize: 12,
  },
});
