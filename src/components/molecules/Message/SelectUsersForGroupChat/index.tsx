import React, { useCallback, useEffect } from "react";
import { ActivityIndicator, Image, Text, TextInput, View } from "react-native";
import { FlatList } from "react-native-actions-sheet";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import avatar from "../../../../assets/avatar.png";
import ReusableButton from "@/components/atoms/ReusableButton";

// type user = {
//     _id: string
//     profileImageUrl: string
//     firstName: string
//     year: string
//     degree: string
//     major: string
//   }

interface user {
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
  data: any;
  setSearchInput: (value: string) => void;
  setSelectedUsers: (value: user[]) => void;
  selectedUsers: user[];
  isFetching: boolean;
};

const SelectUsersForGroupChat = ({
  data,
  isFetching,
  setSearchInput,
  selectedUsers,
  setSelectedUsers,
}: Props) => {
  const handleSelectAll = useCallback(() => {
    const getAllUsers = data?.user?.map((user: user) => user);
    setSelectedUsers(getAllUsers);
  }, [data]);

  const renderItem = ({ item }: { item: user }) => {
    let bouncyCheckboxRef: any = null;

    const handleClick = (user: user) => {
      if (
        selectedUsers?.some((selectedUser: any) => selectedUser._id == item._id)
      ) {
        const filterd = selectedUsers.filter(
          (selectedUser: any) => selectedUser._id !== item._id
        );
        setSelectedUsers(filterd);
      } else {
        setSelectedUsers([...selectedUsers, item]);
      }
    };
    const isSelected = selectedUsers?.some(
      (selectedUser: any) => selectedUser._id == item._id
    );

    return (
      <View
        style={{
          paddingHorizontal: 12,
        }}
        className="flex flex-row justify-between p-4 border-b border-neutral-200 "
      >
        <View className="flex-1 flex-row items-center gap-4 justify-center">
          <View className=" ">
            <Image
              source={
                item?.profile?.profile_dp?.imageUrl
                  ? { uri: item?.profile?.profile_dp?.imageUrl }
                  : avatar
              }
              style={{ width: 52, height: 52 }}
              className=" rounded-full"
              resizeMode="cover"
            />
          </View>

          <View className=" flex-1 flex-row items-center ">
            <View className=" flex-1 ">
              <Text
                className="text-neutral-600 text-sm 
                     font-semibold"
              >
                {item.firstName} {item.lastName}
              </Text>
              <View>
                <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
                  3rd Yr. undergraduate
                </Text>
                <Text style={{ fontSize: 12 }} className="text-neutral-500 ">
                  Biological engineering
                </Text>
              </View>
            </View>

            <View className="flex justify-center items-center ">
              <BouncyCheckbox
                ref={bouncyCheckboxRef}
                size={25}
                fillColor="blue"
                unFillColor="#FFFFFF"
                text="Click Me"
                iconStyle={{ borderColor: "blue" }}
                innerIconStyle={{ borderWidth: 2 }}
                isChecked={isSelected}
                useBuiltInState={false}
                onPress={() => {
                  handleClick(item);
                }}
                // bounceEffect={0}
                // bounceFriction={1}
                style={{ height: 24 }}
                bounceEffectIn={1}
                bounceEffectOut={1}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        height: "100%",
        alignItems: "center",
        paddingTop: 20,
        gap: 10,
        width: "100%",
      }}
    >
      <View className="w-full p-3">
        <TextInput
          style={{ paddingStart: 8 }}
          onChangeText={(text) => setSearchInput(text)}
          className="border border-neutral-200 w-full   rounded-lg h-14 p-0"
          placeholderTextColor="#a9a9a9"
          placeholder="Search User..."
        />
      </View>
      <View
        style={{
          paddingHorizontal: 12,
        }}
        className="flex flex-row  justify-start w-full"
      >
        <ReusableButton
          onPress={() => handleSelectAll()}
          buttonText="Select ALL"
          containerStyle="px-4 w-40"
        />
      </View>

      <FlatList
        data={data?.user}
        style={{
          width: "100%",
          height: "100%",
        }}
        keyExtractor={(item, index) => item._id + index}
        renderItem={renderItem}
        ListEmptyComponent={
          isFetching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#7367f0" />
            </View>
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text>No Result Found</Text>
            </View>
          )
        }
      />
    </View>
  );
};

export default SelectUsersForGroupChat;
