import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import avatar from "../../../../assets/avatar.png"; // Ensure you have a local avatar image
import ReusableButton from "@/components/atoms/ReusableButton";

// Define user type
interface User {
  _id: string;
  profileImageUrl: string;
  firstName: string;
  profile: {
    study_year: string;
    degree: string;
    major: string;
  };
}

interface Props {
  setSelectedUsers: (value: User[]) => void;
  selectedUsers: User[];
  user: User;
}

const GroupSelectUsers = ({ selectedUsers, setSelectedUsers, user }: Props) => {
  const handleClick = (user: User) => {
    if (selectedUsers?.some((selectedUser) => selectedUser._id === user._id)) {
      const filtered = selectedUsers.filter(
        (selectedUser) => selectedUser._id !== user._id,
      );
      setSelectedUsers(filtered);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const isSelected = selectedUsers?.some(
    (selectedUser) => selectedUser._id === user._id,
  );

  return (
    <TouchableOpacity className="flex flex-row items-center gap-4 w-full bg-red-400">
      {/* <ReusableButton
        onPress={() => handleClick(user)}
        buttonText={isSelected ? 'checked' : 'unchecked'}
        variant="primary"
        
      /> */}
      <View className="flex flex-row items-center  gap-2">
        <Image
          source={user.profileImageUrl ? { uri: user.profileImageUrl } : avatar}
          className="w-10 h-10 rounded-full object-cover"
        />
        <View>
          <Text className="text-sm font-semibold">{user.firstName}</Text>
          <Text className="text-xs text-gray-500">
            {user?.profile?.study_year + " " + "Yr"} {user?.profile?.degree}{" "}
            {user?.profile?.major}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupSelectUsers;
