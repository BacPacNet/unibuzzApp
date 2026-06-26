import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import avatar from "@/assets/avatarPlaceholder.png";
import { Users } from "@/types/connections";
import Badge from "@/assets/badge.svg";
import { getUserProfileSubtitleLines, isApplicantRole } from "@/lib/userProfileSubtitle";

type Props = {
  item: any;
  selectedUsers: Users[];
  setSelectedUsers: (value: Users[]) => void;
  excludeApplicants?: boolean;
};

export const NewGroupUserListItem = ({
  item,
  selectedUsers,
  setSelectedUsers,
  excludeApplicants = false,
}: Props) => {
  const [imageError, setImageError] = useState(false);
  const imageUri = item?.profile_dp?.imageUrl;

  const isSelected = selectedUsers?.some(
    (selectedUser: any) => selectedUser._id == item._id
  );

  const handleClick = () => {
    if (excludeApplicants && isApplicantRole(item?.role)) {
      return;
    }

    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u: any) => u._id !== item._id));
    } else {
      setSelectedUsers([...selectedUsers, item]);
    }
  };

  let bouncyCheckboxRef: any = null;

  const { line1, line2 } = getUserProfileSubtitleLines({
    role: item?.role,
    study_year: item?.study_year,
    major: item?.major,
    occupation: item?.occupation,
    affiliation: item?.affiliation,
  });

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
            <View className="flex-row items-center gap-2">
              <Text className="text-neutral-600 text-xs font-semibold">
                {item.firstName} {item.lastName}
              </Text>
              {item?.isVerified && <Badge width={12} height={12} />}
            </View>

            <View>
              {line1 ? (
                <Text style={{ fontSize: 12 }} className="text-neutral-500">
                  {line1}
                </Text>
              ) : null}
              {line2 ? (
                <Text style={{ fontSize: 12 }} className="text-neutral-500">
                  {line2}
                </Text>
              ) : null}
            </View>
          </View>

          <View className="flex justify-center items-center">
            {/* <BouncyCheckbox
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
            /> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
