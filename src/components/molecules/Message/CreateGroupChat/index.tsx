import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

import { useForm } from "react-hook-form";
import { Camera, UserPlus, User, NavArrowLeft, X } from "iconoir-react-native";
import ReusableButton from "@/components/atoms/ReusableButton";

import {
  useCreateGroupChat,
  useGetUserFollowingAndFollowers,
} from "@/services/Messages";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

import SelectUsersForGroupChat from "../SelectUsersForGroupChat";
import { launchImageLibrary } from "react-native-image-picker";
import { replaceImage } from "@/services/uploadImage";
import SelectBottomSheet from "../../SelectBottomSheet";
import { currYear, occupationAndDepartment, value } from "@/types/register";
import BackHeader from "@/components/atoms/BackHeader";

interface User {
  _id: string;
  profileImageUrl: string;
  firstName: string;
  lastName: string;
  profile: {
    study_year: string;
    degree: string;
    major: string;
    profile_dp: {
      imageUrl: string;
    };
  };
}

type Props = {
  setSelectedChat: (value: User) => void;
  setCurrTab: (value: string) => void;
};

type ImageAsset = {
  uri: string;
  fileName?: string;
  fileSize?: number;
  height?: number;
  width?: number;
  type?: string;
};

const CreateGroupChat = ({ setSelectedChat, setCurrTab }: Props) => {
  const {
    handleSubmit,
    register: GroupChatRegister,
    formState: { errors: GroupChatRegisterErr },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      inviteOption: "public",
      title: "",
      description: "",
      option: null,
    },
  });

  const [groupLogoImage, setGroupLogoImage] = useState<ImageAsset | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  //   const [selectedYears, setSelectedYears] = useState<any>([]);
  //   const [selectedMajors, setSelectedMajors] = useState<any>([]);
  //   const [selectedOccupation, setSelectedOccupation] = useState<any>([]);
  //   const [selectedAffiliation, setSelectedAffiliation] = useState<any>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const { data, isFetching } = useGetUserFollowingAndFollowers(searchInput);
  const { mutate: createGroupChat, isPending } = useCreateGroupChat();

  const actionSheetRef = useRef<ActionSheetRef>(null);
  //   const yearSheetRef = useRef<ActionSheetRef>(null);
  //   const majorSheetRef = useRef<ActionSheetRef>(null);
  //   const occupationSheetRef = useRef<ActionSheetRef>(null);
  //   const affiliationSheetRef = useRef<ActionSheetRef>(null);

  const handleClick = (userId: string) => {
    if (selectedUsers?.some((selectedUser) => selectedUser._id == userId)) {
      const filterd = selectedUsers.filter(
        (selectedUser) => selectedUser._id !== userId
      );
      setSelectedUsers(filterd);
    }
  };
  //   const handleYearClick = (year: string) => {
  //     if (selectedYears?.some((value: any) => value == year)) {
  //       const filterd = selectedYears.filter((value: any) => value !== year);
  //       setSelectedYears(filterd);
  //     }
  //   };
  //   const handleMajorClick = (major: string) => {
  //     if (selectedMajors?.some((value: any) => value == major)) {
  //       const filterd = selectedMajors.filter((value: any) => value !== major);
  //       setSelectedMajors(filterd);
  //     }
  //   };
  //   const handleOccupationClick = (occupation: string) => {
  //     if (selectedOccupation?.some((value: any) => value == occupation)) {
  //       const filterd = selectedOccupation.filter(
  //         (value: any) => value !== occupation
  //       );
  //       setSelectedOccupation(filterd);
  //     }
  //   };
  //   const handleAffiliationClick = (affiliation: string) => {
  //     if (selectedAffiliation?.some((value: any) => value == affiliation)) {
  //       const filterd = selectedAffiliation.filter(
  //         (value: any) => value !== affiliation
  //       );
  //       setSelectedAffiliation(filterd);
  //     }
  //   };

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: "photo" }, (response: any) => {
      if (!response.didCancel && !response.errorCode) {
        const imageObject = response.assets[0];
        setGroupLogoImage(imageObject);
      }
    });
  };

  const onGroupChatSubmit = async (data: any) => {
    let UploadedImageLink;
    let logogImageData;
    if (groupLogoImage) {
      setUploadingImage(true);
      UploadedImageLink = await replaceImage(groupLogoImage, "");
      setUploadingImage(false);
      logogImageData = {
        groupLogo: {
          imageUrl: UploadedImageLink?.imageUrl,
          publicId: UploadedImageLink?.publicId,
        },
      };
    }

    const selectedUsersIds = selectedUsers.map((item) => item._id);
    const dataToPush = {
      groupLogo: logogImageData?.groupLogo,
      groupName: data.title,
      groupDescription: data.description,
      users: selectedUsersIds,
    };
    createGroupChat(dataToPush, {
      onSuccess: (res: any) => {
        if (!res) return;
        setCurrTab("Inbox");
        setSelectedChat(res);
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "white",
      }}
    >
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <View style={{ flex: 1 }}>
          {/* <BottomSheetModalProvider> */}
          <View className="flex-1">
            {/* <View className="flex flex-row gap-4 items-center border-b border-neutral-300 p-4">
              <TouchableOpacity onPress={() => setCurrTab("Inbox")}>
                <NavArrowLeft height={24} width={24} />
              </TouchableOpacity>
              <Text>Back to Inbox</Text>
            </View> */}
            <BackHeader
              label="Back to Inbox"
              onPress={() => setCurrTab("Inbox")}
            />

            <View className="p-4 flex-1 gap-2">
              <Text className="text-neutral-700 font-semibold text-[18px]">
                Create Chat Group
              </Text>
              <View className="flex flex-row justify-between items-center mt-4">
                <TouchableOpacity
                  onPress={() => handleImagePick()}
                  className="border-2 border-neutral-200 bg-white w-24 h-24 rounded-full flex items-center justify-center"
                >
                  {groupLogoImage && (
                    <Image
                      source={{ uri: groupLogoImage.uri }}
                      className="w-24 h-24 rounded-full absolute"
                    />
                  )}
                  <Camera width={40} height={40} className="text-slate-400" />
                </TouchableOpacity>

                <View className="flex-1 ms-2 gap-2">
                  <Text className="font-medium text-xs text-neutral-900">
                    Group Name
                  </Text>
                  <TextInput
                    placeholder="Enter group name"
                    className="border border-neutral-200 p-2 rounded-lg text-neutral-500"
                    onChangeText={(text) => setValue("title", text)}
                  />
                  {GroupChatRegisterErr.title && (
                    <Text className="text-red-500">
                      Please enter your Group Name!
                    </Text>
                  )}
                </View>
              </View>
              <View className="my-4 flex gap-2">
                <Text className="font-medium text-xs text-neutral-900">
                  Add Members
                </Text>

                <TouchableOpacity
                  onPress={() => actionSheetRef.current?.show()}
                  className="border border-neutral-200 p-2 h-12 rounded-lg flex items-end"
                >
                  <UserPlus
                    height={24}
                    width={24}
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {selectedUsers?.slice(0, 8).map((item, key) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        backgroundColor: "#E5E7EB",
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text className="text-primary-500">{item.firstName}</Text>
                      <TouchableOpacity onPress={() => handleClick(item._id)}>
                        <Text className="text-primary-500">x</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {selectedUsers?.length > 9 && (
                    <View
                      className="text-primary-500 bg-neutral-200"
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                    >
                      <Text className="text-primary-500">
                        +{selectedUsers?.length - 4}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* //year 
              <View className="my-4 flex gap-2">
                <Text className="font-medium text-xs text-neutral-900">
                  Year
                </Text>

                <TouchableOpacity
                  onPress={() => yearSheetRef.current?.show()}
                  className="border border-neutral-200 p-2 h-12 rounded-lg flex flex-row justify-between"
                >
                  <Text>Invite students of a specific year.</Text>
                  <UserPlus
                    height={24}
                    width={24}
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {selectedYears?.map((item: any, key: number) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,

                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                      className="border border-neutral-300"
                    >
                      <Text className="text-black">{item}</Text>
                      <TouchableOpacity onPress={() => handleYearClick(item)}>
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-black bg-neutral-200 border border-neutral-300 p-1 text-xs rounded-lg "
                        >
                          100
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View> */}

              {/* //Major 
              <View className="my-4 flex gap-2">
                <Text className="font-medium text-xs text-neutral-900">
                  Major
                </Text>

                <TouchableOpacity
                  onPress={() => majorSheetRef.current?.show()}
                  className="border border-neutral-200 p-2 h-12 rounded-lg flex flex-row justify-between"
                >
                  <Text>Invite students of a specific major.</Text>
                  <UserPlus
                    height={24}
                    width={24}
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {selectedMajors?.map((item: any, key: number) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,

                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                      className="border border-neutral-300"
                    >
                      <Text className="text-black">{item}</Text>
                      <TouchableOpacity onPress={() => handleMajorClick(item)}>
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-black bg-neutral-200 border border-neutral-300 p-1 text-xs rounded-lg "
                        >
                          100
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View> */}

              {/* //faculty occupation 
              <View className="my-4 flex gap-2">
                <Text className="font-medium text-xs text-neutral-900">
                  Occupation
                </Text>

                <TouchableOpacity
                  onPress={() => occupationSheetRef.current?.show()}
                  className="border border-neutral-200 p-2 h-12 rounded-lg flex flex-row justify-between"
                >
                  <Text>Invite students of a specific occupation.</Text>
                  <UserPlus
                    height={24}
                    width={24}
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {selectedOccupation?.map((item: any, key: number) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,

                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                      className="border border-neutral-300"
                    >
                      <Text className="text-black">{item}</Text>
                      <TouchableOpacity
                        onPress={() => handleOccupationClick(item)}
                      >
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-black bg-neutral-200 border border-neutral-300 p-1 text-xs rounded-lg "
                        >
                          100
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View> */}
              {/* //faculty affiliation 
              <View className="my-4 flex gap-2">
                <Text className="font-medium text-xs text-neutral-900">
                  Affiliation
                </Text>

                <TouchableOpacity
                  onPress={() => affiliationSheetRef.current?.show()}
                  className="border border-neutral-200 p-2 h-12 rounded-lg flex flex-row justify-between"
                >
                  <Text>Invite students of a specific Affiliation.</Text>
                  <UserPlus
                    height={24}
                    width={24}
                    className="text-primary-500"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  {selectedAffiliation?.map((item: any, key: number) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,

                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                      }}
                      className="border border-neutral-300"
                    >
                      <Text className="text-black">{item}</Text>
                      <TouchableOpacity
                        onPress={() => handleAffiliationClick(item)}
                      >
                        <Text
                          style={{ fontSize: 12 }}
                          className="text-black bg-neutral-200 border border-neutral-300 p-1 text-xs rounded-lg "
                        >
                          100
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View> */}

              <ReusableButton
                onPress={handleSubmit(onGroupChatSubmit)}
                buttonText="Create New Chat"
                variant="primary"
                disabled={isPending || uploadingImage}
                isLoading={isPending || uploadingImage}
              />
            </View>
          </View>

          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            snapPoints={[70, 100]}
            onClose={() => setSearchInput("")}
          >
            <SelectUsersForGroupChat
              data={data}
              isFetching={isFetching}
              setSearchInput={setSearchInput}
              setSelectedUsers={setSelectedUsers}
              selectedUsers={selectedUsers}
            />
          </ActionSheet>
          {/* <ActionSheet
            ref={yearSheetRef}
            gestureEnabled={true}
            snapPoints={[70, 100]}
          >
            <SelectBottomSheet
              data={currYear}
              setSelectedField={setSelectedYears}
              selectedField={selectedYears}
            />
          </ActionSheet>
          <ActionSheet
            ref={majorSheetRef}
            gestureEnabled={true}
            snapPoints={[70, 100]}
          >
            <SelectBottomSheet
              data={value}
              setSelectedField={setSelectedMajors}
              selectedField={selectedMajors}
            />
          </ActionSheet>
          <ActionSheet
            ref={occupationSheetRef}
            gestureEnabled={true}
            snapPoints={[70, 100]}
          >
            <SelectBottomSheet
              data={Object.keys(occupationAndDepartment)}
              setSelectedField={setSelectedOccupation}
              selectedField={selectedOccupation}
            />
          </ActionSheet>
          <ActionSheet
            ref={affiliationSheetRef}
            gestureEnabled={true}
            snapPoints={[70, 100]}
          >
            <SelectBottomSheet
              data={value}
              setSelectedField={setSelectedAffiliation}
              selectedField={selectedAffiliation}
            />
          </ActionSheet> */}
        </View>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default CreateGroupChat;
