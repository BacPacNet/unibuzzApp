import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import avatar from "@/assets/avatarPlaceholder.png";
import { Users } from "@/types/connections";
import { Xmark } from "iconoir-react-native";

type Props = {
  item: Users;
  selectedUsers: Users[];
  setSelectedUsers: (value: Users | Users[]) => void;
  handleUserSelect?: (value: Users) => void;
  handleRemoveUser?: () => void;
  isRemoveAllowed?: boolean;
};

export const UserSelectCard = ({
  item,
  selectedUsers,
  setSelectedUsers,
  handleUserSelect,
  isRemoveAllowed,
  handleRemoveUser
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = item?.profile?.profile_dp?.imageUrl;

  const isSelected = selectedUsers?.some(
    (selectedUser: any) => selectedUser._id == item._id,
  );

  const handleClick = () => {
    if (handleUserSelect) {
      return handleUserSelect(item);
    }
    if (isSelected) {
      // Handle deselection
      if (Array.isArray(selectedUsers)) {
        setSelectedUsers(selectedUsers.filter((u: any) => u._id !== item._id));
      } else {
        setSelectedUsers([]);
      }
    } else {
      // Handle selection
      if (Array.isArray(selectedUsers)) {
        setSelectedUsers([...selectedUsers, item]);
      } else {
        setSelectedUsers(item);
      }
    }
  };



  return (
    <TouchableOpacity
      onPress={handleClick}
      style={{ paddingHorizontal: 12 }}
      className="flex flex-row justify-between p-4 border-b border-neutral-200"
    >
      <View className="flex-1 flex-row items-center gap-4 justify-center">
        <View>
          <Image
            source={!imageError && imageUri ? { uri: imageUri } : avatar}
            style={{ width: 52, height: 52 }}
            className="rounded-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        </View>

        <View className="flex-1 flex-row items-center">
          <View className="flex-1">
            <Text className="text-neutral-600 text-xs font-semibold">
              {item.firstName} {item.lastName}
            </Text>
            <View>
              <Text style={{ fontSize: 12 }} className="text-neutral-500">
                {item?.profile?.role === "student"
                  ? `${item.profile.study_year}`
                  : item?.profile?.occupation}
              </Text>
              <Text style={{ fontSize: 12 }} className="text-neutral-500">
                {item?.profile?.role === "student"
                  ? item.profile.major
                  : item?.profile?.affiliation}
              </Text>
            </View>
          </View>

        
        </View>
      </View>
      {isRemoveAllowed ? 
      <View className="flex-row items-center justify-center"> 
      <TouchableOpacity onPress={() => handleRemoveUser?.()}>
        <Text>
        <Xmark width={20} height={20} />
        </Text>
      </TouchableOpacity>
      </View> : null}
    </TouchableOpacity>
  );
};