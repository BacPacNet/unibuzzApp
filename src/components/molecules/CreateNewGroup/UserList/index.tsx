import { useState } from "react";
import { Image, Text, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import avatar from "@/assets/avatarPlaceholder.png";
import { Users } from "@/types/connections";

type Props = {
  item: Users;
  selectedUsers: Users[];
  setSelectedUsers: (value: Users[]) => void;
};

export const NewGroupUserListItem = ({
  item,
  selectedUsers,
  setSelectedUsers,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = item?.profile?.profile_dp?.imageUrl;

  const isSelected = selectedUsers?.some(
    (selectedUser: any) => selectedUser._id == item._id,
  );

  const handleClick = () => {
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u: any) => u._id !== item._id));
    } else {
      setSelectedUsers([...selectedUsers, item]);
    }
  };

  let bouncyCheckboxRef: any = null;

  return (
    <View
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
            <Text className="text-neutral-600 text-lg font-semibold">
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

          <View className="flex justify-center items-center">
            <BouncyCheckbox
              ref={bouncyCheckboxRef}
              size={25}
              fillColor="#6647FF"
              unFillColor="#FFFFFF"
              text="Click Me"
              iconStyle={{ borderColor: "#6647FF" }}
              innerIconStyle={{ borderWidth: 2 }}
              isChecked={isSelected}
              useBuiltInState={false}
              onPress={handleClick}
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
